const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { exec } = require('child_process'); // For running CLI commands
const net = require('net'); // For port scanning

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        webPreferences: {
            preload: `${__dirname}/preload.js`, // Use preload script for security
            contextIsolation: true, // Recommended for security
            nodeIntegration: false, // Recommended for security
        }
    });

    mainWindow.loadFile('index.html');

    // Open the DevTools.
    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// --- IPC Handlers for CLI Commands ---

ipcMain.handle('run-ping', async (event, host) => {
    return new Promise((resolve, reject) => {
        if (!host) {
            reject('Host cannot be empty.');
            return;
        }
        // -n 4 for 4 pings, -w 1000 for 1000ms timeout
        exec(`ping ${host} -n 4 -w 1000`, (error, stdout, stderr) => {
            if (error) {
                // Ping returns non-zero exit code on failure/timeout
                resolve(`Error or timeout: ${stderr || stdout}`);
                return;
            }
            resolve(stdout);
        });
    });
});

ipcMain.handle('run-tracert', async (event, host) => {
    return new Promise((resolve, reject) => {
        if (!host) {
            reject('Host cannot be empty.');
            return;
        }
        exec(`tracert ${host}`, (error, stdout, stderr) => {
            if (error) {
                resolve(`Error: ${stderr || stdout}`);
                return;
            }
            resolve(stdout);
        });
    });
});

ipcMain.handle('run-nslookup', async (event, domain) => {
    return new Promise((resolve, reject) => {
        if (!domain) {
            reject('Domain cannot be empty.');
            return;
        }
        exec(`nslookup ${domain}`, (error, stdout, stderr) => {
            if (error) {
                resolve(`Error: ${stderr || stdout}`);
                return;
            }
            resolve(stdout);
        });
    });
});

ipcMain.handle('scan-ports', async (event, ipAddress, startPort, endPort) => {
    return new Promise(async (resolve) => {
        const results = [];
        const promises = [];

        for (let port = startPort; port <= endPort; port++) {
            promises.push(new Promise((res) => {
                const socket = new net.Socket();
                socket.setTimeout(1000); // 1-second timeout

                socket.once('connect', () => {
                    results.push({ port, status: 'Open' });
                    socket.destroy();
                    res();
                });

                socket.once('timeout', () => {
                    results.push({ port, status: 'Closed/Filtered (Timeout)' });
                    socket.destroy();
                    res();
                });

                socket.once('error', (err) => {
                    // Common errors: ECONNREFUSED (port closed), EHOSTUNREACH (host unreachable)
                    results.push({ port, status: `Closed/Filtered (${err.code})` });
                    socket.destroy();
                    res();
                });

                socket.connect(port, ipAddress);
            }));
        }

        await Promise.all(promises);
        results.sort((a, b) => a.port - b.port); // Sort by port number
        resolve(results);
    });
});

ipcMain.handle('map-network-drive', async (event, driveLetter, networkPath, username, password) => {
    return new Promise((resolve, reject) => {
        if (!driveLetter || !networkPath) {
            reject('Drive letter and network path are required.');
            return;
        }

        let command = `net use ${driveLetter}: \"${networkPath}\"`;
        if (username && password) {
            command += ` /user:${username} ${password}`;
        }
        
        exec(command, (error, stdout, stderr) => {
            if (error) {
                resolve(`Error mapping drive: ${stderr || stdout}`);
                return;
            }
            resolve(`Drive ${driveLetter}: mapped successfully.\n${stdout}`);
        });
    });
});

ipcMain.handle('unmap-network-drive', async (event, driveLetter) => {
    return new Promise((resolve, reject) => {
        if (!driveLetter) {
            reject('Drive letter is required.');
            return;
        }
        exec(`net use ${driveLetter}: /delete`, (error, stdout, stderr) => {
            if (error) {
                resolve(`Error unmapping drive: ${stderr || stdout}`);
                return;
            }
            resolve(`Drive ${driveLetter}: unmapped successfully.\n${stdout}`);
        });
    });
});

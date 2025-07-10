// --- Helper function to update output box ---
function updateOutput(elementId, content) {
    const outputBox = document.getElementById(elementId);
    outputBox.textContent = content; // Use textContent to prevent XSS
    outputBox.scrollTop = outputBox.scrollHeight; // Auto-scroll to bottom
}

// --- Ping Utility ---
document.getElementById('runPing').addEventListener('click', async () => {
    const host = document.getElementById('pingHost').value;
    updateOutput('pingOutput', 'Pinging...');
    try {
        const result = await window.api.ping(host);
        updateOutput('pingOutput', result);
    } catch (error) {
        updateOutput('pingOutput', `Error: ${error}`);
    }
});

// --- Traceroute Utility ---
document.getElementById('runTracert').addEventListener('click', async () => {
    const host = document.getElementById('tracertHost').value;
    updateOutput('tracertOutput', 'Running traceroute...');
    try {
        const result = await window.api.tracert(host);
        updateOutput('tracertOutput', result);
    } catch (error) {
        updateOutput('tracertOutput', `Error: ${error}`);
    }
});

// --- DNS Lookup Utility ---
document.getElementById('runDnsLookup').addEventListener('click', async () => {
    const domain = document.getElementById('dnsDomain').value;
    updateOutput('dnsOutput', 'Performing DNS lookup...');
    try {
        const result = await window.api.nslookup(domain);
        updateOutput('dnsOutput', result);
    } catch (error) {
        updateOutput('dnsOutput', `Error: ${error}`);
    }
});

// --- Port Scanner Utility ---
document.getElementById('runPortScan').addEventListener('click', async () => {
    const ipAddress = document.getElementById('portScanIp').value;
    const startPort = parseInt(document.getElementById('startPort').value, 10);
    const endPort = parseInt(document.getElementById('endPort').value, 10);

    if (!ipAddress || isNaN(startPort) || isNaN(endPort) || startPort > endPort || startPort < 1 || endPort > 65535) {
        updateOutput('portScanOutput', 'Please enter a valid IP address and a valid port range (1-65535).');
        return;
    }

    updateOutput('portScanOutput', `Scanning ports on ${ipAddress} from ${startPort} to ${endPort}...`);
    try {
        const results = await window.api.scanPorts(ipAddress, startPort, endPort);
        let output = `Scan results for ${ipAddress}:\n`;
        results.forEach(res => {
            const statusClass = res.status.includes('Open') ? 'open-port' : 'closed-port';
            output += `Port ${res.port}: <span class="${statusClass}">${res.status}</span>\n`;
        });
        document.getElementById('portScanOutput').innerHTML = output; // Use innerHTML for colored spans
    } catch (error) {
        updateOutput('portScanOutput', `Error: ${error}`);
    }
});

// --- Network Drive Mapper/Unmapper ---
document.getElementById('runMapDrive').addEventListener('click', async () => {
    const driveLetter = document.getElementById('mapDriveLetter').value.toUpperCase();
    const networkPath = document.getElementById('mapNetworkPath').value;
    const username = document.getElementById('mapUsername').value;
    const password = document.getElementById('mapPassword').value;

    updateOutput('netDriveOutput', 'Mapping network drive...');
    try {
        const result = await window.api.mapDrive(driveLetter, networkPath, username, password);
        updateOutput('netDriveOutput', result);
    } catch (error) {
        updateOutput('netDriveOutput', `Error: ${error}`);
    }
});

document.getElementById('runUnmapDrive').addEventListener('click', async () => {
    const driveLetter = document.getElementById('unmapDriveLetter').value.toUpperCase();
    updateOutput('netDriveOutput', 'Unmapping network drive...');
    try {
        const result = await window.api.unmapDrive(driveLetter);
        updateOutput('netDriveOutput', result);
    } catch (error) {
        updateOutput('netDriveOutput', `Error: ${error}`);
    }
});

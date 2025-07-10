const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    ping: (host) => ipcRenderer.invoke('run-ping', host),
    tracert: (host) => ipcRenderer.invoke('run-tracert', host),
    nslookup: (domain) => ipcRenderer.invoke('run-nslookup', domain),
    scanPorts: (ip, start, end) => ipcRenderer.invoke('scan-ports', ip, start, end),
    mapDrive: (letter, path, user, pass) => ipcRenderer.invoke('map-network-drive', letter, path, user, pass),
    unmapDrive: (letter) => ipcRenderer.invoke('unmap-network-drive', letter)
});

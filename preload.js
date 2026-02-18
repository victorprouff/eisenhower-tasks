const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loadTasks: () => ipcRenderer.invoke('load-tasks'),
  saveTasks: (tasks) => ipcRenderer.invoke('save-tasks', tasks),
  onUpdateAvailable: (cb) => ipcRenderer.on('update-available', (_e, version) => cb(version)),
  onUpdateDownloaded: (cb) => ipcRenderer.on('update-downloaded', (_e, version) => cb(version)),
  restartAndInstall: () => ipcRenderer.send('restart-and-install')
});
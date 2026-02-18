const { app, BrowserWindow, ipcMain } = require('electron');
const { autoUpdater } = require('electron-updater');
const path = require('path');
const fs = require('fs');

let mainWindow;
const dataPath = path.join(app.getPath('userData'), 'tasks.json');

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    titleBarStyle: process.platform === 'darwin' ? 'default' : 'default',
    backgroundColor: '#f5f5f5',
    icon: path.join(__dirname, 'build/icon.png'), // ← Ajoute cette ligne
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  
  // Ouvrir DevTools en développement
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  setTimeout(() => autoUpdater.checkForUpdates(), 3000);
});

autoUpdater.on('update-available', (info) => {
  mainWindow.webContents.send('update-available', info.version);
});

autoUpdater.on('update-downloaded', (info) => {
  mainWindow.webContents.send('update-downloaded', info.version);
});

ipcMain.on('restart-and-install', () => {
  autoUpdater.quitAndInstall();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Gestion du stockage des tâches
ipcMain.handle('load-tasks', () => {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, 'utf8');
      return JSON.parse(data);
    }
    return [];
  } catch (error) {
    console.error('Erreur lors du chargement:', error);
    return [];
  }
});

ipcMain.handle('save-tasks', (event, tasks) => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(tasks, null, 2));
    return { success: true };
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error);
    return { success: false, error: error.message };
  }
});
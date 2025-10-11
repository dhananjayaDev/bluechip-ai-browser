const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    minWidth: 1200,
    minHeight: 800,
    fullscreen: false,
    maximized: true,
    titleBarStyle: 'default',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
      webviewTag: true
    },
    title: 'BlueChip AI Browser - Simple',
    icon: path.join(__dirname, '../public/icon.png'),
    show: false
  });

  // Load a simple HTML page
  mainWindow.loadFile(path.join(__dirname, '../public/simple.html'));

  // Show the window when it's ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools for debugging
  mainWindow.webContents.openDevTools();

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
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
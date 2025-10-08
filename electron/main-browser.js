const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Database setup
const Database = require('./database');

let mainWindow;
let database;

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
          nodeIntegration: false,
          contextIsolation: true,
          enableRemoteModule: false,
          preload: path.join(__dirname, 'preload.js'),
          webSecurity: true,
          webviewTag: true
        },
    title: 'BlueChip AI Browser',
    icon: path.join(__dirname, '../public/icon.png'),
    show: false
  });

  // Load the actual browser UI
  mainWindow.loadFile(path.join(__dirname, '../public/index.html'));

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

// Simple IPC handlers for webview navigation
ipcMain.handle('navigate', async (event, url) => {
  try {
    // Send navigation command to renderer process
    mainWindow.webContents.send('navigate-to-url', url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('go-back', async () => {
  try {
    mainWindow.webContents.send('webview-go-back');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('go-forward', async () => {
  try {
    mainWindow.webContents.send('webview-go-forward');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('reload', async () => {
  try {
    mainWindow.webContents.send('webview-reload');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('go-home', async () => {
  try {
    mainWindow.webContents.send('webview-go-home');
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Initialize database
async function initializeDatabase() {
  try {
    database = new Database();
    await database.init();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
}

// This method will be called when Electron has finished initialization
app.whenReady().then(async () => {
  await initializeDatabase();
  createWindow();
});

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

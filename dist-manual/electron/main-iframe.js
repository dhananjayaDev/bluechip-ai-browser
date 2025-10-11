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
      webSecurity: true
    },
    title: 'BlueChip AI Browser',
    icon: path.join(__dirname, '../public/icon.png'),
    show: false
  });

  // Load the actual browser UI
  mainWindow.loadFile(path.join(__dirname, '../public/index-iframe.html'));

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

app.whenReady().then(async () => {
  await initializeDatabase();
  createWindow();
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

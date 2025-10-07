const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Database setup
const Database = require('./database');

// AI Service setup
const aiService = require('../lib/ai');

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
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: false,
      webviewTag: true,
      preload: path.join(__dirname, 'preload.js')
    },
    title: 'BlueChip AI Browser',
    icon: path.join(__dirname, '../public/icon.png'),
    show: false
  });

  // Load the app - Use simple HTML file
  mainWindow.loadFile(path.join(__dirname, '../public/index.html'));
  
  // Don't open DevTools by default for full screen experience
  // Uncomment the line below if you need DevTools for debugging
  // mainWindow.webContents.openDevTools();

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Initialize database when app is ready
app.whenReady().then(async () => {
  try {
    database = new Database();
    await database.init();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
  }
  
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

// IPC Handlers for database operations
ipcMain.handle('db-get-bookmarks', async () => {
  try {
    return await database.getBookmarks();
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    throw error;
  }
});

ipcMain.handle('db-add-bookmark', async (event, bookmark) => {
  try {
    return await database.addBookmark(bookmark);
  } catch (error) {
    console.error('Error adding bookmark:', error);
    throw error;
  }
});

ipcMain.handle('db-remove-bookmark', async (event, id) => {
  try {
    return await database.removeBookmark(id);
  } catch (error) {
    console.error('Error removing bookmark:', error);
    throw error;
  }
});

ipcMain.handle('db-get-history', async () => {
  try {
    return await database.getHistory();
  } catch (error) {
    console.error('Error getting history:', error);
    throw error;
  }
});

ipcMain.handle('db-add-history', async (event, historyEntry) => {
  try {
    return await database.addHistory(historyEntry);
  } catch (error) {
    console.error('Error adding history:', error);
    throw error;
  }
});

ipcMain.handle('db-clear-history', async () => {
  try {
    return await database.clearHistory();
  } catch (error) {
    console.error('Error clearing history:', error);
    throw error;
  }
});

// Settings management
ipcMain.handle('get-settings', async () => {
  try {
    return await database.getSettings();
  } catch (error) {
    console.error('Error getting settings:', error);
    throw error;
  }
});

ipcMain.handle('update-settings', async (event, settings) => {
  try {
    return await database.updateSettings(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
});

// AI operations
ipcMain.handle('ai-chat', async (event, message, context) => {
  try {
    const settings = await database.getSettings();
    const apiKey = settings.gemini_api_key;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }
    
    await aiService.initialize(apiKey);
    return await aiService.chat(message, context);
  } catch (error) {
    console.error('AI chat error:', error);
    throw error;
  }
});

ipcMain.handle('ai-summarize', async (event, url, title) => {
  try {
    const settings = await database.getSettings();
    const apiKey = settings.gemini_api_key;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured');
    }
    
    await aiService.initialize(apiKey);
    return await aiService.summarize(url, title);
  } catch (error) {
    console.error('AI summarize error:', error);
    throw error;
  }
});

// Security: Prevent new window creation
app.on('web-contents-created', (event, contents) => {
  contents.on('new-window', (event, navigationUrl) => {
    event.preventDefault();
    shell.openExternal(navigationUrl);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
}); 
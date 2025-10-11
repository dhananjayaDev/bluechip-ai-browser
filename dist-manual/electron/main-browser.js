const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Database setup
const Database = require('./database');

let mainWindow;
let aiChatWindow;
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
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../public/index.html'));
  }

  // Show the window when it's ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Open DevTools only in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

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

// Database handlers
ipcMain.handle('db-get-bookmarks', async () => {
  try {
    return await database.getBookmarks();
  } catch (error) {
    console.error('Error getting bookmarks:', error);
    return [];
  }
});

ipcMain.handle('db-add-bookmark', async (event, bookmark) => {
  try {
    return await database.addBookmark(bookmark);
  } catch (error) {
    console.error('Error adding bookmark:', error);
    return null;
  }
});

ipcMain.handle('db-remove-bookmark', async (event, id) => {
  try {
    return await database.removeBookmark(id);
  } catch (error) {
    console.error('Error removing bookmark:', error);
    return false;
  }
});

ipcMain.handle('db-get-history', async () => {
  try {
    return await database.getHistory();
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
});

ipcMain.handle('db-add-history', async (event, historyEntry) => {
  try {
    return await database.addHistory(historyEntry);
  } catch (error) {
    console.error('Error adding history:', error);
    return null;
  }
});

ipcMain.handle('db-clear-history', async () => {
  try {
    return await database.clearHistory();
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
});

// Settings handlers
ipcMain.handle('get-settings', async () => {
  try {
    return await database.getSettings();
  } catch (error) {
    console.error('Error getting settings:', error);
    return {};
  }
});

ipcMain.handle('update-settings', async (event, settings) => {
  try {
    return await database.updateSettings(settings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return false;
  }
});

// AI Service handlers
ipcMain.handle('ai-chat', async (event, message, context) => {
  try {
    const aiService = require('../lib/ai');
    
    // Get API key from settings
    const settings = await database.getSettings();
    const apiKey = settings.gemini_api_key;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please add your API key in settings.');
    }
    
    // Initialize AI service if not already initialized
    if (!aiService.isReady()) {
      await aiService.initialize(apiKey);
    }
    
    const response = await aiService.chat(message, context);
    return response;
  } catch (error) {
    console.error('Error in AI chat:', error);
    return 'Sorry, I encountered an error. Please check your API key and try again.';
  }
});

ipcMain.handle('ai-summarize', async (event, url, title) => {
  try {
    const aiService = require('../lib/ai');
    
    // Get API key from settings
    const settings = await database.getSettings();
    const apiKey = settings.gemini_api_key;
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please add your API key in settings.');
    }
    
    // Initialize AI service if not already initialized
    if (!aiService.isReady()) {
      await aiService.initialize(apiKey);
    }
    
    const response = await aiService.summarize(url, title);
    return response;
  } catch (error) {
    console.error('Error in AI summarize:', error);
    return 'Sorry, I encountered an error while summarizing the page. Please check your API key and try again.';
  }
});

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

// AI Chat window management
ipcMain.handle('open-ai-chat', async () => {
  try {
    if (aiChatWindow && !aiChatWindow.isDestroyed()) {
      aiChatWindow.focus();
      return { success: true };
    }

    aiChatWindow = new BrowserWindow({
      width: 900,
      height: 700,
      minWidth: 600,
      minHeight: 400,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        preload: path.join(__dirname, 'preload.js')
      },
      title: 'BlueChip AI Chat',
      icon: path.join(__dirname, '../public/icon.png'),
      show: false
    });

    aiChatWindow.loadFile(path.join(__dirname, '../public/ai-chat.html'));

    aiChatWindow.once('ready-to-show', () => {
      aiChatWindow.show();
    });

    aiChatWindow.on('closed', () => {
      aiChatWindow = null;
    });

    return { success: true };
  } catch (error) {
    console.error('Error opening AI chat:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('close-ai-chat', async () => {
  try {
    if (aiChatWindow && !aiChatWindow.isDestroyed()) {
      aiChatWindow.close();
    }
    return { success: true };
  } catch (error) {
    console.error('Error closing AI chat:', error);
    return { success: false, error: error.message };
  }
});

// AI Sidebar toggle handler
ipcMain.handle('toggle-ai-sidebar', async () => {
  try {
    // Send toggle command to renderer process
    mainWindow.webContents.send('toggle-ai-sidebar');
    return { success: true };
  } catch (error) {
    console.error('Error toggling AI sidebar:', error);
    return { success: false, error: error.message };
  }
});

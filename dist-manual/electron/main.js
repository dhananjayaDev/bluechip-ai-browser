const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

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
    nodeIntegration: false,
    contextIsolation: true,
    enableRemoteModule: false,
    webviewTag: true,
    preload: path.join(__dirname, 'preload.js')
  },
    title: 'BlueChip AI Browser',
    icon: path.join(__dirname, '../public/icon.png'),
    show: false
  });


  // Inject global polyfill before loading the app
  mainWindow.webContents.on('will-navigate', () => {
    mainWindow.webContents.executeJavaScript(`
      console.log('will-navigate: Injecting global polyfills');
      if (typeof global === 'undefined') {
        window.global = window;
        global = window;
      }
      if (typeof __dirname === 'undefined') {
        window.__dirname = '';
        __dirname = '';
      }
      if (typeof __filename === 'undefined') {
        window.__filename = '';
        __filename = '';
      }
      if (typeof process === 'undefined') {
        window.process = { env: {} };
        process = { env: {} };
      }
      console.log('will-navigate: Global polyfills injected');
    `);
  });

  // Also inject on dom-ready
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.executeJavaScript(`
      console.log('dom-ready: Injecting global polyfills');
      if (typeof global === 'undefined') {
        window.global = window;
        global = window;
      }
      if (typeof __dirname === 'undefined') {
        window.__dirname = '';
        __dirname = '';
      }
      if (typeof __filename === 'undefined') {
        window.__filename = '';
        __filename = '';
      }
      if (typeof process === 'undefined') {
        window.process = { env: {} };
        process = { env: {} };
      }
      console.log('dom-ready: Global polyfills injected');
    `);
  });

  // Load the app - Always use Next.js
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // In production, Next.js will be built and served
    mainWindow.loadURL('http://localhost:3000');
  }
  
  // Show the window when it's ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Prevent unnecessary reloads and requests
  mainWindow.webContents.on('did-finish-load', () => {
    console.log('Page loaded successfully');
  });

  // Add error handling
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load page:', errorCode, errorDescription);
  });

  mainWindow.webContents.on('crashed', () => {
    console.error('Renderer process crashed');
  });

  // Disable unnecessary features that cause slowness
  mainWindow.webContents.setUserAgent('BlueChip-AI-Browser/1.0.0');
  
  // Set Content Security Policy
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': ["default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: http: https: ws: wss:; script-src 'self' 'unsafe-inline' 'unsafe-eval';"]
      }
    });
  });
  
  // Open DevTools only in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

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
    // Try to get API key from environment first, then from settings
    let apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      const settings = await database.getSettings();
      apiKey = settings.gemini_api_key;
    }
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in .env.local');
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
    // Try to get API key from environment first, then from settings
    let apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      const settings = await database.getSettings();
      apiKey = settings.gemini_api_key;
    }
    
    if (!apiKey) {
      throw new Error('Gemini API key not configured. Please set GEMINI_API_KEY in .env.local');
    }
    
    await aiService.initialize(apiKey);
    return await aiService.summarize(url, title);
  } catch (error) {
    console.error('AI summarize error:', error);
    throw error;
  }
});

// Burger Menu IPC Handlers
ipcMain.handle('create-new-window', async () => {
  try {
    const newWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });
    
    // Always use Next.js
    await newWindow.loadURL('http://localhost:3000');
    return { success: true };
  } catch (error) {
    console.error('Error creating new window:', error);
    throw error;
  }
});

ipcMain.handle('create-private-window', async () => {
  try {
    const newWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });
    
    // Always use Next.js
    await newWindow.loadURL('http://localhost:3000');
    return { success: true };
  } catch (error) {
    console.error('Error creating private window:', error);
    throw error;
  }
});

ipcMain.handle('create-private-window-with-tor', async () => {
  try {
    // For now, same as private window - Tor integration would be added later
    const newWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(__dirname, 'preload.js')
      }
    });
    
    // Always use Next.js
    await newWindow.loadURL('http://localhost:3000');
    return { success: true };
  } catch (error) {
    console.error('Error creating private window with Tor:', error);
    throw error;
  }
});

ipcMain.handle('open-bluechip-ai', async () => {
  try {
    // This would open AI features - for now just log
    console.log('Opening Bluechip AI features');
    return { success: true };
  } catch (error) {
    console.error('Error opening Bluechip AI:', error);
    throw error;
  }
});

ipcMain.handle('open-bluechip-vpn', async () => {
  try {
    // This would open VPN features - for now just log
    console.log('Opening Bluechip VPN features');
    return { success: true };
  } catch (error) {
    console.error('Error opening Bluechip VPN:', error);
    throw error;
  }
});

ipcMain.handle('set-sidebar-mode', async (event, mode) => {
  try {
    // This would control sidebar visibility - for now just log
    console.log('Setting sidebar mode to:', mode);
    return { success: true };
  } catch (error) {
    console.error('Error setting sidebar mode:', error);
    throw error;
  }
});

ipcMain.handle('open-passwords', async () => {
  try {
    console.log('Opening passwords manager');
    return { success: true };
  } catch (error) {
    console.error('Error opening passwords:', error);
    throw error;
  }
});

ipcMain.handle('open-history', async () => {
  try {
    console.log('Opening history manager');
    return { success: true };
  } catch (error) {
    console.error('Error opening history:', error);
    throw error;
  }
});

ipcMain.handle('open-bookmarks', async () => {
  try {
    console.log('Opening bookmarks manager');
    return { success: true };
  } catch (error) {
    console.error('Error opening bookmarks:', error);
    throw error;
  }
});

ipcMain.handle('open-extensions', async () => {
  try {
    console.log('Opening extensions manager');
    return { success: true };
  } catch (error) {
    console.error('Error opening extensions:', error);
    throw error;
  }
});

ipcMain.handle('delete-browsing-data', async () => {
  try {
    console.log('Opening delete browsing data dialog');
    return { success: true };
  } catch (error) {
    console.error('Error opening delete browsing data:', error);
    throw error;
  }
});

ipcMain.handle('set-zoom', async (event, zoomLevel) => {
  try {
    console.log('Setting zoom level to:', zoomLevel);
    return { success: true };
  } catch (error) {
    console.error('Error setting zoom:', error);
    throw error;
  }
});

ipcMain.handle('print-page', async () => {
  try {
    console.log('Printing current page');
    return { success: true };
  } catch (error) {
    console.error('Error printing page:', error);
    throw error;
  }
});

ipcMain.handle('open-find-and-edit', async () => {
  try {
    console.log('Opening find and edit tools');
    return { success: true };
  } catch (error) {
    console.error('Error opening find and edit:', error);
    throw error;
  }
});

ipcMain.handle('open-save-and-share', async () => {
  try {
    console.log('Opening save and share tools');
    return { success: true };
  } catch (error) {
    console.error('Error opening save and share:', error);
    throw error;
  }
});

ipcMain.handle('open-more-tools', async () => {
  try {
    console.log('Opening more tools');
    return { success: true };
  } catch (error) {
    console.error('Error opening more tools:', error);
    throw error;
  }
});

ipcMain.handle('open-help', async () => {
  try {
    console.log('Opening help');
    return { success: true };
  } catch (error) {
    console.error('Error opening help:', error);
    throw error;
  }
});

ipcMain.handle('open-settings', async () => {
  try {
    console.log('Opening settings');
    return { success: true };
  } catch (error) {
    console.error('Error opening settings:', error);
    throw error;
  }
});

ipcMain.handle('exit-app', async () => {
  try {
    console.log('Exiting application');
    app.quit();
    return { success: true };
  } catch (error) {
    console.error('Error exiting app:', error);
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
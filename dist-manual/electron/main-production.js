const { app, BrowserWindow, BrowserView, ipcMain, shell } = require('electron');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Database setup
const Database = require('./database');

let mainWindow;
let browserView;
let database;

function createWindow() {
  // Create the main browser window
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
      preload: path.join(__dirname, 'preload-production.js')
    },
    title: 'BlueChip AI Browser',
    icon: path.join(__dirname, '../public/icon.png'),
    show: false
  });

  // Create BrowserView for content
  browserView = new BrowserView({
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      allowRunningInsecureContent: false
    }
  });

  // Set up BrowserView
  mainWindow.setBrowserView(browserView);
  
  // Position BrowserView below navigation (40px from top)
  const bounds = mainWindow.getBounds();
  browserView.setBounds({
    x: 0,
    y: 40,
    width: bounds.width,
    height: bounds.height - 40
  });

  // Load the UI
  mainWindow.loadFile(path.join(__dirname, '../public/index-production.html'));

  // Show the window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Handle window resize
  mainWindow.on('resize', () => {
    const bounds = mainWindow.getBounds();
    browserView.setBounds({
      x: 0,
      y: 40,
      width: bounds.width,
      height: bounds.height - 40
    });
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
    browserView = null;
  });
}

// IPC handlers for navigation
ipcMain.handle('navigate-to-url', async (event, url) => {
  try {
    if (browserView) {
      await browserView.webContents.loadURL(url);
      return { success: true, url: url };
    }
    return { success: false, error: 'BrowserView not available' };
  } catch (error) {
    console.error('Navigation error:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('go-back', async () => {
  try {
    if (browserView && browserView.webContents.canGoBack()) {
      browserView.webContents.goBack();
      return { success: true };
    }
    return { success: false, error: 'Cannot go back' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('go-forward', async () => {
  try {
    if (browserView && browserView.webContents.canGoForward()) {
      browserView.webContents.goForward();
      return { success: true };
    }
    return { success: false, error: 'Cannot go forward' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('refresh', async () => {
  try {
    if (browserView) {
      browserView.webContents.reload();
      return { success: true };
    }
    return { success: false, error: 'BrowserView not available' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-current-url', async () => {
  try {
    if (browserView) {
      return { success: true, url: browserView.webContents.getURL() };
    }
    return { success: false, error: 'BrowserView not available' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Database handlers
ipcMain.handle('db-get-bookmarks', async () => {
  try {
    if (database) {
      return await database.getBookmarks();
    }
    return [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
});

ipcMain.handle('db-add-bookmark', async (event, bookmark) => {
  try {
    if (database) {
      return await database.addBookmark(bookmark);
    }
    return { success: false, error: 'Database not available' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-remove-bookmark', async (event, id) => {
  try {
    if (database) {
      return await database.removeBookmark(id);
    }
    return { success: false, error: 'Database not available' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-get-history', async () => {
  try {
    if (database) {
      return await database.getHistory();
    }
    return [];
  } catch (error) {
    console.error('Database error:', error);
    return [];
  }
});

ipcMain.handle('db-add-history', async (event, historyEntry) => {
  try {
    if (database) {
      return await database.addHistory(historyEntry);
    }
    return { success: false, error: 'Database not available' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('db-clear-history', async () => {
  try {
    if (database) {
      return await database.clearHistory();
    }
    return { success: false, error: 'Database not available' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Settings handlers
ipcMain.handle('db-get-settings', async () => {
  try {
    if (database) {
      return await database.getSettings();
    }
    return {};
  } catch (error) {
    console.error('Database error:', error);
    return {};
  }
});

ipcMain.handle('db-update-setting', async (event, key, value) => {
  try {
    if (database) {
      return await database.updateSetting(key, value);
    }
    return { success: false, error: 'Database not available' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Utility handlers
ipcMain.handle('open-external', async (event, url) => {
  try {
    await shell.openExternal(url);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-app-version', async () => {
  try {
    return { success: true, version: app.getVersion() };
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

// App event handlers
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

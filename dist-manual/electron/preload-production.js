const { contextBridge, ipcRenderer } = require('electron');

// Expose secure APIs to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Navigation functions
  navigateToUrl: (url) => ipcRenderer.invoke('navigate-to-url', url),
  goBack: () => ipcRenderer.invoke('go-back'),
  goForward: () => ipcRenderer.invoke('go-forward'),
  refresh: () => ipcRenderer.invoke('refresh'),
  getCurrentUrl: () => ipcRenderer.invoke('get-current-url'),
  
  // Database operations
  getBookmarks: () => ipcRenderer.invoke('db-get-bookmarks'),
  addBookmark: (bookmark) => ipcRenderer.invoke('db-add-bookmark', bookmark),
  removeBookmark: (id) => ipcRenderer.invoke('db-remove-bookmark', id),
  getHistory: () => ipcRenderer.invoke('db-get-history'),
  addHistory: (historyEntry) => ipcRenderer.invoke('db-add-history', historyEntry),
  clearHistory: () => ipcRenderer.invoke('db-clear-history'),
  
  // Settings operations
  getSettings: () => ipcRenderer.invoke('db-get-settings'),
  updateSetting: (key, value) => ipcRenderer.invoke('db-update-setting', key, value),
  
  // AI operations
  chatWithAI: (message, context) => ipcRenderer.invoke('ai-chat', message, context),
  summarizePage: (url, title) => ipcRenderer.invoke('ai-summarize', url, title),
  
  // Utility functions
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
});

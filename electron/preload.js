const { ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
// Since contextIsolation is disabled, we can directly assign to window
window.electronAPI = {
  // Database operations
  getBookmarks: () => ipcRenderer.invoke('db-get-bookmarks'),
  addBookmark: (bookmark) => ipcRenderer.invoke('db-add-bookmark', bookmark),
  removeBookmark: (id) => ipcRenderer.invoke('db-remove-bookmark', id),
  getHistory: () => ipcRenderer.invoke('db-get-history'),
  addHistory: (historyEntry) => ipcRenderer.invoke('db-add-history', historyEntry),
  clearHistory: () => ipcRenderer.invoke('db-clear-history'),
  
  // Settings
  getSettings: () => ipcRenderer.invoke('get-settings'),
  updateSettings: (settings) => ipcRenderer.invoke('update-settings', settings),
  
  // Navigation
  navigate: (url) => ipcRenderer.invoke('navigate', url),
  goBack: () => ipcRenderer.invoke('go-back'),
  goForward: () => ipcRenderer.invoke('go-forward'),
  refresh: () => ipcRenderer.invoke('refresh'),
  goHome: () => ipcRenderer.invoke('go-home'),
  
  // Tab management
  createTab: () => ipcRenderer.invoke('create-tab'),
  closeTab: (tabId) => ipcRenderer.invoke('close-tab', tabId),
  switchTab: (tabId) => ipcRenderer.invoke('switch-tab', tabId),
  
  // AI operations
  aiChat: (message, context) => ipcRenderer.invoke('ai-chat', message, context),
  aiSummarize: (url, content) => ipcRenderer.invoke('ai-summarize', url, content),
  
  // Burger Menu Operations
  createNewWindow: () => ipcRenderer.invoke('create-new-window'),
  createPrivateWindow: () => ipcRenderer.invoke('create-private-window'),
  createPrivateWindowWithTor: () => ipcRenderer.invoke('create-private-window-with-tor'),
  openBluechipAI: () => ipcRenderer.invoke('open-bluechip-ai'),
  openBluechipVPN: () => ipcRenderer.invoke('open-bluechip-vpn'),
  setSidebarMode: (mode) => ipcRenderer.invoke('set-sidebar-mode', mode),
  openPasswords: () => ipcRenderer.invoke('open-passwords'),
  openHistory: () => ipcRenderer.invoke('open-history'),
  openBookmarks: () => ipcRenderer.invoke('open-bookmarks'),
  openExtensions: () => ipcRenderer.invoke('open-extensions'),
  deleteBrowsingData: () => ipcRenderer.invoke('delete-browsing-data'),
  setZoom: (zoomLevel) => ipcRenderer.invoke('set-zoom', zoomLevel),
  printPage: () => ipcRenderer.invoke('print-page'),
  openFindAndEdit: () => ipcRenderer.invoke('open-find-and-edit'),
  openSaveAndShare: () => ipcRenderer.invoke('open-save-and-share'),
  openMoreTools: () => ipcRenderer.invoke('open-more-tools'),
  openHelp: () => ipcRenderer.invoke('open-help'),
  openSettings: () => ipcRenderer.invoke('open-settings'),
  exitApp: () => ipcRenderer.invoke('exit-app'),
  
  // Utils
  openExternal: (url) => ipcRenderer.invoke('open-external', url),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Listeners
  onBookmarkAdded: (callback) => ipcRenderer.on('bookmark-added', callback),
  onBookmarkRemoved: (callback) => ipcRenderer.on('bookmark-removed', callback),
  onHistoryUpdated: (callback) => ipcRenderer.on('history-updated', callback),
  onTabCreated: (callback) => ipcRenderer.on('tab-created', callback),
  onTabClosed: (callback) => ipcRenderer.on('tab-closed', callback),
  onNavigationChanged: (callback) => ipcRenderer.on('navigation-changed', callback),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
}; 
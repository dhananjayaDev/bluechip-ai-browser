const { contextBridge, ipcRenderer } = require('electron');

console.log('Preload script is running!');

// CRITICAL: Define Node.js globals BEFORE any other code
if (typeof global === 'undefined') {
  console.log('Defining global polyfill');
  window.global = window;
  global = window;
}

// Also define on the global object itself
if (typeof globalThis !== 'undefined') {
  globalThis.global = globalThis;
}

// Inject polyfills into the web content context
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded - injecting polyfills');
  
  // Create a script element to inject polyfills
  const script = document.createElement('script');
  script.textContent = `
    console.log('Injecting global polyfills via script');
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
    console.log('Global polyfills injected successfully');
  `;
  document.head.appendChild(script);
});

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

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
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
  
      // Utils
      openExternal: (url) => ipcRenderer.invoke('open-external', url),
      getAppVersion: () => ipcRenderer.invoke('get-app-version'),
      openAIChat: () => ipcRenderer.invoke('open-ai-chat'),
      closeAIChat: () => ipcRenderer.invoke('close-ai-chat'),
      toggleAISidebar: () => ipcRenderer.invoke('toggle-ai-sidebar'),
  
  // Listeners
  onBookmarkAdded: (callback) => ipcRenderer.on('bookmark-added', callback),
  onBookmarkRemoved: (callback) => ipcRenderer.on('bookmark-removed', callback),
  onHistoryUpdated: (callback) => ipcRenderer.on('history-updated', callback),
  onToggleAISidebar: (callback) => ipcRenderer.on('toggle-ai-sidebar', callback),
  onTabCreated: (callback) => ipcRenderer.on('tab-created', callback),
  onTabClosed: (callback) => ipcRenderer.on('tab-closed', callback),
  onNavigationChanged: (callback) => ipcRenderer.on('navigation-changed', callback),
  
      // WebView listeners (simplified)
      onUpdateUrl: (callback) => ipcRenderer.on('update-url', (event, url) => callback(url)),
      onUpdateCanGoBack: (callback) => ipcRenderer.on('update-can-go-back', (event, canGoBack) => callback(canGoBack)),
      onUpdateCanGoForward: (callback) => ipcRenderer.on('update-can-go-forward', (event, canGoForward) => callback(canGoForward)),
      onNavigationError: (callback) => ipcRenderer.on('navigation-error', (event, error) => callback(error)),
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

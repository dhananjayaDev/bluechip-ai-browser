const { create } = require('zustand');
const { persist } = require('zustand/middleware');

const useBrowserStore = create(
  persist(
    (set, get) => ({
      // Tabs state
      tabs: [],
      activeTabId: null,
      tabCounter: 0,

      // Bookmarks state
      bookmarks: [
        {
          id: 'homepage',
          title: 'Bluechip Technologies Asia - Home',
          url: 'https://bluechiptech.asia/',
          favicon: ''
        },
        {
          id: 'about',
          title: 'About Us - Bluechip Technologies Asia',
          url: 'https://bluechiptech.asia/#about',
          favicon: ''
        },
        {
          id: 'services',
          title: 'Services - AI Strategy & Consulting',
          url: 'https://bluechiptech.asia/#services',
          favicon: ''
        },
        {
          id: 'technologies',
          title: 'Technologies - AI, ML, Deep Learning',
          url: 'https://bluechiptech.asia/#technologies',
          favicon: ''
        },
        {
          id: 'contact',
          title: 'Contact - Global Offices',
          url: 'https://bluechiptech.asia/#contact',
          favicon: ''
        }
      ],

      // History state
      history: [],

      // Settings state
      settings: {
        homepage: 'https://bluechiptech.asia/',
        gemini_api_key: '',
        theme: 'light',
        search_engine: 'https://www.google.com/search?q='
      },

      // Tab management
      createTab: (url = null) => {
        const { tabs, tabCounter, settings } = get();
        const newTab = {
          id: `tab-${tabCounter + 1}`,
          title: 'Bluechip Technologies Asia',
          url: url || '', // Start with empty URL to show WelcomeScreen
          favicon: ''
        };

        set({
          tabs: [...tabs, newTab],
          activeTabId: newTab.id,
          tabCounter: tabCounter + 1
        });

        return newTab;
      },

      closeTab: (tabId) => {
        const { tabs, activeTabId } = get();
        const newTabs = tabs.filter(tab => tab.id !== tabId);
        
        if (newTabs.length === 0) {
          // If no tabs left, create a new one
          get().createTab();
          return;
        }

        let newActiveTabId = activeTabId;
        if (activeTabId === tabId) {
          // If closing active tab, switch to the next one
          const currentIndex = tabs.findIndex(tab => tab.id === tabId);
          const nextTab = newTabs[currentIndex] || newTabs[currentIndex - 1];
          newActiveTabId = nextTab.id;
        }

        set({
          tabs: newTabs,
          activeTabId: newActiveTabId
        });
      },

      switchTab: (tabId) => {
        set({ activeTabId: tabId });
      },

      updateTab: (tabId, updates) => {
        const { tabs } = get();
        const newTabs = tabs.map(tab =>
          tab.id === tabId ? { ...tab, ...updates } : tab
        );
        set({ tabs: newTabs });
      },

      // Bookmark management
      addBookmark: async (bookmark) => {
        try {
          if (typeof window !== 'undefined' && window.electronAPI) {
            const result = await window.electronAPI.addBookmark(bookmark);
            const newBookmark = { ...bookmark, id: result.id };
            
            set(state => ({
              bookmarks: [...state.bookmarks, newBookmark]
            }));
            
            return newBookmark;
          }
        } catch (error) {
          console.error('Failed to add bookmark:', error);
          throw error;
        }
      },

      removeBookmark: async (id) => {
        try {
          if (typeof window !== 'undefined' && window.electronAPI) {
            await window.electronAPI.removeBookmark(id);
            
            set(state => ({
              bookmarks: state.bookmarks.filter(b => b.id !== id)
            }));
          }
        } catch (error) {
          console.error('Failed to remove bookmark:', error);
          throw error;
        }
      },

      loadBookmarks: async () => {
        try {
          if (typeof window !== 'undefined' && window.electronAPI) {
            const bookmarks = await window.electronAPI.getBookmarks();
            set({ bookmarks });
          }
        } catch (error) {
          console.error('Failed to load bookmarks:', error);
        }
      },

      // History management
      addHistory: async (historyEntry) => {
        try {
          if (typeof window !== 'undefined' && window.electronAPI) {
            await window.electronAPI.addHistory(historyEntry);
            
            set(state => ({
              history: [historyEntry, ...state.history.slice(0, 99)] // Keep last 100
            }));
          }
        } catch (error) {
          console.error('Failed to add history:', error);
          throw error;
        }
      },

      loadHistory: async () => {
        try {
          if (typeof window !== 'undefined' && window.electronAPI) {
            const history = await window.electronAPI.getHistory();
            set({ history });
          }
        } catch (error) {
          console.error('Failed to load history:', error);
        }
      },

      clearHistory: async () => {
        try {
          if (typeof window !== 'undefined' && window.electronAPI) {
            await window.electronAPI.clearHistory();
            set({ history: [] });
          }
        } catch (error) {
          console.error('Failed to clear history:', error);
          throw error;
        }
      },

      // Settings management
      updateSettings: (newSettings) => {
        set(state => ({
          settings: { ...state.settings, ...newSettings }
        }));
      },

      saveSettings: async (newSettings) => {
        try {
          if (typeof window !== 'undefined' && window.electronAPI) {
            await window.electronAPI.updateSettings(newSettings);
            get().updateSettings(newSettings);
          }
        } catch (error) {
          console.error('Failed to save settings:', error);
          throw error;
        }
      },

      loadSettings: async () => {
        try {
          if (typeof window !== 'undefined' && window.electronAPI) {
            const settings = await window.electronAPI.getSettings();
            set({ settings });
          }
        } catch (error) {
          console.error('Failed to load settings:', error);
        }
      },

      // Navigation helpers
      navigate: (url) => {
        const { activeTabId } = get();
        if (activeTabId) {
          get().updateTab(activeTabId, { url });
        }
      },

      goHome: () => {
        const { settings, activeTabId } = get();
        if (activeTabId) {
          get().updateTab(activeTabId, { url: settings.homepage });
        }
      },

      // Utility functions
      getActiveTab: () => {
        const { tabs, activeTabId } = get();
        return tabs.find(tab => tab.id === activeTabId);
      },

      isBookmarked: (url) => {
        const { bookmarks } = get();
        return bookmarks.some(bookmark => bookmark.url === url);
      }
    }),
    {
      name: 'browser-store',
      partialize: (state) => ({
        settings: state.settings,
        bookmarks: state.bookmarks
      })
    }
  )
);

module.exports = { useBrowserStore }; 
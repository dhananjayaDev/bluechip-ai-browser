import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import NavigationBar from '../components/NavigationBar';
import TabBar from '../components/TabBar';
import Sidebar from '../components/Sidebar';
import AISidebar from '../components/AISidebar';
import WebView from '../components/WebView';
import PopularSites from '../components/PopularSites';
import { useBrowserStore } from '../lib/store';
import '../styles/burger-menu.css';

export default function Home() {
  const {
    tabs,
    activeTabId,
    createTab,
    closeTab,
    switchTab,
    addBookmark,
    removeBookmark,
    bookmarks,
    addHistory,
    settings,
    updateSettings
  } = useBrowserStore();

  // State for burger menu functionality
  const [sidebarMode, setSidebarMode] = useState('off');
  const [currentZoom, setCurrentZoom] = useState(100);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiSidebarOpen, setAiSidebarOpen] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const webviewRef = useRef(null);

  useEffect(() => {
    // Initialize with default tab if none exists
    if (tabs.length === 0) {
      createTab();
      // Keep currentUrl empty to show WelcomeScreen
      setCurrentUrl('');
    }
  }, []);

  useEffect(() => {
    // Load settings on mount
    const loadSettings = async () => {
      try {
        const storedSettings = await window.electronAPI.getSettings();
        updateSettings(storedSettings);
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    };

    if (typeof window !== 'undefined' && window.electronAPI) {
      loadSettings();
    }
  }, []);

  const handleNavigation = async (url) => {
    if (!url) return;
    
    let processedUrl = url;
    
    // If it's not a valid URL, treat as search query
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      const searchEngine = settings.search_engine || 'https://www.google.com/search?q=';
      processedUrl = searchEngine + encodeURIComponent(url);
    }

    setCurrentUrl(processedUrl);
    setIsLoading(true);

    // Add to history
    try {
      await addHistory({
        title: url,
        url: processedUrl,
        favicon: ''
      });
    } catch (error) {
      console.error('Failed to add to history:', error);
    }
  };

  const handlePageLoad = (title, url) => {
    setCurrentTitle(title);
    setCurrentUrl(url);
    setIsLoading(false);
  };

  const handleBookmarkToggle = async () => {
    if (!currentUrl) return;

    try {
      const existingBookmark = bookmarks.find(b => b.url === currentUrl);
      
      if (existingBookmark) {
        await removeBookmark(existingBookmark.id);
      } else {
        await addBookmark({
          title: currentTitle || currentUrl,
          url: currentUrl,
          favicon: ''
        });
      }
    } catch (error) {
      console.error('Failed to toggle bookmark:', error);
    }
  };

  const isBookmarked = bookmarks.some(b => b.url === currentUrl);

  // Burger menu handlers
  const handleNewTab = () => {
    createTab();
  };

  const handleNewWindow = () => {
    // Open new window - in Electron this would create a new window
    window.open(window.location.href, '_blank');
  };

  const handleNewPrivateWindow = () => {
    // Open private window - would need to implement private browsing mode
    console.log('Open private window');
  };

  const handleNewPrivateWindowWithTor = () => {
    // Open private window with Tor - would need Tor integration
    console.log('Open private window with Tor');
  };

  const handleBluechipAI = () => {
    setAiSidebarOpen(true);
  };

  const handleWallet = () => {
    // Open wallet - would need wallet integration
    console.log('Open wallet');
  };

  const handleBluechipVPN = () => {
    // Open VPN - would need VPN integration
    console.log('Open Bluechip VPN');
  };

  const handleSidebarToggle = (mode) => {
    setSidebarMode(mode);
    if (mode === 'on') {
      setSidebarOpen(true);
    } else if (mode === 'off') {
      setSidebarOpen(false);
    }
    // Autohide mode would need additional logic
  };

  const handlePasswords = () => {
    // Open passwords manager
    console.log('Open passwords');
  };

  const handleHistory = () => {
    // Open history - could show in sidebar
    console.log('Open history');
  };

  const handleBookmarks = () => {
    // Open bookmarks - could show in sidebar
    console.log('Open bookmarks');
  };

  const handleDownloads = () => {
    // Open downloads
    console.log('Open downloads');
  };

  const handleExtensions = () => {
    // Open extensions
    console.log('Open extensions');
  };

  const handleDeleteBrowsingData = () => {
    // Open clear browsing data dialog
    console.log('Delete browsing data');
  };

  const handleZoomChange = (zoom) => {
    setCurrentZoom(zoom);
    // Apply zoom to webview
    if (webviewRef.current) {
      webviewRef.current.style.zoom = `${zoom}%`;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleFindAndEdit = () => {
    // Open find and edit tools
    console.log('Find and edit');
  };

  const handleSaveAndShare = () => {
    // Open save and share options
    console.log('Save and share');
  };

  const handleMoreTools = () => {
    // Open more tools
    console.log('More tools');
  };

  const handleHelp = () => {
    // Open help
    console.log('Help');
  };

  const handleSettings = () => {
    // Open settings
    console.log('Settings');
  };

  const handleExit = () => {
    // Exit application
    if (window.electronAPI) {
      window.electronAPI.exit();
    } else {
      window.close();
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Head>
        <title>BlueChip AI Browser - Powered by Bluechip Technologies Asia</title>
        <meta name="description" content="AI-powered desktop browser by Bluechip Technologies Asia - We Build AI Future" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Navigation Bar */}
      <NavigationBar
        currentUrl={currentUrl}
        onNavigation={handleNavigation}
        onBookmarkToggle={handleBookmarkToggle}
        isBookmarked={isBookmarked}
        isLoading={isLoading}
        onAIToggle={() => setAiSidebarOpen(!aiSidebarOpen)}
        aiSidebarOpen={aiSidebarOpen}
        onNewTab={handleNewTab}
        onNewWindow={handleNewWindow}
        onNewPrivateWindow={handleNewPrivateWindow}
        onNewPrivateWindowWithTor={handleNewPrivateWindowWithTor}
        onBluechipAI={handleBluechipAI}
        onWallet={handleWallet}
        onBluechipVPN={handleBluechipVPN}
        onSidebarToggle={handleSidebarToggle}
        sidebarMode={sidebarMode}
        onPasswords={handlePasswords}
        onHistory={handleHistory}
        onBookmarks={handleBookmarks}
        onDownloads={handleDownloads}
        onExtensions={handleExtensions}
        onDeleteBrowsingData={handleDeleteBrowsingData}
        onZoomChange={handleZoomChange}
        currentZoom={currentZoom}
        onPrint={handlePrint}
        onFindAndEdit={handleFindAndEdit}
        onSaveAndShare={handleSaveAndShare}
        onMoreTools={handleMoreTools}
        onHelp={handleHelp}
        onSettings={handleSettings}
        onExit={handleExit}
      />

      {/* Tab Bar */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onTabSwitch={switchTab}
        onTabClose={closeTab}
        onCreateTab={createTab}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
          bookmarks={bookmarks}
          onBookmarkClick={(url) => handleNavigation(url)}
          onBookmarkRemove={removeBookmark}
        />

        {/* WebView */}
        <div className="flex-1 relative">
          {!currentUrl || currentUrl === '' ? (
            <WelcomeScreen onNavigate={handleNavigation} />
          ) : (
            <WebView
              ref={webviewRef}
              url={currentUrl}
              onLoad={handlePageLoad}
              onLoadingChange={setIsLoading}
            />
          )}
        </div>

        {/* AI Sidebar */}
        <AISidebar
          isOpen={aiSidebarOpen}
          onToggle={() => setAiSidebarOpen(!aiSidebarOpen)}
          currentUrl={currentUrl}
          currentTitle={currentTitle}
        />
      </div>
    </div>
  );
}

const WelcomeScreen = ({ onNavigate }) => {
  const popularSites = [
    { name: 'Google', url: 'https://www.google.com', icon_type: 'static' },
    { name: 'YouTube', url: 'https://www.youtube.com', icon_type: 'static' },
    { name: 'GitHub', url: 'https://github.com', icon_type: 'static' },
    { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon_type: 'static' },
    { name: 'Reddit', url: 'https://www.reddit.com', icon_type: 'static' },
    { name: 'Wikipedia', url: 'https://en.wikipedia.org', icon_type: 'static' },
    { name: 'Twitter', url: 'https://twitter.com', icon_type: 'static' },
    { name: 'LinkedIn', url: 'https://linkedin.com', icon_type: 'static' }
  ];

  return (
    <div className="h-full flex flex-col items-center justify-center bg-white">
      {/* Google-like Logo */}
      <div className="mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">BC</span>
          </div>
          <h1 className="text-3xl font-normal text-gray-700">
            BlueChip AI Browser
          </h1>
        </div>
      </div>

      {/* Google-like Search Bar */}
      <div className="w-full max-w-2xl mb-8">
        <div className="relative">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search the web or enter a URL"
            className="w-full px-12 py-4 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-shadow"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onNavigate(e.target.value);
              }
            }}
          />
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
        </div>
      </div>

      {/* Popular Sites Grid */}
      <div className="w-full max-w-4xl">
        <PopularSites 
          sites={popularSites}
          onSiteClick={(site) => onNavigate(site.url)}
          maxSites={8}
          showPins={false}
        />
      </div>

      {/* Quick Actions */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => onNavigate('https://www.google.com')}
          className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Google Search
        </button>
        <button
          onClick={() => onNavigate('https://bluechiptech.asia/')}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Bluechip Tech
        </button>
      </div>
    </div>
  );
}; 
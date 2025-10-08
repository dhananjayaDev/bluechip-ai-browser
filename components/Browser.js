import { useState, useRef, useEffect } from 'react';
import ElectronWebView from './ElectronWebView';

const Browser = ({ onNavigate, onBookmark, onHistory }) => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const webviewRef = useRef(null);

  // Popular sites data
  const popularSites = [
    {
      name: 'Google',
      url: 'https://www.google.com',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
      )
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7"></polygon>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
        </svg>
      )
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
        </svg>
      )
    },
    {
      name: 'Wikipedia',
      url: 'https://en.wikipedia.org',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      url: 'https://linkedin.com',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
          <rect x="2" y="9" width="4" height="12"></rect>
          <circle cx="4" cy="4" r="2"></circle>
        </svg>
      )
    }
  ];

  // Navigation functions
  const navigateToUrl = (url) => {
    let fullUrl = url;
    
    // Handle different URL formats
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.') && !url.includes(' ')) {
        // Looks like a domain
        fullUrl = 'https://' + url;
      } else {
        // Search query
        fullUrl = 'https://www.google.com/search?q=' + encodeURIComponent(url);
      }
    }

    setCurrentUrl(fullUrl);
    setShowWelcome(false);
    addToHistory(fullUrl, 'Navigation');
    onNavigate?.(fullUrl);
  };

  const addToHistory = (url, title) => {
    const newEntry = { url, title, timestamp: Date.now() };
    const newHistory = [...history.slice(0, historyIndex + 1), newEntry];
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    onHistory?.(newEntry);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex].url);
      setShowWelcome(false);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentUrl(history[newIndex].url);
      setShowWelcome(false);
    }
  };

  const refresh = () => {
    if (webviewRef.current) {
      webviewRef.current.reload();
    }
  };

  const goHome = () => {
    setCurrentUrl('');
    setShowWelcome(true);
  };

  // Update navigation button states
  useEffect(() => {
    setCanGoBack(historyIndex > 0);
    setCanGoForward(historyIndex < history.length - 1);
  }, [historyIndex, history.length]);

  // Handle webview load
  const handleWebViewLoad = (title, url) => {
    setIsLoading(false);
    if (url !== currentUrl) {
      setCurrentUrl(url);
    }
  };

  const handleLoadingChange = (loading) => {
    setIsLoading(loading);
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Navigation Bar */}
      <div className="flex items-center space-x-2 p-2 bg-white border-b border-gray-200">
        {/* Navigation Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={goBack}
            disabled={!canGoBack}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Go Back"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goForward}
            disabled={!canGoForward}
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Go Forward"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button
            onClick={refresh}
            className="p-2 rounded-lg hover:bg-gray-100"
            title="Refresh"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 flex items-center space-x-2">
          <input
            type="text"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                navigateToUrl(e.target.value);
              }
            }}
            placeholder="Enter URL or search query..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={() => navigateToUrl(currentUrl)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Go
          </button>
        </div>

        {/* Home Button */}
        <button
          onClick={goHome}
          className="p-2 rounded-lg hover:bg-gray-100"
          title="Home"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        {showWelcome ? (
          /* Welcome Screen */
          <div className="h-full flex flex-col items-center justify-center bg-gray-50">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                BlueChip AI Browser
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Your intelligent browsing companion
              </p>
            </div>

            {/* Popular Sites */}
            <div className="w-full max-w-4xl">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
                Popular Sites
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {popularSites.map((site, index) => (
                  <button
                    key={index}
                    onClick={() => navigateToUrl(site.url)}
                    className="flex flex-col items-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 hover:border-blue-300"
                  >
                    <div className="w-12 h-12 flex items-center justify-center text-gray-600 mb-3">
                      {site.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {site.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 flex space-x-4">
              <button
                onClick={() => navigateToUrl('https://www.google.com')}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Google Search
              </button>
              <button
                onClick={() => navigateToUrl('https://bluechiptech.asia/')}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Bluechip Tech
              </button>
            </div>
          </div>
        ) : (
          /* WebView */
          <ElectronWebView
            ref={webviewRef}
            url={currentUrl}
            onLoad={handleWebViewLoad}
            onLoadingChange={handleLoadingChange}
            className="h-full"
          />
        )}
      </div>
    </div>
  );
};

export default Browser;


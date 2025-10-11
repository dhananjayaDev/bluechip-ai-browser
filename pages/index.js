import { useState, useEffect, useRef, useCallback } from 'react';
import Head from 'next/head';
import NavigationBar from '../components/NavigationBar';
import HomeView from '../components/HomeView';
import BrowserView from '../components/BrowserView';
import AIModeView from '../components/AIModeView';

export default function Home() {
  // State management
  const [currentView, setCurrentView] = useState('home'); // 'home', 'browser', 'ai'
  const [currentUrl, setCurrentUrl] = useState('');
  const [sessionHistory, setSessionHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const addressBarRef = useRef(null);
  const currentHistoryIndexRef = useRef(-1);

  // Keep ref in sync with state
  useEffect(() => {
    currentHistoryIndexRef.current = currentHistoryIndex;
  }, [currentHistoryIndex]);

  const addToHistory = useCallback((url, title = '') => {
    setSessionHistory(prevHistory => {
      const newHistory = [...prevHistory];
      // Remove any future history if we're not at the end
      if (currentHistoryIndexRef.current < newHistory.length - 1) {
        newHistory.splice(currentHistoryIndexRef.current + 1);
      }
      
      // Add new entry
      newHistory.push({ url: url, title: title, timestamp: Date.now() });
      setCurrentHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, []); // Empty dependency array - we'll use functional updates

  // Initialize with home screen
  useEffect(() => {
    setSessionHistory(prevHistory => {
      const newHistory = [...prevHistory];
      // Remove any future history if we're not at the end
      if (currentHistoryIndexRef.current < newHistory.length - 1) {
        newHistory.splice(currentHistoryIndexRef.current + 1);
      }
      
      // Add new entry
      newHistory.push({ url: 'home', title: 'BlueChip AI Browser Home', timestamp: Date.now() });
      setCurrentHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, []); // Run only once on mount

  const openSite = (url) => {
    addToHistory(url, 'Loading...');
    setCurrentView('browser');
    setCurrentUrl(url);
    
    // Update address bar
    if (addressBarRef.current) {
      addressBarRef.current.value = url;
    }
  };

  const openAIMode = () => {
    addToHistory('ai-mode', 'AI Mode');
    setCurrentView('ai');
  };

  const goBack = () => {
    if (currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const previousEntry = sessionHistory[newIndex];
      setCurrentHistoryIndex(newIndex);
      
      if (previousEntry.url === 'home') {
        // Go back to home screen
        setCurrentView('home');
        setCurrentUrl('');
      } else if (previousEntry.url === 'ai-mode') {
        // Go back to AI mode
        setCurrentView('ai');
      } else {
        // Load the previous URL
        setCurrentView('browser');
        setCurrentUrl(previousEntry.url);
        if (addressBarRef.current) {
          addressBarRef.current.value = previousEntry.url;
        }
      }
    } else {
      // No history to go back to, go to home
      setCurrentView('home');
      setCurrentUrl('');
    }
  };

  const goForward = () => {
    if (currentHistoryIndex < sessionHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const nextEntry = sessionHistory[newIndex];
      setCurrentHistoryIndex(newIndex);
      
      if (nextEntry.url === 'home') {
        setCurrentView('home');
        setCurrentUrl('');
      } else if (nextEntry.url === 'ai-mode') {
        setCurrentView('ai');
      } else {
        setCurrentView('browser');
        setCurrentUrl(nextEntry.url);
        if (addressBarRef.current) {
          addressBarRef.current.value = nextEntry.url;
        }
      }
    }
  };

  const refresh = () => {
    // Only refresh if we're in browser view
    if (currentView === 'browser') {
      // WebView refresh would be handled by BrowserView component
      // This is a placeholder for refresh functionality
    }
  };

  const goHome = () => {
    setCurrentView('home');
    setCurrentUrl('');
    
    // Reset history position to home
    const homeIndex = sessionHistory.findIndex(entry => entry.url === 'home');
    if (homeIndex !== -1) {
      setCurrentHistoryIndex(homeIndex);
    } else {
      addToHistory('home', 'BlueChip AI Browser Home');
      setCurrentHistoryIndex(0);
    }
  };

  const handleAddressBarSubmit = (e) => {
    e.preventDefault();
    const url = addressBarRef.current.value.trim();
    if (url) {
      let fullUrl = url;
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        if (url.includes('.') && !url.includes(' ')) {
          fullUrl = 'https://' + url;
        } else {
          fullUrl = 'https://www.google.com/search?q=' + encodeURIComponent(url);
        }
      }
      openSite(fullUrl);
    }
  };

  return (
    <>
      <Head>
        <title>BlueChip AI Browser</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Navigation Bar - Always Visible */}
      <NavigationBar
        currentHistoryIndex={currentHistoryIndex}
        sessionHistory={sessionHistory}
        showWebView={currentView === 'browser'}
        onGoBack={goBack}
        onGoForward={goForward}
        onRefresh={refresh}
        onGoHome={goHome}
        onAddressBarSubmit={handleAddressBarSubmit}
        addressBarRef={addressBarRef}
      />

      {/* Main Content Area */}
      <div style={{ paddingTop: '40px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Render Current View */}
        {currentView === 'home' && (
          <HomeView 
            onOpenSite={openSite}
            onOpenAIMode={openAIMode}
          />
        )}
        
        {currentView === 'browser' && (
          <BrowserView 
            currentUrl={currentUrl}
          />
        )}
        
        {currentView === 'ai' && (
          <AIModeView />
        )}
      </div>
    </>
  );
}
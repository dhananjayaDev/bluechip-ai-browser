import { useState } from 'react';
import Head from 'next/head';
import Browser from '../components/Browser';
import AISidebar from '../components/AISidebar';

export default function Home() {
  const [currentUrl, setCurrentUrl] = useState('');
  const [isAISidebarOpen, setIsAISidebarOpen] = useState(false);

  const handleNavigate = (url) => {
    setCurrentUrl(url);
  };

  const handleBookmark = (bookmark) => {
    // Handle bookmark functionality
    console.log('Bookmark added:', bookmark);
  };

  const handleHistory = (historyEntry) => {
    // Handle history functionality
    console.log('History entry added:', historyEntry);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Head>
        <title>BlueChip AI Browser</title>
        <meta name="description" content="AI-powered browser with intelligent features" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Main Content Area */}
      <div className="flex-1 flex">
        {/* Browser Component */}
        <Browser
          onNavigate={handleNavigate}
          onBookmark={handleBookmark}
          onHistory={handleHistory}
        />

        {/* AI Sidebar */}
        <AISidebar
          isOpen={isAISidebarOpen}
          onToggle={() => setIsAISidebarOpen(!isAISidebarOpen)}
          currentUrl={currentUrl}
        />
      </div>
    </div>
  );
}


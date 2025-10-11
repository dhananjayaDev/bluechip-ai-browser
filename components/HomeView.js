import { useRef } from 'react';

export default function HomeView({ onOpenSite, onOpenAIMode }) {
  const searchInputRef = useRef(null);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchInputRef.current.value.trim();
    if (query) {
      if (query.startsWith('http://') || query.startsWith('https://')) {
        onOpenSite(query);
      } else {
        const searchUrl = 'https://www.google.com/search?q=' + encodeURIComponent(query);
        onOpenSite(searchUrl);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit(e);
    }
  };

  const popularSites = [
    { 
      name: 'Google', 
      url: 'https://www.google.com',
      iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>'
    },
    { 
      name: 'YouTube', 
      url: 'https://www.youtube.com',
      iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>'
    },
    { 
      name: 'GitHub', 
      url: 'https://github.com',
      iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>'
    },
    { 
      name: 'Wikipedia', 
      url: 'https://en.wikipedia.org',
      iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>'
    },
    { 
      name: 'LinkedIn', 
      url: 'https://linkedin.com',
      iconSvg: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>'
    }
  ];

  return (
    <div id="welcomeScreen" style={{ display: 'block' }}>
      {/* Logo Section */}
      <div className="logo-section">
        <div className="logo-container">
          <div className="bluechip-logo local" style={{ backgroundImage: 'url(/logo.png)' }}></div>
          <h1 className="title">BlueChip AI Browser</h1>
        </div>
      </div>

      {/* Search Section */}
      <div className="search-container">
        <div className="search-box">
          <div className="search-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
          <form onSubmit={handleSearchSubmit}>
            <input 
              ref={searchInputRef}
              type="text"
              className="search-input" 
              placeholder="Search the web or enter a URL"
              id="searchInput"
              onKeyPress={handleKeyPress}
            />
          </form>
          <button className="ai-mode-btn" onClick={onOpenAIMode} title="AI Mode">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"></polygon>
            </svg>
            <span>AI Mode</span>
          </button>
          <div className="mic-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Popular Sites Section */}
      <div className="sites-section">
        <div className="sites-grid">
          {popularSites.map((site, index) => (
            <div 
              key={index}
              className="site-item" 
              onClick={() => {
                onOpenSite(site.url);
              }}
              style={{ cursor: 'pointer' }}
            >
              <div className="site-icon" dangerouslySetInnerHTML={{ __html: site.iconSvg }}>
              </div>
              <span className="site-name">{site.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

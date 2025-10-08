import React, { useState, useEffect } from 'react';
import SiteIcon from './SiteIcon';
import iconService from '../lib/iconService';

const PopularSites = ({ 
  sites = [], 
  onSiteClick, 
  onSitePin, 
  onSiteRemove,
  maxSites = 8,
  showPins = true,
  className = ''
}) => {
  const [popularSites, setPopularSites] = useState(sites);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (sites.length === 0) {
      loadDefaultSites();
    } else {
      setPopularSites(sites);
    }
  }, [sites]);

  const loadDefaultSites = async () => {
    setIsLoading(true);
    try {
      // Load default popular sites with icons
      const defaultSites = [
        { name: 'Google', url: 'https://www.google.com', icon_type: 'static' },
        { name: 'YouTube', url: 'https://www.youtube.com', icon_type: 'static' },
        { name: 'GitHub', url: 'https://github.com', icon_type: 'static' },
        { name: 'Stack Overflow', url: 'https://stackoverflow.com', icon_type: 'static' },
        { name: 'Reddit', url: 'https://www.reddit.com', icon_type: 'static' },
        { name: 'Wikipedia', url: 'https://en.wikipedia.org', icon_type: 'static' },
        { name: 'Twitter', url: 'https://twitter.com', icon_type: 'static' },
        { name: 'LinkedIn', url: 'https://linkedin.com', icon_type: 'static' }
      ];

      const sitesWithIcons = iconService.getPopularSitesWithIcons(defaultSites);
      setPopularSites(sitesWithIcons);
    } catch (error) {
      console.error('Error loading default sites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSiteClick = (site) => {
    if (onSiteClick) {
      onSiteClick(site);
    }
  };

  const handleSitePin = (site, e) => {
    e.stopPropagation();
    if (onSitePin) {
      onSitePin(site);
    }
  };

  const handleSiteRemove = (site, e) => {
    e.stopPropagation();
    if (onSiteRemove) {
      onSiteRemove(site);
    }
  };

  const renderSite = (site, index) => (
    <div
      key={site.id || site.url || index}
      className="popular-site-item group"
      onClick={() => handleSiteClick(site)}
    >
      <div className="site-icon-container">
        <SiteIcon 
          site={site} 
          size={48} 
          className="site-icon"
          onIconLoad={(iconData) => {
            // Update site with icon data if needed
            if (iconData && !site.icon) {
              setPopularSites(prev => 
                prev.map(s => s.url === site.url ? { ...s, icon: iconData } : s)
              );
            }
          }}
        />
        {showPins && (
          <div className="site-actions">
            <button
              className="site-pin-btn"
              onClick={(e) => handleSitePin(site, e)}
              title={site.isPinned ? 'Unpin site' : 'Pin site'}
            >
              📌
            </button>
            <button
              className="site-remove-btn"
              onClick={(e) => handleSiteRemove(site, e)}
              title="Remove site"
            >
              ✕
            </button>
          </div>
        )}
      </div>
      <span className="site-name">{site.name || site.title}</span>
    </div>
  );

  if (isLoading) {
    return (
      <div className={`popular-sites loading ${className}`}>
        <div className="sites-grid">
          {Array.from({ length: maxSites }).map((_, index) => (
            <div key={index} className="popular-site-item loading">
              <div className="site-icon-container">
                <div className="site-icon skeleton" />
              </div>
              <div className="site-name skeleton-text" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`popular-sites ${className}`}>
      <h2 className="sites-title">Popular Sites</h2>
      <div className="sites-grid">
        {popularSites.slice(0, maxSites).map((site, index) => renderSite(site, index))}
      </div>
    </div>
  );
};

// CSS styles for the component
const styles = `
  .popular-sites {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
  }

  .sites-title {
    font-size: 14px;
    color: #5f6368;
    margin-bottom: 20px;
    text-align: center;
    font-weight: normal;
  }

  .sites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    gap: 20px;
    max-width: 600px;
    margin: 0 auto;
  }

  .popular-site-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 16px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
  }

  .popular-site-item:hover {
    background-color: #f8f9fa;
    transform: translateY(-2px);
  }

  .popular-site-item.loading {
    cursor: default;
  }

  .site-icon-container {
    position: relative;
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
  }

  .site-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background-color: #f3f4f6;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .site-icon.skeleton {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  .site-name {
    font-size: 12px;
    color: #5f6368;
    text-align: center;
    word-break: break-word;
    line-height: 1.2;
  }

  .site-name.skeleton-text {
    width: 60px;
    height: 12px;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 2px;
  }

  .site-actions {
    position: absolute;
    top: -4px;
    right: -4px;
    display: flex;
    gap: 2px;
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .popular-site-item:hover .site-actions {
    opacity: 1;
  }

  .site-pin-btn,
  .site-remove-btn {
    width: 20px;
    height: 20px;
    border: none;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    transition: all 0.2s ease;
  }

  .site-pin-btn:hover,
  .site-remove-btn:hover {
    background-color: #fff;
    transform: scale(1.1);
  }

  .site-remove-btn {
    color: #ef4444;
  }

  @keyframes loading {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (max-width: 768px) {
    .sites-grid {
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
    }
    
    .popular-site-item {
      padding: 12px;
    }
    
    .site-icon-container {
      width: 40px;
      height: 40px;
    }
    
    .site-icon {
      width: 40px;
      height: 40px;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default PopularSites;

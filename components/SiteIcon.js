import React, { useState, useEffect } from 'react';
import iconService from '../lib/iconService';

const SiteIcon = ({ 
  site, 
  size = 24, 
  className = '', 
  style = {},
  showFallback = true,
  onIconLoad = null,
  onIconError = null
}) => {
  const [iconData, setIconData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    loadIcon();
  }, [site]);

  const loadIcon = async () => {
    try {
      setIsLoading(true);
      setHasError(false);
      
      // Get icon data from icon service
      const icon = iconService.getIcon(site.url, site.icon_type || 'auto');
      setIconData(icon);
      
      if (onIconLoad) {
        onIconLoad(icon);
      }
    } catch (error) {
      console.error('Error loading icon:', error);
      setHasError(true);
      
      if (onIconError) {
        onIconError(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    setHasError(true);
    if (onIconError) {
      onIconError(new Error('Failed to load favicon'));
    }
  };

  const handleImageLoad = () => {
    setHasError(false);
  };

  const renderIcon = () => {
    if (isLoading) {
      return (
        <div 
          className={`site-icon-loading ${className}`}
          style={{ width: size, height: size, ...style }}
        >
          <div className="loading-spinner" />
        </div>
      );
    }

    if (!iconData) {
      return renderFallbackIcon();
    }

    switch (iconData.type) {
      case 'static':
      case 'fallback':
        return (
          <div
            className={`site-icon-static ${className}`}
            style={{ width: size, height: size, ...style }}
            dangerouslySetInnerHTML={{ __html: iconData.svg }}
          />
        );
      
      case 'dynamic':
        return (
          <div className={`site-icon-dynamic ${className}`} style={{ width: size, height: size, ...style }}>
            <img
              src={iconData.url}
              alt={`${iconData.domain} favicon`}
              onError={handleImageError}
              onLoad={handleImageLoad}
              style={{
                width: size,
                height: size,
                display: hasError ? 'none' : 'block',
                borderRadius: '4px'
              }}
            />
            {hasError && showFallback && iconData.fallback && (
              <div
                className="site-icon-fallback"
                dangerouslySetInnerHTML={{ __html: iconData.fallback.svg }}
              />
            )}
          </div>
        );
      
      default:
        return renderFallbackIcon();
    }
  };

  const renderFallbackIcon = () => {
    const fallbackIcon = iconService.getFallbackIcon(iconService.extractDomain(site.url));
    return (
      <div
        className={`site-icon-fallback ${className}`}
        style={{ width: size, height: size, ...style }}
        dangerouslySetInnerHTML={{ __html: fallbackIcon.svg }}
      />
    );
  };

  return renderIcon();
};

// CSS styles for the component
const styles = `
  .site-icon-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f3f4f6;
    border-radius: 4px;
  }

  .loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #e5e7eb;
    border-top: 2px solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  .site-icon-static,
  .site-icon-fallback {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .site-icon-dynamic {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .site-icon-dynamic img {
    object-fit: contain;
  }

  .site-icon-fallback {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default SiteIcon;

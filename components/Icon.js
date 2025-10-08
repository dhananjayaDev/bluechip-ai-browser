import React, { useState } from 'react';

const Icon = ({ 
  url, 
  iconType = 'auto', 
  size = 24, 
  className = '', 
  style = {},
  fallbackIcon = null,
  onError = null
}) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
    setIsLoading(false);
    if (onError) {
      onError();
    }
  };

  // Handle image load success
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Get icon based on type
  const getIconContent = () => {
    if (iconType === 'static' || iconType === 'fallback') {
      // Static SVG icon (Feather icons)
      return (
        <div 
          className={`icon-static ${className}`}
          style={{ width: size, height: size, ...style }}
          dangerouslySetInnerHTML={{ __html: iconType === 'static' ? getStaticIcon() : getFallbackIcon() }}
        />
      );
    } else if (iconType === 'dynamic' || iconType === 'img') {
      // Dynamic favicon
      if (imageError && fallbackIcon) {
        return (
          <div 
            className={`icon-fallback ${className}`}
            style={{ width: size, height: size, ...style }}
            dangerouslySetInnerHTML={{ __html: fallbackIcon }}
          />
        );
      }
      
      return (
        <div className={`icon-dynamic ${className}`} style={{ width: size, height: size, ...style }}>
          {isLoading && (
            <div className="icon-loading">
              <div className="icon-loading-spinner" />
            </div>
          )}
          <img
            src={getFaviconUrl(url)}
            alt={`${getDomain(url)} favicon`}
            onError={handleImageError}
            onLoad={handleImageLoad}
            style={{ 
              width: size, 
              height: size, 
              display: imageError ? 'none' : 'block',
              borderRadius: '4px'
            }}
          />
        </div>
      );
    }
    
    // Default fallback
    return (
      <div 
        className={`icon-default ${className}`}
        style={{ width: size, height: size, ...style }}
        dangerouslySetInnerHTML={{ __html: getDefaultIcon() }}
      />
    );
  };

  return getIconContent();
};

// Helper functions
const getDomain = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch (error) {
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
  }
};

const getFaviconUrl = (url) => {
  const domain = getDomain(url);
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
};

const getStaticIcon = () => {
  // This would be replaced with actual Feather icon SVG
  return feather.icons.globe.toSvg({ width: 24, height: 24 });
};

const getFallbackIcon = () => {
  // This would be replaced with actual fallback Feather icon SVG
  return feather.icons.globe.toSvg({ width: 24, height: 24 });
};

const getDefaultIcon = () => {
  // Default globe icon
  return feather.icons.globe.toSvg({ width: 24, height: 24 });
};

export default Icon;

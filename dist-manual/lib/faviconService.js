const https = require('https');
const http = require('http');
const { URL } = require('url');

class FaviconService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Get favicon URL for a given domain
   * @param {string} url - The URL to get favicon for
   * @param {Object} options - Options for favicon fetching
   * @returns {Promise<string>} Favicon URL
   */
  async getFaviconUrl(url, options = {}) {
    const {
      size = 32,
      useGoogle = true,
      fallbackToGoogle = true
    } = options;

    const domain = this.extractDomain(url);
    const cacheKey = `${domain}-${size}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheTimeout) {
        return cached.url;
      }
      this.cache.delete(cacheKey);
    }

    try {
      let faviconUrl;

      if (useGoogle) {
        // Use Google's favicon service as primary
        faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
      } else {
        // Try to get favicon from the actual site
        faviconUrl = await this.getSiteFavicon(url, size);
      }

      // Cache the result
      this.cache.set(cacheKey, {
        url: faviconUrl,
        timestamp: Date.now()
      });

      return faviconUrl;
    } catch (error) {
      console.error('Error getting favicon:', error);
      
      if (fallbackToGoogle && !useGoogle) {
        // Fallback to Google's service
        const googleUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=${size}`;
        this.cache.set(cacheKey, {
          url: googleUrl,
          timestamp: Date.now()
        });
        return googleUrl;
      }

      // Return a default favicon
      return this.getDefaultFavicon();
    }
  }

  /**
   * Get favicon from the actual website
   * @param {string} url - The URL to get favicon from
   * @param {number} size - Favicon size
   * @returns {Promise<string>} Favicon URL
   */
  async getSiteFavicon(url, size = 32) {
    return new Promise((resolve, reject) => {
      const domain = this.extractDomain(url);
      const protocol = url.startsWith('https:') ? 'https:' : 'http:';
      
      // Try common favicon locations
      const faviconPaths = [
        '/favicon.ico',
        '/favicon.png',
        '/apple-touch-icon.png',
        '/apple-touch-icon-precomposed.png'
      ];

      const tryFavicon = (index) => {
        if (index >= faviconPaths.length) {
          reject(new Error('No favicon found'));
          return;
        }

        const faviconUrl = `${protocol}//${domain}${faviconPaths[index]}`;
        
        this.checkUrlExists(faviconUrl)
          .then((exists) => {
            if (exists) {
              resolve(faviconUrl);
            } else {
              tryFavicon(index + 1);
            }
          })
          .catch(() => {
            tryFavicon(index + 1);
          });
      };

      tryFavicon(0);
    });
  }

  /**
   * Check if a URL exists and returns a favicon
   * @param {string} url - URL to check
   * @returns {Promise<boolean>} True if URL exists and returns favicon
   */
  checkUrlExists(url) {
    return new Promise((resolve) => {
      const protocol = url.startsWith('https:') ? https : http;
      
      const req = protocol.request(url, { method: 'HEAD' }, (res) => {
        resolve(res.statusCode === 200 && res.headers['content-type']?.includes('image'));
      });

      req.on('error', () => resolve(false));
      req.setTimeout(5000, () => {
        req.destroy();
        resolve(false);
      });
      
      req.end();
    });
  }

  /**
   * Extract domain from URL
   * @param {string} url - The URL to extract domain from
   * @returns {string} Domain name
   */
  extractDomain(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname.replace('www.', '');
    } catch (error) {
      return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];
    }
  }

  /**
   * Get default favicon URL
   * @returns {string} Default favicon URL
   */
  getDefaultFavicon() {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTYiIGN5PSIxNiIgcj0iMTQiIGZpbGw9IiNmM2Y0ZjYiLz4KPHN2ZyB4PSI4IiB5PSI4IiB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTExIDIxQzE2LjUyMjggMjEgMjEgMTYuNTIyOCAyMSAxMUMyMSA1LjQ3NzE1IDE2LjUyMjggMSAxMSAxQzUuNDc3MTUgMSAxIDUuNDc3MTUgMSAxMUMxIDE2LjUyMjggNS40NzcxNSAyMSAxMSAyMVoiIHN0cm9rZT0iIzk5YTNhZiIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTIxIDIxTDE2LjY1IDE2LjY1IiBzdHJva2U9IiM5OWEzYWYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo8L3N2Zz4K';
  }

  /**
   * Batch fetch favicons for multiple URLs
   * @param {Array} urls - Array of URLs
   * @param {Object} options - Options for favicon fetching
   * @returns {Promise<Array>} Array of favicon URLs
   */
  async batchGetFavicons(urls, options = {}) {
    const promises = urls.map(url => this.getFaviconUrl(url, options));
    return Promise.allSettled(promises);
  }

  /**
   * Clear favicon cache
   */
  clearCache() {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, value]) => ({
        key,
        url: value.url,
        age: Date.now() - value.timestamp
      }))
    };
  }
}

// Create singleton instance
const faviconService = new FaviconService();

module.exports = faviconService;

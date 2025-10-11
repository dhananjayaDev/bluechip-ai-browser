const feather = require('feather-icons');

class IconService {
  constructor() {
    // Static popular sites with their corresponding Feather icons
    this.staticPopularSites = {
      'google.com': 'search',
      'youtube.com': 'play',
      'github.com': 'github',
      'stackoverflow.com': 'help-circle',
      'reddit.com': 'message-circle',
      'wikipedia.org': 'book-open',
      'twitter.com': 'twitter',
      'linkedin.com': 'linkedin',
      'facebook.com': 'facebook',
      'instagram.com': 'instagram',
      'discord.com': 'message-square',
      'twitch.tv': 'tv',
      'netflix.com': 'play-circle',
      'spotify.com': 'music',
      'amazon.com': 'shopping-cart',
      'microsoft.com': 'monitor',
      'apple.com': 'smartphone',
      'adobe.com': 'image',
      'figma.com': 'layers',
      'notion.so': 'file-text',
      'slack.com': 'slack',
      'zoom.us': 'video',
      'dropbox.com': 'cloud',
      'drive.google.com': 'hard-drive',
      'docs.google.com': 'file-text',
      'sheets.google.com': 'grid',
      'slides.google.com': 'presentation',
      'calendar.google.com': 'calendar',
      'gmail.com': 'mail',
      'outlook.com': 'mail',
      'yahoo.com': 'mail'
    };

    // Fallback icons for unknown sites
    this.fallbackIcons = {
      'search': 'search',
      'social': 'users',
      'news': 'newspaper',
      'shopping': 'shopping-bag',
      'entertainment': 'play',
      'education': 'book',
      'business': 'briefcase',
      'technology': 'cpu',
      'default': 'globe'
    };
  }

  /**
   * Get icon for a given URL
   * @param {string} url - The URL to get icon for
   * @param {string} type - Type of icon ('static', 'dynamic', 'auto')
   * @returns {Object} Icon data with type, name, and SVG
   */
  getIcon(url, type = 'auto') {
    const domain = this.extractDomain(url);
    
    if (type === 'static' || (type === 'auto' && this.staticPopularSites[domain])) {
      return this.getStaticIcon(domain);
    } else if (type === 'dynamic' || type === 'auto') {
      return this.getDynamicIcon(url);
    }
    
    return this.getFallbackIcon(domain);
  }

  /**
   * Get static Feather icon for popular sites
   * @param {string} domain - Domain name
   * @returns {Object} Icon data
   */
  getStaticIcon(domain) {
    const iconName = this.staticPopularSites[domain] || 'globe';
    const iconSvg = feather.icons[iconName]?.toSvg({
      width: 24,
      height: 24,
      'stroke-width': 2
    }) || feather.icons.globe.toSvg({
      width: 24,
      height: 24,
      'stroke-width': 2
    });

    return {
      type: 'static',
      name: iconName,
      svg: iconSvg,
      domain: domain
    };
  }

  /**
   * Get dynamic favicon for any URL
   * @param {string} url - The URL to get favicon for
   * @returns {Object} Icon data
   */
  getDynamicIcon(url) {
    const domain = this.extractDomain(url);
    const faviconUrl = this.getFaviconUrl(url);

    return {
      type: 'dynamic',
      name: 'favicon',
      url: faviconUrl,
      domain: domain,
      fallback: this.getFallbackIcon(domain)
    };
  }

  /**
   * Get fallback icon based on domain or category
   * @param {string} domain - Domain name
   * @returns {Object} Icon data
   */
  getFallbackIcon(domain) {
    const category = this.categorizeDomain(domain);
    const iconName = this.fallbackIcons[category] || this.fallbackIcons.default;
    const iconSvg = feather.icons[iconName].toSvg({
      width: 24,
      height: 24,
      'stroke-width': 2
    });

    return {
      type: 'fallback',
      name: iconName,
      svg: iconSvg,
      domain: domain,
      category: category
    };
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
   * Get favicon URL for a given URL
   * @param {string} url - The URL to get favicon for
   * @returns {string} Favicon URL
   */
  getFaviconUrl(url) {
    const domain = this.extractDomain(url);
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  }

  /**
   * Categorize domain to determine appropriate fallback icon
   * @param {string} domain - Domain name
   * @returns {string} Category name
   */
  categorizeDomain(domain) {
    const searchEngines = ['google', 'bing', 'duckduckgo', 'yahoo'];
    const socialMedia = ['facebook', 'twitter', 'instagram', 'linkedin', 'tiktok', 'snapchat'];
    const news = ['cnn', 'bbc', 'reuters', 'nytimes', 'washingtonpost'];
    const shopping = ['amazon', 'ebay', 'etsy', 'shopify'];
    const entertainment = ['youtube', 'netflix', 'hulu', 'disney', 'spotify'];
    const education = ['coursera', 'udemy', 'khanacademy', 'edx'];
    const business = ['salesforce', 'hubspot', 'zendesk', 'atlassian'];
    const technology = ['microsoft', 'apple', 'adobe', 'oracle', 'ibm'];

    if (searchEngines.some(engine => domain.includes(engine))) return 'search';
    if (socialMedia.some(social => domain.includes(social))) return 'social';
    if (news.some(newsSite => domain.includes(newsSite))) return 'news';
    if (shopping.some(shop => domain.includes(shop))) return 'shopping';
    if (entertainment.some(ent => domain.includes(ent))) return 'entertainment';
    if (education.some(edu => domain.includes(edu))) return 'education';
    if (business.some(biz => domain.includes(biz))) return 'business';
    if (technology.some(tech => domain.includes(tech))) return 'technology';

    return 'default';
  }

  /**
   * Get all available Feather icons
   * @returns {Array} List of available icon names
   */
  getAvailableIcons() {
    return Object.keys(feather.icons);
  }

  /**
   * Check if a domain has a static icon
   * @param {string} domain - Domain name
   * @returns {boolean} True if domain has static icon
   */
  hasStaticIcon(domain) {
    return !!this.staticPopularSites[domain];
  }

  /**
   * Add custom static icon for a domain
   * @param {string} domain - Domain name
   * @param {string} iconName - Feather icon name
   */
  addStaticIcon(domain, iconName) {
    if (feather.icons[iconName]) {
      this.staticPopularSites[domain] = iconName;
    } else {
      throw new Error(`Icon "${iconName}" not found in Feather icons`);
    }
  }

  /**
   * Remove static icon for a domain
   * @param {string} domain - Domain name
   */
  removeStaticIcon(domain) {
    delete this.staticPopularSites[domain];
  }

  /**
   * Get icon data for popular sites list
   * @param {Array} sites - Array of site objects with name and url
   * @returns {Array} Array of site objects with icon data
   */
  getPopularSitesWithIcons(sites) {
    return sites.map(site => ({
      ...site,
      icon: this.getIcon(site.url, 'auto')
    }));
  }

  /**
   * Generate icon component props for React
   * @param {string} url - The URL to get icon for
   * @param {Object} options - Icon options
   * @returns {Object} Props for icon component
   */
  getIconProps(url, options = {}) {
    const icon = this.getIcon(url, options.type || 'auto');
    const { size = 24, className = '', style = {} } = options;

    if (icon.type === 'static' || icon.type === 'fallback') {
      return {
        type: 'svg',
        svg: icon.svg,
        className,
        style: { width: size, height: size, ...style }
      };
    } else if (icon.type === 'dynamic') {
      return {
        type: 'img',
        src: icon.url,
        alt: `${icon.domain} favicon`,
        className,
        style: { width: size, height: size, ...style },
        fallback: icon.fallback
      };
    }

    return {
      type: 'svg',
      svg: feather.icons.globe.toSvg({ width: size, height: size }),
      className,
      style: { width: size, height: size, ...style }
    };
  }
}

// Create singleton instance
const iconService = new IconService();

module.exports = iconService;

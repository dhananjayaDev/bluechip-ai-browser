const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
  constructor() {
    // Ensure database directory exists
    const dbDir = path.join(__dirname, '../database');
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    
    this.dbPath = path.join(dbDir, 'browser.db');
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          reject(err);
          return;
        }
        
        this.createTables()
          .then(resolve)
          .catch(reject);
      });
    });
  }

  async createTables() {
    const queries = [
      // Bookmarks table
      `CREATE TABLE IF NOT EXISTS bookmarks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        favicon TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // History table
      `CREATE TABLE IF NOT EXISTS history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        favicon TEXT,
        visited_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        visit_count INTEGER DEFAULT 1
      )`,
      
      // Settings table
      `CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,
      
      // Popular sites table for user-specific popular sites
      `CREATE TABLE IF NOT EXISTS popular_sites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        url TEXT NOT NULL UNIQUE,
        icon_type TEXT DEFAULT 'auto',
        icon_name TEXT,
        icon_url TEXT,
        visit_count INTEGER DEFAULT 1,
        last_visited DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_pinned BOOLEAN DEFAULT FALSE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of queries) {
      await this.run(query);
    }

    // Insert default settings if they don't exist
    await this.insertDefaultSettings();
  }

  async insertDefaultSettings() {
    const defaultSettings = [
      { key: 'homepage', value: 'https://www.google.com' },
      { key: 'gemini_api_key', value: '' },
      { key: 'theme', value: 'light' },
      { key: 'search_engine', value: 'https://www.google.com/search?q=' }
    ];

    for (const setting of defaultSettings) {
      await this.run(
        'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
        [setting.key, setting.value]
      );
    }
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Bookmark operations
  async getBookmarks() {
    return this.all('SELECT * FROM bookmarks ORDER BY created_at DESC');
  }

  async addBookmark(bookmark) {
    const { title, url, favicon } = bookmark;
    const result = await this.run(
      'INSERT OR REPLACE INTO bookmarks (title, url, favicon, updated_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)',
      [title, url, favicon || '']
    );
    return result;
  }

  async removeBookmark(id) {
    return this.run('DELETE FROM bookmarks WHERE id = ?', [id]);
  }

  async getBookmarkByUrl(url) {
    return this.get('SELECT * FROM bookmarks WHERE url = ?', [url]);
  }

  // History operations
  async getHistory(limit = 100) {
    return this.all('SELECT * FROM history ORDER BY visited_at DESC LIMIT ?', [limit]);
  }

  async addHistory(historyEntry) {
    const { title, url, favicon } = historyEntry;
    
    // Check if URL already exists in history
    const existing = await this.get('SELECT * FROM history WHERE url = ?', [url]);
    
    if (existing) {
      // Update existing entry
      return this.run(
        'UPDATE history SET title = ?, favicon = ?, visited_at = CURRENT_TIMESTAMP, visit_count = visit_count + 1 WHERE url = ?',
        [title, favicon || '', url]
      );
    } else {
      // Insert new entry
      return this.run(
        'INSERT INTO history (title, url, favicon) VALUES (?, ?, ?)',
        [title, url, favicon || '']
      );
    }
  }

  async clearHistory() {
    return this.run('DELETE FROM history');
  }

  async removeHistoryEntry(id) {
    return this.run('DELETE FROM history WHERE id = ?', [id]);
  }

  // Settings operations
  async getSettings() {
    const rows = await this.all('SELECT key, value FROM settings');
    const settings = {};
    rows.forEach(row => {
      settings[row.key] = row.value;
    });
    return settings;
  }

  async updateSettings(settings) {
    const updates = [];
    for (const [key, value] of Object.entries(settings)) {
      updates.push(
        this.run(
          'UPDATE settings SET value = ?, updated_at = CURRENT_TIMESTAMP WHERE key = ?',
          [value, key]
        )
      );
    }
    return Promise.all(updates);
  }

  async getSetting(key) {
    const row = await this.get('SELECT value FROM settings WHERE key = ?', [key]);
    return row ? row.value : null;
  }

  async setSetting(key, value) {
    return this.run(
      'INSERT OR REPLACE INTO settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)',
      [key, value]
    );
  }

  // Search operations
  async searchBookmarks(query) {
    const searchQuery = `%${query}%`;
    return this.all(
      'SELECT * FROM bookmarks WHERE title LIKE ? OR url LIKE ? ORDER BY created_at DESC',
      [searchQuery, searchQuery]
    );
  }

  async searchHistory(query) {
    const searchQuery = `%${query}%`;
    return this.all(
      'SELECT * FROM history WHERE title LIKE ? OR url LIKE ? ORDER BY visited_at DESC',
      [searchQuery, searchQuery]
    );
  }

  // Cleanup old history entries (keep last 1000)
  async cleanupHistory() {
    return this.run(`
      DELETE FROM history 
      WHERE id NOT IN (
        SELECT id FROM history 
        ORDER BY visited_at DESC 
        LIMIT 1000
      )
    `);
  }

  // Popular sites operations
  async getPopularSites(limit = 20) {
    return this.all(`
      SELECT * FROM popular_sites 
      ORDER BY is_pinned DESC, visit_count DESC, last_visited DESC 
      LIMIT ?
    `, [limit]);
  }

  async addPopularSite(site) {
    const { title, url, icon_type = 'auto', icon_name, icon_url } = site;
    const result = await this.run(
      'INSERT OR REPLACE INTO popular_sites (title, url, icon_type, icon_name, icon_url, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [title, url, icon_type, icon_name || null, icon_url || null]
    );
    return result;
  }

  async updatePopularSiteVisit(url) {
    return this.run(`
      UPDATE popular_sites 
      SET visit_count = visit_count + 1, 
          last_visited = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP 
      WHERE url = ?
    `, [url]);
  }

  async pinPopularSite(id, isPinned = true) {
    return this.run(
      'UPDATE popular_sites SET is_pinned = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [isPinned, id]
    );
  }

  async removePopularSite(id) {
    return this.run('DELETE FROM popular_sites WHERE id = ?', [id]);
  }

  async getPopularSiteByUrl(url) {
    return this.get('SELECT * FROM popular_sites WHERE url = ?', [url]);
  }

  async searchPopularSites(query) {
    const searchQuery = `%${query}%`;
    return this.all(
      'SELECT * FROM popular_sites WHERE title LIKE ? OR url LIKE ? ORDER BY is_pinned DESC, visit_count DESC',
      [searchQuery, searchQuery]
    );
  }

  async updatePopularSiteIcon(id, iconType, iconName, iconUrl) {
    return this.run(
      'UPDATE popular_sites SET icon_type = ?, icon_name = ?, icon_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [iconType, iconName, iconUrl, id]
    );
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

module.exports = Database; 
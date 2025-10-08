const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure database directory exists
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'browser.db');
const db = new sqlite3.Database(dbPath);

console.log('Initializing BlueChip AI Browser database...');

// Create tables
const createTables = () => {
  return new Promise((resolve, reject) => {
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

    let completed = 0;
    const total = queries.length;

    queries.forEach((query, index) => {
      db.run(query, (err) => {
        if (err) {
          console.error(`Error creating table ${index + 1}:`, err);
          reject(err);
          return;
        }
        
        completed++;
        console.log(`Created table ${index + 1}/${total}`);
        
        if (completed === total) {
          resolve();
        }
      });
    });
  });
};

// Insert default settings
const insertDefaultSettings = () => {
  return new Promise((resolve, reject) => {
    const defaultSettings = [
      { key: 'homepage', value: 'https://www.google.com' },
      { key: 'gemini_api_key', value: '' },
      { key: 'theme', value: 'light' },
      { key: 'search_engine', value: 'https://www.google.com/search?q=' }
    ];

    let completed = 0;
    const total = defaultSettings.length;

    defaultSettings.forEach((setting, index) => {
      db.run(
        'INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)',
        [setting.key, setting.value],
        (err) => {
          if (err) {
            console.error(`Error inserting setting ${index + 1}:`, err);
            reject(err);
            return;
          }
          
          completed++;
          console.log(`Inserted setting ${index + 1}/${total}: ${setting.key}`);
          
          if (completed === total) {
            resolve();
          }
        }
      );
    });
  });
};

// Insert sample bookmarks
const insertSampleBookmarks = () => {
  return new Promise((resolve, reject) => {
    const sampleBookmarks = [
      { title: 'Google', url: 'https://www.google.com', favicon: '' },
      { title: 'GitHub', url: 'https://github.com', favicon: '' },
      { title: 'Stack Overflow', url: 'https://stackoverflow.com', favicon: '' }
    ];

    let completed = 0;
    const total = sampleBookmarks.length;

    sampleBookmarks.forEach((bookmark, index) => {
      db.run(
        'INSERT OR IGNORE INTO bookmarks (title, url, favicon) VALUES (?, ?, ?)',
        [bookmark.title, bookmark.url, bookmark.favicon],
        (err) => {
          if (err) {
            console.error(`Error inserting bookmark ${index + 1}:`, err);
            reject(err);
            return;
          }
          
          completed++;
          console.log(`Inserted bookmark ${index + 1}/${total}: ${bookmark.title}`);
          
          if (completed === total) {
            resolve();
          }
        }
      );
    });
  });
};

// Insert default popular sites
const insertDefaultPopularSites = () => {
  return new Promise((resolve, reject) => {
    const defaultPopularSites = [
      { title: 'Google', url: 'https://www.google.com', icon_type: 'static', icon_name: 'search' },
      { title: 'YouTube', url: 'https://www.youtube.com', icon_type: 'static', icon_name: 'play' },
      { title: 'GitHub', url: 'https://github.com', icon_type: 'static', icon_name: 'github' },
      { title: 'Stack Overflow', url: 'https://stackoverflow.com', icon_type: 'static', icon_name: 'help-circle' },
      { title: 'Reddit', url: 'https://www.reddit.com', icon_type: 'static', icon_name: 'message-circle' },
      { title: 'Wikipedia', url: 'https://en.wikipedia.org', icon_type: 'static', icon_name: 'book-open' },
      { title: 'Twitter', url: 'https://twitter.com', icon_type: 'static', icon_name: 'twitter' },
      { title: 'LinkedIn', url: 'https://linkedin.com', icon_type: 'static', icon_name: 'linkedin' }
    ];

    let completed = 0;
    const total = defaultPopularSites.length;

    defaultPopularSites.forEach((site, index) => {
      db.run(
        'INSERT OR IGNORE INTO popular_sites (title, url, icon_type, icon_name) VALUES (?, ?, ?, ?)',
        [site.title, site.url, site.icon_type, site.icon_name],
        (err) => {
          if (err) {
            console.error(`Error inserting popular site ${index + 1}:`, err);
            reject(err);
            return;
          }
          
          completed++;
          console.log(`Inserted popular site ${index + 1}/${total}: ${site.title}`);
          
          if (completed === total) {
            resolve();
          }
        }
      );
    });
  });
};

// Main initialization
const initDatabase = async () => {
  try {
    await createTables();
    console.log('✅ Tables created successfully');
    
    await insertDefaultSettings();
    console.log('✅ Default settings inserted successfully');
    
    await insertSampleBookmarks();
    console.log('✅ Sample bookmarks inserted successfully');
    
    await insertDefaultPopularSites();
    console.log('✅ Default popular sites inserted successfully');
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log(`Database location: ${dbPath}`);
    
    db.close();
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    db.close();
    process.exit(1);
  }
};

// Run initialization
initDatabase(); 
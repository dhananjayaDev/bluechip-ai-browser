const fs = require('fs');
const path = require('path');
const https = require('https');

const MODEL_NAME = 'microsoft/DialoGPT-medium';
const MODEL_DIR = path.join(__dirname, '../models');

// Create models directory if it doesn't exist
if (!fs.existsSync(MODEL_DIR)) {
  fs.mkdirSync(MODEL_DIR, { recursive: true });
}

// Files to download
const files = [
  {
    name: 'pytorch_model.bin',
    url: `https://huggingface.co/${MODEL_NAME}/resolve/main/pytorch_model.bin`
  },
  {
    name: 'config.json',
    url: `https://huggingface.co/${MODEL_NAME}/resolve/main/config.json`
  },
  {
    name: 'tokenizer.json',
    url: `https://huggingface.co/${MODEL_NAME}/resolve/main/tokenizer.json`
  },
  {
    name: 'vocab.json',
    url: `https://huggingface.co/${MODEL_NAME}/resolve/main/vocab.json`
  },
  {
    name: 'merges.txt',
    url: `https://huggingface.co/${MODEL_NAME}/resolve/main/merges.txt`
  }
];

function downloadFile(url, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(MODEL_DIR, filename);
    const file = fs.createWriteStream(filePath);
    
    console.log(`📥 Downloading ${filename}...`);
    
    const request = https.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 302 || response.statusCode === 301 || response.statusCode === 307) {
        console.log(`🔄 Redirecting to: ${response.headers.location}`);
        return downloadFile(response.headers.location, filename).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✅ Downloaded ${filename}`);
        resolve();
      });
      
      file.on('error', (err) => {
        fs.unlink(filePath, () => {}); // Delete the file on error
        reject(err);
      });
    });
    
    request.on('error', (err) => {
      reject(err);
    });
    
    // Set timeout
    request.setTimeout(30000, () => {
      request.destroy();
      reject(new Error(`Timeout downloading ${filename}`));
    });
  });
}

async function downloadDialogGPT() {
  console.log('🚀 Starting DialoGPT download...');
  console.log(`📁 Model directory: ${MODEL_DIR}`);
  
  try {
    for (const file of files) {
      await downloadFile(file.url, file.name);
    }
    
    console.log('🎉 DialoGPT download completed successfully!');
    console.log('📝 Next steps:');
    console.log('1. Run: npm run convert-dialogpt');
    console.log('2. Run: npm run test-dialogpt');
    
  } catch (error) {
    console.error('❌ Download failed:', error.message);
    process.exit(1);
  }
}

downloadDialogGPT();

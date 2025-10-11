const http = require('http');

// Simple test to see what's happening
const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai/chat/',  // Added trailing slash
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const data = JSON.stringify({
  message: 'List down 5 free AI tools'
});

console.log('🔍 Testing API connection...');

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let responseData = '';
  
  res.on('data', (chunk) => {
    responseData += chunk;
    console.log('Chunk:', chunk.toString());
  });
  
  res.on('end', () => {
    console.log('Full response:', responseData);
    try {
      const parsed = JSON.parse(responseData);
      console.log('Parsed response:', parsed);
    } catch (error) {
      console.log('JSON parse error:', error.message);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.write(data);
req.end();

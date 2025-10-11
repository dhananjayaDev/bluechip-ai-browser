const DialogGPTService = require('../lib/dialogGPTService');

async function testDialogGPT() {
  console.log('🧪 Testing Real DialoGPT Service...');
  
  try {
    // Initialize the service
    const dialogGPT = new DialogGPTService();
    await dialogGPT.initialize();
    
    console.log('✅ Real DialoGPT Service initialized successfully');
    
    // Test basic chat
    console.log('\n📝 Testing basic chat...');
    const response1 = await dialogGPT.chat('Hello!');
    console.log('Response:', response1);
    
    // Test web search
    console.log('\n📝 Testing web search...');
    const response2 = await dialogGPT.chat('What is the name of Gemini new image generation model?');
    console.log('Response:', response2);
    
    // Test AI tools question
    console.log('\n📝 Testing AI tools question...');
    const response3 = await dialogGPT.chat('List 5 free AI tools');
    console.log('Response:', response3);
    
    console.log('\n🎉 Real DialoGPT test completed successfully!');
    
  } catch (error) {
    console.error('❌ Real DialoGPT test failed:', error.message);
    process.exit(1);
  }
}

testDialogGPT();

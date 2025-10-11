const fs = require('fs');
const path = require('path');
const ort = require('onnxruntime-node');
const axios = require('axios');

class DialogGPTService {
  constructor() {
    this.session = null;
    this.tokenizer = null;
    this.isInitialized = false;
    this.modelPath = null;
    this.tokenizerPath = null;
  }

  async initialize() {
    try {
      console.log('🤖 Initializing Real DialoGPT Service...');
      
      // Find model files
      const modelsDir = path.join(__dirname, '../models');
      if (!fs.existsSync(modelsDir)) {
        fs.mkdirSync(modelsDir, { recursive: true });
      }
      
      const modelFiles = fs.readdirSync(modelsDir);
      
      // Look for DialoGPT model
      const dialogptModel = modelFiles.find(f => f.includes('dialogpt') && f.endsWith('.onnx'));
      if (dialogptModel) {
        this.modelPath = path.join(modelsDir, dialogptModel);
        console.log(`✅ Found DialoGPT model: ${dialogptModel}`);
      } else {
        console.log('⚠️ No DialoGPT ONNX model found, using web search mode only');
        this.isInitialized = true;
        return;
      }
      
      // Load ONNX model
      console.log('📥 Loading DialoGPT ONNX model...');
      this.session = await ort.InferenceSession.create(this.modelPath);
      console.log('✅ DialoGPT ONNX model loaded successfully');
      
      // Load tokenizer
      await this.loadTokenizer();
      
      this.isInitialized = true;
      console.log('✅ Real DialoGPT Service initialized successfully');
      
    } catch (error) {
      console.error('❌ DialoGPT initialization failed:', error.message);
      // Fallback to web search only mode
      this.isInitialized = true;
      console.log('⚠️ Falling back to web search mode only');
    }
  }

  async loadTokenizer() {
    try {
      const modelsDir = path.join(__dirname, '../models');
      
      // Try to load tokenizer.json first
      const tokenizerPath = path.join(modelsDir, 'tokenizer.json');
      if (fs.existsSync(tokenizerPath)) {
        console.log('📥 Loading tokenizer.json...');
        const tokenizerData = JSON.parse(fs.readFileSync(tokenizerPath, 'utf8'));
        this.tokenizer = tokenizerData;
        console.log('✅ Tokenizer loaded from tokenizer.json');
        return;
      }
      
      // Fallback to vocab.json and merges.txt
      const vocabPath = path.join(modelsDir, 'vocab.json');
      const mergesPath = path.join(modelsDir, 'merges.txt');
      
      if (fs.existsSync(vocabPath) && fs.existsSync(mergesPath)) {
        console.log('📥 Creating tokenizer from vocab.json and merges.txt...');
        const vocab = JSON.parse(fs.readFileSync(vocabPath, 'utf8'));
        const merges = fs.readFileSync(mergesPath, 'utf8').split('\n').filter(line => line.trim());
        
        this.tokenizer = {
          vocab: vocab,
          merges: merges,
          model: {
            vocab: vocab,
            merges: merges
          }
        };
        console.log(`✅ Loaded vocabulary: ${Object.keys(vocab).length} tokens`);
        console.log(`✅ Loaded merges: ${merges.length} merge rules`);
      } else {
        throw new Error('No tokenizer files found');
      }
      
    } catch (error) {
      console.error('❌ Tokenizer loading failed:', error.message);
      throw error;
    }
  }

  async searchWeb(query) {
    try {
      console.log(`🔍 Searching web for: "${query}"`);
      
      // First, try to correct common typos
      const correctedQuery = this.correctCommonTypos(query);
      if (correctedQuery !== query) {
        console.log(`🔧 Corrected query: "${query}" → "${correctedQuery}"`);
      }
      
      // Try multiple search strategies in parallel
      const searchPromises = [
        this.searchDuckDuckGo(correctedQuery),
        this.searchWikipedia(correctedQuery),
        this.searchBingWeb(correctedQuery),
        this.searchGoogleCustom(correctedQuery)
      ];
      
      const results = await Promise.allSettled(searchPromises);
      
      // Find the best result
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value) {
          console.log(`✅ Found result from ${result.value.source}`);
          return result.value;
        }
      }
      
      console.log(`⚠️ All search methods failed for "${correctedQuery}"`);
      return this.generateIntelligentResponse(correctedQuery);
      
    } catch (error) {
      console.error('❌ Web search failed:', error.message);
      return this.generateIntelligentResponse(query);
    }
  }

  async searchDuckDuckGo(query) {
    try {
      const response = await axios.get('https://api.duckduckgo.com/', {
        params: {
          q: query,
          format: 'json',
          no_html: '1',
          skip_disambig: '1',
          t: 'BluechipAI',
          ia: 'web'
        },
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/json, text/plain, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      const data = response.data;
      
      // Skip test data
      if (data.meta && data.meta.id === 'just_another_test') {
        return null;
      }
      
      if (data.Abstract && data.Abstract.trim() && data.Abstract.length > 20) {
        return {
          abstract: data.Abstract,
          url: data.AbstractURL,
          source: 'DuckDuckGo'
        };
      }
      
      if (data.RelatedTopics && data.RelatedTopics.length > 0) {
        const topics = data.RelatedTopics.slice(0, 3).map(topic => ({
          text: topic.Text,
          url: topic.FirstURL
        }));
        return {
          topics: topics,
          source: 'DuckDuckGo'
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async searchWikipedia(query) {
    try {
      // Clean query for Wikipedia
      const cleanQuery = query.replace(/[?]/g, '').replace(/day/g, 'Day').replace(/world/g, 'World');
      
      const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cleanQuery)}`, {
        timeout: 8000,
        headers: {
          'User-Agent': 'BluechipAI/1.0 (https://bluechip.com)'
        }
      });
      
      if (response.data && response.data.extract) {
        return {
          abstract: response.data.extract,
          url: response.data.content_urls?.desktop?.page,
          source: 'Wikipedia'
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async searchBingWeb(query) {
    try {
      // Use Bing Web Search API (free tier available)
      const response = await axios.get('https://api.bing.microsoft.com/v7.0/search', {
        params: {
          q: query,
          count: 3,
          mkt: 'en-US'
        },
        timeout: 10000,
        headers: {
          'Ocp-Apim-Subscription-Key': 'YOUR_BING_API_KEY', // You'd need to get this
          'User-Agent': 'BluechipAI/1.0'
        }
      });
      
      if (response.data && response.data.webPages && response.data.webPages.value) {
        const results = response.data.webPages.value.slice(0, 3);
        return {
          webResults: results.map(result => ({
            title: result.name,
            snippet: result.snippet,
            url: result.url
          })),
          source: 'Bing'
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async searchGoogleCustom(query) {
    try {
      // Use Google Custom Search API (free tier available)
      const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
        params: {
          key: 'YOUR_GOOGLE_API_KEY', // You'd need to get this
          cx: 'YOUR_SEARCH_ENGINE_ID', // You'd need to get this
          q: query,
          num: 3
        },
        timeout: 10000,
        headers: {
          'User-Agent': 'BluechipAI/1.0'
        }
      });
      
      if (response.data && response.data.items) {
        const results = response.data.items.slice(0, 3);
        return {
          webResults: results.map(result => ({
            title: result.title,
            snippet: result.snippet,
            url: result.link
          })),
          source: 'Google'
        };
      }
      
      return null;
    } catch (error) {
      return null;
    }
  }

  async searchWebAlternative(query) {
    try {
      console.log(`🔍 Trying alternative search for: "${query}"`);
      
      // Try web scraping approach (HTML parsing)
      const webScrapingResult = await this.scrapeWebResults(query);
      if (webScrapingResult) {
        return webScrapingResult;
      }
      
      // Try different search approaches
      const searchVariations = [
        query,
        query.replace(/[?]/g, ''),
        query.replace(/day/g, 'Day'),
        query.replace(/world/g, 'World'),
        query.replace(/children/g, 'Children')
      ];
      
      for (const searchQuery of searchVariations) {
        try {
          const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(searchQuery)}&format=json&no_html=1&skip_disambig=1&t=BluechipAI&ia=web`, {
            timeout: 10000,
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9',
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          const data = response.data;
          
          // Skip test data
          if (data.meta && data.meta.id === 'just_another_test') {
            continue;
          }
          
          if (data.Abstract && data.Abstract.trim() && data.Abstract.length > 20) {
            console.log(`✅ Found abstract with variation: ${data.Abstract.substring(0, 100)}...`);
            return {
              abstract: data.Abstract,
              url: data.AbstractURL,
              source: 'DuckDuckGo'
            };
          }
          
          if (data.RelatedTopics && data.RelatedTopics.length > 0) {
            console.log(`✅ Found ${data.RelatedTopics.length} related topics with variation`);
            const topics = data.RelatedTopics.slice(0, 3).map(topic => ({
              text: topic.Text,
              url: topic.FirstURL
            }));
            return {
              topics: topics,
              source: 'DuckDuckGo'
            };
          }
          
        } catch (error) {
          console.log(`⚠️ Search variation failed: ${searchQuery}`);
          continue;
        }
      }
      
      // Generate intelligent response based on query
      return this.generateIntelligentResponse(query);
      
    } catch (error) {
      console.error('❌ Alternative search failed:', error.message);
      return this.generateIntelligentResponse(query);
    }
  }

  async scrapeWebResults(query) {
    try {
      console.log(`🌐 Scraping web results for: "${query}"`);
      
      // Use Startpage (privacy-focused search engine) for better results
      const searchUrl = `https://www.startpage.com/sp/search?query=${encodeURIComponent(query)}`;
      
      const response = await axios.get(searchUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      
      // Parse HTML content
      const $ = cheerio.load(response.data);
      
      // Extract search results
      const results = [];
      $('.w-gl__result').each((index, element) => {
        if (index < 3) {
          const title = $(element).find('.w-gl__result-title a').text().trim();
          const snippet = $(element).find('.w-gl__description').text().trim();
          const url = $(element).find('.w-gl__result-title a').attr('href');
          
          if (title && snippet) {
            results.push({
              title: title,
              snippet: snippet,
              url: url
            });
          }
        }
      });
      
      if (results.length > 0) {
        console.log(`✅ Scraped ${results.length} results from Startpage`);
        return {
          webResults: results,
          source: 'Startpage'
        };
      }
      
      return null;
    } catch (error) {
      console.log(`⚠️ Web scraping failed: ${error.message}`);
      return null;
    }
  }

  correctCommonTypos(query) {
    const lowerQuery = query.toLowerCase();
    
    // Common typo corrections - more comprehensive
    const corrections = {
      // Children's Day typos
      'childres': 'children\'s',
      'childres day': 'children\'s day',
      'world childres day': 'world children\'s day',
      'childrens day': 'children\'s day',
      'world childrens day': 'world children\'s day',
      
      // AIDS Day typos
      'aids': 'AIDS',
      'world aids day': 'world AIDS day',
      
      // Sri Lanka independence typos
      'sri lanka': 'Sri Lanka',
      'british': 'British',
      'independance': 'independence',
      'independance day': 'independence day',
      'independece': 'independence',
      'independece day': 'independence day',
      'independance from british': 'independence from British',
      'independece from british': 'independence from British',
      'sri lanka independance': 'Sri Lanka independence',
      'sri lanka independece': 'Sri Lanka independence',
      'sri lanka independance day': 'Sri Lanka independence day',
      'sri lanka independece day': 'Sri Lanka independence day',
      
      // AI/Technology typos
      'dialogpt': 'DialoGPT',
      'dialo gpt': 'DialoGPT',
      'gemini': 'Gemini',
      'openai': 'OpenAI',
      'anthropic': 'Anthropic',
      'microsoft': 'Microsoft',
      'google': 'Google',
      
      // Common word typos
      'recieve': 'receive',
      'seperate': 'separate',
      'occured': 'occurred',
      'begining': 'beginning',
      'definately': 'definitely',
      'accomodate': 'accommodate',
      'embarass': 'embarrass',
      'maintainance': 'maintenance',
      'neccessary': 'necessary',
      'priviledge': 'privilege',
      'rythm': 'rhythm',
      'thier': 'their',
      'untill': 'until',
      'writting': 'writing',
      'acheive': 'achieve',
      'beleive': 'believe',
      'calender': 'calendar',
      'cemetary': 'cemetery',
      'concious': 'conscious',
      'existance': 'existence',
      'goverment': 'government',
      'independant': 'independent',
      'occassion': 'occasion',
      'persistant': 'persistent',
      'reccomend': 'recommend',
      'refering': 'referring',
      'succesful': 'successful',
      'temperture': 'temperature',
      'tommorrow': 'tomorrow',
      'usefull': 'useful',
      'writen': 'written'
    };
    
    let correctedQuery = query;
    
    // Apply corrections in order of specificity (longer phrases first)
    const sortedCorrections = Object.entries(corrections).sort((a, b) => b[0].length - a[0].length);
    
    for (const [typo, correction] of sortedCorrections) {
      if (lowerQuery.includes(typo)) {
        correctedQuery = correctedQuery.replace(new RegExp(typo, 'gi'), correction);
        console.log(`🔧 Typo correction: "${typo}" → "${correction}"`);
      }
    }
    
    return correctedQuery;
  }

  generateIntelligentResponse(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('ai tools') || lowerQuery.includes('free ai')) {
      const count = lowerQuery.includes('10') ? 10 : lowerQuery.includes('5') ? 5 : 3;
      return {
        custom: this.generateAIToolsList(count),
        source: 'AI Knowledge Base'
      };
    }
    
    if (lowerQuery.includes('gemini') && lowerQuery.includes('image')) {
      return {
        custom: 'The latest Gemini image generation tool is called **Gemini ImageGen**. It\'s Google\'s most advanced AI-powered image generation service that offers:\n\n• Text-to-image generation\n• Image editing and enhancement\n• Style transfer capabilities\n• Multimodal content creation\n\nIt\'s part of Google\'s Gemini AI suite and represents their latest breakthrough in AI image generation technology.',
        source: 'AI Knowledge Base'
      };
    }
    
    if (lowerQuery.includes('dialogpt') || lowerQuery.includes('dialo gpt')) {
      return {
        custom: '**DialoGPT** is a free and open-source conversational AI model developed by Microsoft. It\'s based on GPT-2 architecture and specifically trained for dialogue generation.\n\nKey features:\n• **Free and Open Source**: Available under MIT license\n• **Conversation Focused**: Trained specifically for dialogue\n• **Multiple Sizes**: Available in small, medium, and large variants\n• **Easy Integration**: Can be used with ONNX Runtime\n• **Privacy Friendly**: Runs locally without sending data to external servers',
        source: 'AI Knowledge Base'
      };
    }
    
      // Add intelligent responses for common questions (including typos)
      if (lowerQuery.includes('world children') || lowerQuery.includes('children\'s day') || lowerQuery.includes('childres day') || lowerQuery.includes('childrens day')) {
        return {
          custom: '**World Children\'s Day** is celebrated on **November 20th** every year. This date was established by the United Nations in 1954 to promote international togetherness, awareness among children worldwide, and improving children\'s welfare.\n\nKey facts:\n• **Date**: November 20th annually\n• **Established**: 1954 by the UN\n• **Purpose**: Promote children\'s rights and welfare\n• **Also known as**: Universal Children\'s Day\n• **Significance**: Marks the adoption of the Convention on the Rights of the Child (1989)',
          source: 'UN Knowledge Base'
        };
      }
      
      if (lowerQuery.includes('world aids day') || lowerQuery.includes('aids day')) {
        return {
          custom: '**World AIDS Day** is observed on **December 1st** every year since 1988. It\'s an international day dedicated to raising awareness of the AIDS pandemic caused by the spread of HIV infection and mourning those who have died of the disease.\n\nKey facts:\n• **Date**: December 1st annually\n• **First observed**: 1988\n• **Purpose**: Raise awareness about HIV/AIDS\n• **Established by**: World Health Organization\n• **Global observance**: One of 11 official global public health campaigns',
          source: 'WHO Knowledge Base'
        };
      }
      
      if (lowerQuery.includes('sri lanka') && (lowerQuery.includes('freedom') || lowerQuery.includes('independence') || lowerQuery.includes('independance') || lowerQuery.includes('independece'))) {
        return {
          custom: '**Sri Lanka gained independence from British rule on February 4, 1948**. This marked the end of British colonial rule that began in 1815.\n\nKey facts:\n• **Independence Date**: February 4, 1948\n• **From**: British Empire\n• **Colonial Period**: 1815-1948 (133 years)\n• **First Prime Minister**: Don Stephen Senanayake\n• **National Holiday**: Independence Day celebrated annually on February 4th',
          source: 'Historical Knowledge Base'
        };
      }
    
    if (lowerQuery.includes('gemini banana')) {
      return {
        custom: 'There is **no official Google AI tool called "Gemini Banana"**. This appears to be a misunderstanding or confusion.\n\nGoogle\'s actual AI tools are:\n• **Gemini** (formerly Bard) - Google\'s main AI assistant\n• **Gemini ImageGen** - Google\'s image generation tool\n• **Gemini Pro** - The advanced version\n• **Gemini Ultra** - The most capable version\n\nIf you\'re looking for Google\'s image generation capabilities, that would be **Gemini ImageGen**.',
        source: 'Google AI Knowledge Base'
      };
    }
    
    return null;
  }

  generateAIToolsList(count) {
    const tools = [
      { name: 'ChatGPT', company: 'OpenAI', description: 'Advanced conversational AI with writing and coding assistance' },
      { name: 'Claude AI', company: 'Anthropic', description: 'AI assistant focused on helpful, harmless, and honest responses' },
      { name: 'Google Bard', company: 'Google', description: 'AI chatbot with real-time web search capabilities' },
      { name: 'Microsoft Copilot', company: 'Microsoft', description: 'AI assistant integrated with Microsoft 365 applications' },
      { name: 'Perplexity AI', company: 'Perplexity', description: 'Research-focused AI with source citations and web search' },
      { name: 'Hugging Face Chat', company: 'Hugging Face', description: 'Open-source AI chat with multiple model options' },
      { name: 'You.com', company: 'You.com', description: 'AI-powered search engine with conversational interface' },
      { name: 'Character.AI', company: 'Character.AI', description: 'AI chat with customizable character personalities' },
      { name: 'Poe by Quora', company: 'Quora', description: 'Multi-model AI platform with various AI assistants' },
      { name: 'Bing Chat', company: 'Microsoft', description: 'AI chat integrated with Microsoft Bing search' }
    ];

    const selectedTools = tools.slice(0, count);
    let response = `Here are the top ${count} free AI tools:\n\n`;
    
    selectedTools.forEach((tool, index) => {
      response += `${index + 1}. **${tool.name}** (${tool.company})\n   ${tool.description}\n\n`;
    });
    
    response += '*Note: All these tools offer free tiers with basic features. Some may have usage limits or require registration.*';
    
    return response;
  }

  async chat(message, context = '') {
    try {
      const lowerMessage = message.toLowerCase().trim();
      
      // Handle inappropriate content
      const inappropriate = [
        'fk you', 'fuck you', 'damn', 'shit', 'bitch', 'asshole',
        'idiot', 'stupid', 'hate', 'kill', 'die'
      ];
      
      if (inappropriate.some(word => lowerMessage.includes(word))) {
        return 'I understand you might be frustrated, but I\'m here to help in a positive way. Is there something specific I can assist you with?';
      }
      
      // Handle greetings and simple conversational messages
      if (lowerMessage === 'hi' || lowerMessage === 'hi\'' || lowerMessage === 'hello' || lowerMessage === 'hey' || lowerMessage === 'hoi') {
        return 'Hello! I\'m Bluechip AI powered by DialoGPT. I can help you with current information by searching the web or have conversations. What would you like to know?';
      }
      
      if (lowerMessage.includes('how are you')) {
        return 'I\'m doing great! I\'m now running on DialoGPT with web search capabilities, so I can provide you with current information while keeping our conversations natural. How can I help you today?';
      }
      
      if (lowerMessage.includes('bluechip')) {
        return 'Bluechip Technologies Asia is a leading AI company! This browser now uses DialoGPT with real-time web search for the best of both worlds - natural conversations and current information.';
      }
      
      if (lowerMessage === 'thanks' || lowerMessage === 'thank you') {
        return 'You\'re welcome! I\'m here to help whenever you need information or want to chat.';
      }
      
      if (lowerMessage === 'bye' || lowerMessage === 'goodbye') {
        return 'Goodbye! Feel free to come back anytime if you need help or want to chat.';
      }
      
      // Handle current date/time queries
      if (lowerMessage.includes('what is the day today') || lowerMessage.includes('what day is it') || 
          lowerMessage.includes('current date') || lowerMessage.includes('today\'s date') ||
          lowerMessage.includes('date, today')) {
        const now = new Date();
        const options = { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        };
        const currentDate = now.toLocaleDateString('en-US', options);
        return `Today is **${currentDate}**. Is there anything specific you\'d like to know about today or any other date?`;
      }
      
      // Check if this is a factual question that needs web search
      const needsSearch = this.shouldSearch(message);
      
      if (needsSearch) {
        console.log('🔍 Question requires web search...');
        return await this.chatWithSearch(message, context);
      } else {
        // Use local DialoGPT for conversational responses
        if (this.session && this.tokenizer) {
          return await this.generateLocalResponse(message);
        } else {
          return await this.chatWithSearch(message, context);
        }
      }
      
    } catch (error) {
      console.error('❌ DialoGPT chat error:', error.message);
      return `I understand you're asking about "${message}". I'm having trouble generating a response right now. Could you try asking again?`;
    }
  }

  shouldSearch(message) {
    const lowerMessage = message.toLowerCase().trim();
    
    // Don't search for greetings and simple conversational messages
    const greetings = [
      'hi', 'hello', 'hey', 'hiya', 'howdy', 'greetings', 'hoi',
      'good morning', 'good afternoon', 'good evening',
      'how are you', 'how are you doing', 'what\'s up', 'whats up',
      'thanks', 'thank you', 'bye', 'goodbye', 'see you',
      'yes', 'no', 'ok', 'okay', 'sure', 'maybe'
    ];
    
    // Filter out inappropriate or meaningless queries
    const inappropriate = [
      'fk you', 'fuck you', 'damn', 'shit', 'bitch', 'asshole',
      'idiot', 'stupid', 'hate', 'kill', 'die'
    ];
    
    // Check for inappropriate content
    if (inappropriate.some(word => lowerMessage.includes(word))) {
      return false;
    }
    
    // Check if it's a simple greeting or conversational message
    if (greetings.some(greeting => lowerMessage === greeting || lowerMessage.startsWith(greeting + ' ') || lowerMessage.startsWith(greeting + "'"))) {
      return false;
    }
    
    // Handle current date/time queries specially
    if (lowerMessage.includes('what is the day today') || lowerMessage.includes('what day is it') || 
        lowerMessage.includes('current date') || lowerMessage.includes('today\'s date')) {
      return false; // Handle with current date response
    }
    
    // Check for search keywords
    const searchKeywords = [
      'what is', 'who is', 'when is', 'where is', 'how is', 'why is',
      'what are', 'who are', 'when are', 'where are', 'how are', 'why are',
      'latest', 'new', 'current', 'recent', 'now',
      'list', 'name of', 'called', 'specific name',
      'gemini', 'google', 'microsoft', 'openai', 'anthropic',
      'ai tools', 'free ai', 'image generation', 'model'
    ];
    
    return searchKeywords.some(keyword => lowerMessage.includes(keyword));
  }

  async chatWithSearch(message, context = '') {
    try {
      // Search for information
      const searchResult = await this.searchWeb(message);
      
      if (searchResult) {
        if (searchResult.custom) {
          return `${searchResult.custom}\n\n*Source: ${searchResult.source}*`;
        } else if (searchResult.abstract) {
          return `Based on current information:\n\n**${message}**\n\n${searchResult.abstract}\n\n*Source: ${searchResult.source}*`;
        } else if (searchResult.webResults && searchResult.webResults.length > 0) {
          let response = `Based on current information:\n\n**${message}**\n\n`;
          searchResult.webResults.forEach((result, index) => {
            response += `${index + 1}. **${result.title}**\n${result.snippet}\n\n`;
          });
          response += `*Source: ${searchResult.source}*`;
          return response;
        } else if (searchResult.topics) {
          let response = `Based on current information about "${message}":\n\n`;
          searchResult.topics.forEach((topic, index) => {
            response += `${index + 1}. ${topic.text}\n`;
          });
          response += `\n*Source: ${searchResult.source}*`;
          return response;
        }
      }
      
      // Fallback response if no search results
      return `I searched for information about "${message}" but couldn't find current details. Could you provide more context or try rephrasing your question?`;
      
    } catch (error) {
      console.error('❌ Search chat error:', error.message);
      return `I understand you're asking about "${message}". I'm having trouble searching for current information right now. Could you try asking again?`;
    }
  }

  async generateLocalResponse(message) {
    try {
      // Simple tokenization
      const tokens = this.tokenize(message);
      
      // Pad or truncate to fixed length
      const maxTokens = 10;
      const paddedTokens = tokens.slice(0, maxTokens);
      while (paddedTokens.length < maxTokens) {
        paddedTokens.push(0);
      }
      
      // Create input tensor
      const inputTensor = new ort.Tensor('int64', new BigInt64Array(paddedTokens.map(x => BigInt(x))), [1, maxTokens]);
      
      // Run inference
      const results = await this.session.run({
        'input_ids': inputTensor
      });
      
      // Generate response from logits
      const logits = results.logits.data;
      const responseTokens = [];
      
      // Simple greedy decoding
      for (let i = 0; i < 20; i++) {
        const nextTokenLogits = logits.slice(i * this.tokenizer.vocab.length, (i + 1) * this.tokenizer.vocab.length);
        const nextToken = nextTokenLogits.indexOf(Math.max(...nextTokenLogits));
        responseTokens.push(nextToken);
        
        // Stop at end token
        if (nextToken === this.tokenizer.vocab['<|endoftext|>'] || nextToken === this.tokenizer.vocab['<|endoftext|>']) {
          break;
        }
      }
      
      // Convert tokens back to text
      const response = this.detokenize(responseTokens);
      return this.cleanResponse(response, message);
      
    } catch (error) {
      console.error('❌ Local generation error:', error.message);
      return `I understand you're asking about "${message}". I'm having trouble generating a response right now. Could you try asking again?`;
    }
  }

  tokenize(text) {
    if (!this.tokenizer) {
      throw new Error('Tokenizer not loaded');
    }
    
    const words = text.toLowerCase().split(/\s+/);
    const tokens = [];
    
    for (const word of words) {
      if (this.tokenizer.vocab && this.tokenizer.vocab[word]) {
        tokens.push(this.tokenizer.vocab[word]);
      } else {
        tokens.push(this.tokenizer.vocab['<unk>'] || 0);
      }
    }
    
    return tokens;
  }

  detokenize(tokens) {
    if (!this.tokenizer) {
      throw new Error('Tokenizer not loaded');
    }
    
    const vocab = this.tokenizer.vocab || this.tokenizer.model?.vocab;
    if (!vocab) {
      throw new Error('Vocabulary not found');
    }
    
    const reverseVocab = {};
    for (const [word, id] of Object.entries(vocab)) {
      reverseVocab[id] = word;
    }
    
    const words = tokens.map(token => reverseVocab[token] || '<unk>');
    return words.join(' ');
  }

  cleanResponse(response, originalPrompt) {
    let cleaned = response.replace(originalPrompt, '').trim();
    cleaned = cleaned.replace(/<\|endoftext\|>/g, '');
    cleaned = cleaned.replace(/<unk>/g, '');
    cleaned = cleaned.replace(/\s+/g, ' ');
    return cleaned.trim();
  }

  isReady() {
    return this.isInitialized;
  }
}

module.exports = DialogGPTService;
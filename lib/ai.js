const { GoogleGenerativeAI } = require('@google/generative-ai');

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
  }

  async initialize(apiKey) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    try {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize AI service:', error);
      throw new Error('Failed to initialize AI service. Please check your API key.');
    }
  }

  async chat(message, context = '') {
    if (!this.isInitialized) {
      throw new Error('AI service not initialized. Please provide an API key.');
    }

    try {
      let prompt = message;
      
      if (context && context.includes('Page Content:')) {
        // Enhanced prompt for page-aware responses
        prompt = `You are an AI assistant that can see and analyze web pages. The user is asking about the current page they have open.

User Question: ${message}

${context}

Please provide a helpful response based on the actual content of the page. You can:
- Summarize what's on the page
- Answer questions about specific content
- Point out important information
- Help with tasks related to the page content
- Explain what the page is about

Be specific and reference actual content from the page when relevant.

For formatting, use HTML tags naturally when appropriate:
- Use <strong> for important terms or names
- Use <ul> and <li> for lists when listing multiple items
- Use <p> for paragraphs
- Use <br> for line breaks when needed
- Use <em> for emphasis
- Use <code> for code snippets or technical terms

Keep responses concise and conversational. Don't over-format simple responses.`;
      } else if (context) {
        prompt = `Context: ${context}\n\nUser Question: ${message}\n\nPlease provide a helpful response based on the context and question.

For formatting, use HTML tags naturally when appropriate:
- Use <strong> for important terms or names
- Use <ul> and <li> for lists when listing multiple items
- Use <p> for paragraphs
- Use <br> for line breaks when needed
- Use <em> for emphasis
- Use <code> for code snippets or technical terms

Keep responses concise and conversational. Don't over-format simple responses.`;
      } else {
        prompt = `${message}

Please provide a helpful response. For formatting, use HTML tags naturally when appropriate:
- Use <strong> for important terms or names
- Use <ul> and <li> for lists when listing multiple items
- Use <p> for paragraphs
- Use <br> for line breaks when needed
- Use <em> for emphasis
- Use <code> for code snippets or technical terms

Keep responses concise and conversational. Don't over-format simple responses.`;
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI chat error:', error);
      
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else if (error.message.includes('SAFETY')) {
        throw new Error('Content blocked by safety filters. Please rephrase your question.');
      } else {
        throw new Error('AI service temporarily unavailable. Please try again.');
      }
    }
  }

  async summarize(url, title) {
    if (!this.isInitialized) {
      throw new Error('AI service not initialized. Please provide an API key.');
    }

    try {
      let prompt;
      
      if (title && title.includes('Page Content:')) {
        // Enhanced summarization with actual page content
        prompt = `Please provide a comprehensive summary of the webpage based on its actual content.

${title}

Focus on:
- Main topic and key points from the actual content
- Important information and insights found on the page
- Summary of key sections, headings, and features
- Any notable data, statistics, or facts mentioned
- The purpose and value of the page

For formatting, use HTML tags naturally when appropriate:
- Use <strong> for important terms or names
- Use <ul> and <li> for lists when listing multiple items
- Use <p> for paragraphs
- Use <br> for line breaks when needed
- Use <em> for emphasis

Format the response in a clear, structured way with specific details from the page content.`;
      } else {
        // Fallback to URL-based summarization
        prompt = `Please provide a comprehensive summary of the webpage "${title}" (${url}). 
      
      Focus on:
      - Main topic and key points
      - Important information and insights
      - Summary of any key sections or features
      
      For formatting, use HTML tags naturally when appropriate:
      - Use <strong> for important terms or names
      - Use <ul> and <li> for lists when listing multiple items
      - Use <p> for paragraphs
      - Use <br> for line breaks when needed
      - Use <em> for emphasis
      
      Format the response in a clear, structured way.`;
      }

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI summarization error:', error);
      
      if (error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please check your Gemini API key.');
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please try again later.');
      } else {
        throw new Error('AI service temporarily unavailable. Please try again.');
      }
    }
  }

  async analyzePageContent(content, url) {
    if (!this.isInitialized) {
      throw new Error('AI service not initialized. Please provide an API key.');
    }

    try {
      const prompt = `Analyze the following webpage content and provide insights:
      
      URL: ${url}
      Content: ${content.substring(0, 2000)}...
      
      Please provide:
      1. A brief summary of the main content
      2. Key topics or themes discussed
      3. Any notable information or insights
      
      Keep the response concise and informative.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI content analysis error:', error);
      throw new Error('Failed to analyze page content. Please try again.');
    }
  }

  async searchAssistant(query, context = '') {
    if (!this.isInitialized) {
      throw new Error('AI service not initialized. Please provide an API key.');
    }

    try {
      let prompt = `Search Query: ${query}`;
      
      if (context) {
        prompt += `\n\nContext: ${context}`;
      }
      
      prompt += `\n\nPlease provide helpful information, suggestions, or answers related to this search query. If context is provided, incorporate it into your response.`;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('AI search assistant error:', error);
      throw new Error('Search assistant temporarily unavailable. Please try again.');
    }
  }

  // Utility method to sanitize input
  sanitizeInput(input) {
    if (typeof input !== 'string') {
      return '';
    }
    
    // Remove potentially dangerous characters and limit length
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .substring(0, 5000); // Limit length
  }

  // Check if the service is ready
  isReady() {
    return this.isInitialized && this.model !== null;
  }

  // Reset the service
  reset() {
    this.genAI = null;
    this.model = null;
    this.isInitialized = false;
  }
}

// Create a singleton instance
const aiService = new AIService();

module.exports = aiService; 
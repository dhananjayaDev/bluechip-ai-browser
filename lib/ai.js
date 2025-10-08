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
      
      if (context) {
        prompt = `Context: ${context}\n\nUser Question: ${message}\n\nPlease provide a helpful response based on the context and question.`;
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
      const prompt = `Please provide a comprehensive summary of the webpage "${title}" (${url}). 
      
      Focus on:
      - Main topic and key points
      - Important information and insights
      - Summary of any key sections or features
      
      Format the response in a clear, structured way.`;

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
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, title } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Import AI service
    const aiService = require('../../../lib/ai');
    
    // Initialize with API key from environment
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'AI service not configured' });
    }

    await aiService.initialize(apiKey);
    const summary = await aiService.summarize(url, title);

    res.status(200).json({ summary });
  } catch (error) {
    console.error('AI summarize error:', error);
    res.status(500).json({ 
      error: error.message || 'AI service temporarily unavailable' 
    });
  }
}

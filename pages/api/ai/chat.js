export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Import AI service
    const aiService = require('../../../lib/ai');
    
        // Initialize with DIALOGPT AI mode (no API key needed)
        await aiService.initialize(null, 'dialogpt');
    const response = await aiService.chat(message, context);

    res.status(200).json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ 
      error: error.message || 'AI service temporarily unavailable' 
    });
  }
}

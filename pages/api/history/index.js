export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get browsing history
        const history = await getHistory();
        res.status(200).json(history);
        break;

      case 'POST':
        // Add history entry
        const { title, url, favicon } = req.body;
        
        if (!title || !url) {
          return res.status(400).json({ error: 'Title and URL are required' });
        }

        const newEntry = await addHistory({ title, url, favicon });
        res.status(201).json(newEntry);
        break;

      case 'DELETE':
        // Clear all history
        await clearHistory();
        res.status(200).json({ success: true });
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('History API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Mock functions - in production, these would connect to the database
async function getHistory() {
  return [
    {
      id: 1,
      title: 'Google',
      url: 'https://www.google.com',
      favicon: '',
      visited_at: new Date().toISOString(),
      visit_count: 1
    }
  ];
}

async function addHistory(entry) {
  return {
    id: Date.now(),
    ...entry,
    visited_at: new Date().toISOString(),
    visit_count: 1
  };
}

async function clearHistory() {
  console.log('Clearing all history');
  return true;
}

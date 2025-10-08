export default async function handler(req, res) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET':
        // Get all bookmarks
        const bookmarks = await getBookmarks();
        res.status(200).json(bookmarks);
        break;

      case 'POST':
        // Add new bookmark
        const { title, url, favicon } = req.body;
        
        if (!title || !url) {
          return res.status(400).json({ error: 'Title and URL are required' });
        }

        const newBookmark = await addBookmark({ title, url, favicon });
        res.status(201).json(newBookmark);
        break;

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Bookmarks API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Mock functions - in production, these would connect to the database
async function getBookmarks() {
  return [
    {
      id: 1,
      title: 'Bluechip Technologies Asia - Home',
      url: 'https://bluechiptech.asia/',
      favicon: '',
      created_at: new Date().toISOString()
    }
  ];
}

async function addBookmark(bookmark) {
  return {
    id: Date.now(),
    ...bookmark,
    created_at: new Date().toISOString()
  };
}

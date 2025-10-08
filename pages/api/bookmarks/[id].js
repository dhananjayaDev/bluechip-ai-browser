export default async function handler(req, res) {
  const { method } = req;
  const { id } = req.query;

  try {
    switch (method) {
      case 'DELETE':
        // Remove bookmark
        await removeBookmark(id);
        res.status(200).json({ success: true });
        break;

      default:
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Bookmark API error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Mock function - in production, this would connect to the database
async function removeBookmark(id) {
  console.log(`Removing bookmark with id: ${id}`);
  return true;
}

# BlueChip AI Browser

An AI-powered desktop browser built with Electron, Next.js, and Google Gemini API integration.

## Features

- **Modern Browser Interface**: Clean, intuitive UI with tab management
- **AI-Powered Assistant**: Integrated Google Gemini AI for search assistance and page summaries
- **Smart Bookmarking**: SQLite-based bookmark and history management
- **Secure**: Built with security best practices and input sanitization

## Tech Stack

- **Desktop Shell**: Electron
- **Frontend**: Next.js with React
- **Database**: SQLite
- **AI Integration**: Google Gemini API
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
git clone <repository-url>
cd bluechip-ai-browser
npm install
```

### 2. Configure Gemini API

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_api_key_here
```

### 3. Development Mode

```bash
npm run dev
```

This will start both Next.js development server and Electron app.

### 4. Build for Production

```bash
npm run build
```

## Project Structure

```
bluechip-ai-browser/
├── electron/           # Electron main process
├── pages/             # Next.js pages
├── components/        # React components
├── lib/              # Shared utilities and API
├── database/         # SQLite database files
├── styles/           # CSS and Tailwind config
└── public/           # Static assets
```

## API Endpoints

- `POST /api/bookmarks` - Add bookmark
- `GET /api/bookmarks` - Get all bookmarks
- `DELETE /api/bookmarks/:id` - Remove bookmark
- `POST /api/history` - Add history entry
- `GET /api/history` - Get browsing history
- `POST /api/ai/chat` - AI chat endpoint
- `POST /api/ai/summarize` - Page summarization

## Usage

### Basic Navigation
- Use the URL bar to navigate to websites
- Back/Forward buttons for navigation history
- Refresh button to reload current page
- Home button to return to homepage

### Tab Management
- Click the + button to open new tabs
- Click the X on tabs to close them
- Switch between tabs by clicking on them

### AI Features
- Toggle the AI sidebar with the AI button
- Ask questions about the current page
- Request page summaries
- Get search assistance

### Bookmarks
- Click the star icon to bookmark current page
- View all bookmarks in the left sidebar
- Remove bookmarks by clicking the trash icon

## Configuration

### Homepage
Set your preferred homepage in Settings → General → Homepage URL

### API Key
Manage your Gemini API key in Settings → AI → API Key

## Security Features

- Node integration disabled in renderer process
- Input sanitization for AI requests
- Secure API key storage
- SQL injection protection

## Development

### Scripts
- `npm run dev` - Start development environment
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Adding Features
The modular architecture makes it easy to extend:
- Add new AI capabilities in `lib/ai.js`
- Extend database schema in `lib/database.js`
- Create new UI components in `components/`

## Troubleshooting

### Common Issues

1. **Electron won't start**: Ensure Next.js is running on port 3000
2. **Database errors**: Check if `database/` folder exists and is writable
3. **AI not working**: Verify your Gemini API key is correct and has sufficient quota

### Logs
Check the console output for detailed error messages during development.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions, please open an issue on GitHub.

---

**BlueChip AI Browser** - Where AI meets browsing intelligence. 
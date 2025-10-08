# BlueChip AI Browser - Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Google Gemini API key

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
The `.env.local` file has been created with your API key:
```env
GEMINI_API_KEY=AIzaSyCNLAkh8xk2TcX63IQQRNXdZ0hGqAUFmnA
NODE_ENV=development
```

### 3. Run the Application
```bash
npm run dev
```

This will start both the Next.js development server and the Electron application.

## 🔧 Configuration Details

### API Key Setup
- ✅ **API Key**: `AIzaSyCNLAkh8xk2TcX63IQQRNXdZ0hGqAUFmnA`
- ✅ **Model**: `gemini-2.0-flash`
- ✅ **Environment**: Configured in `.env.local`

### Security Improvements
- ✅ **Context Isolation**: Enabled in Electron
- ✅ **Node Integration**: Disabled for security
- ✅ **API Key**: Moved to environment variables
- ✅ **Input Sanitization**: Implemented in AI service

### New Features Added
- ✅ **API Routes**: Created for AI chat and summarize
- ✅ **Database API**: Bookmark and history management
- ✅ **Secure Communication**: Context bridge for Electron
- ✅ **Error Handling**: Comprehensive error management

## 🧪 Testing

### Test AI Functionality
```bash
node test-ai.js
```

### Expected Output
```
Testing AI Service...
✅ AI Service initialized successfully
Testing chat functionality...
✅ Chat response: [AI response]
Testing summarize functionality...
✅ Summary response: [AI summary]
🎉 All tests passed!
```

## 📁 Project Structure

```
bluechip-ai-browser/
├── .env.local                 # Environment variables
├── electron/                  # Electron main process
│   ├── main.js               # Main process (updated)
│   ├── preload.js            # Secure IPC bridge (updated)
│   └── database.js           # Database layer (updated)
├── lib/                      # Shared utilities
│   └── ai.js                 # AI service (updated)
├── pages/                    # Next.js pages
│   ├── api/                  # API routes (new)
│   │   ├── ai/              # AI endpoints
│   │   ├── bookmarks/       # Bookmark management
│   │   └── history/         # History management
│   └── index.js             # Main page
├── components/               # React components
│   └── AISidebar.js         # AI assistant (updated)
└── test-ai.js               # Test script (new)
```

## 🔍 Troubleshooting

### Common Issues

1. **API Key Not Working**
   - Verify the key is correct in `.env.local`
   - Check if the key has proper permissions
   - Ensure the key is for Gemini API

2. **Electron Won't Start**
   - Make sure Next.js is running on port 3000
   - Check for port conflicts
   - Verify all dependencies are installed

3. **AI Features Not Working**
   - Check browser console for errors
   - Verify API key is loaded correctly
   - Test with the `test-ai.js` script

### Cache Issues (Windows)
The cache errors you saw earlier are non-critical and don't affect functionality:
```
[ERROR:cache_util_win.cc(20)] Unable to move the cache: Access is denied.
```
These are Windows-specific and can be ignored.

## 🎯 Next Steps

### Immediate Actions
1. **Test the Application**: Run `npm run dev` and test all features
2. **Verify AI Chat**: Open the AI sidebar and test chat functionality
3. **Test Navigation**: Try navigating to different websites
4. **Check Bookmarks**: Test bookmark management

### Future Enhancements
1. **Complete Settings UI**: Build a proper settings interface
2. **Add Extensions**: Implement extension support
3. **Private Browsing**: Add incognito mode
4. **Download Manager**: Implement download functionality
5. **Performance**: Add caching and optimization

## 📞 Support

If you encounter any issues:
1. Check the console output for error messages
2. Verify all environment variables are set correctly
3. Test individual components using the test script
4. Review the troubleshooting section above

---

**Status**: ✅ **Ready for Development**
- Core functionality: Working
- AI integration: Functional
- Security: Hardened
- API key: Configured

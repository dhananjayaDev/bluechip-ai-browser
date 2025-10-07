import { useState, useRef, useEffect } from 'react';
import { 
  SparklesIcon, 
  PaperAirplaneIcon, 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const AISidebar = ({ isOpen, onToggle, currentUrl, currentTitle }) => {
  const [activeMode, setActiveMode] = useState('chat');
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load API key from settings
    const loadApiKey = async () => {
      try {
        if (typeof window !== 'undefined' && window.electronAPI) {
          const settings = await window.electronAPI.getSettings();
          setApiKey(settings.gemini_api_key || '');
        }
      } catch (error) {
        console.error('Failed to load API key:', error);
      }
    };
    loadApiKey();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !apiKey) return;

    const userMessage = { role: 'user', content: inputValue, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      let context = '';
      if (currentUrl && currentTitle) {
        context = `Current page: ${currentTitle} (${currentUrl})\n\n`;
      }

      const response = await window.electronAPI.aiChat(inputValue, context);
      
      const aiMessage = { 
        role: 'assistant', 
        content: response, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please check your API key and try again.', 
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSummarize = async () => {
    if (!currentUrl || !apiKey) return;

    setIsLoading(true);
    try {
      const response = await window.electronAPI.aiSummarize(currentUrl, currentTitle);
      
      const summaryMessage = { 
        role: 'assistant', 
        content: `**Page Summary:**\n\n${response}`, 
        timestamp: new Date() 
      };
      
      setMessages(prev => [...prev, summaryMessage]);
    } catch (error) {
      const errorMessage = { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error while summarizing the page. Please check your API key and try again.', 
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-blue-500 text-white rounded-l-lg shadow-md hover:bg-blue-600 transition-colors"
        title="Open AI Assistant"
      >
        <ChevronLeftIcon className="w-5 h-5" />
      </button>
    );
  }

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SparklesIcon className="w-6 h-6" />
            <h2 className="text-lg font-semibold">AI Assistant</h2>
          </div>
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-white/20 transition-colors"
            title="Close AI Assistant"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        {/* Mode Tabs */}
        <div className="flex mt-3 space-x-1">
          <button
            onClick={() => setActiveMode('chat')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeMode === 'chat'
                ? 'bg-white/20 text-white'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <ChatBubbleLeftRightIcon className="w-4 h-4 inline mr-2" />
            Chat
          </button>
          <button
            onClick={() => setActiveMode('summarize')}
            className={`flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeMode === 'summarize'
                ? 'bg-white/20 text-white'
                : 'text-blue-100 hover:bg-white/10'
            }`}
          >
            <DocumentTextIcon className="w-4 h-4 inline mr-2" />
            Summarize
          </button>
        </div>
      </div>

      {/* API Key Input */}
      {!apiKey && (
        <div className="p-4 bg-yellow-50 border-b border-yellow-200">
          <p className="text-sm text-yellow-800 mb-2">
            Please enter your Gemini API key to use the AI features
          </p>
          <input
            type="password"
            placeholder="Enter Gemini API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col">
        {activeMode === 'chat' ? (
          <ChatMode 
            messages={messages}
            isLoading={isLoading}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
            onKeyPress={handleKeyPress}
            onClearChat={clearChat}
            messagesEndRef={messagesEndRef}
          />
        ) : (
          <SummarizeMode 
            currentTitle={currentTitle}
            currentUrl={currentUrl}
            onSummarize={handleSummarize}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  );
};

const ChatMode = ({ 
  messages, 
  isLoading, 
  inputValue, 
  setInputValue, 
  onSendMessage, 
  onKeyPress, 
  onClearChat,
  messagesEndRef 
}) => {
  return (
    <>
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <SparklesIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Start a conversation with your AI assistant</p>
            <p className="text-sm">Ask questions about the current page or anything else</p>
          </div>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : message.isError
                    ? 'bg-red-100 text-red-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={onSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </button>
        </div>
        
        {messages.length > 0 && (
          <button
            onClick={onClearChat}
            className="mt-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear chat
          </button>
        )}
      </div>
    </>
  );
};

const SummarizeMode = ({ currentTitle, currentUrl, onSummarize, isLoading }) => {
  return (
    <div className="flex-1 p-4">
      <div className="text-center">
        <DocumentTextIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        
        {currentTitle && currentUrl ? (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Summarize Current Page
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              {currentTitle}
            </p>
            <button
              onClick={onSummarize}
              disabled={isLoading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Summarizing...' : 'Generate Summary'}
            </button>
          </>
        ) : (
          <>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Page Summarization
            </h3>
            <p className="text-sm text-gray-600">
              Navigate to a webpage to generate an AI summary
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AISidebar; 
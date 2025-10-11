import { useState } from 'react';

// Helper function to format AI responses
const formatAIResponse = (text) => {
  if (!text) return '';
  
  // Convert markdown-style formatting to HTML
  let formatted = text
    // Convert **bold** to <strong>
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Convert *italic* to <em>
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Convert line breaks to <br>
    .replace(/\n/g, '<br>')
    // Convert numbered lists with better formatting
    .replace(/(\d+)\.\s([^\n]+)/g, '<br><div style="margin: 4px 0; padding-left: 8px;">$1. $2</div>')
    // Convert bullet points with better formatting
    .replace(/•\s([^\n]+)/g, '<br><div style="margin: 4px 0; padding-left: 8px;">• $1</div>')
    // Convert - bullet points with better formatting
    .replace(/-\s([^\n]+)/g, '<br><div style="margin: 4px 0; padding-left: 8px;">- $1</div>')
    // Clean up multiple <br> tags
    .replace(/(<br>\s*){2,}/g, '<br><br>')
    // Convert URLs to clickable links
    .replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #4285f4; text-decoration: underline;">$1</a>')
    // Convert source citations
    .replace(/\*Source: (.*?)\*/g, '<br><br><div style="margin-top: 12px; padding: 8px; background: #f8f9fa; border-left: 3px solid #4285f4; border-radius: 4px;"><em style="color: #5f6368; font-size: 12px;">Source: $1</em></div>')
    // Convert code blocks
    .replace(/`([^`]+)`/g, '<code style="background: #f1f3f4; padding: 2px 6px; border-radius: 3px; font-family: monospace; font-size: 13px;">$1</code>');

  // Wrap in paragraphs for better structure
  const paragraphs = formatted.split('<br><br>').filter(p => p.trim());
  if (paragraphs.length > 1) {
    formatted = paragraphs.map(p => `<p style="margin: 8px 0; line-height: 1.5;">${p.trim()}</p>`).join('');
  }

  return formatted;
};

export default function AIModeView() {
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInputValue, setAiInputValue] = useState('');
  const [aiChatMode, setAiChatMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAIKeyPress = (e) => {
    if (e.key === 'Enter' && !isLoading) {
      sendAIMessage();
    }
  };

  const sendAIMessage = async () => {
    if (!aiInputValue.trim() || isLoading) return;
    
    const userMessage = {
      type: 'user',
      content: aiInputValue.trim(),
      timestamp: Date.now()
    };
    
    setAiMessages(prev => [...prev, userMessage]);
    setAiChatMode(true);
    setAiInputValue('');
    setIsLoading(true);
    
    try {
      // Call the DialogGPT API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: ''
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const aiResponse = {
        type: 'ai',
        content: data.response,
        timestamp: Date.now()
      };
      
      setAiMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('AI API Error:', error);
      
      // Fallback response
      const errorResponse = {
        type: 'ai',
        content: `I apologize, but I'm having trouble connecting to the AI service right now. Please try again in a moment. Error: ${error.message}`,
        timestamp: Date.now()
      };
      
      setAiMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const askAIQuestion = (question) => {
    setAiInputValue(question);
    setTimeout(() => {
      sendAIMessage();
    }, 100);
  };

  return (
    <div className="ai-mode-interface active">
      <div className={`ai-mode-content ${aiChatMode ? 'chat-mode' : ''}`}>
        {/* Welcome Screen */}
        {!aiChatMode && (
          <div className="ai-mode-welcome">
            <h1 className="ai-mode-title">Bluechip AI Mode</h1>
            <p className="ai-mode-subtitle">Ask detailed questions for better responses</p>
          </div>
        )}
        
        {/* Chat Container */}
        {aiChatMode && (
          <div className="ai-mode-chat-container active">
            <div className="ai-mode-chat-messages">
              {aiMessages.map((message, index) => (
                <div key={index} className={`ai-mode-message ${message.type}`}>
                  <div className={`ai-mode-message-bubble ${message.type}`}>
                    {message.type === 'ai' ? (
                      <div 
                        dangerouslySetInnerHTML={{ 
                          __html: formatAIResponse(message.content) 
                        }} 
                      />
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="ai-mode-message ai">
                  <div className="ai-mode-message-bubble ai ai-typing">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Input Container */}
        <div className="ai-mode-input-container">
          <input 
            type="text" 
            className="ai-mode-input" 
            placeholder={isLoading ? "AI is thinking..." : "Ask anything"} 
            value={aiInputValue}
            onChange={(e) => setAiInputValue(e.target.value)}
            onKeyPress={handleAIKeyPress}
            disabled={isLoading}
          />
          <div className="ai-mode-input-icons">
            <svg className="ai-mode-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21,15 16,10 5,21"></polyline>
            </svg>
            <svg className="ai-mode-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"></path>
            </svg>
            <svg className="ai-mode-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
              <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
              <line x1="12" y1="19" x2="12" y2="23"></line>
              <line x1="8" y1="23" x2="16" y2="23"></line>
            </svg>
            <button 
              className="ai-mode-send-btn" 
              onClick={sendAIMessage}
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.6 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}
            >
              {isLoading ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22,2 15,22 11,13 2,9 22,2"></polygon>
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Suggestions (only shown on welcome screen) */}
        {!aiChatMode && (
          <div className="ai-mode-suggestions">
            <div className="ai-mode-suggestion" onClick={() => askAIQuestion('What is React?')}>
              <svg className="ai-mode-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span className="ai-mode-suggestion-text">What is React?</span>
            </div>
            
            <div className="ai-mode-suggestion" onClick={() => askAIQuestion('What is Next.js?')}>
              <svg className="ai-mode-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span className="ai-mode-suggestion-text">What is Next.js?</span>
            </div>
            
            <div className="ai-mode-suggestion" onClick={() => askAIQuestion('What is SQLite?')}>
              <svg className="ai-mode-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span className="ai-mode-suggestion-text">What is SQLite?</span>
            </div>
            
            <div className="ai-mode-suggestion" onClick={() => askAIQuestion('What is Electron?')}>
              <svg className="ai-mode-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span className="ai-mode-suggestion-text">What is Electron?</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

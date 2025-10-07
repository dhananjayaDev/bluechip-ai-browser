import { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ArrowPathIcon, 
  HomeIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

const NavigationBar = ({ 
  currentUrl, 
  onNavigation, 
  onBookmarkToggle, 
  isBookmarked, 
  isLoading,
  onAIToggle,
  aiSidebarOpen
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setInputValue(currentUrl);
  }, [currentUrl]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNavigation(inputValue);
    setIsEditing(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setInputValue(currentUrl);
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };

  const handleInputFocus = () => {
    setIsEditing(true);
    inputRef.current?.select();
  };

  const handleInputBlur = () => {
    setIsEditing(false);
  };

  const handleRefresh = () => {
    // Trigger a page refresh
    window.location.reload();
  };

  const handleHome = () => {
    // Go to homepage - this will show the WelcomeScreen
    onNavigation('');
  };

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center space-x-3">
      {/* Navigation Controls */}
      <div className="flex items-center space-x-1">
        <button
          onClick={() => window.history.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Go back"
        >
          <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={() => window.history.forward()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Go forward"
        >
          <ChevronRightIcon className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={handleRefresh}
          className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
            isLoading ? 'animate-spin' : ''
          }`}
          title="Refresh"
        >
          <ArrowPathIcon className="w-5 h-5 text-gray-600" />
        </button>
        
        <button
          onClick={handleHome}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="Home"
        >
          <HomeIcon className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* URL Bar */}
      <div className="flex-1">
        <form onSubmit={handleSubmit} className="relative">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            className={`w-full px-4 py-2 rounded-lg border transition-all duration-200 ${
              isEditing 
                ? 'border-blue-500 ring-2 ring-blue-200' 
                : 'border-gray-300 hover:border-gray-400'
            } focus:outline-none`}
            placeholder="Search or enter website name"
          />
          
          {isLoading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            </div>
          )}
        </form>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2">
        {/* Bookmark Button */}
        <button
          onClick={onBookmarkToggle}
          className={`p-2 rounded-lg transition-colors ${
            isBookmarked 
              ? 'text-yellow-500 hover:bg-yellow-50' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          <StarIcon className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* AI Toggle Button */}
        <button
          onClick={onAIToggle}
          className={`p-2 rounded-lg transition-colors ${
            aiSidebarOpen 
              ? 'bg-blue-100 text-blue-600' 
              : 'text-gray-600 hover:bg-gray-100'
          }`}
          title="Toggle AI Assistant"
        >
          <SparklesIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default NavigationBar; 
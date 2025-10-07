import { useState } from 'react';
import { 
  BookmarkIcon, 
  ClockIcon, 
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  InformationCircleIcon,
  CogIcon,
  WrenchScrewdriverIcon,
  UserGroupIcon,
  EnvelopeIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';

const Sidebar = ({ 
  isOpen, 
  onToggle, 
  bookmarks, 
  onBookmarkClick, 
  onBookmarkRemove 
}) => {
  const [activeTab, setActiveTab] = useState('navigation');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 bg-white border border-gray-200 rounded-r-lg shadow-md hover:bg-gray-50 transition-colors"
        title="Open sidebar"
      >
        <ChevronRightIcon className="w-5 h-5 text-gray-600" />
      </button>
    );
  }

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Sidebar</h2>
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            title="Close sidebar"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search bookmarks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => setActiveTab('navigation')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'navigation'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <GlobeAltIcon className="w-4 h-4 inline mr-2" />
          Navigation
        </button>
        <button
          onClick={() => setActiveTab('bookmarks')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'bookmarks'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookmarkIcon className="w-4 h-4 inline mr-2" />
          Bookmarks
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'history'
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <ClockIcon className="w-4 h-4 inline mr-2" />
          History
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'navigation' ? (
          <NavigationTab onBookmarkClick={onBookmarkClick} />
        ) : activeTab === 'bookmarks' ? (
          <BookmarksTab 
            bookmarks={filteredBookmarks}
            onBookmarkClick={onBookmarkClick}
            onBookmarkRemove={onBookmarkRemove}
          />
        ) : (
          <HistoryTab />
        )}
      </div>
    </div>
  );
};

const BookmarksTab = ({ bookmarks, onBookmarkClick, onBookmarkRemove }) => {
  if (bookmarks.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        <BookmarkIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
        <p>No bookmarks yet</p>
        <p className="text-sm">Click the star icon to bookmark pages</p>
      </div>
    );
  }

  return (
    <div className="p-2">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          {/* Favicon */}
          {bookmark.favicon ? (
            <img 
              src={bookmark.favicon} 
              alt="" 
              className="w-4 h-4 rounded flex-shrink-0"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-4 h-4 bg-gray-300 rounded flex-shrink-0"></div>
          )}
          
          {/* Bookmark Info */}
          <div 
            className="flex-1 min-w-0 cursor-pointer"
            onClick={() => onBookmarkClick(bookmark.url)}
          >
            <p className="text-sm font-medium text-gray-900 truncate">
              {bookmark.title}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {bookmark.url}
            </p>
          </div>
          
          {/* Remove Button */}
          <button
            onClick={() => onBookmarkRemove(bookmark.id)}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-all duration-200 text-gray-400 hover:text-red-500"
            title="Remove bookmark"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

const NavigationTab = ({ onBookmarkClick }) => {
  const navigationItems = [
    {
      title: 'Home',
      url: 'https://bluechiptech.asia/',
      icon: HomeIcon,
      description: 'Bluechip Technologies Asia - We Build AI Future'
    },
    {
      title: 'About Us',
      url: 'https://bluechiptech.asia/#about',
      icon: InformationCircleIcon,
      description: 'Learn about our mission and team'
    },
    {
      title: 'Services',
      url: 'https://bluechiptech.asia/#services',
      icon: CogIcon,
      description: 'AI Strategy, Consulting & Implementation'
    },
    {
      title: 'Technologies',
      url: 'https://bluechiptech.asia/#technologies',
      icon: WrenchScrewdriverIcon,
      description: 'AI, ML, Deep Learning & Web Technologies'
    },
    {
      title: 'Careers',
      url: 'https://bluechiptech.asia/#careers',
      icon: UserGroupIcon,
      description: 'Join our talented team of 50+ professionals'
    },
    {
      title: 'Contact',
      url: 'https://bluechiptech.asia/#contact',
      icon: EnvelopeIcon,
      description: 'Get in touch with our global offices'
    }
  ];

  const serviceItems = [
    {
      title: 'AI Strategy & Consulting',
      url: 'https://bluechiptech.asia/#services',
      description: 'Tailored AI strategies and consulting'
    },
    {
      title: 'AI Accelerators',
      url: 'https://bluechiptech.asia/#services',
      description: 'Ready-to-use AI solutions and pipelines'
    },
    {
      title: 'End-to-End Implementation',
      url: 'https://bluechiptech.asia/#services',
      description: 'Complete AI solution deployment'
    },
    {
      title: 'MLOps & Operations',
      url: 'https://bluechiptech.asia/#services',
      description: 'Scalable AI operations and maintenance'
    },
    {
      title: 'Custom AI Products',
      url: 'https://bluechiptech.asia/#services',
      description: 'Bespoke AI product development'
    },
    {
      title: 'Enterprise Solutions',
      url: 'https://bluechiptech.asia/#services',
      description: 'Large-scale AI enterprise solutions'
    }
  ];

  const technologyItems = [
    {
      title: 'Machine Learning',
      description: 'Advanced ML algorithms and models'
    },
    {
      title: 'Deep Learning',
      description: 'Neural networks and deep architectures'
    },
    {
      title: 'Natural Language Processing',
      description: 'Text analysis and language understanding'
    },
    {
      title: 'Computer Vision',
      description: 'Image and video processing'
    },
    {
      title: 'Data Science',
      description: 'Analytics and insights'
    },
    {
      title: 'Web Technologies',
      description: 'Modern web development and APIs'
    }
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Bluechip Technologies Asia</h3>
        <p className="text-sm text-gray-600 mb-4">Quick navigation to our main sections</p>
      </div>
      
              <div className="space-y-3">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.title}
                className="group flex items-start space-x-3 p-3 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer border border-gray-200 hover:border-blue-300"
                onClick={() => onBookmarkClick(item.url)}
              >
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <IconComponent className="w-5 h-5 text-blue-600" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Services Section */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 px-3">Our Services</h4>
          <div className="space-y-2">
            {serviceItems.map((service) => (
              <div
                key={service.title}
                onClick={() => onBookmarkClick(service.url)}
                className="group px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <h5 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                  {service.title}
                </h5>
                <p className="text-xs text-gray-600">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Technologies Section */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3 px-3">Technologies</h4>
          <div className="space-y-2">
            {technologyItems.map((tech) => (
              <div
                key={tech.title}
                className="px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <h5 className="text-sm font-medium text-gray-800">
                  {tech.title}
                </h5>
                <p className="text-xs text-gray-600">
                  {tech.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Global Offices</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>🇺🇸 USA: Lewes, DE</p>
            <p>🇭🇰 Hong Kong: Wanchai</p>
            <p>🇱🇰 Sri Lanka: Colombo</p>
            <p>🇸🇬 Singapore: Joo Chiat Road</p>
            <p>🇬🇧 UK: London</p>
            <p>🇮🇳 India: Mumbai</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">Notable Clients</h4>
          <div className="text-xs text-blue-700 space-y-1">
            <p>🏢 Hemas Holdings</p>
            <p>🏦 Bank of Ceylon</p>
            <p>📱 Dialog</p>
            <p>✈️ Sri Lankan Airlines</p>
            <p>🎓 Universitas Indonesia</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <h4 className="text-sm font-medium text-green-900 mb-2">Contact Info</h4>
          <div className="text-xs text-green-700 space-y-1">
            <p>📧 hello@bluechiptech.asia</p>
            <p>📞 Singapore: +65 83760864</p>
            <p>📞 Sri Lanka: +94 716092918</p>
            <p>📞 US: +1 (628) 251-1362</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-purple-50 rounded-lg">
          <h4 className="text-sm font-medium text-purple-900 mb-2">Our Brands</h4>
          <div className="text-xs text-purple-700 space-y-1">
            <p>🎯 Bluechip Training</p>
            <p>📞 CallerWise</p>
            <p>🎮 LK Game Studio</p>
          </div>
        </div>
    </div>
  );
};

const HistoryTab = () => {
  return (
    <div className="p-4 text-center text-gray-500">
      <ClockIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
      <p>History feature coming soon</p>
      <p className="text-sm">Browse history will be displayed here</p>
    </div>
  );
};

export default Sidebar; 
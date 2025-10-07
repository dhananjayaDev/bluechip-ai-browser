import { XMarkIcon, PlusIcon } from '@heroicons/react/24/outline';

const TabBar = ({ tabs, activeTabId, onTabSwitch, onTabClose, onCreateTab }) => {
  return (
    <div className="bg-white border-b border-gray-200 px-2 py-1 flex items-center space-x-1">
      {/* Existing Tabs */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`group flex items-center space-x-2 px-3 py-2 rounded-t-lg cursor-pointer transition-all duration-200 ${
            activeTabId === tab.id
              ? 'bg-blue-50 border-b-2 border-blue-500 text-blue-700'
              : 'bg-gray-50 hover:bg-gray-100 text-gray-600'
          }`}
          onClick={() => onTabSwitch(tab.id)}
        >
          {/* Favicon */}
          {tab.favicon ? (
            <img 
              src={tab.favicon} 
              alt="" 
              className="w-4 h-4 rounded"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-4 h-4 bg-gray-300 rounded"></div>
          )}
          
          {/* Tab Title */}
          <span className="text-sm font-medium truncate max-w-32">
            {tab.title || 'New Tab'}
          </span>
          
          {/* Close Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onTabClose(tab.id);
            }}
            className={`opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-all duration-200 ${
              activeTabId === tab.id ? 'text-blue-600' : 'text-gray-500'
            }`}
            title="Close tab"
          >
            <XMarkIcon className="w-3 h-3" />
          </button>
        </div>
      ))}
      
      {/* New Tab Button */}
      <button
        onClick={onCreateTab}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
        title="New tab"
      >
        <PlusIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TabBar; 
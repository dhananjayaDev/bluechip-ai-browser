import React, { useState, useRef, useEffect } from 'react';
import { 
  Bars3Icon,
  PlusIcon,
  EyeSlashIcon,
  ShieldCheckIcon,
  SparklesIcon,
  WalletIcon,
  KeyIcon,
  ClockIcon,
  BookmarkIcon,
  ArrowDownTrayIcon,
  PuzzlePieceIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  PrinterIcon,
  DocumentMagnifyingGlassIcon,
  ArrowDownIcon,
  WrenchScrewdriverIcon,
  QuestionMarkCircleIcon,
  CogIcon,
  XMarkIcon as CloseIcon
} from '@heroicons/react/24/outline';

const WorkingBurgerMenu = ({ 
  onNewTab,
  onNewWindow,
  onNewPrivateWindow,
  onNewPrivateWindowWithTor,
  onBluechipAI,
  onWallet,
  onBluechipVPN,
  onSidebarToggle,
  sidebarMode,
  onPasswords,
  onHistory,
  onBookmarks,
  onDownloads,
  onExtensions,
  onDeleteBrowsingData,
  onZoomChange,
  currentZoom,
  onPrint,
  onFindAndEdit,
  onSaveAndShare,
  onMoreTools,
  onHelp,
  onSettings,
  onExit
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sidebarModeState, setSidebarModeState] = useState(sidebarMode || 'off');
  const [zoomLevel, setZoomLevel] = useState(currentZoom || 100);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSidebarModeChange = (mode) => {
    setSidebarModeState(mode);
    onSidebarToggle?.(mode);
  };

  const handleZoomChange = (newZoom) => {
    setZoomLevel(newZoom);
    onZoomChange?.(newZoom);
  };

  const handleZoomIn = () => {
    const newZoom = Math.min(zoomLevel + 10, 500);
    handleZoomChange(newZoom);
  };

  const handleZoomOut = () => {
    const newZoom = Math.max(zoomLevel - 10, 25);
    handleZoomChange(newZoom);
  };

  const handleResetZoom = () => {
    handleZoomChange(100);
  };

  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const menuItems = [
    // New Windows/Tabs Section
    {
      icon: PlusIcon,
      label: 'New tab',
      shortcut: 'Ctrl+T',
      onClick: onNewTab
    },
    {
      icon: PlusIcon,
      label: 'New window',
      shortcut: 'Ctrl+N',
      onClick: onNewWindow
    },
    {
      icon: EyeSlashIcon,
      label: 'New private window',
      shortcut: 'Ctrl+Shift+N',
      onClick: onNewPrivateWindow
    },
    {
      icon: EyeSlashIcon,
      label: 'New private window with Tor',
      shortcut: 'Shift+Alt+N',
      onClick: onNewPrivateWindowWithTor
    },
    // Separator
    { type: 'separator' },
    // Browser-Specific Features Section
    {
      icon: SparklesIcon,
      label: 'Bluechip AI',
      onClick: onBluechipAI
    },
    {
      icon: WalletIcon,
      label: 'Wallet',
      onClick: onWallet
    },
    {
      icon: ShieldCheckIcon,
      label: 'Bluechip VPN',
      onClick: onBluechipVPN
    },
    // Separator
    { type: 'separator' },
    // Sidebar Toggle Section
    {
      icon: Bars3Icon,
      label: 'Sidebar',
      customContent: (
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleSidebarModeChange('on')}
            className={`px-2 py-1 rounded text-xs ${
              sidebarModeState === 'on' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            On
          </button>
          <button
            onClick={() => handleSidebarModeChange('autohide')}
            className={`px-2 py-1 rounded text-xs ${
              sidebarModeState === 'autohide' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Autohide
          </button>
          <button
            onClick={() => handleSidebarModeChange('off')}
            className={`px-2 py-1 rounded text-xs ${
              sidebarModeState === 'off' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
            }`}
          >
            Off
          </button>
        </div>
      )
    },
    // Separator
    { type: 'separator' },
    // Browser Data and Management Section
    {
      icon: KeyIcon,
      label: 'Passwords and autofill',
      hasSubmenu: true,
      onClick: onPasswords
    },
    {
      icon: ClockIcon,
      label: 'History',
      hasSubmenu: true,
      onClick: onHistory
    },
    {
      icon: BookmarkIcon,
      label: 'Bookmarks and lists',
      hasSubmenu: true,
      onClick: onBookmarks
    },
    {
      icon: ArrowDownTrayIcon,
      label: 'Downloads',
      shortcut: 'Ctrl+J',
      onClick: onDownloads
    },
    {
      icon: PuzzlePieceIcon,
      label: 'Extensions',
      hasSubmenu: true,
      onClick: onExtensions
    },
    {
      icon: TrashIcon,
      label: 'Delete browsing data...',
      shortcut: 'Ctrl+Shift+Del',
      onClick: onDeleteBrowsingData
    },
    // Separator
    { type: 'separator' },
    // Zoom Control Section
    {
      icon: MagnifyingGlassIcon,
      label: 'Zoom',
      customContent: (
        <div className="flex items-center space-x-1">
          <button
            onClick={handleZoomOut}
            className="px-2 py-1 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 text-sm"
            title="Zoom out"
          >
            -
          </button>
          <span className="text-xs text-gray-300 min-w-[2rem] text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={handleZoomIn}
            className="px-2 py-1 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 text-sm"
            title="Zoom in"
          >
            +
          </button>
          <button
            onClick={handleResetZoom}
            className="px-2 py-1 bg-gray-600 text-gray-300 rounded hover:bg-gray-500 text-xs"
            title="Reset zoom"
          >
            100%
          </button>
          <button
            onClick={handleFullScreen}
            className="px-2 py-1 bg-gray-600 text-gray-300 rounded hover:bg-gray-500"
            title="Full screen"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      )
    },
    // Separator
    { type: 'separator' },
    // Print, Share, and Tools Section
    {
      icon: PrinterIcon,
      label: 'Print...',
      shortcut: 'Ctrl+P',
      onClick: onPrint
    },
    {
      icon: DocumentMagnifyingGlassIcon,
      label: 'Find and edit',
      hasSubmenu: true,
      onClick: onFindAndEdit
    },
    {
      icon: ArrowDownIcon,
      label: 'Save and share',
      hasSubmenu: true,
      onClick: onSaveAndShare
    },
    {
      icon: WrenchScrewdriverIcon,
      label: 'More tools',
      hasSubmenu: true,
      onClick: onMoreTools
    },
    // Separator
    { type: 'separator' },
    // Help, Settings, and Exit Section
    {
      icon: QuestionMarkCircleIcon,
      label: 'Help',
      onClick: onHelp
    },
    {
      icon: CogIcon,
      label: 'Settings',
      onClick: onSettings
    },
    {
      icon: CloseIcon,
      label: 'Exit',
      onClick: onExit
    }
  ];

  const renderMenuItem = (item, index) => {
    if (item.type === 'separator') {
      return (
        <div key={index} className="border-t border-gray-600 my-1"></div>
      );
    }

    const IconComponent = item.icon;
    
    return (
      <div
        key={index}
        className="flex items-center justify-between px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors"
        onClick={item.onClick}
      >
        <div className="flex items-center space-x-3">
          <IconComponent className="w-5 h-5 text-gray-400" />
          <span className="text-sm text-gray-100">{item.label}</span>
          {item.hasSubmenu && (
            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {item.shortcut && (
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
              {item.shortcut}
            </span>
          )}
          {item.customContent && item.customContent}
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Burger Menu Button */}
      <button
        onClick={() => {
          console.log('Burger menu clicked, current isOpen:', isOpen);
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Menu"
      >
        <Bars3Icon className="w-5 h-5 text-gray-600" />
      </button>

      {/* Expanding Panel */}
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-80 rounded-lg shadow-xl z-50"
          style={{
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div className="py-2">
            {menuItems.map((item, index) => renderMenuItem(item, index))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkingBurgerMenu;

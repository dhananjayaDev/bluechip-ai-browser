import React, { useState, useRef, useEffect } from 'react';
import { 
  Bars3Icon,
  XMarkIcon,
  PlusIcon,
  EyeSlashIcon,
  EyeIcon,
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

const BurgerMenu = ({ 
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
      section: 'new',
      items: [
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
        }
      ]
    },
    // Browser-Specific Features Section
    {
      section: 'features',
      items: [
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
        }
      ]
    },
    // Sidebar Toggle Section
    {
      section: 'sidebar',
      items: [
        {
          icon: Bars3Icon,
          label: 'Sidebar',
          customContent: (
            <div className="flex items-center space-x-2 burger-menu-toggle-group">
              <button
                onClick={() => handleSidebarModeChange('on')}
                className={`px-3 py-1 rounded text-sm transition-colors burger-menu-toggle-btn ${
                  sidebarModeState === 'on' 
                    ? 'active' 
                    : 'inactive'
                }`}
              >
                On
              </button>
              <button
                onClick={() => handleSidebarModeChange('autohide')}
                className={`px-3 py-1 rounded text-sm transition-colors burger-menu-toggle-btn ${
                  sidebarModeState === 'autohide' 
                    ? 'active' 
                    : 'inactive'
                }`}
              >
                Autohide
              </button>
              <button
                onClick={() => handleSidebarModeChange('off')}
                className={`px-3 py-1 rounded text-sm transition-colors burger-menu-toggle-btn ${
                  sidebarModeState === 'off' 
                    ? 'active' 
                    : 'inactive'
                }`}
              >
                Off
              </button>
            </div>
          )
        }
      ]
    },
    // Browser Data and Management Section
    {
      section: 'data',
      items: [
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
        }
      ]
    },
    // Zoom Control Section
    {
      section: 'zoom',
      items: [
        {
          icon: MagnifyingGlassIcon,
          label: 'Zoom',
          customContent: (
            <div className="flex items-center space-x-2 burger-menu-zoom-controls">
              <button
                onClick={handleZoomOut}
                className="burger-menu-zoom-btn"
                title="Zoom out"
              >
                <span className="text-lg font-bold">-</span>
              </button>
              <span className="burger-menu-zoom-level">
                {zoomLevel}%
              </span>
              <button
                onClick={handleZoomIn}
                className="burger-menu-zoom-btn"
                title="Zoom in"
              >
                <span className="text-lg font-bold">+</span>
              </button>
              <button
                onClick={handleResetZoom}
                className="burger-menu-zoom-btn"
                title="Reset zoom"
              >
                <span className="text-sm">100%</span>
              </button>
              <button
                onClick={handleFullScreen}
                className="burger-menu-fullscreen-btn"
                title="Full screen"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          )
        }
      ]
    },
    // Print, Share, and Tools Section
    {
      section: 'tools',
      items: [
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
        }
      ]
    },
    // Help, Settings, and Exit Section
    {
      section: 'system',
      items: [
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
      ]
    }
  ];

  const renderMenuItem = (item, index) => {
    const IconComponent = item.icon;
    
    return (
      <div
        key={index}
        className="flex items-center justify-between px-4 py-3 hover:bg-gray-700 cursor-pointer transition-colors burger-menu-item"
        onClick={item.onClick}
      >
        <div className="flex items-center space-x-3">
          <IconComponent className="w-5 h-5 text-gray-400 burger-menu-icon" />
          <span className="text-sm text-gray-100 burger-menu-label">{item.label}</span>
          {item.hasSubmenu && (
            <svg className="w-4 h-4 text-gray-500 burger-menu-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {item.shortcut && (
            <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded burger-menu-shortcut">
              {item.shortcut}
            </span>
          )}
          {item.customContent && item.customContent}
        </div>
      </div>
    );
  };

  const renderSection = (section, index) => (
    <div key={index}>
      {section.items.map((item, itemIndex) => renderMenuItem(item, itemIndex))}
      {index < menuItems.length - 1 && (
        <div className="border-t border-gray-600 my-1 burger-menu-separator" />
      )}
    </div>
  );

  console.log('BurgerMenu render - isOpen:', isOpen, 'menuItems length:', menuItems.length);

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
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 burger-menu-panel">
          <div className="py-2">
            {menuItems.map((section, index) => {
              console.log('Rendering section:', index, 'items:', section.items.length);
              return renderSection(section, index);
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BurgerMenu;

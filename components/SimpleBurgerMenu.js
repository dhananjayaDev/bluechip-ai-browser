import React, { useState, useRef, useEffect } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';

const SimpleBurgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
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

  console.log('SimpleBurgerMenu render - isOpen:', isOpen);

  return (
    <div className="relative" ref={menuRef}>
      {/* Burger Menu Button */}
      <button
        onClick={() => {
          console.log('Simple burger menu clicked, current isOpen:', isOpen);
          setIsOpen(!isOpen);
        }}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors border border-gray-300"
        title="Menu"
      >
        <Bars3Icon className="w-5 h-5 text-gray-600" />
      </button>

      {/* Expanding Panel */}
      {isOpen && (
        <div 
          className="absolute top-full right-0 mt-2 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50"
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '8px',
            width: '320px',
            backgroundColor: '#1f2937',
            border: '1px solid #4b5563',
            borderRadius: '8px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
            zIndex: 50
          }}
        >
          <div className="py-2">
            <div className="px-4 py-3 text-sm text-gray-100 hover:bg-gray-700 cursor-pointer">
              New tab
            </div>
            <div className="px-4 py-3 text-sm text-gray-100 hover:bg-gray-700 cursor-pointer">
              New window
            </div>
            <div className="px-4 py-3 text-sm text-gray-100 hover:bg-gray-700 cursor-pointer">
              Bluechip AI
            </div>
            <div className="px-4 py-3 text-sm text-gray-100 hover:bg-gray-700 cursor-pointer">
              Bluechip VPN
            </div>
            <div className="border-t border-gray-600 my-1"></div>
            <div className="px-4 py-3 text-sm text-gray-100 hover:bg-gray-700 cursor-pointer">
              Settings
            </div>
            <div className="px-4 py-3 text-sm text-gray-100 hover:bg-gray-700 cursor-pointer">
              Help
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleBurgerMenu;

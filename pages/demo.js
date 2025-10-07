import { useState } from 'react';
import Head from 'next/head';

export default function Demo() {
  const [activeTab, setActiveTab] = useState('features');

  const features = [
    {
      title: 'AI-Powered Browsing',
      description: 'Integrated Google Gemini AI for intelligent search assistance and page summarization',
      icon: '🤖'
    },
    {
      title: 'Modern Interface',
      description: 'Clean, intuitive UI built with Next.js and Tailwind CSS',
      icon: '🎨'
    },
    {
      title: 'Smart Bookmarks',
      description: 'SQLite-based bookmark and history management with search capabilities',
      icon: '⭐'
    },
    {
      title: 'Tab Management',
      description: 'Efficient tab system with easy navigation and organization',
      icon: '📑'
    },
    {
      title: 'Secure Design',
      description: 'Built with security best practices and input sanitization',
      icon: '🔒'
    },
    {
      title: 'Cross-Platform',
      description: 'Desktop application built with Electron for Windows, macOS, and Linux',
      icon: '💻'
    }
  ];

  const techStack = [
    { name: 'Electron', description: 'Desktop application framework' },
    { name: 'Next.js', description: 'React framework for the frontend' },
    { name: 'SQLite', description: 'Lightweight database for data storage' },
    { name: 'Google Gemini', description: 'AI integration for intelligent features' },
    { name: 'Tailwind CSS', description: 'Utility-first CSS framework' },
    { name: 'Zustand', description: 'State management library' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>BlueChip AI Browser - Demo</title>
        <meta name="description" content="AI-powered desktop browser demo" />
      </Head>

      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              BlueChip AI Browser
            </h1>
            <p className="text-xl text-blue-100">
              Where AI meets browsing intelligence
            </p>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: 'features', label: 'Features' },
              { id: 'tech', label: 'Tech Stack' },
              { id: 'demo', label: 'Live Demo' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'features' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Powerful Features
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Experience the future of browsing with AI-powered features designed to enhance your productivity and understanding of web content.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tech' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Technology Stack
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Built with modern, reliable technologies that ensure performance, security, and maintainability.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {techStack.map((tech, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-gray-600">
                    {tech.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'demo' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Live Demo
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Try out the browser features in this interactive demo environment.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded hover:bg-gray-200 transition-colors">
                      ←
                    </button>
                    <button className="p-2 rounded hover:bg-gray-200 transition-colors">
                      →
                    </button>
                    <button className="p-2 rounded hover:bg-gray-200 transition-colors">
                      ↻
                    </button>
                    <button className="p-2 rounded hover:bg-gray-200 transition-colors">
                      🏠
                    </button>
                  </div>
                  
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Enter URL or search query..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      defaultValue="https://example.com"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded hover:bg-gray-200 transition-colors">
                      ⭐
                    </button>
                    <button className="p-2 rounded hover:bg-gray-200 transition-colors">
                      🤖
                    </button>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-white rounded border">
                  <h3 className="font-semibold mb-2">Demo Content</h3>
                  <p className="text-gray-600">
                    This is a demonstration of the BlueChip AI Browser interface. 
                    In the actual application, you would see web content here.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-600 mb-4">
                To experience the full browser functionality, run the application locally:
              </p>
              <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                npm run dev
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2024 BlueChip AI Browser. Built with ❤️ and AI.
          </p>
        </div>
      </footer>
    </div>
  );
} 
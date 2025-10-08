/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  // Remove output: 'export' to enable API routes
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Environment variables
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Performance optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  // Disable Fast Refresh for Electron
  reactStrictMode: false,
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.target = 'electron-renderer';
      
      // Comprehensive fallbacks for Electron renderer
      config.resolve.fallback = {
        ...config.resolve.fallback,
        global: false,
        __dirname: false,
        __filename: false,
        path: false,
        fs: false,
        os: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };
      
      // Disable problematic modules for Electron
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-refresh': false,
        'webpack': false,
      };
      
      // Multiple polyfill strategies
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.DefinePlugin({
          global: 'globalThis',
          __dirname: '""',
          __filename: '""',
          process: '{}',
        }),
        new webpack.ProvidePlugin({
          global: 'globalThis',
        })
      );
      
      // Entry point polyfill removed - causing issues
      
    }
    
    // Optimize for development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
      // Disable Fast Refresh for Electron
      config.resolve.alias = {
        ...config.resolve.alias,
        'react-refresh': false,
        'webpack': false,
      };
    }
    
    return config;
  }
}

module.exports = nextConfig 
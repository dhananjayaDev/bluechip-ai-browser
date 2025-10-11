/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  // Only enable static export for production builds
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
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
      
      // Define global properly
      config.resolve.alias = {
        ...config.resolve.alias,
        global: 'globalThis',
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
      
    }
    
    // Optimize for development
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    
    return config;
  }
}

module.exports = nextConfig 
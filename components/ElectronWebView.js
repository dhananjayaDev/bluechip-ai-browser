import { useEffect, useRef, useState } from 'react';

const ElectronWebView = ({ url, onLoad, onLoadingChange, className = '' }) => {
  const webviewRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (url && webviewRef.current) {
      setIsLoading(true);
      setError(null);
      webviewRef.current.src = url;
    }
  }, [url]);

  const handleLoad = () => {
    setIsLoading(false);
    onLoadingChange?.(false);
    
    try {
      // Get page title from webview
      const webview = webviewRef.current;
      if (webview && webview.getTitle) {
        const title = webview.getTitle() || url;
        onLoad?.(title, url);
      } else {
        onLoad?.(url, url);
      }
    } catch (error) {
      // Cross-origin restrictions may prevent access
      onLoad?.(url, url);
    }
  };

  const handleError = (event) => {
    setIsLoading(false);
    onLoadingChange?.(false);
    setError('Failed to load page');
    console.error('WebView error:', event);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
    onLoadingChange?.(true);
  };

  if (!url) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Welcome to BlueChip AI Browser
          </h3>
          <p className="text-gray-600">
            Enter a URL or search query to get started
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex-1 flex items-center justify-center bg-gray-50 ${className}`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Failed to load page
          </h3>
          <p className="text-gray-600 mb-4">
            {error}
          </p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              onLoadingChange?.(true);
              if (webviewRef.current) {
                webviewRef.current.reload();
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex-1 relative ${className}`}>
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-white px-4 py-2 rounded-lg shadow-lg border border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Loading...</span>
            </div>
          </div>
        </div>
      )}

      {/* Electron WebView */}
      <webview
        ref={webviewRef}
        className="w-full h-full border-0"
        onLoad={handleLoad}
        onError={handleError}
        onLoadStart={handleLoadStart}
        title={url}
        nodeintegration="false"
        websecurity="true"
        allowpopups="true"
        disablewebsecurity="false"
      />
    </div>
  );
};

export default ElectronWebView;


import { useRef } from 'react';

export default function BrowserView({ currentUrl }) {
  const webviewRef = useRef(null);

  return (
    <div 
      id="webviewContainer" 
      style={{ 
        display: 'block', 
        position: 'fixed', 
        top: '40px', 
        left: '0', 
        width: '100vw', 
        height: 'calc(100vh - 40px)', 
        zIndex: '1000', 
        background: 'white' 
      }}
    >
      <webview 
        ref={webviewRef}
        id="webContent" 
        src={currentUrl}
        style={{ 
          display: 'flex', 
          width: '100%', 
          height: '100%', 
          border: 'none' 
        }}
        webpreferences="nodeIntegration=false, contextIsolation=true"
        onLoad={() => {/* WebView loaded */}}
        onError={(e) => {/* WebView error */}}
      />
    </div>
  );
}

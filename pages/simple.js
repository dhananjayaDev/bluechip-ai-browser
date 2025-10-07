export default function SimpleHome() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Google-like Logo */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          marginBottom: '20px'
        }}>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            background: 'linear-gradient(45deg, #4285f4, #9c27b0)', 
            borderRadius: '8px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px'
          }}>
            BC
          </div>
          <h1 style={{ 
            fontSize: '32px', 
            fontWeight: 'normal', 
            color: '#5f6368',
            margin: 0
          }}>
            BlueChip AI Browser
          </h1>
        </div>
      </div>

      {/* Google-like Search Bar */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '30px' }}>
        <div style={{ position: 'relative' }}>
          <div style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#9aa0a6'
          }}>
            🔍
          </div>
          <input
            type="text"
            placeholder="Search the web or enter a URL"
            style={{
              width: '100%',
              padding: '16px 50px',
              fontSize: '16px',
              border: '1px solid #dfe1e5',
              borderRadius: '24px',
              outline: 'none',
              boxShadow: '0 2px 5px 1px rgba(64,60,67,.16)',
              transition: 'box-shadow 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = '0 2px 5px 1px rgba(64,60,67,.28)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 2px 5px 1px rgba(64,60,67,.16)';
            }}
          />
          <div style={{ 
            position: 'absolute', 
            right: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#9aa0a6'
          }}>
            🎤
          </div>
        </div>
      </div>

      {/* Popular Sites */}
      <div style={{ width: '100%', maxWidth: '800px' }}>
        <h2 style={{ 
          fontSize: '14px', 
          color: '#5f6368', 
          marginBottom: '20px', 
          textAlign: 'center',
          fontWeight: 'normal'
        }}>
          Popular Sites
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', 
          gap: '20px',
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          {[
            { name: 'Google', icon: '🔍', url: 'https://www.google.com' },
            { name: 'YouTube', icon: '📺', url: 'https://www.youtube.com' },
            { name: 'GitHub', icon: '💻', url: 'https://github.com' },
            { name: 'Stack Overflow', icon: '❓', url: 'https://stackoverflow.com' },
            { name: 'Reddit', icon: '🔴', url: 'https://www.reddit.com' },
            { name: 'Wikipedia', icon: '📚', url: 'https://en.wikipedia.org' },
            { name: 'Twitter', icon: '🐦', url: 'https://twitter.com' },
            { name: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' }
          ].map((site) => (
            <div
              key={site.name}
              onClick={() => window.open(site.url, '_blank')}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f8f9fa';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{ 
                width: '48px', 
                height: '48px', 
                backgroundColor: '#f1f3f4', 
                borderRadius: '50%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '8px',
                fontSize: '20px'
              }}>
                {site.icon}
              </div>
              <span style={{ 
                fontSize: '12px', 
                color: '#5f6368', 
                textAlign: 'center'
              }}>
                {site.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ marginTop: '40px', display: 'flex', gap: '12px' }}>
        <button
          onClick={() => window.open('https://www.google.com', '_blank')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#f8f9fa',
            color: '#3c4043',
            border: '1px solid #f8f9fa',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f1f3f4';
            e.target.style.borderColor = '#dadce0';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#f8f9fa';
            e.target.style.borderColor = '#f8f9fa';
          }}
        >
          Google Search
        </button>
        <button
          onClick={() => window.open('https://bluechiptech.asia/', '_blank')}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4285f4',
            color: 'white',
            border: '1px solid #4285f4',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#3367d6';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#4285f4';
          }}
        >
          Bluechip Tech
        </button>
      </div>
    </div>
  );
}

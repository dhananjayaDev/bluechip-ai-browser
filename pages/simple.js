export default function Simple() {
  return (
    <div style={{ 
      padding: '50px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333' }}>Simple Test Page</h1>
      <p>This is a basic HTML page without any React complexity.</p>
      <p>If you can see this, the basic Next.js + Electron integration works!</p>
      
      <div style={{ marginTop: '30px' }}>
        <button 
          onClick={() => alert('Button clicked!')}
          style={{ 
            padding: '15px 30px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Test Button
        </button>
      </div>
      
      <div style={{ marginTop: '30px', padding: '20px', backgroundColor: 'white', borderRadius: '5px' }}>
        <h3>System Info:</h3>
        <p>Time: {new Date().toLocaleString()}</p>
        <p>User Agent: {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}</p>
      </div>
    </div>
  );
}
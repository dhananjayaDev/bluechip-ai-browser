export default function TestPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '100vh' }}>
      <h1 style={{ color: 'blue', fontSize: '32px' }}>BlueChip AI Browser</h1>
      <p style={{ color: 'gray', fontSize: '18px' }}>This is a test page to verify the app is working.</p>
      <div style={{ marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="Search the web or enter a URL"
          style={{ 
            width: '500px', 
            padding: '10px', 
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '25px',
            outline: 'none'
          }}
        />
      </div>
      <div style={{ marginTop: '20px' }}>
        <button style={{ 
          padding: '10px 20px', 
          backgroundColor: '#4285f4', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px',
          marginRight: '10px'
        }}>
          Google Search
        </button>
        <button style={{ 
          padding: '10px 20px', 
          backgroundColor: '#34a853', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px'
        }}>
          Bluechip Tech
        </button>
      </div>
    </div>
  );
}

import Head from 'next/head';

export default function Test() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>Test Page - BlueChip AI Browser</title>
      </Head>
      
      <h1>BlueChip AI Browser - Test Page</h1>
      <p>If you can see this, the Next.js + Electron integration is working!</p>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Test Navigation</h2>
        <button 
          onClick={() => window.open('https://www.google.com', '_blank')}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#4285f4', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Open Google
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <h2>Environment Test</h2>
        <p>API Key configured: {process.env.GEMINI_API_KEY ? 'Yes' : 'No'}</p>
        <p>Current time: {new Date().toLocaleString()}</p>
      </div>
    </div>
  );
}
import '../styles/globals.css'
import Script from 'next/script'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Script
        id="global-polyfill"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            // Global polyfill for Electron - must run before any other code
            if (typeof global === 'undefined') {
              if (typeof globalThis !== 'undefined') {
                global = globalThis;
                globalThis.global = globalThis;
              } else if (typeof window !== 'undefined') {
                global = window;
                window.global = window;
              } else {
                global = {};
              }
            }
            
            if (typeof process === 'undefined') {
              if (typeof globalThis !== 'undefined') {
                globalThis.process = { env: {} };
                process = globalThis.process;
              } else if (typeof window !== 'undefined') {
                window.process = { env: {} };
                process = window.process;
              } else {
                process = { env: {} };
              }
            }
            
            if (typeof Buffer === 'undefined') {
              if (typeof globalThis !== 'undefined') {
                globalThis.Buffer = globalThis.Buffer || {};
                Buffer = globalThis.Buffer;
              } else if (typeof window !== 'undefined') {
                window.Buffer = window.Buffer || {};
                Buffer = window.Buffer;
              } else {
                Buffer = {};
              }
            }
            
            console.log('Global polyfill loaded via Script tag');
          `
        }}
      />
      <Component {...pageProps} />
    </>
  )
}
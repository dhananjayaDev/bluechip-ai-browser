// Fix global is not defined error for Electron
if (typeof global === 'undefined') {
  window.global = window;
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
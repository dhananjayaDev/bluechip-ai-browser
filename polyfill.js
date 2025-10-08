// Global polyfills for Electron renderer process
if (typeof global === 'undefined') {
  window.global = window;
  global = window;
}

if (typeof __dirname === 'undefined') {
  window.__dirname = '';
  __dirname = '';
}

if (typeof __filename === 'undefined') {
  window.__filename = '';
  __filename = '';
}

if (typeof process === 'undefined') {
  window.process = { env: {} };
  process = { env: {} };
}

console.log('Global polyfills loaded from polyfill.js');

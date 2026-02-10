import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

// Register Service Worker for PWA (Production only)
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
     window.addEventListener('load', async () => {
          try {
               const registration = await navigator.serviceWorker.register('/sw.js');
               console.log('SW registered:', registration.scope);
          } catch (err) {
               console.log('SW registration failed:', err);
          }
     });
}

// PWA Install Prompt
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
     e.preventDefault();
     deferredPrompt = e;
     window.dispatchEvent(new CustomEvent('pwa-install-available'));
});

window.installPWA = async () => {
     if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          console.log('PWA install:', outcome);
          deferredPrompt = null;
     }
};

ReactDOM.createRoot(document.getElementById('root')).render(
     <React.StrictMode>
          <App />
     </React.StrictMode>
);

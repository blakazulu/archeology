// Minimal Service Worker for PWA Installation
// No caching - just enables "Add to Home Screen" functionality

self.addEventListener('install', () => {
  // Skip waiting to activate immediately
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(self.clients.claim());
});

// No fetch handler - all requests go directly to network

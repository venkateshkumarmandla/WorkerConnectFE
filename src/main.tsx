import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Capacitor } from '@capacitor/core';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker, requestNotificationPermission } from './utils/pwa';
import { initializeCapacitorPlugins } from './utils/capacitor-plugins';

// Add error handling for initialization
// Add error handling for initialization
const initApp = async () => {
  try {
    // Render the app IMMEDIATELY to show UI
    const rootElement = document.getElementById('root');
    if (!rootElement) throw new Error('Root element not found');

    createRoot(rootElement).render(
      <StrictMode>
        <App />
      </StrictMode>
    );

    // Then initialize plugins in background
    if (!Capacitor.isNativePlatform()) {
      await registerServiceWorker();
    } else {
      // Initialize Capacitor plugins for native platforms
      // Don't await here to block anything else, just let it run
      initializeCapacitorPlugins().catch(err => console.warn('Plugin init failed:', err));
    }

    // Request notification permission in background
    requestNotificationPermission().catch(err => console.warn('Notification permission failed:', err));

  } catch (error) {
    console.error('Error initializing app:', error);
    // Even if initial render failed above (unlikely unless root missing), try again if needed
    // but usually the first render attempt is enough. 
  }
};

// Start the app
initApp();
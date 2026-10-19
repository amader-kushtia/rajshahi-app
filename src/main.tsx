import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AdminConfigProvider } from './context/AdminConfigContext';
import { LanguageProvider } from './context/LanguageContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Gracefully handle uncaught promise rejections during app initialization (e.g. WebSocket connection notices)
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = typeof reason === 'string' 
      ? reason 
      : (reason?.message || (reason ? String(reason) : ''));
    
    if (
      message.includes('WebSocket') || 
      message.includes('closed without opened') || 
      message.includes('failed to connect') ||
      message.includes('ws://') ||
      message.includes('wss://')
    ) {
      console.warn('Handled client connection notice:', message);
      event.preventDefault(); // Prevent uncaught rejection error from crashing or showing overlay
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AdminConfigProvider>
        <LanguageProvider>
          <App />
        </LanguageProvider>
      </AdminConfigProvider>
    </ErrorBoundary>
  </StrictMode>,
);

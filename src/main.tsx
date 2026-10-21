import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import {registerSW} from 'virtual:pwa-register';

// Register Service Worker for offline caching and instant updates
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[PWA] Nova versão do Modo Avanço disponível.');
  },
  onOfflineReady() {
    console.log('[PWA] Modo Avanço pronto para uso 100% offline.');
  },
});

createRoot(document.getElementById('root')!).render(<App />);


import React from 'react';
import { createRoot } from 'react-dom/client';
import { parseBrowserConfig } from '@portfolio-pilot/config/browser';
import { healthResponseSchema, REQUEST_ID_HEADER } from '@portfolio-pilot/contracts';

const config = parseBrowserConfig({ VITE_APP_NAME: import.meta.env.VITE_APP_NAME, VITE_DATA_MODE: import.meta.env.VITE_DATA_MODE });
function App() {
  const [health, setHealth] = React.useState('Checking API…');
  React.useEffect(() => {
    const controller = new AbortController();
    fetch('/api/health/live', { signal: controller.signal }).then(async (response) => {
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const body = healthResponseSchema.parse(await response.json());
      if (response.headers.get(REQUEST_ID_HEADER) !== body.requestId) throw new Error('Request ID mismatch');
      setHealth('API live');
    }).catch((error: unknown) => { if (!controller.signal.aborted) setHealth(`API unavailable: ${String(error)}`); });
    return () => controller.abort();
  }, []);
  return <main><h1>{config.VITE_APP_NAME}</h1><p>Milestone 02 scaffold</p><p>Data mode: <strong>{config.VITE_DATA_MODE === 'mock' ? 'Deterministic demo' : 'Live'}</strong></p><p role="status">{health}</p></main>;
}
createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);

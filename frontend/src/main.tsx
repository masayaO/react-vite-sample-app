import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from '@/app/app';

import './index.css';

async function enableMocking() {
  if (!import.meta.env.DEV) return;
  try {
    const { worker } = await import('@/mocks/browser');
    await worker.start({ onUnhandledRequest: 'bypass' });
  } catch (error) {
    console.warn(
      'MSW failed to start. Continuing without request mocking.',
      error,
    );
  }
}

void enableMocking().then(() => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});

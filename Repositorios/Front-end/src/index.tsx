import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';

import { App } from './App';
import { AuthProvider } from './contexts/auth-context';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <AuthProvider>
        <App />
      </AuthProvider>
    </StrictMode>
  );
} else {
  console.error("No element with id 'root' in the document.");
}

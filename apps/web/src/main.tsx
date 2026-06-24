import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from './store/store';
import { restoreSession } from './store/authSlice';
import { ToastProvider } from './components/Toast';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

// Attempt a silent session restore once, at app boot (before first render).
// Runs here in the composition root — not in a component — so it fires exactly
// once and isn't double-invoked by StrictMode.
store.dispatch(restoreSession());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
);

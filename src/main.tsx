import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppProvider } from './context/AppContext';
import { StarfieldCanvas } from './components/common/StarfieldCanvas';
import { App } from './App';
import './style.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppProvider>
      <StarfieldCanvas />
      <App />
    </AppProvider>
  </React.StrictMode>
);

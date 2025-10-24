import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom'; // 1. Імпортуємо
import App from './App';
import './index.css';
import './i18n';
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 2. Огортаємо App */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

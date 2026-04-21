import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Master Reset via URL parameter
const params = new URLSearchParams(window.location.search);
if (params.get('reset') === 'true') {
  localStorage.clear();
  // Limpa a URL sem dar reload pesado
  window.history.replaceState({}, document.title, window.location.pathname);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

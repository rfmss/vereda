import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Master Reset via URL parameter (Before React mounts)
const params = new URLSearchParams(window.location.search);
if (params.get('reset') === 'true') {
  localStorage.clear();
  window.location.href = window.location.pathname; 
} else {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

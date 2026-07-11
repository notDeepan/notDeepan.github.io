import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

// Apply the saved theme before first paint to avoid a flash of the wrong theme.
try {
  const t = localStorage.getItem('dg-portfolio-theme')
  document.documentElement.dataset.theme = t === 'light' ? 'light' : 'dark'
} catch {
  document.documentElement.dataset.theme = 'dark'
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

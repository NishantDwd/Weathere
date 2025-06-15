import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast'
import { FavoritesProvider } from '@/components/FavoritesContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FavoritesProvider>
      <App />
      <Toaster position="top-center" />
    </FavoritesProvider>
  </StrictMode>,
)
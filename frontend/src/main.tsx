import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { GlobalProvider } from './context/GlobalContext/GlobalProvider'
import './index.css'
import { SnackbarProvider } from './context/snackbar-context/snackbar.provider'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <SnackbarProvider>
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </SnackbarProvider>
  </BrowserRouter>
  ,
)

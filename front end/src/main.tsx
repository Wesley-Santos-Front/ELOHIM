import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles.css'
import { UserProvider } from './contexts/UserContext'
import {Toaster} from 'react-hot-toast';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UserProvider>
      <Toaster position="top-center"  reverseOrder={false} />
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </UserProvider>
  </StrictMode>,
)

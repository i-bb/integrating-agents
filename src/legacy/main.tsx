import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { TrackerProvider } from './tracker/TrackerProvider'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <TrackerProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </TrackerProvider>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Hooked from './Hooked.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Hooked />
  </StrictMode>,
)

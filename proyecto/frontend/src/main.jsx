// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom' // Corregí la importación
// import { AuthProvider } from './context/AuthContext'
//
// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <BrowserRouter>
//       <AuthProvider>
//         <App />
//       </AuthProvider>
//     </BrowserRouter>
//   </StrictMode>
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

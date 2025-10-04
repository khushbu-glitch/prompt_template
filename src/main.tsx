import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { CartProvider } from './context/CartContext'
import { RazorpayProvider } from './context/RazorpayContext'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <CartProvider>
      <RazorpayProvider>
        <App />
      </RazorpayProvider>
    </CartProvider>
  </React.StrictMode>,
)


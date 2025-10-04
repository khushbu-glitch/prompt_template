import React, { useState } from 'react';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { CartIcon } from './components/CartIcon';
import './App.css';

/**
 * Main App Component
 * Entry point for the Shopify Storefront application
 * Includes shopping cart functionality
 */
function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  return (
    <div className="app">
      <header className="app-header" role="banner">
        <div className="app-header__container">
          <div className="app-header__content">
            <div>
              <h1 className="app-header__title">Premium Store</h1>
              <p className="app-header__tagline">Quality products for modern life</p>
            </div>
            <CartIcon onClick={openCart} />
          </div>
        </div>
      </header>

      <main className="app-main">
        <ProductGrid />
      </main>

      <footer className="app-footer" role="contentinfo">
        <p className="app-footer__text">
          &copy; {new Date().getFullYear()} Premium Store. All rights reserved.
        </p>
      </footer>

      {/* Shopping Cart Sidebar */}
      <Cart isOpen={isCartOpen} onClose={closeCart} />
    </div>
  );
}

export default App;


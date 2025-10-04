import React from 'react';
import { ProductGrid } from './components/ProductGrid';
import './App.css';

/**
 * Main App Component
 * Entry point for the Shopify Storefront application
 */
function App() {
  return (
    <div className="app">
      <header className="app-header" role="banner">
        <div className="app-header__container">
          <h1 className="app-header__title">Premium Store</h1>
          <p className="app-header__tagline">Quality products for modern life</p>
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
    </div>
  );
}

export default App;


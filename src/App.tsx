import ProductGrid from './components/ProductGrid';
import Cart from './components/Cart';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      <header>
        <h1>Shopify Storefront</h1>
      </header>
      <main>
        <ProductGrid />
      </main>
      <Cart />
    </CartProvider>
  );
}

export default App;

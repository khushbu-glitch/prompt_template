import React, { useState, useEffect, useContext } from 'react';
import { Product } from '../types/product';
import { fetchProducts } from '../services/shopify';
import { CartContext } from '../context/CartContext';
import './ProductGrid.css';

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error('ProductGrid must be used within a CartProvider');
  }

  const { addToCart } = cartContext;

  useEffect(() => {
    const getProducts = async () => {
      try {
        const fetchedProducts = await fetchProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const renderProductGrid = () => {
    return (
      <div className="product-grid" role="grid">
        {products.map((product) => (
          <div key={product.id} className="product-card" role="gridcell" tabIndex={0}>
            <img
              src={product.featuredImage.url}
              alt={product.featuredImage.altText}
              className="product-image"
            />
            <h2 className="product-title">{product.title}</h2>
            <p className="product-price">
              {product.priceRange.minVariantPrice.amount}{' '}
              {product.priceRange.minVariantPrice.currencyCode}
            </p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div aria-live="polite">Loading...</div>;
  }

  if (error) {
    return <div role="alert" aria-live="assertive">Error: {error}</div>;
  }

  return (
    <section aria-labelledby="products-heading">
      <h1 id="products-heading" className="sr-only">Products</h1>
      {renderProductGrid()}
    </section>
  );
};

export default ProductGrid;

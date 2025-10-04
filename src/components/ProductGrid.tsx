import React, { useEffect, useState } from 'react';
import { ShopifyProduct } from '../types/shopify';
import { fetchProducts } from '../api/shopify';
import { ProductCard } from './ProductCard';
import { LoadingSpinner } from './LoadingSpinner';
import { ErrorMessage } from './ErrorMessage';

/**
 * ProductGrid Component
 * Main component for displaying a grid of products with loading and error states
 */
export const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, []);

  /**
   * Loads products from API
   * Handles loading states and errors
   */
  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const fetchedProducts = await fetchProducts({ first: 10 });
      setProducts(fetchedProducts);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to load products';
      setError(errorMessage);
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders the product grid
   * Core rendering function as requested
   */
  const renderProductGrid = (): React.ReactNode => {
    if (products.length === 0) {
      return (
        <div className="product-grid__empty" role="status">
          <p>No products available at this time.</p>
        </div>
      );
    }

    return (
      <div
        className="product-grid__container"
        role="list"
        aria-label="Product list"
      >
        {products.map((product) => (
          <div key={product.id} role="listitem">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="product-grid" role="main" aria-busy="true">
        <LoadingSpinner />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="product-grid" role="main" aria-busy="false">
        <ErrorMessage message={error} onRetry={loadProducts} />
      </div>
    );
  }

  // Success state
  return (
    <div className="product-grid" role="main" aria-busy="false">
      <div className="product-grid__header">
        <h2 className="product-grid__title">Our Products</h2>
        <p className="product-grid__subtitle">
          Discover our curated collection of premium products
        </p>
      </div>

      {renderProductGrid()}
    </div>
  );
};


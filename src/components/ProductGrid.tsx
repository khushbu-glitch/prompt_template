import React, { useState, useEffect } from 'react';
import { Product } from '../types/product';
import { fetchProducts } from '../services/shopify';
import { useCart } from '../context/useCart';
import './ProductGrid.css';

const ProductGrid: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;
  const { addToCart } = useCart();

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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const renderProductGrid = () => {
    return (
      <div className="product-grid" role="grid">
        {currentProducts.map((product) => (
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
      <div className="search-container">
        <input
          type="text"
          placeholder="Search for products..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-input"
          aria-label="Search for products"
        />
      </div>
      {renderProductGrid()}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;

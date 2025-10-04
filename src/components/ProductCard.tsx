import React, { useState } from 'react';
import { ShopifyProduct } from '../types/shopify';
import { formatPrice } from '../api/shopify';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: ShopifyProduct;
}

/**
 * ProductCard Component
 * Displays individual product information with accessibility features
 * Includes shopping cart integration
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const mainImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const formattedPrice = formatPrice(price.amount, price.currencyCode);

  /**
   * Handles adding product to cart with visual feedback
   */
  const handleAddToCart = () => {
    if (!product.availableForSale) return;
    
    setIsAdding(true);
    addToCart(product, 1);
    
    // Reset button state after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <article
      className="product-card"
      aria-label={`${product.title} - ${formattedPrice}`}
    >
      <div className="product-card__image-container">
        {mainImage ? (
          <img
            src={mainImage.url}
            alt={mainImage.altText || product.title}
            className="product-card__image"
            loading="lazy"
            width={mainImage.width}
            height={mainImage.height}
          />
        ) : (
          <div
            className="product-card__image-placeholder"
            role="img"
            aria-label="Product image not available"
          >
            <span aria-hidden="true">📦</span>
          </div>
        )}
        {!product.availableForSale && (
          <span className="product-card__badge" aria-label="Product status">
            Out of Stock
          </span>
        )}
      </div>

      <div className="product-card__content">
        <h3 className="product-card__title">{product.title}</h3>

        <p className="product-card__description">
          {product.description.length > 100
            ? `${product.description.substring(0, 100)}...`
            : product.description}
        </p>

        <div className="product-card__footer">
          <span
            className="product-card__price"
            aria-label={`Price: ${formattedPrice}`}
          >
            {formattedPrice}
          </span>

          <button
            className={`product-card__button ${isAdding ? 'product-card__button--adding' : ''}`}
            disabled={!product.availableForSale || isAdding}
            onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`}
            aria-live="polite"
          >
            {isAdding ? '✓ Added!' : product.availableForSale ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  );
};


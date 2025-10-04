import React from 'react';
import { ShopifyProduct } from '../types/shopify';
import { formatPrice } from '../api/shopify';

interface ProductCardProps {
  product: ShopifyProduct;
}

/**
 * ProductCard Component
 * Displays individual product information with accessibility features
 */
export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const mainImage = product.images.edges[0]?.node;
  const price = product.priceRange.minVariantPrice;
  const formattedPrice = formatPrice(price.amount, price.currencyCode);

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
            className="product-card__button"
            disabled={!product.availableForSale}
            aria-label={`Add ${product.title} to cart`}
          >
            {product.availableForSale ? 'Add to Cart' : 'Unavailable'}
          </button>
        </div>
      </div>
    </article>
  );
};


import React from 'react';
import { useCart } from '../context/CartContext';

interface CartIconProps {
  onClick: () => void;
}

/**
 * CartIcon Component
 * Displays cart icon with item count badge
 * Accessible button with proper ARIA labels
 */
export const CartIcon: React.FC<CartIconProps> = ({ onClick }) => {
  const { getItemCount } = useCart();
  const itemCount = getItemCount();

  return (
    <button
      className="cart-icon"
      onClick={onClick}
      aria-label={`Shopping cart with ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`}
    >
      <svg
        className="cart-icon__svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {itemCount > 0 && (
        <span className="cart-icon__badge" aria-hidden="true">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};


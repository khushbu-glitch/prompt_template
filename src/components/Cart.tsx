import React from 'react';
import { useCart } from '../context/CartContext';
import { useRazorpay } from '../context/RazorpayContext';
import { formatPrice } from '../api/shopify';
import { PaymentSuccess } from './PaymentSuccess';
import { PaymentFailure } from './PaymentFailure';
import { PaymentProcessing } from './PaymentProcessing';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Cart Component
 * Displays shopping cart with items, quantities, and total
 * Integrated with Razorpay payment processing
 * Fully accessible with ARIA attributes and keyboard navigation
 */
export const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartTotal } = useCart();
  const { 
    initRazorpayCheckout, 
    paymentStatus, 
    paymentDetails, 
    clearPaymentStatus,
    isProcessing 
  } = useRazorpay();

  /**
   * Handle checkout button click
   * Initiates Razorpay payment flow
   */
  const handleCheckout = async () => {
    const total = getCartTotal();
    
    if (total <= 0) {
      alert('Your cart is empty');
      return;
    }

    try {
      await initRazorpayCheckout(total, 'INR', {
        name: 'Premium Store',
        description: `Purchase of ${cart.itemCount} item${cart.itemCount !== 1 ? 's' : ''}`,
        prefill: {
          name: '',
          email: '',
          contact: '',
        },
      });
    } catch (error) {
      console.error('Checkout error:', error);
    }
  };

  /**
   * Handle successful payment completion
   */
  const handlePaymentComplete = () => {
    clearCart();
    clearPaymentStatus();
    onClose();
  };

  /**
   * Handle payment retry
   */
  const handlePaymentRetry = () => {
    clearPaymentStatus();
    handleCheckout();
  };

  // Close on Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when cart is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const total = getCartTotal();
  const isEmpty = cart.items.length === 0;

  return (
    <>
      {/* Backdrop */}
      <div
        className="cart-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Cart Panel */}
      <aside
        className="cart-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
      >
        {/* Header */}
        <div className="cart-header">
          <h2 id="cart-title" className="cart-title">
            Shopping Cart
            {!isEmpty && (
              <span className="cart-count" aria-label={`${cart.itemCount} items`}>
                ({cart.itemCount})
              </span>
            )}
          </h2>
          <button
            className="cart-close"
            onClick={onClose}
            aria-label="Close cart"
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        {/* Cart Content */}
        <div className="cart-content">
          {isEmpty ? (
            <div className="cart-empty" role="status">
              <div className="cart-empty__icon" aria-hidden="true">
                🛒
              </div>
              <p className="cart-empty__text">Your cart is empty</p>
              <button className="cart-empty__button" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <ul className="cart-items" role="list">
                {cart.items.map((item) => {
                  const image = item.product.images.edges[0]?.node;
                  const itemTotal = item.price * item.quantity;

                  return (
                    <li key={item.id} className="cart-item" role="listitem">
                      <div className="cart-item__image-container">
                        {image ? (
                          <img
                            src={image.url}
                            alt={image.altText || item.product.title}
                            className="cart-item__image"
                            width="80"
                            height="80"
                          />
                        ) : (
                          <div className="cart-item__image-placeholder" aria-hidden="true">
                            📦
                          </div>
                        )}
                      </div>

                      <div className="cart-item__details">
                        <h3 className="cart-item__title">{item.product.title}</h3>
                        <p className="cart-item__price">
                          {formatPrice(
                            item.price.toString(),
                            item.product.priceRange.minVariantPrice.currencyCode
                          )}
                        </p>

                        <div className="cart-item__quantity">
                          <label htmlFor={`quantity-${item.id}`} className="sr-only">
                            Quantity for {item.product.title}
                          </label>
                          <button
                            className="cart-item__quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            aria-label={`Decrease quantity of ${item.product.title}`}
                          >
                            −
                          </button>
                          <input
                            id={`quantity-${item.id}`}
                            type="number"
                            min="1"
                            max="99"
                            value={item.quantity}
                            onChange={(e) => {
                              const value = parseInt(e.target.value, 10);
                              if (!isNaN(value) && value > 0) {
                                updateQuantity(item.id, value);
                              }
                            }}
                            className="cart-item__quantity-input"
                            aria-label={`Quantity: ${item.quantity}`}
                          />
                          <button
                            className="cart-item__quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            aria-label={`Increase quantity of ${item.product.title}`}
                          >
                            +
                          </button>
                        </div>

                        <p className="cart-item__subtotal">
                          Subtotal:{' '}
                          {formatPrice(
                            itemTotal.toString(),
                            item.product.priceRange.minVariantPrice.currencyCode
                          )}
                        </p>
                      </div>

                      <button
                        className="cart-item__remove"
                        onClick={() => removeFromCart(item.id)}
                        aria-label={`Remove ${item.product.title} from cart`}
                      >
                        <span aria-hidden="true">🗑️</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Clear Cart Button */}
              <button
                className="cart-clear"
                onClick={clearCart}
                aria-label="Clear all items from cart"
              >
                Clear Cart
              </button>
            </>
          )}
        </div>

        {/* Footer with Total */}
        {!isEmpty && (
          <div className="cart-footer">
            <div className="cart-total">
              <span className="cart-total__label">Total:</span>
              <span className="cart-total__amount" aria-label={`Total: ${formatPrice(total.toString(), 'INR')}`}>
                {formatPrice(total.toString(), 'INR')}
              </span>
            </div>
            <button 
              className="cart-checkout" 
              onClick={handleCheckout}
              disabled={isProcessing}
              aria-label="Proceed to checkout and make payment"
            >
              {isProcessing ? 'Processing...' : 'Proceed to Checkout'}
            </button>
            <p className="cart-footer__note">Secure payment via Razorpay</p>
          </div>
        )}
      </aside>

      {/* Payment Status Modals */}
      {paymentStatus === 'processing' && <PaymentProcessing />}
      
      {paymentStatus === 'success' && paymentDetails && (
        <PaymentSuccess 
          paymentDetails={paymentDetails} 
          onClose={handlePaymentComplete} 
        />
      )}
      
      {paymentStatus === 'failure' && (
        <PaymentFailure 
          paymentDetails={paymentDetails}
          onRetry={handlePaymentRetry}
          onClose={clearPaymentStatus}
        />
      )}
    </>
  );
};


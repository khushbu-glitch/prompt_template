import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { initRazorpayCheckout } from '../services/razorpay';
import './Cart.css';

const Cart: React.FC = () => {
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }

  const { cartItems, getCartTotal } = cartContext;

  const handlePaymentSuccess = (response: any) => {
    console.log('Payment successful:', response);
    setPaymentStatus('success');
  };

  const handlePaymentFailure = (response: any) => {
    console.error('Payment failed:', response);
    setPaymentStatus('failed');
  };

  const handleCheckout = async () => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: parseFloat(getCartTotal()) * 100,
      currency: 'INR',
      name: 'Shopify Storefront',
      description: 'Test Transaction',
      handler: handlePaymentSuccess,
      prefill: {
        name: 'Test User',
        email: 'test.user@example.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Test Corporate Address',
      },
      theme: {
        color: '#3399cc',
      },
    };

    const result: any = await initRazorpayCheckout(options);
    if (!result.success) {
      handlePaymentFailure(result.response);
    }
  };

  return (
    <aside className="cart" aria-labelledby="cart-heading">
      <h2 id="cart-heading" className="sr-only">Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <span>{item.title}</span>
                <span>
                  {item.quantity} x ${item.priceRange.minVariantPrice.amount}
                </span>
              </li>
            ))}
          </ul>
          <p className="cart-total">
            <strong>Total:</strong> ${getCartTotal()}
          </p>
          <button onClick={handleCheckout} className="checkout-button">
            Checkout
          </button>
        </>
      )}
      {paymentStatus === 'success' && (
        <div className="payment-success" role="alert">
          Payment Successful!
        </div>
      )}
      {paymentStatus === 'failed' && (
        <div className="payment-failure" role="alert">
          Payment Failed. Please try again.
        </div>
      )}
    </aside>
  );
};

export default Cart;

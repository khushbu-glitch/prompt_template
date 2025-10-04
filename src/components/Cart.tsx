import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import './Cart.css';

const Cart: React.FC = () => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    return null;
  }

  const { cartItems, getCartTotal } = cartContext;

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
        </>
      )}
    </aside>
  );
};

export default Cart;

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CartProvider, CartContext } from './CartContext';
import { Product } from '../types/product';

const mockProduct: Product = {
  id: 'gid://shopify/Product/1',
  title: 'Mock Product 1',
  description: 'This is a mock product description.',
  featuredImage: {
    url: 'https://via.placeholder.com/150',
    altText: 'Mock Product 1 Image',
  },
  priceRange: {
    minVariantPrice: {
      amount: '19.99',
      currencyCode: 'USD',
    },
  },
};

const TestComponent = () => {
  const cartContext = React.useContext(CartContext);
  if (!cartContext) return null;

  const { cartItems, addToCart, getCartTotal } = cartContext;

  return (
    <div>
      <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
      <div data-testid="cart-items">
        {cartItems.map((item) => (
          <div key={item.id}>{item.title}</div>
        ))}
      </div>
      <div data-testid="cart-total">{getCartTotal()}</div>
    </div>
  );
};

describe('CartContext', () => {
  it('should add items to the cart and calculate the total', () => {
    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    expect(screen.getByTestId('cart-items').children.length).toBe(0);
    expect(screen.getByTestId('cart-total').textContent).toBe('0.00');

    fireEvent.click(screen.getByText('Add to Cart'));

    expect(screen.getByTestId('cart-items').children.length).toBe(1);
    expect(screen.getByTestId('cart-total').textContent).toBe('19.99');
  });
});

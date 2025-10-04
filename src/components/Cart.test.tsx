import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Cart from './Cart';
import { CartProvider, CartContext } from '../context/CartContext';
import * as razorpayService from '../services/razorpay';
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

describe('Cart', () => {
  beforeEach(() => {
    jest.spyOn(razorpayService, 'initRazorpayCheckout').mockResolvedValue({ success: true, response: {} });
  });

  it('should display cart items, total, and handle checkout', () => {
    const TestComponent = () => {
      const cartContext = React.useContext(CartContext);
      if (!cartContext) return null;
      const { addToCart } = cartContext;

      return (
        <div>
          <button onClick={() => addToCart(mockProduct)}>Add to Cart</button>
          <Cart />
        </div>
      );
    };

    render(
      <CartProvider>
        <TestComponent />
      </CartProvider>
    );

    fireEvent.click(screen.getByText('Add to Cart'));

    expect(screen.getByText('Mock Product 1')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toHaveTextContent('Total: $19.99');

    fireEvent.click(screen.getByText('Checkout'));

    expect(razorpayService.initRazorpayCheckout).toHaveBeenCalled();
  });
});

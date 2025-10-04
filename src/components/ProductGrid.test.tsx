import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductGrid from './ProductGrid';
import { CartProvider } from '../context/CartContext';
import * as shopifyService from '../services/shopify';
import { Product } from '../types/product';

const mockProducts: Product[] = [
  {
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
  },
  {
    id: 'gid://shopify/Product/2',
    title: 'Another Product',
    description: 'This is another mock product description.',
    featuredImage: {
      url: 'https://via.placeholder.com/150',
      altText: 'Another Product Image',
    },
    priceRange: {
      minVariantPrice: {
        amount: '29.99',
        currencyCode: 'USD',
      },
    },
  },
];

describe('ProductGrid', () => {
  beforeEach(() => {
    jest.spyOn(shopifyService, 'fetchProducts').mockResolvedValue(mockProducts);
  });

  it('should render products, handle search, and pagination', async () => {
    render(
      <CartProvider>
        <ProductGrid />
      </CartProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Mock Product 1')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText('Search for products'), {
      target: { value: 'Another' },
    });

    expect(screen.queryByText('Mock Product 1')).not.toBeInTheDocument();
    expect(screen.getByText('Another Product')).toBeInTheDocument();
  });
});

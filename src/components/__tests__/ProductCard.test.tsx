import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from '../ProductCard';
import { CartProvider } from '../../context/CartContext';
import { mockProduct } from '../../test/mocks/shopifyMock';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('ProductCard Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should render product title', () => {
    render(<ProductCard product={mockProduct} />, { wrapper });

    expect(screen.getByText(mockProduct.title)).toBeInTheDocument();
  });

  it('should render product description', () => {
    render(<ProductCard product={mockProduct} />, { wrapper });

    expect(screen.getByText(mockProduct.description)).toBeInTheDocument();
  });

  it('should render product price', () => {
    render(<ProductCard product={mockProduct} />, { wrapper });

    expect(screen.getByText(/99\.99/)).toBeInTheDocument();
  });

  it('should render product image', () => {
    render(<ProductCard product={mockProduct} />, { wrapper });

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute(
      'src',
      mockProduct.images.edges[0].node.url
    );
  });

  it('should have add to cart button', () => {
    render(<ProductCard product={mockProduct} />, { wrapper });

    expect(screen.getByText(/add to cart/i)).toBeInTheDocument();
  });

  it('should show "Added!" after clicking add to cart', async () => {
    render(<ProductCard product={mockProduct} />, { wrapper });

    const button = screen.getByText(/add to cart/i);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/added!/i)).toBeInTheDocument();
    });
  });

  it('should disable button when unavailable', () => {
    const unavailableProduct = { ...mockProduct, availableForSale: false };

    render(<ProductCard product={unavailableProduct} />, { wrapper });

    const button = screen.getByText(/unavailable/i);
    expect(button).toBeDisabled();
  });

  it('should have proper ARIA labels', () => {
    render(<ProductCard product={mockProduct} />, { wrapper });

    const article = screen.getByRole('article');
    expect(article).toHaveAttribute('aria-label');
  });

  it('should display alt text for image', () => {
    render(<ProductCard product={mockProduct} />, { wrapper });

    const image = screen.getByRole('img');
    expect(image).toHaveAttribute('alt');
  });

  it('should show out of stock badge when unavailable', () => {
    const unavailableProduct = { ...mockProduct, availableForSale: false };

    render(<ProductCard product={unavailableProduct} />, { wrapper });

    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });
});


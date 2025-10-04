import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ProductGrid } from '../ProductGrid';
import { mockProducts } from '../../test/mocks/shopifyMock';
import * as shopifyApi from '../../api/shopify';

vi.mock('../../api/shopify');

describe('renderProductGrid()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    vi.spyOn(shopifyApi, 'fetchProducts').mockImplementation(
      () => new Promise(() => {})
    );

    render(<ProductGrid />);

    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();
  });

  it('should render products after loading', async () => {
    vi.spyOn(shopifyApi, 'fetchProducts').mockResolvedValue(mockProducts);

    render(<ProductGrid />);

    await waitFor(() => {
      expect(screen.getByText(/our products/i)).toBeInTheDocument();
    });

    expect(screen.getByRole('list')).toBeInTheDocument();
  });

  it('should render product cards', async () => {
    vi.spyOn(shopifyApi, 'fetchProducts').mockResolvedValue(mockProducts);

    render(<ProductGrid />);

    await waitFor(() => {
      mockProducts.forEach((product) => {
        expect(screen.getByText(product.title)).toBeInTheDocument();
      });
    });
  });

  it('should handle empty product list', async () => {
    vi.spyOn(shopifyApi, 'fetchProducts').mockResolvedValue([]);

    render(<ProductGrid />);

    await waitFor(() => {
      expect(
        screen.getByText(/no products available/i)
      ).toBeInTheDocument();
    });
  });

  it('should render error state on failure', async () => {
    vi.spyOn(shopifyApi, 'fetchProducts').mockRejectedValue(
      new Error('API Error')
    );

    render(<ProductGrid />);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    });
  });

  it('should have aria-busy attribute', () => {
    vi.spyOn(shopifyApi, 'fetchProducts').mockResolvedValue(mockProducts);

    render(<ProductGrid />);

    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('aria-busy');
  });

  it('should render with proper list structure', async () => {
    vi.spyOn(shopifyApi, 'fetchProducts').mockResolvedValue(mockProducts);

    render(<ProductGrid />);

    await waitFor(() => {
      const list = screen.getByRole('list');
      expect(list).toHaveAttribute('aria-label', 'Product list');
    });
  });

  it('should render correct number of products', async () => {
    vi.spyOn(shopifyApi, 'fetchProducts').mockResolvedValue(mockProducts);

    render(<ProductGrid />);

    await waitFor(() => {
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(mockProducts.length);
    });
  });
});

describe('ProductGrid Error Handling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show retry button on error', async () => {
    vi.spyOn(shopifyApi, 'fetchProducts').mockRejectedValue(
      new Error('Network error')
    );

    render(<ProductGrid />);

    await waitFor(() => {
      expect(screen.getByText(/try again/i)).toBeInTheDocument();
    });
  });

  it('should display error message', async () => {
    const errorMessage = 'Failed to load products';
    vi.spyOn(shopifyApi, 'fetchProducts').mockRejectedValue(
      new Error(errorMessage)
    );

    render(<ProductGrid />);

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });
});


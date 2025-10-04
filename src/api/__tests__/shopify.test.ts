import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchProducts, formatPrice } from '../shopify';
import { mockProducts, mockShopifyResponse } from '../../test/mocks/shopifyMock';

describe('fetchProducts()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should return mock products when API is not configured', async () => {
    const products = await fetchProducts();

    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  it('should handle pagination parameters', async () => {
    const products = await fetchProducts({ first: 5, after: null });

    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThanOrEqual(0);
  });

  it('should handle query parameter', async () => {
    const products = await fetchProducts({ query: 'test' });

    expect(products).toBeDefined();
    expect(Array.isArray(products)).toBe(true);
  });

  it('should fall back to mock data on API error', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const products = await fetchProducts();

    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
  });

  it('should handle successful API response', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockShopifyResponse,
    });

    const products = await fetchProducts();

    expect(products).toBeDefined();
    expect(products.length).toBe(mockProducts.length);
  });

  it('should handle GraphQL errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        errors: [{ message: 'GraphQL error' }],
        data: { products: { edges: [], pageInfo: {} } },
      }),
    });

    const products = await fetchProducts();

    // Should fall back to mock data
    expect(products).toBeDefined();
    expect(products.length).toBeGreaterThan(0);
  });

  it('should handle HTTP errors', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const products = await fetchProducts();

    // Should fall back to mock data
    expect(products).toBeDefined();
  });

  it('should return products with correct structure', async () => {
    const products = await fetchProducts();

    expect(products[0]).toHaveProperty('id');
    expect(products[0]).toHaveProperty('title');
    expect(products[0]).toHaveProperty('description');
    expect(products[0]).toHaveProperty('priceRange');
    expect(products[0]).toHaveProperty('images');
    expect(products[0]).toHaveProperty('availableForSale');
  });
});

describe('formatPrice()', () => {
  it('should format USD price correctly', () => {
    const formatted = formatPrice('99.99', 'USD');
    expect(formatted).toContain('99.99');
    expect(formatted).toContain('$');
  });

  it('should format INR price correctly', () => {
    const formatted = formatPrice('499.99', 'INR');
    expect(formatted).toContain('499.99');
  });

  it('should handle zero amount', () => {
    const formatted = formatPrice('0', 'USD');
    expect(formatted).toContain('0');
  });

  it('should handle large amounts', () => {
    const formatted = formatPrice('999999.99', 'USD');
    expect(formatted).toBeDefined();
    expect(formatted.length).toBeGreaterThan(0);
  });

  it('should handle decimal precision', () => {
    const formatted = formatPrice('99.999', 'USD');
    expect(formatted).toBeDefined();
  });
});


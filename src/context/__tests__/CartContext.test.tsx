import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CartProvider, useCart } from '../CartContext';
import { mockProduct, mockProducts } from '../../test/mocks/shopifyMock';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe('addToCart()', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should add a product to cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    expect(result.current.cart.items.length).toBe(1);
    expect(result.current.cart.items[0].product.id).toBe(mockProduct.id);
    expect(result.current.cart.items[0].quantity).toBe(1);
  });

  it('should add multiple quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 3);
    });

    expect(result.current.cart.items[0].quantity).toBe(3);
  });

  it('should update quantity if product already in cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.cart.items.length).toBe(1);
    expect(result.current.cart.items[0].quantity).toBe(3);
  });

  it('should not add unavailable products', () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    const unavailableProduct = { ...mockProduct, availableForSale: false };

    act(() => {
      result.current.addToCart(unavailableProduct, 1);
    });

    expect(result.current.cart.items.length).toBe(0);
  });

  it('should not add zero quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 0);
    });

    expect(result.current.cart.items.length).toBe(0);
  });

  it('should not add negative quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, -1);
    });

    expect(result.current.cart.items.length).toBe(0);
  });

  it('should update cart totals after adding', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    expect(result.current.cart.itemCount).toBe(2);
    expect(result.current.cart.subtotal).toBeGreaterThan(0);
  });

  it('should persist to localStorage', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    expect(localStorage.setItem).toHaveBeenCalled();
  });
});

describe('getCartTotal()', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return 0 for empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const total = result.current.getCartTotal();
    expect(total).toBe(0);
  });

  it('should calculate total for single item', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    const total = result.current.getCartTotal();
    expect(total).toBe(99.99);
  });

  it('should calculate total for multiple quantities', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 3);
    });

    const total = result.current.getCartTotal();
    expect(total).toBe(99.99 * 3);
  });

  it('should calculate total for multiple products', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProducts[0], 1);
      result.current.addToCart(mockProducts[1], 1);
    });

    const total = result.current.getCartTotal();
    expect(total).toBe(99.99 + 149.99);
  });

  it('should update when items are removed', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    const itemId = result.current.cart.items[0].id;

    act(() => {
      result.current.removeFromCart(itemId);
    });

    const total = result.current.getCartTotal();
    expect(total).toBe(0);
  });

  it('should be a number', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    const total = result.current.getCartTotal();
    expect(typeof total).toBe('number');
  });
});

describe('removeFromCart()', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should remove item from cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    const itemId = result.current.cart.items[0].id;

    act(() => {
      result.current.removeFromCart(itemId);
    });

    expect(result.current.cart.items.length).toBe(0);
  });

  it('should update totals after removal', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    const itemId = result.current.cart.items[0].id;

    act(() => {
      result.current.removeFromCart(itemId);
    });

    expect(result.current.cart.itemCount).toBe(0);
    expect(result.current.cart.subtotal).toBe(0);
  });
});

describe('updateQuantity()', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should update item quantity', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    const itemId = result.current.cart.items[0].id;

    act(() => {
      result.current.updateQuantity(itemId, 5);
    });

    expect(result.current.cart.items[0].quantity).toBe(5);
  });

  it('should remove item when quantity is 0', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    const itemId = result.current.cart.items[0].id;

    act(() => {
      result.current.updateQuantity(itemId, 0);
    });

    expect(result.current.cart.items.length).toBe(0);
  });

  it('should update totals after quantity change', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    const itemId = result.current.cart.items[0].id;

    act(() => {
      result.current.updateQuantity(itemId, 10);
    });

    expect(result.current.cart.itemCount).toBe(10);
    expect(result.current.getCartTotal()).toBe(99.99 * 10);
  });
});

describe('clearCart()', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should clear all items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProducts[0], 1);
      result.current.addToCart(mockProducts[1], 1);
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.cart.items.length).toBe(0);
    expect(result.current.cart.itemCount).toBe(0);
    expect(result.current.cart.subtotal).toBe(0);
  });
});

describe('getItemCount()', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should return 0 for empty cart', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    expect(result.current.getItemCount()).toBe(0);
  });

  it('should return total quantity of all items', () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart(mockProducts[0], 2);
      result.current.addToCart(mockProducts[1], 3);
    });

    expect(result.current.getItemCount()).toBe(5);
  });
});


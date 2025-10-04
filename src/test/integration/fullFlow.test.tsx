import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { CartProvider, useCart } from '../../context/CartContext';
import { RazorpayProvider, useRazorpay } from '../../context/RazorpayContext';
import { mockProduct, mockProducts } from '../mocks/shopifyMock';
import React from 'react';

const AllProviders = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>
    <RazorpayProvider>{children}</RazorpayProvider>
  </CartProvider>
);

describe('Full E-commerce Flow Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should complete full purchase flow: add to cart, checkout, payment success', async () => {
    const { result } = renderHook(
      () => ({
        cart: useCart(),
        payment: useRazorpay(),
      }),
      { wrapper: AllProviders }
    );

    // Step 1: Add products to cart
    act(() => {
      result.current.cart.addToCart(mockProducts[0], 2);
      result.current.cart.addToCart(mockProducts[1], 1);
    });

    expect(result.current.cart.cart.items.length).toBe(2);
    expect(result.current.cart.getItemCount()).toBe(3);

    // Step 2: Get cart total
    const total = result.current.cart.getCartTotal();
    expect(total).toBe(99.99 * 2 + 149.99);

    // Step 3: Initiate checkout
    act(() => {
      result.current.payment.initRazorpayCheckout(total);
    });

    expect(result.current.payment.paymentStatus).toBe('processing');

    // Step 4: Complete payment (mock)
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.payment.paymentStatus).toBe('success');
      expect(result.current.payment.paymentDetails).toBeDefined();
    });

    // Step 5: Clear cart after successful payment
    act(() => {
      result.current.cart.clearCart();
    });

    expect(result.current.cart.cart.items.length).toBe(0);
    expect(result.current.cart.getCartTotal()).toBe(0);
  });

  it('should handle failed payment and allow retry', async () => {
    const { result } = renderHook(
      () => ({
        cart: useCart(),
        payment: useRazorpay(),
      }),
      { wrapper: AllProviders }
    );

    // Add items to cart
    act(() => {
      result.current.cart.addToCart(mockProduct, 1);
    });

    const total = result.current.cart.getCartTotal();

    // Simulate payment failure
    act(() => {
      result.current.payment.handlePaymentFailure({
        error: {
          code: 'PAYMENT_FAILED',
          description: 'Payment declined',
          source: 'customer',
          step: 'authorization',
          reason: 'insufficient_balance',
          metadata: {},
        },
      });
    });

    expect(result.current.payment.paymentStatus).toBe('failure');

    // Clear status and retry
    act(() => {
      result.current.payment.clearPaymentStatus();
    });

    expect(result.current.payment.paymentStatus).toBe('idle');

    // Cart should still have items for retry
    expect(result.current.cart.cart.items.length).toBe(1);
  });

  it('should handle quantity updates and recalculate total', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: AllProviders,
    });

    // Add product
    act(() => {
      result.current.addToCart(mockProduct, 1);
    });

    const itemId = result.current.cart.items[0].id;
    const initialTotal = result.current.getCartTotal();

    // Update quantity
    act(() => {
      result.current.updateQuantity(itemId, 5);
    });

    const newTotal = result.current.getCartTotal();

    expect(newTotal).toBe(initialTotal * 5);
    expect(result.current.getItemCount()).toBe(5);
  });

  it('should prevent adding unavailable products', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: AllProviders,
    });

    const unavailableProduct = { ...mockProduct, availableForSale: false };

    act(() => {
      result.current.addToCart(unavailableProduct, 1);
    });

    expect(result.current.cart.items.length).toBe(0);
  });

  it('should persist cart to localStorage', () => {
    const { result } = renderHook(() => useCart(), {
      wrapper: AllProviders,
    });

    act(() => {
      result.current.addToCart(mockProduct, 2);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'shopify-cart',
      expect.any(String)
    );
  });
});


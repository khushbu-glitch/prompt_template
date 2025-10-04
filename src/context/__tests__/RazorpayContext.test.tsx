import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { RazorpayProvider, useRazorpay } from '../RazorpayContext';
import {
  mockRazorpaySuccess,
  mockRazorpayError,
} from '../../test/mocks/razorpayMock';
import React from 'react';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <RazorpayProvider>{children}</RazorpayProvider>
);

describe('initRazorpayCheckout()', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should initialize payment with valid amount', async () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.initRazorpayCheckout(499.99);
    });

    expect(result.current.paymentStatus).toBe('processing');
    expect(result.current.isProcessing).toBe(true);
  });

  it('should throw error for zero amount', async () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    await expect(async () => {
      await result.current.initRazorpayCheckout(0);
    }).rejects.toThrow('Amount must be greater than zero');
  });

  it('should throw error for negative amount', async () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    await expect(async () => {
      await result.current.initRazorpayCheckout(-100);
    }).rejects.toThrow('Amount must be greater than zero');
  });

  it('should use mock payment when API key not configured', async () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.initRazorpayCheckout(499.99);
    });

    // Fast-forward timers to simulate mock payment completion
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.paymentStatus).toBe('success');
    });
  });

  it('should handle custom order details', async () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.initRazorpayCheckout(299.99, 'INR', {
        name: 'Test Store',
        description: 'Test order',
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9876543210',
        },
      });
    });

    expect(result.current.isProcessing).toBe(true);
  });

  it('should convert amount to paise', async () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.initRazorpayCheckout(100.50);
    });

    // Mock payment should process 10050 paise
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.paymentDetails?.amount).toBe(10050);
    });
  });

  it('should set payment status to processing', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.initRazorpayCheckout(99.99);
    });

    expect(result.current.paymentStatus).toBe('processing');
  });
});

describe('handlePaymentSuccess()', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should handle successful payment', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.handlePaymentSuccess(mockRazorpaySuccess);
    });

    expect(result.current.paymentStatus).toBe('success');
    expect(result.current.paymentDetails).toBeDefined();
    expect(result.current.paymentDetails?.paymentId).toBe(
      mockRazorpaySuccess.razorpay_payment_id
    );
  });

  it('should store payment details', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.handlePaymentSuccess(mockRazorpaySuccess);
    });

    expect(result.current.paymentDetails).toMatchObject({
      paymentId: mockRazorpaySuccess.razorpay_payment_id,
      orderId: mockRazorpaySuccess.razorpay_order_id,
      signature: mockRazorpaySuccess.razorpay_signature,
      status: 'success',
    });
  });

  it('should set processing to false', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.handlePaymentSuccess(mockRazorpaySuccess);
    });

    expect(result.current.isProcessing).toBe(false);
  });

  it('should save to localStorage', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.handlePaymentSuccess(mockRazorpaySuccess);
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'payment_history',
      expect.any(String)
    );
  });

  it('should include timestamp', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.handlePaymentSuccess(mockRazorpaySuccess);
    });

    expect(result.current.paymentDetails?.timestamp).toBeDefined();
    expect(typeof result.current.paymentDetails?.timestamp).toBe('number');
  });
});

describe('handlePaymentFailure()', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should handle payment failure', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.handlePaymentFailure(mockRazorpayError);
    });

    expect(result.current.paymentStatus).toBe('failure');
    expect(result.current.paymentDetails).toBeDefined();
  });

  it('should store error details', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.handlePaymentFailure(mockRazorpayError);
    });

    expect(result.current.paymentDetails?.status).toBe('failure');
    expect(result.current.paymentDetails?.paymentId).toBeDefined();
  });

  it('should set processing to false', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.handlePaymentFailure(mockRazorpayError);
    });

    expect(result.current.isProcessing).toBe(false);
  });

  it('should handle missing payment_id in metadata', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    const errorWithoutPaymentId = {
      error: {
        ...mockRazorpayError.error,
        metadata: {},
      },
    };

    act(() => {
      result.current.handlePaymentFailure(errorWithoutPaymentId);
    });

    expect(result.current.paymentDetails?.paymentId).toBe('N/A');
  });

  it('should include timestamp', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.handlePaymentFailure(mockRazorpayError);
    });

    expect(result.current.paymentDetails?.timestamp).toBeDefined();
  });
});

describe('clearPaymentStatus()', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should clear payment status', () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    act(() => {
      result.current.handlePaymentSuccess(mockRazorpaySuccess);
    });

    act(() => {
      result.current.clearPaymentStatus();
    });

    expect(result.current.paymentStatus).toBe('idle');
    expect(result.current.paymentDetails).toBeNull();
    expect(result.current.isProcessing).toBe(false);
  });
});

describe('Payment Flow Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should complete full payment flow', async () => {
    const { result } = renderHook(() => useRazorpay(), { wrapper });

    // Start payment
    act(() => {
      result.current.initRazorpayCheckout(499.99);
    });

    expect(result.current.paymentStatus).toBe('processing');

    // Complete mock payment
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(result.current.paymentStatus).toBe('success');
      expect(result.current.paymentDetails).toBeDefined();
      expect(result.current.isProcessing).toBe(false);
    });

    // Clear status
    act(() => {
      result.current.clearPaymentStatus();
    });

    expect(result.current.paymentStatus).toBe('idle');
  });
});


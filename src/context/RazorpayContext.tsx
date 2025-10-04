import React, { createContext, useContext, useState, useCallback } from 'react';
import {
  RazorpayConfig,
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
  PaymentDetails,
  RazorpayInstance,
} from '../types/razorpay';
import { loadRazorpayScript, isRazorpayLoaded } from '../utils/razorpayLoader';

/**
 * Razorpay Configuration from Environment Variables
 * Secure API key handling
 */
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID;
const USE_MOCK_PAYMENT = !RAZORPAY_KEY_ID || import.meta.env.VITE_USE_MOCK_PAYMENT === 'true';

interface RazorpayContextType {
  initRazorpayCheckout: (
    amount: number,
    currency?: string,
    orderDetails?: Partial<RazorpayConfig>
  ) => Promise<void>;
  handlePaymentSuccess: (response: RazorpaySuccessResponse) => void;
  handlePaymentFailure: (error: RazorpayErrorResponse) => void;
  paymentStatus: 'idle' | 'processing' | 'success' | 'failure';
  paymentDetails: PaymentDetails | null;
  clearPaymentStatus: () => void;
  isProcessing: boolean;
}

const RazorpayContext = createContext<RazorpayContextType | undefined>(undefined);

/**
 * Razorpay Provider Component
 * Manages payment processing with Razorpay Standard Checkout
 */
export const RazorpayProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failure'>('idle');
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  /**
   * Handle successful payment
   * @param response - Razorpay success response
   */
  const handlePaymentSuccess = useCallback((response: RazorpaySuccessResponse) => {
    const details: PaymentDetails = {
      paymentId: response.razorpay_payment_id,
      orderId: response.razorpay_order_id,
      signature: response.razorpay_signature,
      amount: 0, // Will be set by initRazorpayCheckout
      currency: 'INR',
      status: 'success',
      timestamp: Date.now(),
    };

    setPaymentDetails(details);
    setPaymentStatus('success');
    setIsProcessing(false);

    // Announce to screen readers
    announceToScreenReader('Payment successful! Your order has been placed.');

    // Log for debugging (remove in production or use proper logging service)
    console.log('Payment Success:', response);

    // Store in localStorage for order history
    try {
      const paymentHistory = JSON.parse(localStorage.getItem('payment_history') || '[]');
      paymentHistory.push(details);
      localStorage.setItem('payment_history', JSON.stringify(paymentHistory));
    } catch (error) {
      console.error('Error saving payment history:', error);
    }
  }, []);

  /**
   * Handle payment failure
   * @param error - Razorpay error response
   */
  const handlePaymentFailure = useCallback((error: RazorpayErrorResponse) => {
    const details: PaymentDetails = {
      paymentId: error.error.metadata?.payment_id || 'N/A',
      orderId: error.error.metadata?.order_id,
      amount: 0,
      currency: 'INR',
      status: 'failure',
      timestamp: Date.now(),
    };

    setPaymentDetails(details);
    setPaymentStatus('failure');
    setIsProcessing(false);

    // Announce to screen readers
    announceToScreenReader(`Payment failed: ${error.error.description}`);

    // Log error (use proper error logging service in production)
    console.error('Payment Failure:', error);
  }, []);

  /**
   * Initialize and launch Razorpay checkout
   * @param amount - Amount in rupees (will be converted to paise)
   * @param currency - Currency code (default: INR)
   * @param orderDetails - Additional order configuration
   */
  const initRazorpayCheckout = useCallback(
    async (
      amount: number,
      currency: string = 'INR',
      orderDetails?: Partial<RazorpayConfig>
    ): Promise<void> => {
      // Validate amount
      if (amount <= 0) {
        throw new Error('Amount must be greater than zero');
      }

      setIsProcessing(true);
      setPaymentStatus('processing');

      // Mock payment mode for development/testing
      if (USE_MOCK_PAYMENT) {
        console.warn('Using mock payment mode. Set VITE_RAZORPAY_KEY_ID in .env for real payments.');
        
        // Simulate payment processing
        setTimeout(() => {
          const mockResponse: RazorpaySuccessResponse = {
            razorpay_payment_id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            razorpay_order_id: `order_mock_${Date.now()}`,
            razorpay_signature: 'mock_signature',
          };

          // Store amount for mock payment
          const details: PaymentDetails = {
            ...mockResponse,
            paymentId: mockResponse.razorpay_payment_id,
            orderId: mockResponse.razorpay_order_id,
            signature: mockResponse.razorpay_signature,
            amount: amount * 100, // Convert to paise
            currency,
            status: 'success',
            timestamp: Date.now(),
          };
          
          setPaymentDetails(details);
          handlePaymentSuccess(mockResponse);
        }, 2000);

        return;
      }

      try {
        // Load Razorpay script
        const loaded = await loadRazorpayScript();
        
        if (!loaded || !isRazorpayLoaded()) {
          throw new Error('Failed to load Razorpay. Please check your internet connection.');
        }

        // Convert amount to smallest currency unit (paise for INR)
        const amountInPaise = Math.round(amount * 100);

        // Configure Razorpay checkout
        const options: RazorpayConfig = {
          key: RAZORPAY_KEY_ID,
          amount: amountInPaise,
          currency: currency,
          name: orderDetails?.name || 'Premium Store',
          description: orderDetails?.description || 'Purchase from Premium Store',
          image: orderDetails?.image || '/logo.png',
          handler: (response) => {
            const details: PaymentDetails = {
              ...response,
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature,
              amount: amountInPaise,
              currency,
              status: 'success',
              timestamp: Date.now(),
            };
            setPaymentDetails(details);
            handlePaymentSuccess(response);
          },
          prefill: {
            name: orderDetails?.prefill?.name || '',
            email: orderDetails?.prefill?.email || '',
            contact: orderDetails?.prefill?.contact || '',
          },
          theme: {
            color: orderDetails?.theme?.color || '#2563eb',
          },
          modal: {
            ondismiss: () => {
              setPaymentStatus('idle');
              setIsProcessing(false);
              announceToScreenReader('Payment cancelled');
            },
            escape: true,
            backdropclose: true,
          },
          ...orderDetails,
        };

        // Create and open Razorpay instance
        const razorpayInstance: RazorpayInstance = new window.Razorpay(options);

        // Handle payment failure
        razorpayInstance.on('payment.failed', (response: RazorpayErrorResponse) => {
          handlePaymentFailure(response);
        });

        // Open checkout modal
        razorpayInstance.open();
      } catch (error) {
        console.error('Error initializing Razorpay:', error);
        
        // Create mock error response
        const errorResponse: RazorpayErrorResponse = {
          error: {
            code: 'INITIALIZATION_ERROR',
            description: error instanceof Error ? error.message : 'Failed to initialize payment',
            source: 'client',
            step: 'initialization',
            reason: 'script_load_failure',
            metadata: {},
          },
        };
        
        handlePaymentFailure(errorResponse);
      }
    },
    [handlePaymentSuccess, handlePaymentFailure]
  );

  /**
   * Clear payment status and details
   */
  const clearPaymentStatus = useCallback(() => {
    setPaymentStatus('idle');
    setPaymentDetails(null);
    setIsProcessing(false);
  }, []);

  const value: RazorpayContextType = {
    initRazorpayCheckout,
    handlePaymentSuccess,
    handlePaymentFailure,
    paymentStatus,
    paymentDetails,
    clearPaymentStatus,
    isProcessing,
  };

  return <RazorpayContext.Provider value={value}>{children}</RazorpayContext.Provider>;
};

/**
 * Custom hook to use Razorpay context
 */
export const useRazorpay = (): RazorpayContextType => {
  const context = useContext(RazorpayContext);
  if (!context) {
    throw new Error('useRazorpay must be used within a RazorpayProvider');
  }
  return context;
};

/**
 * Helper function to announce messages to screen readers
 */
function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}


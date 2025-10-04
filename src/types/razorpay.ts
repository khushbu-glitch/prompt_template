/**
 * TypeScript interfaces for Razorpay Payment Integration
 * Based on Razorpay Standard Checkout API
 */

export interface RazorpayConfig {
  key: string;
  amount: number; // Amount in smallest currency unit (paise for INR)
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  handler: (response: RazorpaySuccessResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
  };
  modal?: {
    ondismiss?: () => void;
    escape?: boolean;
    backdropclose?: boolean;
  };
}

export interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayErrorResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id?: string;
      payment_id?: string;
    };
  };
}

export interface PaymentDetails {
  paymentId: string;
  orderId?: string;
  signature?: string;
  amount: number;
  currency: string;
  status: 'success' | 'failure' | 'pending';
  timestamp: number;
}

export interface RazorpayInstance {
  open: () => void;
  close: () => void;
  on: (event: string, handler: (response: RazorpayErrorResponse) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (config: RazorpayConfig) => RazorpayInstance;
  }
}


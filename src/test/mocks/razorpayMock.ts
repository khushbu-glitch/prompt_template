import {
  RazorpaySuccessResponse,
  RazorpayErrorResponse,
  PaymentDetails,
} from '../../types/razorpay';

export const mockRazorpaySuccess: RazorpaySuccessResponse = {
  razorpay_payment_id: 'pay_test123456789',
  razorpay_order_id: 'order_test123456789',
  razorpay_signature: 'mock_signature_hash',
};

export const mockRazorpayError: RazorpayErrorResponse = {
  error: {
    code: 'BAD_REQUEST_ERROR',
    description: 'Payment failed',
    source: 'customer',
    step: 'authorization',
    reason: 'payment_cancelled',
    metadata: {
      order_id: 'order_test123456789',
      payment_id: 'pay_test123456789',
    },
  },
};

export const mockPaymentDetails: PaymentDetails = {
  paymentId: 'pay_test123456789',
  orderId: 'order_test123456789',
  signature: 'mock_signature_hash',
  amount: 49999,
  currency: 'INR',
  status: 'success',
  timestamp: Date.now(),
};


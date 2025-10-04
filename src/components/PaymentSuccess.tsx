import React from 'react';
import { PaymentDetails } from '../types/razorpay';
import { formatPrice } from '../api/shopify';

interface PaymentSuccessProps {
  paymentDetails: PaymentDetails;
  onClose: () => void;
}

/**
 * PaymentSuccess Component
 * Displays payment success confirmation with order details
 * Fully accessible with ARIA attributes
 */
export const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  paymentDetails,
  onClose,
}) => {
  const amount = paymentDetails.amount / 100; // Convert from paise to rupees
  const formattedAmount = formatPrice(amount.toString(), paymentDetails.currency);

  return (
    <div className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-success-title">
      <div className="payment-modal__backdrop" onClick={onClose} aria-hidden="true" />
      
      <div className="payment-modal__content payment-success">
        <div className="payment-success__icon" aria-hidden="true">
          ✓
        </div>

        <h2 id="payment-success-title" className="payment-success__title">
          Payment Successful!
        </h2>

        <p className="payment-success__message">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        <div className="payment-success__details" role="group" aria-label="Payment details">
          <div className="payment-detail">
            <span className="payment-detail__label">Payment ID:</span>
            <span className="payment-detail__value" aria-label={`Payment ID: ${paymentDetails.paymentId}`}>
              {paymentDetails.paymentId}
            </span>
          </div>

          {paymentDetails.orderId && (
            <div className="payment-detail">
              <span className="payment-detail__label">Order ID:</span>
              <span className="payment-detail__value" aria-label={`Order ID: ${paymentDetails.orderId}`}>
                {paymentDetails.orderId}
              </span>
            </div>
          )}

          <div className="payment-detail">
            <span className="payment-detail__label">Amount Paid:</span>
            <span className="payment-detail__value payment-detail__value--amount">
              {formattedAmount}
            </span>
          </div>

          <div className="payment-detail">
            <span className="payment-detail__label">Date:</span>
            <span className="payment-detail__value">
              {new Date(paymentDetails.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="payment-success__message-box">
          <p className="payment-success__info">
            A confirmation email has been sent to your registered email address.
          </p>
        </div>

        <button
          className="payment-success__button"
          onClick={onClose}
          aria-label="Close payment success notification and continue shopping"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};


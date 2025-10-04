import React from 'react';
import { PaymentDetails } from '../types/razorpay';

interface PaymentFailureProps {
  paymentDetails: PaymentDetails | null;
  errorMessage?: string;
  onRetry: () => void;
  onClose: () => void;
}

/**
 * PaymentFailure Component
 * Displays payment failure message with retry option
 * Fully accessible with ARIA attributes
 */
export const PaymentFailure: React.FC<PaymentFailureProps> = ({
  paymentDetails,
  errorMessage,
  onRetry,
  onClose,
}) => {
  return (
    <div className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-failure-title">
      <div className="payment-modal__backdrop" onClick={onClose} aria-hidden="true" />
      
      <div className="payment-modal__content payment-failure">
        <div className="payment-failure__icon" aria-hidden="true">
          ✕
        </div>

        <h2 id="payment-failure-title" className="payment-failure__title">
          Payment Failed
        </h2>

        <p className="payment-failure__message">
          {errorMessage || 'We encountered an issue processing your payment. Please try again.'}
        </p>

        {paymentDetails && (
          <div className="payment-failure__details" role="group" aria-label="Payment details">
            {paymentDetails.paymentId !== 'N/A' && (
              <div className="payment-detail">
                <span className="payment-detail__label">Payment ID:</span>
                <span className="payment-detail__value">
                  {paymentDetails.paymentId}
                </span>
              </div>
            )}

            {paymentDetails.orderId && (
              <div className="payment-detail">
                <span className="payment-detail__label">Order ID:</span>
                <span className="payment-detail__value">
                  {paymentDetails.orderId}
                </span>
              </div>
            )}

            <div className="payment-detail">
              <span className="payment-detail__label">Time:</span>
              <span className="payment-detail__value">
                {new Date(paymentDetails.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        )}

        <div className="payment-failure__suggestions">
          <h3 className="payment-failure__suggestions-title">Common issues:</h3>
          <ul className="payment-failure__suggestions-list">
            <li>Insufficient balance in account</li>
            <li>Incorrect card details or expired card</li>
            <li>Payment timeout or network issue</li>
            <li>Payment cancelled by user</li>
          </ul>
        </div>

        <div className="payment-failure__actions">
          <button
            className="payment-failure__button payment-failure__button--retry"
            onClick={onRetry}
            aria-label="Retry payment"
          >
            Try Again
          </button>
          
          <button
            className="payment-failure__button payment-failure__button--cancel"
            onClick={onClose}
            aria-label="Cancel and return to cart"
          >
            Cancel
          </button>
        </div>

        <p className="payment-failure__support">
          Need help? Contact our support team at{' '}
          <a href="mailto:support@premiumstore.com" className="payment-failure__support-link">
            support@premiumstore.com
          </a>
        </p>
      </div>
    </div>
  );
};


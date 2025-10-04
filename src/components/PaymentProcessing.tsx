import React from 'react';

/**
 * PaymentProcessing Component
 * Displays loading state while payment is being processed
 * Accessible with ARIA live region
 */
export const PaymentProcessing: React.FC = () => {
  return (
    <div className="payment-modal" role="dialog" aria-modal="true" aria-labelledby="payment-processing-title">
      <div className="payment-modal__backdrop" aria-hidden="true" />
      
      <div className="payment-modal__content payment-processing">
        <div className="payment-processing__spinner" aria-hidden="true">
          <div className="payment-processing__spinner-circle"></div>
          <div className="payment-processing__spinner-circle"></div>
          <div className="payment-processing__spinner-circle"></div>
        </div>

        <h2 id="payment-processing-title" className="payment-processing__title">
          Processing Payment
        </h2>

        <p className="payment-processing__message" role="status" aria-live="polite">
          Please wait while we process your payment...
        </p>

        <p className="payment-processing__note">
          Do not close this window or press the back button
        </p>
      </div>
    </div>
  );
};


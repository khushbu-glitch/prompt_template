import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

/**
 * ErrorMessage Component
 * Displays error messages with optional retry functionality
 * Includes proper ARIA attributes for accessibility
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
}) => {
  return (
    <div
      className="error-message"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className="error-message__icon" aria-hidden="true">
        ⚠️
      </div>
      <h3 className="error-message__title">Oops! Something went wrong</h3>
      <p className="error-message__text">{message}</p>
      {onRetry && (
        <button
          className="error-message__button"
          onClick={onRetry}
          aria-label="Retry loading products"
        >
          Try Again
        </button>
      )}
    </div>
  );
};


import React from 'react';

/**
 * LoadingSpinner Component
 * Accessible loading indicator with ARIA attributes
 */
export const LoadingSpinner: React.FC = () => {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="loading-spinner__spinner" aria-hidden="true">
        <div className="loading-spinner__bounce1"></div>
        <div className="loading-spinner__bounce2"></div>
        <div className="loading-spinner__bounce3"></div>
      </div>
      <span className="loading-spinner__text">Loading products...</span>
    </div>
  );
};


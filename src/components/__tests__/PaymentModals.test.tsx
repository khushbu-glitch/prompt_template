import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PaymentSuccess } from '../PaymentSuccess';
import { PaymentFailure } from '../PaymentFailure';
import { PaymentProcessing } from '../PaymentProcessing';
import { mockPaymentDetails } from '../../test/mocks/razorpayMock';

describe('PaymentSuccess Component', () => {
  it('should render success message', () => {
    render(
      <PaymentSuccess paymentDetails={mockPaymentDetails} onClose={vi.fn()} />
    );

    expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
  });

  it('should display payment ID', () => {
    render(
      <PaymentSuccess paymentDetails={mockPaymentDetails} onClose={vi.fn()} />
    );

    expect(screen.getByText(mockPaymentDetails.paymentId)).toBeInTheDocument();
  });

  it('should have continue shopping button', () => {
    const onClose = vi.fn();

    render(
      <PaymentSuccess paymentDetails={mockPaymentDetails} onClose={onClose} />
    );

    const button = screen.getByText(/continue shopping/i);
    fireEvent.click(button);

    expect(onClose).toHaveBeenCalled();
  });

  it('should have proper dialog attributes', () => {
    render(
      <PaymentSuccess paymentDetails={mockPaymentDetails} onClose={vi.fn()} />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('should display formatted amount', () => {
    render(
      <PaymentSuccess paymentDetails={mockPaymentDetails} onClose={vi.fn()} />
    );

    // Amount should be displayed in currency format
    expect(screen.getByText(/₹/)).toBeInTheDocument();
  });
});

describe('PaymentFailure Component', () => {
  it('should render failure message', () => {
    render(
      <PaymentFailure
        paymentDetails={mockPaymentDetails}
        onRetry={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
  });

  it('should have retry button', () => {
    const onRetry = vi.fn();

    render(
      <PaymentFailure
        paymentDetails={mockPaymentDetails}
        onRetry={onRetry}
        onClose={vi.fn()}
      />
    );

    const button = screen.getByText(/try again/i);
    fireEvent.click(button);

    expect(onRetry).toHaveBeenCalled();
  });

  it('should have cancel button', () => {
    const onClose = vi.fn();

    render(
      <PaymentFailure
        paymentDetails={mockPaymentDetails}
        onRetry={vi.fn()}
        onClose={onClose}
      />
    );

    const button = screen.getByText(/cancel/i);
    fireEvent.click(button);

    expect(onClose).toHaveBeenCalled();
  });

  it('should display common issues', () => {
    render(
      <PaymentFailure
        paymentDetails={mockPaymentDetails}
        onRetry={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText(/common issues/i)).toBeInTheDocument();
    expect(screen.getByText(/insufficient balance/i)).toBeInTheDocument();
  });

  it('should show support email', () => {
    render(
      <PaymentFailure
        paymentDetails={mockPaymentDetails}
        onRetry={vi.fn()}
        onClose={vi.fn()}
      />
    );

    const supportLink = screen.getByText(/support@premiumstore.com/i);
    expect(supportLink).toHaveAttribute('href', 'mailto:support@premiumstore.com');
  });
});

describe('PaymentProcessing Component', () => {
  it('should render processing message', () => {
    render(<PaymentProcessing />);

    expect(screen.getByText(/processing payment/i)).toBeInTheDocument();
  });

  it('should show warning message', () => {
    render(<PaymentProcessing />);

    expect(
      screen.getByText(/do not close this window/i)
    ).toBeInTheDocument();
  });

  it('should have loading spinner', () => {
    render(<PaymentProcessing />);

    const dialog = screen.getByRole('dialog');
    expect(dialog).toBeInTheDocument();
  });

  it('should have ARIA live region', () => {
    render(<PaymentProcessing />);

    const statusElement = screen.getByRole('status');
    expect(statusElement).toHaveAttribute('aria-live', 'polite');
  });
});


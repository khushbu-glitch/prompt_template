# Razorpay Payment Integration Documentation

## Overview

This application integrates **Razorpay Standard Checkout** for secure payment processing. The integration includes complete payment lifecycle management with success/failure handling, mock payment support for testing, and full accessibility compliance.

## Core Functions

### `initRazorpayCheckout(amount, currency, orderDetails)`

**Location:** `src/context/RazorpayContext.tsx`

Initializes and launches the Razorpay payment checkout modal.

**Parameters:**
- `amount: number` - Amount in rupees (automatically converted to paise)
- `currency: string` (optional, default: 'INR') - Currency code
- `orderDetails: Partial<RazorpayConfig>` (optional) - Additional configuration

**Features:**
- ✅ Loads Razorpay script dynamically
- ✅ Validates amount and payment readiness
- ✅ Converts currency to smallest unit (paise)
- ✅ Opens Razorpay checkout modal
- ✅ Handles modal dismissal
- ✅ Falls back to mock payment if API key not configured
- ✅ Announces status to screen readers

**Example:**
```typescript
import { useRazorpay } from './context/RazorpayContext';

function CheckoutButton() {
  const { initRazorpayCheckout } = useRazorpay();

  const handleClick = async () => {
    try {
      await initRazorpayCheckout(499.99, 'INR', {
        name: 'Premium Store',
        description: 'Purchase of 3 items',
        prefill: {
          name: 'John Doe',
          email: 'john@example.com',
          contact: '9876543210',
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
    }
  };

  return <button onClick={handleClick}>Pay Now</button>;
}
```

### `handlePaymentSuccess(response)`

**Location:** `src/context/RazorpayContext.tsx`

Handles successful payment completion and updates application state.

**Parameters:**
- `response: RazorpaySuccessResponse` - Response from Razorpay containing payment details

**Features:**
- ✅ Stores payment details in state
- ✅ Updates payment status to 'success'
- ✅ Saves to localStorage payment history
- ✅ Announces success to screen readers
- ✅ Logs transaction details

**Response Structure:**
```typescript
{
  razorpay_payment_id: string;  // Unique payment ID
  razorpay_order_id?: string;   // Order ID if created
  razorpay_signature?: string;  // Payment signature for verification
}
```

**Example:**
```typescript
// Called automatically by Razorpay on successful payment
// You can also call it manually if needed:
const { handlePaymentSuccess } = useRazorpay();

handlePaymentSuccess({
  razorpay_payment_id: 'pay_ABC123',
  razorpay_order_id: 'order_XYZ789',
  razorpay_signature: 'signature_hash',
});
```

### `handlePaymentFailure(error)`

**Location:** `src/context/RazorpayContext.tsx`

Handles payment failures and displays appropriate error messages.

**Parameters:**
- `error: RazorpayErrorResponse` - Error response from Razorpay

**Features:**
- ✅ Updates payment status to 'failure'
- ✅ Stores error details
- ✅ Announces failure to screen readers
- ✅ Logs error for debugging
- ✅ Provides retry option to user

**Error Structure:**
```typescript
{
  error: {
    code: string;           // Error code (e.g., 'BAD_REQUEST_ERROR')
    description: string;    // Human-readable error message
    source: string;         // Error source ('customer', 'business', etc.)
    step: string;           // Payment step where error occurred
    reason: string;         // Reason for failure
    metadata: {
      order_id?: string;
      payment_id?: string;
    };
  };
}
```

**Example:**
```typescript
const { handlePaymentFailure } = useRazorpay();

// Razorpay calls this automatically on failure
// You can also trigger it manually:
handlePaymentFailure({
  error: {
    code: 'PAYMENT_FAILED',
    description: 'Payment was declined by bank',
    source: 'bank',
    step: 'authorization',
    reason: 'insufficient_balance',
    metadata: {
      order_id: 'order_123',
      payment_id: 'pay_456',
    },
  },
});
```

## Additional Functions

### `clearPaymentStatus()`

Resets payment status and clears payment details.

```typescript
const { clearPaymentStatus } = useRazorpay();
clearPaymentStatus();
```

## Environment Variables

### Required for Production

Create a `.env` file in the project root:

```env
# Razorpay API Key ID (get from Razorpay Dashboard)
VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxxx

# Optional: Force mock payment mode
VITE_USE_MOCK_PAYMENT=false
```

### Getting Razorpay API Keys

1. **Sign up** at [https://razorpay.com](https://razorpay.com)
2. **Navigate** to Dashboard > Settings > API Keys
3. **Generate** API Keys (Test or Live mode)
4. **Copy** the Key ID (starts with `rzp_test_` or `rzp_live_`)
5. **Add** to `.env` file as `VITE_RAZORPAY_KEY_ID`

**Important:** 
- Never commit `.env` to version control
- Use test keys for development: `rzp_test_xxxxx`
- Use live keys only in production: `rzp_live_xxxxx`
- Key Secret is NOT needed for Standard Checkout

## Mock Payment Mode

For testing without Razorpay account:

1. **Leave `VITE_RAZORPAY_KEY_ID` empty** or unset
2. **Or set** `VITE_USE_MOCK_PAYMENT=true`

**Mock Payment Behavior:**
- ✅ Simulates 2-second payment processing
- ✅ Always returns success
- ✅ Generates mock payment ID and order ID
- ✅ Saves to payment history
- ✅ Perfect for development/testing

```typescript
// Mock payment automatically triggers:
const mockResponse = {
  razorpay_payment_id: 'mock_1234567890_abc',
  razorpay_order_id: 'order_mock_1234567890',
  razorpay_signature: 'mock_signature',
};
```

## Payment Status Flow

```
idle → processing → success/failure → idle
```

1. **idle** - No payment in progress
2. **processing** - Payment initiated, waiting for completion
3. **success** - Payment completed successfully
4. **failure** - Payment failed or cancelled
5. **idle** - Reset after handling success/failure

## Components

### PaymentSuccess

Displays payment success confirmation with details.

**Location:** `src/components/PaymentSuccess.tsx`

**Features:**
- ✅ Animated success icon
- ✅ Payment ID and order ID display
- ✅ Amount paid confirmation
- ✅ Timestamp
- ✅ Confirmation message
- ✅ Continue shopping button
- ✅ Full ARIA support

### PaymentFailure

Displays payment failure message with retry option.

**Location:** `src/components/PaymentFailure.tsx`

**Features:**
- ✅ Animated error icon
- ✅ Error message display
- ✅ Common failure reasons
- ✅ Retry button
- ✅ Cancel button
- ✅ Support contact information
- ✅ Full ARIA support

### PaymentProcessing

Displays loading state during payment processing.

**Location:** `src/components/PaymentProcessing.tsx`

**Features:**
- ✅ Animated loading spinner
- ✅ Processing message
- ✅ Warning not to close window
- ✅ ARIA live region for screen readers

## Accessibility Features

### ARIA Attributes

- ✅ `role="dialog"` and `aria-modal="true"` on payment modals
- ✅ `aria-labelledby` for modal titles
- ✅ `aria-label` on all buttons
- ✅ `aria-live="polite"` for status updates
- ✅ Proper heading hierarchy

### Screen Reader Support

- ✅ Announces payment initiation
- ✅ Announces success/failure
- ✅ Announces processing status
- ✅ Descriptive button labels
- ✅ Live region updates

### Keyboard Navigation

- ✅ All interactive elements keyboard accessible
- ✅ Escape key closes modals
- ✅ Tab navigation through buttons
- ✅ Enter/Space activates buttons

## Security Best Practices

### ✅ Implemented

- **Environment Variables** - API keys stored in `.env`
- **No Hardcoded Secrets** - All sensitive data from env
- **HTTPS Required** - Razorpay requires secure connection
- **Client-Side Only** - Using Standard Checkout (no server required)
- **Amount Validation** - Prevents zero/negative amounts
- **Error Handling** - Graceful failure management

### ⚠️ Recommendations for Production

1. **Server-Side Verification**
   ```typescript
   // Verify payment signature on your backend
   // Use Razorpay Key Secret (never expose to client)
   const crypto = require('crypto');
   const hmac = crypto.createHmac('sha256', key_secret);
   hmac.update(order_id + "|" + payment_id);
   const generated_signature = hmac.digest('hex');
   
   if (generated_signature === razorpay_signature) {
     // Payment is authentic
   }
   ```

2. **Order Creation on Backend**
   - Create Razorpay orders on your server
   - Pass `order_id` to frontend
   - Provides better security and tracking

3. **Webhook Integration**
   - Set up Razorpay webhooks on your server
   - Verify payments independently
   - Handle payment status updates

4. **Rate Limiting**
   - Implement rate limiting on checkout
   - Prevent payment spam

## Payment History

Payments are stored in localStorage:

```typescript
// Access payment history
const history = JSON.parse(
  localStorage.getItem('payment_history') || '[]'
);

// Each entry contains:
{
  paymentId: string;
  orderId?: string;
  signature?: string;
  amount: number;      // In paise
  currency: string;
  status: 'success' | 'failure';
  timestamp: number;
}
```

## Usage Example

### Complete Checkout Flow

```typescript
import React from 'react';
import { useCart } from './context/CartContext';
import { useRazorpay } from './context/RazorpayContext';

function CheckoutComponent() {
  const { cart, getCartTotal, clearCart } = useCart();
  const { 
    initRazorpayCheckout,
    paymentStatus,
    paymentDetails,
    clearPaymentStatus,
    isProcessing,
  } = useRazorpay();

  const handleCheckout = async () => {
    const total = getCartTotal();

    try {
      await initRazorpayCheckout(total, 'INR', {
        name: 'My Store',
        description: `${cart.itemCount} items`,
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9876543210',
        },
      });
    } catch (error) {
      console.error('Checkout failed:', error);
    }
  };

  const handleSuccess = () => {
    clearCart();
    clearPaymentStatus();
    // Navigate to success page or show confirmation
  };

  return (
    <div>
      <button 
        onClick={handleCheckout}
        disabled={isProcessing || cart.itemCount === 0}
      >
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>

      {paymentStatus === 'success' && (
        <div>
          <h2>Payment Successful!</h2>
          <p>Payment ID: {paymentDetails?.paymentId}</p>
          <button onClick={handleSuccess}>Continue</button>
        </div>
      )}

      {paymentStatus === 'failure' && (
        <div>
          <h2>Payment Failed</h2>
          <button onClick={handleCheckout}>Retry</button>
          <button onClick={clearPaymentStatus}>Cancel</button>
        </div>
      )}
    </div>
  );
}
```

## Testing

### Test Cards (Razorpay Test Mode)

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date

**Failure:**
- Card: `4000 0000 0000 0002`
- Triggers payment failure

### Test UPI

- UPI ID: `success@razorpay`
- Triggers successful payment

### Test Netbanking

- Select any bank
- Use credentials: `test` / `test`

## Error Handling

### Common Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| `INITIALIZATION_ERROR` | Failed to load Razorpay script | Check internet connection |
| `BAD_REQUEST_ERROR` | Invalid parameters | Verify amount and config |
| `PAYMENT_DECLINED` | Bank declined payment | Try different payment method |
| `NETWORK_ERROR` | Connection timeout | Retry payment |

### Error Recovery

```typescript
const { paymentStatus, paymentDetails } = useRazorpay();

if (paymentStatus === 'failure') {
  // Log error for debugging
  console.error('Payment failed:', paymentDetails);
  
  // Show user-friendly message
  // Provide retry option
  // Offer alternative payment methods
}
```

## Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 11+
- ✅ Edge 79+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements:**
- JavaScript enabled
- localStorage available
- Secure context (HTTPS)

## Troubleshooting

### Payment Not Starting

1. Check console for errors
2. Verify `VITE_RAZORPAY_KEY_ID` is set
3. Ensure internet connection
4. Check browser console network tab

### Script Load Failure

```typescript
// Script loader handles retries automatically
// If persistent, check:
// - CDN accessibility
// - Firewall/proxy settings
// - Browser extensions blocking scripts
```

### Amount Validation Errors

```typescript
// Amount must be > 0
// Amount in rupees, converted to paise automatically
initRazorpayCheckout(499.99); // ✅ Correct
initRazorpayCheckout(0);      // ❌ Error
initRazorpayCheckout(-100);   // ❌ Error
```

## Support

For Razorpay-specific issues:
- **Documentation:** https://razorpay.com/docs/
- **Support:** https://razorpay.com/support/
- **Dashboard:** https://dashboard.razorpay.com/

For integration issues:
- Check `RAZORPAY_DOCUMENTATION.md`
- Review `src/context/RazorpayContext.tsx`
- Check browser console for errors

---

**Built with security, accessibility, and user experience in mind.**


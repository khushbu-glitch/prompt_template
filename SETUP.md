# Quick Setup Guide

## Immediate Start (Using Mock Data)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:3000`

The app will automatically use mock product data - no API configuration needed!

## Using Real Shopify Data & Razorpay (Optional)

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your credentials to `.env`:**
   ```env
   # Shopify (Optional - uses mock data if not set)
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
   
   # Razorpay (Optional - uses mock payment if not set)
   VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here
   ```

3. **Get Razorpay API Keys:**
   - Sign up at https://razorpay.com
   - Go to Dashboard > Settings > API Keys
   - Use Test Key (`rzp_test_`) for development

4. **Restart the dev server:**
   ```bash
   npm run dev
   ```

## Key Features Implemented

### ✅ Required Functions

- **`fetchProducts()`** - Located in `src/api/shopify.ts`
  - Fetches from Shopify Storefront API
  - Auto-fallback to mock data
  - Full error handling
  
- **`renderProductGrid()`** - Located in `src/components/ProductGrid.tsx`
  - Renders responsive product grid
  - Accessible HTML structure
  - Handles empty states

- **`addToCart(product, quantity)`** - Located in `src/context/CartContext.tsx`
  - Adds products to shopping cart
  - Validates availability
  - Persists to localStorage

- **`getCartTotal()`** - Located in `src/context/CartContext.tsx`
  - Returns total cart price
  - Auto-updates on changes
  - Type-safe

- **`initRazorpayCheckout(amount, currency, config)`** - Located in `src/context/RazorpayContext.tsx`
  - Launches Razorpay payment
  - Mock mode if not configured
  - Full error handling

- **`handlePaymentSuccess(response)`** - Located in `src/context/RazorpayContext.tsx`
  - Processes successful payments
  - Updates order status
  - Clears cart

- **`handlePaymentFailure(error)`** - Located in `src/context/RazorpayContext.tsx`
  - Handles payment failures
  - Provides retry option
  - User-friendly errors

### ✅ Production-Ready Features

- **Secure API Key Handling** - Environment variables only
- **Loading States** - User-friendly loading spinner
- **Error Handling** - Graceful error messages with retry
- **Accessibility** - WCAG 2.1 compliant, ARIA attributes
- **Clean Structure** - Organized components and utilities
- **Mock Data** - 6 realistic products with images
- **Mock Payments** - Test checkout without real payment setup
- **TypeScript** - Full type safety
- **Responsive Design** - Works on mobile, tablet, desktop
- **Payment Gateway** - Razorpay Standard Checkout integration

## File Structure

```
src/
├── api/shopify.ts              ← fetchProducts() here
├── components/
│   ├── ProductGrid.tsx         ← renderProductGrid() here
│   ├── ProductCard.tsx
│   ├── Cart.tsx                ← Shopping cart UI
│   ├── CartIcon.tsx            ← Cart icon with badge
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── context/
│   └── CartContext.tsx         ← addToCart(), getCartTotal()
├── types/
│   ├── shopify.ts
│   └── cart.ts
├── utils/mockData.ts
└── App.tsx
```

## Shopping Cart Features

### How to Use

1. **Add Items**: Click "Add to Cart" on any product card
2. **View Cart**: Click the cart icon (🛒) in the header
3. **Adjust Quantities**: Use +/- buttons or type directly
4. **Remove Items**: Click the trash icon 🗑️
5. **Clear All**: Click "Clear Cart" button
6. **Close Cart**: Click X, backdrop, or press Escape
7. **Persistence**: Cart saves automatically to localStorage

### Available Functions

```typescript
import { useCart } from './context/CartContext';

const {
  cart,              // Current cart state
  addToCart,         // Add product to cart
  removeFromCart,    // Remove item from cart
  updateQuantity,    // Update item quantity
  clearCart,         // Clear all items
  getCartTotal,      // Get total price
  getItemCount       // Get total item count
} = useCart();
```

**📖 See [CART_DOCUMENTATION.md](CART_DOCUMENTATION.md) for complete cart documentation**

**📖 See [RAZORPAY_DOCUMENTATION.md](RAZORPAY_DOCUMENTATION.md) for payment integration guide**

## Accessibility Testing

Test keyboard navigation:
- Press `Tab` to navigate between products
- Press `Enter` to interact with buttons
- Screen readers will announce product information

## Need Help?

See the main [README.md](README.md) for detailed documentation.


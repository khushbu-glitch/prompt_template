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

## Using Real Shopify Data (Optional)

1. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

2. **Add your Shopify credentials to `.env`:**
   ```env
   VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
   VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_token_here
   ```

3. **Restart the dev server:**
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

### ✅ Production-Ready Features

- **Secure API Key Handling** - Environment variables only
- **Loading States** - User-friendly loading spinner
- **Error Handling** - Graceful error messages with retry
- **Accessibility** - WCAG 2.1 compliant, ARIA attributes
- **Clean Structure** - Organized components and utilities
- **Mock Data** - 6 realistic products with images
- **TypeScript** - Full type safety
- **Responsive Design** - Works on mobile, tablet, desktop

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

## Accessibility Testing

Test keyboard navigation:
- Press `Tab` to navigate between products
- Press `Enter` to interact with buttons
- Screen readers will announce product information

## Need Help?

See the main [README.md](README.md) for detailed documentation.


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
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── types/shopify.ts
├── utils/mockData.ts
└── App.tsx
```

## Accessibility Testing

Test keyboard navigation:
- Press `Tab` to navigate between products
- Press `Enter` to interact with buttons
- Screen readers will announce product information

## Need Help?

See the main [README.md](README.md) for detailed documentation.


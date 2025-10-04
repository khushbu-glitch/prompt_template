# Shopify Storefront App

A production-ready React TypeScript storefront application using the Shopify Storefront API with comprehensive accessibility support, error handling, and modern UI design.

## Features

- ✅ **React 18 + TypeScript** - Type-safe development with latest React features
- ✅ **Shopify Storefront API Integration** - Seamless product fetching with GraphQL
- ✅ **Shopping Cart** - Full-featured cart with add/remove, quantities, and localStorage persistence
- ✅ **Mock Data Fallback** - Automatic fallback to mock data when API is unavailable
- ✅ **Secure API Key Handling** - Environment variable-based configuration
- ✅ **Loading States** - User-friendly loading indicators
- ✅ **Error Handling** - Comprehensive error handling with retry functionality
- ✅ **Accessibility (A11y)** - WCAG 2.1 compliant with ARIA attributes
- ✅ **Responsive Design** - Mobile-first approach, works on all devices
- ✅ **Modern UI** - Clean, professional design with smooth animations
- ✅ **Production Ready** - Optimized build with Vite

## Project Structure

```
shopify-storefront-app/
├── src/
│   ├── api/
│   │   └── shopify.ts           # API integration and fetchProducts()
│   ├── components/
│   │   ├── ProductGrid.tsx      # Main grid with renderProductGrid()
│   │   ├── ProductCard.tsx      # Individual product display
│   │   ├── Cart.tsx             # Shopping cart panel
│   │   ├── CartIcon.tsx         # Cart icon with badge
│   │   ├── LoadingSpinner.tsx   # Loading state component
│   │   └── ErrorMessage.tsx     # Error state component
│   ├── context/
│   │   └── CartContext.tsx      # Cart state (addToCart, getCartTotal)
│   ├── types/
│   │   ├── shopify.ts           # TypeScript interfaces
│   │   └── cart.ts              # Cart type definitions
│   ├── utils/
│   │   └── mockData.ts          # Mock product data
│   ├── App.tsx                  # Main application component
│   ├── App.css                  # Application styles
│   ├── main.tsx                 # Application entry point
│   └── index.css                # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── CART_DOCUMENTATION.md        # Shopping cart documentation
└── .env.example                 # Example environment variables
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- A Shopify store with Storefront API access (optional - app works with mock data)

### Installation

1. **Clone or download the project**

```bash
cd shopify-storefront-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables (optional)**

Copy `.env.example` to `.env` and add your Shopify credentials:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
VITE_SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
VITE_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token_here
```

**Note:** If you don't configure the API credentials, the app will automatically use mock data.

### Getting Shopify API Credentials

1. Go to your Shopify Admin dashboard
2. Navigate to **Settings** → **Apps and sales channels** → **Develop apps**
3. Click **Create an app**
4. Configure **Storefront API** scopes (enable product read access)
5. Install the app to your store
6. Copy the **Storefront Access Token** and **Store Domain**

### Running the Application

**Development mode:**

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

**Production build:**

```bash
npm run build
npm run preview
```

## Core Functions

### `fetchProducts()`

Located in `src/api/shopify.ts`, this function:

- Fetches products from Shopify Storefront API using GraphQL
- Automatically falls back to mock data if API is not configured
- Handles errors gracefully with proper error messages
- Supports pagination and filtering parameters
- Returns type-safe product data

**Usage:**

```typescript
import { fetchProducts } from './api/shopify';

const products = await fetchProducts({ 
  first: 10,
  query: 'title:*search*'
});
```

### `renderProductGrid()`

Located in `src/components/ProductGrid.tsx`, this function:

- Renders products in a responsive grid layout
- Handles empty states
- Includes proper ARIA attributes for accessibility
- Returns semantic HTML with role attributes

### `addToCart(product, quantity)`

Located in `src/context/CartContext.tsx`, this function:

- Adds products to the shopping cart
- Validates product availability
- Updates quantity if product already exists
- Persists cart to localStorage
- Announces changes to screen readers

**Usage:**

```typescript
import { useCart } from './context/CartContext';

const { addToCart } = useCart();
addToCart(product, 1);
```

### `getCartTotal()`

Located in `src/context/CartContext.tsx`, this function:

- Returns the total price of all cart items
- Automatically updates on cart changes
- Type-safe return value

**Usage:**

```typescript
import { useCart } from './context/CartContext';

const { getCartTotal } = useCart();
const total = getCartTotal(); // Returns number
```

> **📖 See [CART_DOCUMENTATION.md](CART_DOCUMENTATION.md) for complete shopping cart documentation**

## Accessibility Features

This application follows WCAG 2.1 Level AA guidelines:

- ✅ **Semantic HTML** - Proper use of header, main, footer, article tags
- ✅ **ARIA Labels** - Descriptive labels for interactive elements
- ✅ **Keyboard Navigation** - Full keyboard support with visible focus indicators
- ✅ **Screen Reader Support** - Role attributes and live regions
- ✅ **Color Contrast** - AA compliant color ratios
- ✅ **Responsive Text** - Readable font sizes and line heights
- ✅ **Reduced Motion** - Respects `prefers-reduced-motion` setting
- ✅ **Alt Text** - All images have descriptive alternative text

## Security Considerations

- ✅ Environment variables for sensitive data
- ✅ No hardcoded API keys in source code
- ✅ `.gitignore` configured to exclude `.env` files
- ✅ Secure API communication over HTTPS
- ✅ Input validation and sanitization
- ✅ TypeScript for type safety

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Shopify Storefront API** - Product data source
- **CSS3** - Styling with CSS custom properties
- **GraphQL** - API query language

## Browser Support

- Chrome (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Edge (last 2 versions)

## Performance Optimizations

- ✅ Lazy loading images
- ✅ Optimized bundle size with Vite
- ✅ CSS custom properties for theming
- ✅ Minimal dependencies
- ✅ Efficient re-rendering with React

## Development

**Linting:**

```bash
npm run lint
```

**Type checking:**

```bash
npx tsc --noEmit
```

## Deployment

### Vercel

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm run build
# Deploy the 'dist' folder
```

### Other Platforms

Build the project and deploy the `dist` folder:

```bash
npm run build
```

**Important:** Configure environment variables in your hosting platform's dashboard.

## Troubleshooting

### Products not loading

1. Check if `.env` file exists and contains valid credentials
2. Verify Shopify Storefront API is enabled
3. Check browser console for error messages
4. The app will automatically fall back to mock data if API fails

### TypeScript errors

```bash
npm run build
```

This will show any TypeScript compilation errors.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Check the troubleshooting section
- Review the code comments
- Open an issue on GitHub

## Changelog

### Version 1.0.0
- Initial release
- Shopify Storefront API integration
- Mock data support
- Accessibility features
- Responsive design
- Error handling and loading states

---

Built with ❤️ using React and TypeScript


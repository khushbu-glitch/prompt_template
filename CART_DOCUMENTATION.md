# Shopping Cart Documentation

## Overview

The shopping cart system provides a complete e-commerce cart experience with TypeScript type safety, React Context for state management, localStorage persistence, and full accessibility support.

## Core Functions

### `addToCart(product, quantity)`

**Location:** `src/context/CartContext.tsx`

Adds a product to the shopping cart with the specified quantity.

**Parameters:**
- `product: ShopifyProduct` - The product to add
- `quantity: number` (optional, default: 1) - Number of items to add

**Features:**
- ✅ Validates product availability
- ✅ Prevents adding unavailable products
- ✅ Updates quantity if product already in cart
- ✅ Automatically calculates totals
- ✅ Announces changes to screen readers
- ✅ Persists to localStorage

**Example:**
```typescript
import { useCart } from './context/CartContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  
  const handleClick = () => {
    addToCart(product, 1);
  };
  
  return <button onClick={handleClick}>Add to Cart</button>;
}
```

### `getCartTotal()`

**Location:** `src/context/CartContext.tsx`

Returns the total price of all items in the cart.

**Returns:** `number` - Total cart value

**Features:**
- ✅ Calculates sum of (price × quantity) for all items
- ✅ Updates automatically when cart changes
- ✅ Type-safe return value

**Example:**
```typescript
import { useCart } from './context/CartContext';

function CartTotal() {
  const { getCartTotal } = useCart();
  const total = getCartTotal();
  
  return <div>Total: ${total.toFixed(2)}</div>;
}
```

## Additional Cart Functions

### `removeFromCart(itemId)`

Removes a specific item from the cart by its ID.

**Parameters:**
- `itemId: string` - Unique identifier of the cart item

**Example:**
```typescript
const { removeFromCart } = useCart();
removeFromCart('item-id-123');
```

### `updateQuantity(itemId, quantity)`

Updates the quantity of a cart item.

**Parameters:**
- `itemId: string` - Item to update
- `quantity: number` - New quantity (if 0 or less, removes item)

**Example:**
```typescript
const { updateQuantity } = useCart();
updateQuantity('item-id-123', 5);
```

### `clearCart()`

Removes all items from the cart.

**Example:**
```typescript
const { clearCart } = useCart();
clearCart();
```

### `getItemCount()`

Returns the total number of items in the cart (sum of all quantities).

**Returns:** `number` - Total item count

**Example:**
```typescript
const { getItemCount } = useCart();
const count = getItemCount(); // e.g., 7 items
```

## Cart State Structure

```typescript
interface Cart {
  items: CartItem[];
  itemCount: number;    // Total quantity of all items
  subtotal: number;     // Total price
}

interface CartItem {
  id: string;           // Unique cart item ID
  product: ShopifyProduct;
  quantity: number;
  variantId: string;
  price: number;        // Unit price
}
```

## Components

### CartProvider

Wraps the application to provide cart context to all components.

**Location:** `src/context/CartContext.tsx`

**Usage:**
```typescript
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <CartProvider>
      {/* Your app components */}
    </CartProvider>
  );
}
```

### Cart

Main cart UI component displaying cart items, quantities, and total.

**Location:** `src/components/Cart.tsx`

**Features:**
- ✅ Slide-in panel from right
- ✅ Backdrop overlay
- ✅ Item list with thumbnails
- ✅ Quantity controls (+/- buttons and input)
- ✅ Remove item buttons
- ✅ Clear cart button
- ✅ Total calculation
- ✅ Empty state
- ✅ Keyboard navigation (Escape to close)
- ✅ Body scroll lock when open
- ✅ Full ARIA attributes

**Props:**
- `isOpen: boolean` - Controls visibility
- `onClose: () => void` - Close callback

### CartIcon

Shopping cart icon with item count badge.

**Location:** `src/components/CartIcon.tsx`

**Features:**
- ✅ SVG cart icon
- ✅ Dynamic item count badge
- ✅ Accessible button with ARIA label
- ✅ Hover and click animations

**Props:**
- `onClick: () => void` - Click handler to open cart

## Accessibility Features

### ARIA Attributes

- ✅ `role="dialog"` and `aria-modal="true"` on cart panel
- ✅ `aria-labelledby` for cart title
- ✅ `aria-label` on all interactive elements
- ✅ `aria-live="polite"` for status announcements
- ✅ `role="list"` and `role="listitem"` for cart items

### Keyboard Navigation

- ✅ **Tab** - Navigate between interactive elements
- ✅ **Escape** - Close cart panel
- ✅ **Enter/Space** - Activate buttons
- ✅ Visible focus indicators on all controls

### Screen Reader Support

- ✅ Announces when items are added to cart
- ✅ Announces quantity changes
- ✅ Announces when cart is cleared
- ✅ Descriptive labels on all controls
- ✅ Live regions for dynamic updates

### Visual Feedback

- ✅ Button text changes to "✓ Added!" when item added
- ✅ Green background animation on successful add
- ✅ Badge shows item count
- ✅ Clear empty state messaging

## LocalStorage Persistence

Cart data automatically persists to localStorage:

- ✅ Saved on every cart change
- ✅ Loaded on app initialization
- ✅ Survives page refreshes
- ✅ Storage key: `shopify-cart`

**Data Structure:**
```json
{
  "items": [...],
  "itemCount": 5,
  "subtotal": 399.95
}
```

## Clean Cart Logic

### Validation

- ✅ Cannot add unavailable products
- ✅ Cannot add zero or negative quantities
- ✅ Quantity limited to positive numbers
- ✅ Automatic removal when quantity reaches 0

### State Management

- ✅ Centralized cart state via Context API
- ✅ Immutable state updates
- ✅ Automatic total recalculation
- ✅ Type-safe operations

### Error Handling

- ✅ Console warnings for invalid operations
- ✅ Graceful localStorage error handling
- ✅ Fallback for missing data

## Usage Example

```typescript
import React from 'react';
import { useCart } from './context/CartContext';

function MyComponent() {
  const { 
    cart, 
    addToCart, 
    removeFromCart, 
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount 
  } = useCart();

  // Add product to cart
  const handleAdd = (product) => {
    addToCart(product, 1);
  };

  // Get total
  const total = getCartTotal();
  
  // Get item count
  const itemCount = getItemCount();

  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Total: ${total.toFixed(2)}</p>
      <button onClick={() => clearCart()}>Clear Cart</button>
    </div>
  );
}
```

## Testing the Cart

1. **Add Items**: Click "Add to Cart" on product cards
2. **Open Cart**: Click the cart icon in the header
3. **Adjust Quantities**: Use +/- buttons or type in input
4. **Remove Items**: Click the trash icon 🗑️
5. **Clear Cart**: Click "Clear Cart" button
6. **Close Cart**: Click X or backdrop or press Escape
7. **Refresh Page**: Cart persists across page reloads

## Responsive Design

- ✅ **Desktop**: 450px wide slide-in panel
- ✅ **Tablet**: Full-width cart panel
- ✅ **Mobile**: Optimized layout with smaller images

## Styling

All cart styles are in `src/App.css` under the "SHOPPING CART STYLES" section.

### Customizable CSS Variables

```css
--color-primary: #2563eb;        /* Cart buttons */
--color-success: #10b981;        /* Added state */
--color-error: #ef4444;          /* Badges & remove */
--transition-fast: 150ms;        /* Animations */
--transition-normal: 250ms;      /* Slide animations */
```

## Browser Compatibility

- ✅ Chrome, Firefox, Safari, Edge (modern versions)
- ✅ localStorage API support required
- ✅ CSS Grid and Flexbox support required

## Future Enhancements

Potential features to add:

- [ ] Product variants selection
- [ ] Cart quantity limits per product
- [ ] Discount codes
- [ ] Shipping calculator
- [ ] Tax calculation
- [ ] Save cart to user account
- [ ] Cart expiration
- [ ] Recently removed items
- [ ] Recommendations in cart

---

**Built with accessibility, TypeScript safety, and clean code principles.**


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Cart, CartItem, CartContextType } from '../types/cart';
import { ShopifyProduct } from '../types/shopify';

const CART_STORAGE_KEY = 'shopify-cart';

/**
 * Initial cart state
 */
const initialCart: Cart = {
  items: [],
  itemCount: 0,
  subtotal: 0,
};

/**
 * Cart Context
 */
const CartContext = createContext<CartContextType | undefined>(undefined);

/**
 * Cart Provider Component
 * Manages shopping cart state and provides cart operations
 */
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Cart>(initialCart);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart]);

  /**
   * Calculate cart totals
   */
  const calculateTotals = useCallback((items: CartItem[]): { itemCount: number; subtotal: number } => {
    const itemCount = items.reduce((total, item) => total + item.quantity, 0);
    const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
    return { itemCount, subtotal };
  }, []);

  /**
   * Add product to cart
   * @param product - Product to add
   * @param quantity - Quantity to add (default: 1)
   */
  const addToCart = useCallback(
    (product: ShopifyProduct, quantity: number = 1) => {
      if (quantity <= 0) {
        console.warn('Cannot add zero or negative quantity to cart');
        return;
      }

      if (!product.availableForSale) {
        console.warn('Cannot add unavailable product to cart');
        return;
      }

      setCart((prevCart) => {
        const existingItemIndex = prevCart.items.findIndex(
          (item) => item.product.id === product.id
        );

        let newItems: CartItem[];

        if (existingItemIndex > -1) {
          // Update existing item quantity
          newItems = prevCart.items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + quantity }
              : item
          );
        } else {
          // Add new item to cart
          const newItem: CartItem = {
            id: `${product.id}-${Date.now()}`,
            product,
            quantity,
            variantId: product.variants.edges[0]?.node.id || '',
            price: parseFloat(product.priceRange.minVariantPrice.amount),
          };
          newItems = [...prevCart.items, newItem];
        }

        const totals = calculateTotals(newItems);

        return {
          items: newItems,
          ...totals,
        };
      });

      // Announce to screen readers
      announceToScreenReader(`Added ${product.title} to cart`);
    },
    [calculateTotals]
  );

  /**
   * Remove item from cart
   * @param itemId - ID of cart item to remove
   */
  const removeFromCart = useCallback(
    (itemId: string) => {
      setCart((prevCart) => {
        const newItems = prevCart.items.filter((item) => item.id !== itemId);
        const totals = calculateTotals(newItems);

        return {
          items: newItems,
          ...totals,
        };
      });

      announceToScreenReader('Item removed from cart');
    },
    [calculateTotals]
  );

  /**
   * Update item quantity
   * @param itemId - ID of cart item
   * @param quantity - New quantity
   */
  const updateQuantity = useCallback(
    (itemId: string, quantity: number) => {
      if (quantity <= 0) {
        removeFromCart(itemId);
        return;
      }

      setCart((prevCart) => {
        const newItems = prevCart.items.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        );
        const totals = calculateTotals(newItems);

        return {
          items: newItems,
          ...totals,
        };
      });

      announceToScreenReader('Cart quantity updated');
    },
    [calculateTotals, removeFromCart]
  );

  /**
   * Clear all items from cart
   */
  const clearCart = useCallback(() => {
    setCart(initialCart);
    announceToScreenReader('Cart cleared');
  }, []);

  /**
   * Get cart total
   * @returns Total price of all items in cart
   */
  const getCartTotal = useCallback((): number => {
    return cart.subtotal;
  }, [cart.subtotal]);

  /**
   * Get total number of items in cart
   * @returns Total item count
   */
  const getItemCount = useCallback((): number => {
    return cart.itemCount;
  }, [cart.itemCount]);

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getItemCount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

/**
 * Custom hook to use cart context
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

/**
 * Helper function to announce messages to screen readers
 */
function announceToScreenReader(message: string): void {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', 'polite');
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  document.body.appendChild(announcement);

  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}


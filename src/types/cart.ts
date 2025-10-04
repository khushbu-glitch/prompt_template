/**
 * TypeScript interfaces for shopping cart functionality
 */

import { ShopifyProduct } from './shopify';

export interface CartItem {
  id: string;
  product: ShopifyProduct;
  quantity: number;
  variantId: string;
  price: number;
}

export interface Cart {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
}

export interface CartContextType {
  cart: Cart;
  addToCart: (product: ShopifyProduct, quantity?: number) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
}


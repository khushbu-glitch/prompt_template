import React, { createContext, useState, ReactNode } from 'react';
import { CartItem } from '../types/cart';
import { Product } from '../types/product';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  getCartTotal: () => string;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const itemInCart = prevItems.find((item) => item.id === product.id);
      if (itemInCart) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const getCartTotal = () => {
    return cartItems
      .reduce((total, item) => total + parseFloat(item.priceRange.minVariantPrice.amount) * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

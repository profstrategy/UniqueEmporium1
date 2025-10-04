"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { Product } from "@/components/products/ProductCard.tsx";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  onOpenCartDrawer?: () => void; // New prop to open the cart drawer
}

export const CartProvider = ({ children, onOpenCartDrawer }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const isMobile = useIsMobile();

  const addToCart = useCallback((product: Product, quantityToAdd: number = 1) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantityToAdd;
        toast.success(`${quantityToAdd} x ${product.name} added to cart!`, {
          description: `Current quantity: ${updatedItems[existingItemIndex].quantity}`,
        });
        return updatedItems;
      } else {
        toast.success(`${quantityToAdd} x ${product.name} added to cart!`);
        return [...prevItems, { ...product, quantity: quantityToAdd }];
      }
    });

    // Automatically open cart drawer on desktop after adding an item
    if (!isMobile && onOpenCartDrawer) {
      onOpenCartDrawer();
    }
  }, [isMobile, onOpenCartDrawer]); // Add onOpenCartDrawer to dependencies

  const removeFromCart = useCallback((productId: string) => {
    setCartItems((prevItems) => {
      const removedItem = prevItems.find(item => item.id === productId);
      if (removedItem) {
        toast.info(`${removedItem.name} removed from cart.`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    toast.info("Your cart has been cleared.");
  }, []);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
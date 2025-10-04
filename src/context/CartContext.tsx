"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cart: CartItem[];
  cartItems: CartItem[]; // Add this for backward compatibility
  addToCart: (product: Product | CartItem) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  totalItems: number; // Add this property
  getTotalPrice: () => number;
  totalPrice: number; // Add this property
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  const { toast } = useToast();

  React.useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product | CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        // If item exists, update quantity
        return prevCart.map(item =>
          item.id === product.id 
            ? { ...item, quantity: item.quantity + (("quantity" in product ? product.quantity : 1)) } 
            : item
        );
      } else {
        // If new item, add to cart with quantity
        const quantity = "quantity" in product ? product.quantity : 1;
        return [...prevCart, { ...product, quantity }];
      }
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart =>
      prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Calculate derived values
  const totalItems = getTotalItems();
  const totalPrice = getTotalPrice();

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems: cart, // For backward compatibility
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        totalItems, // Expose totalItems
        getTotalPrice,
        totalPrice, // Expose totalPrice
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
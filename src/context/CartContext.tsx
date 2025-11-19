"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback, useEffect } from "react";
import { Product } from "@/components/products/ProductCard.tsx";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "./AuthContext.tsx"; // Import useAuth
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

export interface CartItem extends Product {
  quantity: number;
  unitPrice: number;
}

// Define the structure for the database table 'cart_items'
interface CartItemDB {
  id?: string; // Optional for inserts
  user_id: string;
  product_id: string;
  product_data: Product; // Store the full product object
  quantity: number;
  unit_price: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  isLoadingCart: boolean; // New loading state
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
  onOpenCartDrawer?: () => void;
}

export const CartProvider = ({ children, onOpenCartDrawer }: CartProviderProps) => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoadingCart, setIsLoadingCart] = useState(true); // New loading state
  const isMobile = useIsMobile();

  // Function to fetch cart items from Supabase
  const fetchCart = useCallback(async (userId: string) => {
    setIsLoadingCart(true);
    const { data, error } = await supabase
      .from('cart_items')
      .select('id, product_id, product_data, quantity, unit_price')
      .eq('user_id', userId);

    if (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to load cart items.");
      setCartItems([]);
    } else {
      const items: CartItem[] = data.map(item => ({
        ...item.product_data as Product, // Spread product_data
        id: item.product_id, // Ensure product_id is used as the main ID for the CartItem
        quantity: item.quantity,
        unitPrice: item.unit_price,
      }));
      setCartItems(items);
    }
    setIsLoadingCart(false);
  }, []);

  // Effect to load cart when user changes or on initial load
  useEffect(() => {
    if (!isLoadingAuth) {
      if (user) {
        fetchCart(user.id);
      } else {
        // Clear cart if user logs out or is not authenticated
        setCartItems([]);
        setIsLoadingCart(false);
      }
    }
  }, [user, isLoadingAuth, fetchCart]);

  const addToCart = useCallback(async (product: Product, quantityToAdd: number = product.minOrderQuantity) => {
    if (!user) {
      toast.error("Please sign in to add items to your cart.");
      return;
    }

    const actualQuantityToAdd = Math.max(product.minOrderQuantity, quantityToAdd);
    const unitPrice = product.price / product.minOrderQuantity;

    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id);

      if (existingItemIndex > -1) {
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += actualQuantityToAdd;
        toast.success(`${actualQuantityToAdd} x ${product.name} added to cart!`, {
          description: `Current quantity: ${updatedItems[existingItemIndex].quantity}`,
        });
        return updatedItems;
      } else {
        toast.success(`${actualQuantityToAdd} x ${product.name} added to cart!`);
        return [...prevItems, { ...product, quantity: actualQuantityToAdd, unitPrice }];
      }
    });

    // Persist to Supabase
    const { error } = await supabase.from('cart_items').upsert(
      {
        user_id: user.id,
        product_id: product.id,
        product_data: product,
        quantity: actualQuantityToAdd,
        unit_price: unitPrice,
      },
      { onConflict: 'user_id, product_id' } // Conflict on user_id and product_id to update quantity
    );

    if (error) {
      console.error("Error adding/updating cart item in DB:", error);
      toast.error("Failed to update cart in database.");
      // Optionally, revert local state if DB update fails
    }

    if (!isMobile && onOpenCartDrawer) {
      onOpenCartDrawer();
    }
  }, [isMobile, onOpenCartDrawer, user]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (!user) return;

    const removedItem = cartItems.find(item => item.id === productId);

    setCartItems((prevItems) => {
      if (removedItem) {
        toast.info(`${removedItem.name} removed from cart.`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });

    // Persist to Supabase
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error("Error removing cart item from DB:", error);
      toast.error("Failed to remove item from cart in database.");
      // Optionally, revert local state if DB update fails
    }
  }, [cartItems, user]);

  const updateQuantity = useCallback(async (productId: string, newQuantity: number) => {
    if (!user) return;

    const itemToUpdate = cartItems.find((item) => item.id === productId);
    if (!itemToUpdate) return;

    let finalQuantity = Math.max(itemToUpdate.minOrderQuantity, newQuantity);
    if (finalQuantity % itemToUpdate.minOrderQuantity !== 0) {
      finalQuantity = Math.ceil(finalQuantity / itemToUpdate.minOrderQuantity) * itemToUpdate.minOrderQuantity;
    }

    if (finalQuantity <= 0) {
      // If quantity becomes 0 or less, remove the item
      removeFromCart(productId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: finalQuantity } : item,
      ),
    );

    // Persist to Supabase
    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: finalQuantity })
      .eq('user_id', user.id)
      .eq('product_id', productId);

    if (error) {
      console.error("Error updating cart item quantity in DB:", error);
      toast.error("Failed to update item quantity in database.");
      // Optionally, revert local state if DB update fails
    }
  }, [cartItems, removeFromCart, user]);

  const clearCart = useCallback(async () => {
    if (!user) return;

    setCartItems([]);
    toast.info("Your cart has been cleared.");

    // Persist to Supabase
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      console.error("Error clearing cart in DB:", error);
      toast.error("Failed to clear cart in database.");
      // Optionally, revert local state if DB update fails
    }
  }, [user]);

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

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
        isLoadingCart,
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
"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { Product } from "@/components/products/ProductCard.tsx";
import { toast } from "sonner";

interface FavoritesContextType {
  favoriteItems: Product[];
  addFavorite: (product: Product) => void;
  removeFavorite: (productId: string) => void;
  isFavorited: (productId: string) => boolean;
  totalFavorites: number;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteItems, setFavoriteItems] = useState<Product[]>([]);

  const addFavorite = useCallback((product: Product) => {
    setFavoriteItems((prevItems) => {
      if (!prevItems.some((item) => item.id === product.id)) {
        toast.success(`${product.name} added to your favorites!`);
        return [...prevItems, product];
      }
      return prevItems;
    });
  }, []);

  const removeFavorite = useCallback((productId: string) => {
    setFavoriteItems((prevItems) => {
      const removedItem = prevItems.find(item => item.id === productId);
      if (removedItem) {
        toast.info(`${removedItem.name} removed from favorites.`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  }, []);

  const isFavorited = useCallback((productId: string) => {
    return favoriteItems.some((item) => item.id === productId);
  }, [favoriteItems]);

  const totalFavorites = favoriteItems.length;

  return (
    <FavoritesContext.Provider
      value={{
        favoriteItems,
        addFavorite,
        removeFavorite,
        isFavorited,
        totalFavorites,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};
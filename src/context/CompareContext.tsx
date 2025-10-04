"use client";

import React, { createContext, useState, useContext, ReactNode, useCallback } from "react";
import { Product } from "@/components/products/ProductCard.tsx";
import { toast } from "sonner";

interface CompareContextType {
  compareItems: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInComparison: (productId: string) => boolean;
  totalCompareItems: number;
  COMPARE_LIMIT: number;
}

const COMPARE_LIMIT = 3; // Maximum number of products to compare

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export const CompareProvider = ({ children }: { children: ReactNode }) => {
  const [compareItems, setCompareItems] = useState<Product[]>([]);

  const addToCompare = useCallback((product: Product) => {
    setCompareItems((prevItems) => {
      if (prevItems.some((item) => item.id === product.id)) {
        toast.info(`${product.name} is already in your comparison list.`);
        return prevItems;
      }
      if (prevItems.length >= COMPARE_LIMIT) {
        toast.warning(`You can compare up to ${COMPARE_LIMIT} products. Remove an item to add another.`, {
          duration: 3000,
        });
        return prevItems;
      }
      toast.success(`${product.name} added to comparison.`);
      return [...prevItems, product];
    });
  }, []);

  const removeFromCompare = useCallback((productId: string) => {
    setCompareItems((prevItems) => {
      const removedItem = prevItems.find(item => item.id === productId);
      if (removedItem) {
        toast.info(`${removedItem.name} removed from comparison.`);
      }
      return prevItems.filter((item) => item.id !== productId);
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareItems([]);
    toast.info("Comparison list cleared.");
  }, []);

  const isInComparison = useCallback((productId: string) => {
    return compareItems.some((item) => item.id === productId);
  }, [compareItems]);

  const totalCompareItems = compareItems.length;

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInComparison,
        totalCompareItems,
        COMPARE_LIMIT,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
};
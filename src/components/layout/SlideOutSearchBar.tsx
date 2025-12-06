"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X, Loader2 } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Product } from "@/data/products";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { cn } from "@/lib/utils";
import { fetchProductsFromSupabase } from "@/integrations/supabase/products";
import { getOptimizedImageUrl } from "@/lib/utils"; // NEW: Import getOptimizedImageUrl

interface SlideOutSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

const SlideOutSearchBar = ({ isOpen, onClose }: SlideOutSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [allLiveProducts, setAllLiveProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAllProducts = async () => {
      const products = await fetchProductsFromSupabase();
      setAllLiveProducts(products);
    };
    loadAllProducts();
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setSearchQuery(searchParams.get("query") || "");

      const handleClickOutside = (event: MouseEvent) => {
        if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
          onClose();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    } else {
      setSuggestions([]);
    }
  }, [isOpen, searchParams, onClose]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.trim().length > 1) {
        setIsLoadingSuggestions(true);
        await new Promise(resolve => setTimeout(resolve, 300)); 
        const filtered = allLiveProducts.filter(product =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
        setSuggestions(filtered);
        setIsLoadingSuggestions(false);
      } else {
        setSuggestions([]);
        setIsLoadingSuggestions(false);
      }
    };

    const handler = setTimeout(() => {
      fetchSuggestions();
    }, 200);

    return () => {
      clearTimeout(handler);
      setIsLoadingSuggestions(false);
    };
  }, [searchQuery, allLiveProducts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };

  const handleSuggestionClick = (productId: string) => {
    navigate(`/products/${productId}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={searchBarRef}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="sticky top-16 z-40 w-full overflow-hidden bg-background/95 backdrop-blur-sm border-b border-border"
        >
          <div className="mx-auto flex max-w-7xl flex-col items-center p-4">
            <form onSubmit={handleSearch} className="flex w-full space-x-2">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-9 pr-10 rounded-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button type="submit" className="shrink-0 rounded-full">
                Search
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
                <X className="h-5 w-5" />
              </Button>
            </form>

            {/* Product Suggestions */}
            {(isLoadingSuggestions || suggestions.length > 0 || searchQuery.trim().length > 1) && (
              <div className="w-full max-w-md mt-4 bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
                {isLoadingSuggestions ? (
                  <div className="flex items-center justify-center p-4 text-muted-foreground">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Loading suggestions...
                  </div>
                ) : suggestions.length > 0 ? (
                  <ul className="divide-y divide-border rounded-2xl">
                    {suggestions.map((product) => (
                      <li
                        key={product.id}
                        className="flex items-center p-3 hover:bg-muted/50 cursor-pointer transition-colors rounded-full"
                        onClick={() => handleSuggestionClick(product.id)}
                      >
                        <ImageWithFallback
                          src={getOptimizedImageUrl(product.images[0], 'thumbnail')} // Apply optimization here
                          alt={product.name}
                          containerClassName="h-10 w-10 rounded-full overflow-hidden flex-shrink-0 mr-3"
                          fallbackLogoClassName="h-6 w-6"
                        />
                        <div className="flex-grow">
                          <p className="font-medium text-sm text-foreground line-clamp-1">{product.name}</p>
                          <p className="text-xs text-muted-foreground line-clamp-1">{product.category}</p>
                        </div>
                        <span className="font-semibold text-sm text-primary ml-auto">
                          {product.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : searchQuery.trim().length > 1 ? (
                  <p className="p-4 text-center text-muted-foreground">No suggestions found.</p>
                ) : null}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SlideOutSearchBar;
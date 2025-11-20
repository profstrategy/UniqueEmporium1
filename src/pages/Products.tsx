"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter, X, Search, Loader2, ArrowUpWideNarrow, ArrowDownWideNarrow } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { products as productsData, Product } from "@/data/products";
import { categories as categoriesData } from "@/data/categories";
import { RecommendedProductsSection } from "@/components/recommended-products/RecommendedProductsSection";
import { cn } from "@/lib/utils";

const ProductsPage = () => {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const initialSearch = searchParams.get("search") || "";

  const [category, setCategory] = useState<string>(initialCategory);
  const [searchTerm, setSearchTerm] = useState<string>(initialSearch);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>("default");
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCategory(searchParams.get("category") || "all");
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  useEffect(() => {
    // Simulate data fetching
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); // Simulate network delay
    return () => clearTimeout(timer);
  }, [category, searchTerm, priceRange, minRating, sortBy]);

  const filteredProducts = useMemo(() => {
    let filtered = productsData.filter((product) => product.status === "active");

    if (category !== "all") {
      filtered = filtered.filter((product) => product.category === category);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.fullDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    filtered = filtered.filter(
      (product) => product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    filtered = filtered.filter((product) => product.rating >= minRating);

    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // Default sorting (e.g., by creation date or popularity)
        break;
    }

    return filtered;
  }, [productsData, category, searchTerm, priceRange, minRating, sortBy]);

  const maxPrice = useMemo(() => {
    return Math.max(...productsData.map((p) => p.price), 100000);
  }, [productsData]);

  const productForRecommendationsId = filteredProducts.length > 0 ? filteredProducts[0].id : undefined;
  const recommendedProducts = useMemo(() => {
    if (!productForRecommendationsId) return [];
    return productsData.filter(p => p.id !== productForRecommendationsId).slice(0, 10);
  }, [productForRecommendationsId, productsData]);


  const renderFilters = () => (
    <div className="space-y-6 p-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 rounded-full border focus:border-primary focus:ring-primary"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Category</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="category-all"
              checked={category === "all"}
              onCheckedChange={() => setCategory("all")}
            />
            <Label htmlFor="category-all">All</Label>
          </div>
          {categoriesData.map((cat) => (
            <div key={cat.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${cat.id}`}
                checked={category === cat.id}
                onCheckedChange={() => setCategory(cat.id)}
              />
              <Label htmlFor={`category-${cat.id}`}>{cat.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Price Range</h3>
        <Slider
          min={0}
          max={maxPrice}
          step={1000}
          value={priceRange}
          onValueChange={(val: [number, number]) => setPriceRange(val)}
          className="w-full"
        />
        <div className="flex justify-between text-sm mt-2">
          <span>₦{priceRange[0].toLocaleString()}</span>
          <span>₦{priceRange[1].toLocaleString()}</span>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Minimum Rating</h3>
        <Select value={String(minRating)} onValueChange={(val) => setMinRating(Number(val))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select minimum rating" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any Rating</SelectItem>
            <SelectItem value="4">4 Stars & Up</SelectItem>
            <SelectItem value="3">3 Stars & Up</SelectItem>
            <SelectItem value="2">2 Stars & Up</SelectItem>
            <SelectItem value="1">1 Star & Up</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => {
          setCategory("all");
          setSearchTerm("");
          setPriceRange([0, maxPrice]);
          setMinRating(0);
          setSortBy("default");
        }}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="container py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-bold font-poppins text-center mb-8 text-foreground">
          Our Products
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Desktop Filters */}
          <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block w-full md:w-1/4 lg:w-1/5 sticky top-24 h-fit bg-card p-6 rounded-lg shadow-sm border"
          >
            {renderFilters()}
          </motion.aside>

          {/* Mobile Filters */}
          <div className="md:hidden flex justify-between items-center mb-4 px-4">
            <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full sm:max-w-xs p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="flex items-center justify-between">
                    <span className="text-xl font-bold">Filters</span>
                    <Button variant="ghost" size="icon" onClick={() => setIsFilterSheetOpen(false)}>
                      <X className="h-5 w-5" />
                    </Button>
                  </SheetTitle>
                </SheetHeader>
                {renderFilters()}
              </SheetContent>
            </Sheet>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
                <SelectItem value="rating-desc">Rating</SelectItem>
                <SelectItem value="name-asc">Name: A-Z</SelectItem>
                <SelectItem value="name-desc">Name: Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Product Grid */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="hidden md:flex justify-end mb-6">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating-desc">Rating</SelectItem>
                  <SelectItem value="name-asc">Name: A-Z</SelectItem>
                  <SelectItem value="name-desc">Name: Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
              </div>
            ) : error ? (
              <div className="text-center text-destructive py-12">
                <p>Error loading products: {error}</p>
                <Button onClick={() => setLoading(true)} className="mt-4">
                  Retry
                </Button>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center text-muted-foreground py-12">
                <p>No products found matching your criteria.</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setCategory("all");
                    setSearchTerm("");
                    setPriceRange([0, maxPrice]);
                    setMinRating(0);
                    setSortBy("default");
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
              >
                <AnimatePresence>
                  {filteredProducts.map((product) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </main>
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <RecommendedProductsSection
          title="You might also like"
          products={recommendedProducts}
          loading={false}
          error={null}
          currentProductId={productForRecommendationsId}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProductsPage;
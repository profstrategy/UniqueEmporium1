"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Shirt, Baby, Gem, ShoppingBag, SlidersHorizontal } from "lucide-react"; // Updated icons for fashion
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProducts, ProductDetails, getProductsByIds } from "@/data/products.ts";
import RecommendedProductsSection from "@/components/recommended-products/RecommendedProductsSection.tsx";
import RecentlyViewedProductsSection from "@/components/product-details/RecentlyViewedProductsSection.tsx";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton.tsx";

const allProducts: ProductDetails[] = mockProducts;

const categories = [
  { name: "All Categories", value: "all" },
  { name: "SHEIN Gowns", value: "SHEIN Gowns", icon: Shirt },
  { name: "Vintage Shirts", value: "Vintage Shirts", icon: Shirt },
  { name: "Kids' Jeans", value: "Kids' Jeans", icon: Baby },
  { name: "Luxury Thrift", value: "Luxury Thrift", icon: Gem },
  { name: "Fashion Bundles", value: "Fashion Bundles", icon: ShoppingBag },
];

const sortOptions = [
  { name: "Default", value: "default" },
  { name: "Name (A-Z)", value: "name-asc" },
  { name: "Name (Z-A)", value: "name-desc" },
  { name: "Price (Low to High)", value: "price-asc" },
  { name: "Price (High to Low)", value: "price-desc" },
  { name: "Rating (High to Low)", value: "rating-desc" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const RECENTLY_VIEWED_KEY = "recentlyViewedProducts";

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");
  const [isMobileFilterPanelOpen, setIsMobileFilterPanelOpen] = useState(false);
  const [recentlyViewedProductIds, setRecentlyViewedProductIds] = useState<string[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    setCurrentQuery(initialQuery);
    setSelectedCategory(initialCategory);
    setLoadingProducts(true);
    const timer = setTimeout(() => {
      setLoadingProducts(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [initialQuery, initialCategory]);

  useEffect(() => {
    const storedViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]") as string[];
    setRecentlyViewedProductIds(storedViewed);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuery(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (value === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", value);
    }
    setSearchParams(searchParams);
    setLoadingProducts(true);
    setTimeout(() => setLoadingProducts(false), 800);
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
    setLoadingProducts(true);
    setTimeout(() => setLoadingProducts(false), 800);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuery.trim()) {
      searchParams.set("query", currentQuery.trim());
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
    setLoadingProducts(true);
    setTimeout(() => setLoadingProducts(false), 800);
  };

  const filterAndSortProducts = () => {
    let filtered = allProducts.filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      const matchesQuery = product.name.toLowerCase().includes(currentQuery.toLowerCase());
      return matchesCategory && matchesQuery;
    });

    switch (sortBy) {
      case "name-asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating-desc":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return filtered;
  };

  const displayedProducts = filterAndSortProducts();
  const productForRecommendationsId = displayedProducts[0]?.id || mockProducts[0]?.id;

  const handleClearFilters = () => {
    setCurrentQuery("");
    setSelectedCategory("all");
    setSortBy("default");
    setSearchParams({});
    setIsMobileFilterPanelOpen(false);
    setLoadingProducts(true);
    setTimeout(() => setLoadingProducts(false), 800);
  };

  const actualRecentlyViewedProducts = getProductsByIds(recentlyViewedProductIds);

  return (
    <div className="max-w-7xl mx-auto py-12 pt-8 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="text-center mb-8"
      >
        <motion.h1
          className="font-poppins text-3xl md:text-4xl font-bold text-foreground mb-2"
          variants={fadeInUp}
        >
          Our Unique Collections
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          variants={fadeInUp}
        >
          Explore our extensive collection of luxury thrift, fashion bundles, and unique wears.
        </motion.p>
      </motion.div>

      {/* Filters and Search Section */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8"
      >
        <form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-md w-full space-x-2">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search unique wears..."
              className="w-full pl-9"
              value={currentQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        {/* Desktop Filters */}
        <div className="hidden lg:flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
          {/* Category Select */}
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
          </Select>

          {/* Sort By Select */}
          <Select value={sortBy} onValueChange={handleSortByChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Mobile Filter Toggle Button */}
        <Button
          variant="outline"
          className="lg:hidden w-full flex items-center justify-center gap-2"
          onClick={() => setIsMobileFilterPanelOpen(!isMobileFilterPanelOpen)}
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </Button>
      </motion.div>

      {/* Mobile Filter Panel */}
      <AnimatePresence>
        {isMobileFilterPanelOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInUp}
            className="lg:hidden w-full p-4 border rounded-lg bg-card flex flex-col gap-4 mb-8"
          >
            {/* Category Select */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort By Select */}
            <Select value={sortBy} onValueChange={handleSortByChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleClearFilters}>Clear Filters</Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <motion.p
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="text-muted-foreground text-center mb-8"
      >
        {loadingProducts ? "Loading products..." : `Showing ${displayedProducts.length} of ${allProducts.length} unique wears`}
      </motion.p>

      {/* Product Grid Display */}
      {loadingProducts ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="text-center py-16"
        >
          <p className="text-lg text-muted-foreground mb-4">No products found matching your criteria.</p>
          <Button onClick={handleClearFilters}>Clear Filters</Button>
        </motion.div>
      )}

      {/* Recommended Products Section (on Products Page) */}
      {productForRecommendationsId && (
        <motion.div
          className="mt-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <RecommendedProductsSection currentProductId={productForRecommendationsId} />
        </motion.div>
      )}

      {/* Recently Viewed Products Section (on Products Page) */}
      <motion.div
        className="mt-16 mb-20"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <RecentlyViewedProductsSection products={actualRecentlyViewedProducts} />
      </motion.div>
    </div>
  );
};

export default Products;
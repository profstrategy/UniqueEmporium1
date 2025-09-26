"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Cpu, MemoryStick, HardDrive, Monitor, BatteryCharging, Wifi, Laptop, Tablet, Headphones, LayoutGrid, Home as HomeIcon, SlidersHorizontal } from "lucide-react"; // Import icons for specs and categories
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Placeholder product data (keeping it here for now as it's already in the file)
const allProducts: Product[] = Array.from({ length: 20 }).map((_, index) => ({
  id: `prod-${index + 1}`,
  name: `ElectroPro Laptop ${index + 1}`,
  category: ["Laptops", "Tablets", "Audio", "Monitors", "Accessories", "Smart Home"][index % 6], // Assign categories
  images: ["/placeholder.svg", "/placeholder.svg"],
  price: 450000 + index * 25000, // Adjusted to Naira values
  originalPrice: (450000 + index * 25000) * 1.1, // 10% higher original price
  discountPercentage: 10,
  rating: Math.min(5, 3.5 + index * 0.1),
  reviews: 50 + index * 10,
  tag: index % 3 === 0 ? "New" : index % 5 === 0 ? "Sale" : undefined,
  tagVariant: index % 3 === 0 ? "default" : index % 5 === 0 ? "destructive" : undefined,
  limitedStock: index % 4 === 0,
  specs: [
    { icon: Cpu, label: "CPU", value: `i${7 + (index % 3)}` },
    { icon: MemoryStick, label: "RAM", value: `${8 * (1 + (index % 2))}GB` },
    { icon: HardDrive, label: "Storage", value: `${256 * (1 + (index % 2))}GB SSD` },
    { icon: Monitor, label: "Display", value: `1${4 + (index % 3)}"` },
    { icon: BatteryCharging, label: "Battery", value: `${10 + (index % 5)} Hrs` },
    { icon: Wifi, label: "Wireless", value: `Wi-Fi 6` },
  ],
}));

const categories = [
  { name: "All Categories", value: "all" },
  { name: "Laptops", value: "Laptops", icon: Laptop },
  { name: "Tablets", value: "Tablets", icon: Tablet },
  { name: "Audio", value: "Audio", icon: Headphones },
  { name: "Monitors", value: "Monitors", icon: LayoutGrid },
  { name: "Accessories", value: "Accessories", icon: LayoutGrid },
  { name: "Smart Home", value: "Smart Home", icon: HomeIcon },
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
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "all";

  const [currentQuery, setCurrentQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("default");
  const [isMobileFilterPanelOpen, setIsMobileFilterPanelOpen] = useState(false); // State for mobile filter panel

  useEffect(() => {
    setCurrentQuery(initialQuery);
    setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

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
  };

  const handleSortByChange = (value: string) => {
    setSortBy(value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentQuery.trim()) {
      searchParams.set("query", currentQuery.trim());
    } else {
      searchParams.delete("query");
    }
    setSearchParams(searchParams);
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
        // No specific sort, maintain original order or a default one
        break;
    }
    return filtered;
  };

  const displayedProducts = filterAndSortProducts();

  const handleClearFilters = () => {
    setCurrentQuery("");
    setSelectedCategory("all");
    setSortBy("default");
    setSearchParams({}); // Clear all search params
    setIsMobileFilterPanelOpen(false); // Close panel on clear
  };

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
          All Electronics
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground max-w-2xl mx-auto"
          variants={fadeInUp}
        >
          Explore our extensive collection of cutting-edge electronics, from powerful laptops to smart home devices.
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
              placeholder="Search products..."
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
        Showing {displayedProducts.length} of {allProducts.length} electronics
      </motion.p>

      {/* Product Grid Display */}
      {displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
          {displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} disableEntryAnimation={true} />
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
    </div>
  );
};

export default Products;
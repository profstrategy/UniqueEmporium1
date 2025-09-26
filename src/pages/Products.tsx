"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Cpu, MemoryStick, HardDrive } from "lucide-react"; // Import icons for specs
import ProductCard, { Product } from "@/components/products/ProductCard.tsx"; // Import ProductCard and Product interface

// Placeholder product data for the Products page
const allProducts: Product[] = Array.from({ length: 20 }).map((_, index) => ({
  id: `prod-${index + 1}`,
  name: `ElectroPro Laptop ${index + 1}`,
  category: "Laptops",
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
  ],
}));

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("query") || "";
  const initialCategory = searchParams.get("category") || "";
  const [currentQuery, setCurrentQuery] = useState(initialQuery);

  useEffect(() => {
    setCurrentQuery(initialQuery);
  }, [initialQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would trigger a product search API call
    console.log("Searching for:", currentQuery);
    console.log("Category filter:", initialCategory);
    // For now, just update the URL if needed or perform a client-side filter
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">
        {initialCategory ? `${initialCategory} Products` : "All Products"}
      </h1>
      <p className="text-lg text-muted-foreground mb-8 text-center">
        Explore our wide range of electronics.
      </p>

      <form onSubmit={handleSearchSubmit} className="flex max-w-md mx-auto mb-8 space-x-2">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allProducts.map((product) => (
          <ProductCard key={product.id} product={product} disableEntryAnimation={true} />
        ))}
      </div>
    </div>
  );
};

export default Products;
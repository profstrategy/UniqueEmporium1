"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scale, ArrowLeft, X, Cpu, MemoryStick, HardDrive, Monitor, BatteryCharging, Wifi, HardHat } from "lucide-react";
import CompareProductCard from "../components/compare-page/CompareProductCard"; // Changed to relative path
import { Product } from "@/components/products/ProductCard.tsx"; // Re-using the Product interface

// Placeholder product data for comparison
const initialCompareProducts: Product[] = [
  {
    id: "comp1",
    name: "ZenBook Pro 14 OLED",
    category: "Laptops",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 950000.00,
    originalPrice: 1000000.00,
    discountPercentage: 5,
    rating: 4.8,
    reviews: 150,
    tag: "Best Seller",
    tagVariant: "destructive",
    limitedStock: true,
    specs: [
      { icon: Cpu, label: "Processor", value: "Intel i7-12700H" },
      { icon: MemoryStick, label: "RAM", value: "16GB DDR5" },
      { icon: HardDrive, label: "Storage", value: "512GB NVMe SSD" },
      { icon: Monitor, label: "Display", value: "14\" OLED 4K" },
      { icon: BatteryCharging, label: "Battery", value: "15 Hrs" },
      { icon: Wifi, label: "Connectivity", value: "Wi-Fi 6E, BT 5.2" },
      { icon: HardHat, label: "OS", value: "Windows 11 Pro" },
    ],
  },
  {
    id: "comp2",
    name: "SoundWave Max Headphones",
    category: "Audio",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 175000.00,
    rating: 4.5,
    reviews: 230,
    tag: "New Arrival",
    tagVariant: "default",
    limitedStock: false,
    specs: [
      { icon: Cpu, label: "Type", value: "Over-ear ANC" },
      { icon: MemoryStick, label: "Connectivity", value: "Bluetooth 5.2" },
      { icon: HardDrive, label: "Battery", value: "30 Hrs" },
      { icon: Monitor, label: "Drivers", value: "40mm Dynamic" },
      { icon: BatteryCharging, label: "Charging", value: "USB-C Fast" },
      { icon: Wifi, label: "Features", value: "Spatial Audio" },
      { icon: HardHat, label: "Weight", value: "250g" },
    ],
  },
  {
    id: "comp3",
    name: "UltraView 32-inch Monitor",
    category: "Monitors",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 400000.00,
    originalPrice: 425000.00,
    discountPercentage: 6,
    rating: 4.7,
    reviews: 95,
    tag: "High Refresh",
    tagVariant: "secondary",
    limitedStock: true,
    specs: [
      { icon: Cpu, label: "Resolution", value: "4K UHD (3840x2160)" },
      { icon: MemoryStick, label: "Refresh Rate", value: "144Hz" },
      { icon: HardDrive, label: "Panel Type", value: "IPS" },
      { icon: Monitor, label: "Size", value: "32-inch" },
      { icon: BatteryCharging, label: "Response", value: "1ms GTG" },
      { icon: Wifi, label: "Ports", value: "HDMI 2.1, DP 1.4" },
      { icon: HardHat, label: "Features", value: "HDR600, FreeSync" },
    ],
  },
];

const compareLimit = 3; // Maximum number of products to compare

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

const Compare = () => {
  const [productsToCompare, setProductsToCompare] = useState<Product[]>(initialCompareProducts);

  const handleRemoveProduct = (productId: string) => {
    setProductsToCompare((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleClearAll = () => {
    setProductsToCompare([]);
  };

  const hasProducts = productsToCompare.length > 0;

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-between mb-8 text-center sm:text-left"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-foreground mb-2 sm:mb-0">
            Product Comparison ({productsToCompare.length} of {compareLimit})
          </h1>
          {hasProducts && (
            <Button variant="outline" onClick={handleClearAll}>
              <X className="mr-2 h-4 w-4" /> Clear All
            </Button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {hasProducts ? (
            <motion.div
              key="compare-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-nowrap overflow-x-auto pb-4 no-scrollbar gap-6
                         md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6 md:overflow-visible md:pb-0"
            >
              {productsToCompare.map((product) => (
                <motion.div key={product.id} variants={fadeInUp} className="flex-shrink-0 w-[280px] md:w-auto">
                  <CompareProductCard product={product} onRemove={handleRemoveProduct} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-compare"
              className="text-center py-20"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ delay: 0.2 }}
            >
              <Scale className="h-24 w-24 text-muted-foreground mx-auto mb-8" />
              <h2 className="text-2xl font-bold mb-4 text-foreground">No Products to Compare</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                Add products to your comparison list from the product pages to see them side-by-side.
              </p>
              <Button asChild size="lg">
                <Link to="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Start Browsing Products
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Compare;
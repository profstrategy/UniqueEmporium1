"use client";

import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Cpu, MemoryStick, HardDrive, Monitor, BatteryCharging } from "lucide-react";
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";

// Placeholder product data for favorites
const favoriteProducts: Product[] = [
  {
    id: "fav1",
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
      { icon: Cpu, label: "Processor", value: "Intel i7" },
      { icon: MemoryStick, label: "RAM", value: "16GB" },
      { icon: HardDrive, label: "Storage", value: "512GB SSD" },
      { icon: Monitor, label: "Display", value: "14\" OLED 4K" },
      { icon: BatteryCharging, label: "Battery", value: "15 Hrs" },
    ],
  },
  {
    id: "fav2",
    name: "SoundWave Max Headphones",
    category: "Audio",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 175000.00,
    rating: 4.5,
    reviews: 230,
    tag: "New Arrival",
    tagVariant: "default",
    specs: [
      { icon: Cpu, label: "Type", value: "Over-ear" },
      { icon: MemoryStick, label: "Connectivity", value: "Bluetooth 5.2" },
      { icon: HardDrive, label: "Battery", value: "30 Hrs" },
    ],
  },
  {
    id: "fav3",
    name: "ErgoGrip Wireless Mouse",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 30000.00,
    rating: 4.6,
    reviews: 310,
    tag: "Top Rated",
    tagVariant: "secondary",
    specs: [
      { icon: Cpu, label: "Connectivity", value: "2.4GHz Wireless" },
      { icon: MemoryStick, label: "DPI", value: "16000" },
      { icon: HardDrive, label: "Buttons", value: "8 Programmable" },
    ],
  },
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

const Favorites = () => {
  const hasFavorites = favoriteProducts.length > 0;

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          className="flex items-center justify-between mb-8"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <h1 className="text-3xl font-bold text-foreground">Your Favorites ({favoriteProducts.length})</h1>
          <Button variant="outline" asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" /> Continue Shopping
            </Link>
          </Button>
        </motion.div>

        <AnimatePresence mode="wait">
          {hasFavorites ? (
            <motion.div
              key="favorites-grid"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {favoriteProducts.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty-favorites"
              className="text-center py-20"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ delay: 0.2 }}
            >
              <Heart className="h-24 w-24 text-muted-foreground mx-auto mb-8" />
              <h2 className="text-2xl font-bold mb-4 text-foreground">No Favorites Yet!</h2>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                It looks like you haven't added any products to your favorites. Start browsing to find items you love!
              </p>
              <Button asChild size="lg">
                <Link to="/products">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Start Browsing
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Favorites;
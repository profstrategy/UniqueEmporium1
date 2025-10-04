"use client";

import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, ArrowLeft, Cpu, MemoryStick, HardDrive, Monitor, BatteryCharging } from "lucide-react";
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx"; // Import useFavorites

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
  const { favoriteItems, removeFavorite } = useFavorites(); // Use FavoritesContext
  const hasFavorites = favoriteItems.length > 0;

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
          <h1 className="text-3xl font-bold text-foreground">Your Favorites ({favoriteItems.length})</h1>
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
              className="grid grid-cols-2 gap-2 md:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4"
            >
              {favoriteItems.map((product) => (
                <motion.div key={product.id} variants={fadeInUp}>
                  {/* Pass a prop to ProductCard to indicate it's in favorites context, 
                      or handle removal directly if ProductCard is not meant to remove */}
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
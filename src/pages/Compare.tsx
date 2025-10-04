"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Scale, ArrowLeft, X, Cpu, MemoryStick, HardDrive, Monitor, BatteryCharging, Wifi, HardHat } from "lucide-react";
import CompareProductCard from "../components/compare-page/CompareProductCard.tsx";
import { Product } from "@/components/products/ProductCard.tsx";
import { useCompare } from "@/context/CompareContext.tsx"; // Import useCompare

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
  const { compareItems, removeFromCompare, clearCompare, COMPARE_LIMIT } = useCompare(); // Use CompareContext
  const hasProducts = compareItems.length > 0;

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
            Product Comparison ({compareItems.length} of {COMPARE_LIMIT})
          </h1>
          {hasProducts && (
            <Button variant="outline" onClick={clearCompare}> {/* Use clearCompare from context */}
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
              {compareItems.map((product) => (
                <motion.div key={product.id} variants={fadeInUp} className="flex-shrink-0 w-[280px] md:w-auto">
                  <CompareProductCard product={product} onRemove={removeFromCompare} /> {/* Pass removeFromCompare */}
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
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";
import { mockProducts, ProductDetails } from "@/data/products.ts"; // Import mockProducts

// Hand-pick some products to represent "Top Selling"
const topSellingProductIds = [
  "zenbook-pro-14-oled",
  "soundwave-noise-cancelling-headphones",
  "gaming-beast-desktop-pc",
  "powercharge-100w-gan-charger",
  "galaxy-tab-s9-ultra",
  "smartwatch-xtreme",
];

const getTopSellingProducts = (): Product[] => {
  return topSellingProductIds
    .map(id => mockProducts.find(p => p.id === id))
    .filter((product): product is ProductDetails => product !== undefined);
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const TopSellingProductsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>([]);

  useEffect(() => {
    setProductsToDisplay(getTopSellingProducts());
  }, []);

  const onSelect = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  if (productsToDisplay.length === 0) {
    return null; // Don't render if no top-selling products
  }

  return (
    <section className="py-12 bg-background">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" /> Top Selling Products
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev} disabled={!canScrollPrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} disabled={!canScrollNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-2 sm:gap-4">
            {productsToDisplay.map((product) => (
              <div key={product.id} className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[280px]">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default TopSellingProductsSection;
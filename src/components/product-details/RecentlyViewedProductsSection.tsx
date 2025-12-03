"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, History } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton.tsx"; // Import ProductCardSkeleton

interface RecentlyViewedProductsSectionProps {
  products: Product[];
}

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const RecentlyViewedProductsSection = ({ products }: RecentlyViewedProductsSectionProps) => {
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
  const [loading, setLoading] = useState(true); // New loading state

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => { // Simulate loading delay
      setLoading(false);
    }, 500); // Simulate 500ms loading
    return () => clearTimeout(timer);
  }, [products]); // Re-run loading state when products prop changes

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

  if (products.length === 0 && !loading) {
    return null; // Don't render if no recently viewed products and not loading
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
            <History className="h-6 w-6 text-primary" /> Recently Viewed
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev} disabled={!canScrollPrev || loading}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} disabled={!canScrollNext || loading}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-2 sm:gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => ( // Show 4 skeletons while loading
                  <div key={i} className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[280px]">
                    <ProductCardSkeleton />
                  </div>
                ))
              : products.map((product) => (
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

export default RecentlyViewedProductsSection;
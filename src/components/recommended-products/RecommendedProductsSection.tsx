"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ProductCard"; // Changed to default import
import { Product } from "@/data/products";
import { cn } from "@/lib/utils";

interface RecommendedProductsSectionProps {
  title: string;
  products: Product[];
  loading: boolean;
  error: string | null;
  currentProductId?: string; // Added this prop
}

const RecommendedProductsSection = ({
  title,
  products,
  loading,
  error,
  currentProductId, // Destructure the new prop
}: RecommendedProductsSectionProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const checkScrollability = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollPrev(scrollLeft > 0);
      setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 1); // -1 to account for sub-pixel rendering
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", checkScrollability);
      // Initial check and re-check on products change
      checkScrollability();
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(currentRef);
      window.addEventListener("resize", checkScrollability);

      return () => {
        currentRef.removeEventListener("scroll", checkScrollability);
        resizeObserver.disconnect();
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth / 2; // Scroll half the visible width
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollPrev = () => scroll("left");
  const scrollNext = () => scroll("right");

  return (
    <section className="py-8 md:py-12 lg:py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <h2 className="text-2xl md:text-3xl font-bold font-poppins text-foreground">
            {title}
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              disabled={!canScrollPrev || loading}
              className="rounded-full"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              disabled={!canScrollNext || loading}
              className="rounded-full"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="text-center text-destructive py-8">
            <p>Error loading products: {error}</p>
            <Button onClick={checkScrollability} className="mt-4">
              Retry
            </Button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            <p>No products found.</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div
            ref={scrollRef}
            className="flex overflow-x-scroll no-scrollbar snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 md:mx-0 md:px-0"
          >
            <AnimatePresence>
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  className="flex-none w-[calc(50%-8px)] sm:w-[calc(33.33%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)] snap-start"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendedProductsSection;
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Lightbulb } from "lucide-react"; // Changed icon to Lightbulb for recommendations
import useEmblaCarousel from "embla-carousel-react";
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";
import { mockProducts, getProductById, ProductDetails as ProductDetailsType } from "@/data/products.ts"; // Import mockProducts and getProductById

interface RecommendedProductsSectionProps {
  currentProductId: string; // New prop to receive the ID of the currently viewed product
}

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const RecommendedProductsSection = ({ currentProductId }: RecommendedProductsSectionProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true, // Allows free dragging
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
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);

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

  useEffect(() => {
    const generateRecommendations = () => {
      const currentProduct = getProductById(currentProductId);
      if (!currentProduct) {
        setRecommendedProducts([]);
        return;
      }

      const recommendations: Product[] = [];
      const recommendationIds = new Set<string>();

      // 1. Category Match (excluding current product)
      const categoryMatches = mockProducts.filter(
        (p) => p.category === currentProduct.category && p.id !== currentProduct.id
      );
      categoryMatches.forEach((p) => {
        if (!recommendationIds.has(p.id)) {
          recommendations.push(p);
          recommendationIds.add(p.id);
        }
      });

      // 2. Related Attributes: Same tag.variant
      if (currentProduct.tagVariant) {
        const tagMatches = mockProducts.filter(
          (p) => p.tagVariant === currentProduct.tagVariant && p.id !== currentProduct.id
        );
        tagMatches.forEach((p) => {
          if (!recommendationIds.has(p.id)) {
            recommendations.push(p);
            recommendationIds.add(p.id);
          }
        });
      }

      // 3. Related Attributes: Price within 20% range
      const priceRange = 0.20;
      const minPrice = currentProduct.price * (1 - priceRange);
      const maxPrice = currentProduct.price * (1 + priceRange);

      const priceMatches = mockProducts.filter(
        (p) => p.id !== currentProduct.id && p.price >= minPrice && p.price <= maxPrice
      );
      priceMatches.forEach((p) => {
        if (!recommendationIds.has(p.id)) {
          recommendations.push(p);
          recommendationIds.add(p.id);
        }
      });

      // Limit to 10 items
      setRecommendedProducts(recommendations.slice(0, 10));
    };

    generateRecommendations();
  }, [currentProductId]); // Re-run when currentProductId changes

  if (recommendedProducts.length === 0) {
    return null; // Don't render the section if no recommendations
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
            <Lightbulb className="h-6 w-6 text-primary" /> Recommended for You
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
            {recommendedProducts.map((product) => (
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

export default RecommendedProductsSection;
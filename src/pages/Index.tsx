"use client";

import React, { useState, useEffect, useCallback } from "react"; // Added useState, useEffect, useCallback
import HeroCarousel from "@/components/hero-carousel/HeroCarousel.tsx";
import HeroIntroBanner from "@/components/hero-intro-banner/HeroIntroBanner.tsx";
import CategoriesSection from "@/components/categories-section/CategoriesSection.tsx";
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";
import WhyChooseUsSection from "@/components/why-choose-us/WhyChooseUsSection.tsx";
import RecommendedProductsSection from "../components/recommended-products/RecommendedProductsSection.tsx";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, Easing } from "framer-motion";
import { mockProducts, ProductDetails } from "@/data/products.ts"; // Import ProductDetails
import useEmblaCarousel from "embla-carousel-react"; // Import useEmblaCarousel
import { ChevronLeft, ChevronRight } from "lucide-react"; // Import ChevronLeft, ChevronRight

// Select specific products from mockProducts to be featured
const featuredProducts: ProductDetails[] = [ // Changed type from Product[] to ProductDetails[]
  mockProducts.find(p => p.id === "zenbook-pro-14-oled"),
  mockProducts.find(p => p.id === "soundwave-noise-cancelling-headphones"),
  mockProducts.find(p => p.id === "ultrafast-1tb-external-ssd"),
  mockProducts.find(p => p.id === "ergofit-wireless-keyboard"),
  mockProducts.find(p => p.id === "smarthome-hub-pro"),
  mockProducts.find(p => p.id === "powercharge-100w-gan-charger"),
].filter((product): product is ProductDetails => product !== undefined); // Filter out any undefined if an ID isn't found

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

const Index = () => {
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

  return (
    <div className="relative min-h-screen w-full">
      <HeroCarousel />
      <HeroIntroBanner />
      <CategoriesSection />

      {/* Featured Products Section */}
      <section id="featured-products-section" className="py-16 bg-muted/30">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" // Removed text-center from here
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="text-left"> {/* Added text-left for title/description */}
              <motion.h2
                className="font-poppins font-bold text-xl md:text-4xl text-foreground"
                variants={fadeInUp}
              >
                Featured Electronics
              </motion.h2>
              <motion.p
                className="text-sm text-muted-foreground mt-2"
                variants={fadeInUp}
              >
                Discover our most popular laptops, gadgets, and accessories
              </motion.p>
            </div>
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
              {featuredProducts.map((product) => (
                <div key={product.id} className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[280px]">
                  <ProductCard product={product} disableEntryAnimation={true} />
                </div>
              ))}
            </div>
          </div>

          <motion.div variants={fadeInUp} className="mt-12 text-center"> {/* Added text-center back for the button */}
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">Browse All Electronics</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* Recommended Products Section */}
      <RecommendedProductsSection />
    </div>
  );
};

export default Index;
"use client";

import HeroSection from "@/components/hero-section/HeroSection.tsx";
import CategoriesSection from "@/components/categories-section/CategoriesSection.tsx";
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";
import WhyChooseUsSection from "@/components/why-choose-us/WhyChooseUsSection.tsx";
import CustomerReviewsSection from "@/components/customer-reviews/CustomerReviewsSection.tsx";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, Easing } from "framer-motion";
import { ProductDetails, getRecentlyViewedProducts } from "@/data/products.ts";
import RecentlyViewedProductsSection from "@/components/product-details/RecentlyViewedProductsSection.tsx";
import TopSellingProductsSection from "@/components/top-selling-products/TopSellingProductsSection.tsx";
import React, { useEffect, useState, useRef } from "react";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton.tsx";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
import { fetchProductsFromSupabase } from "@/integrations/supabase/products";

// Removed: featuredProductNames array is no longer needed as products will be filtered by isFeatured flag

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
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const RECENTLY_VIEWED_KEY = "recentlyViewedProducts";

const Index = () => {
  const [recentlyViewedProductIds, setRecentlyViewedProductIds] = useState<string[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [allAvailableProducts, setAllAvailableProducts] = useState<ProductDetails[]>([]); // State to hold all products
  const [loadingAllProducts, setLoadingAllProducts] = useState(true); // Loading state for all products
  const featuredProductsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadAllProducts = async () => {
      setLoadingAllProducts(true);
      const products = await fetchProductsFromSupabase();
      setAllAvailableProducts(products);
      setLoadingAllProducts(false);
    };
    loadAllProducts();
  }, []);

  useEffect(() => {
    const storedViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]") as string[];
    setRecentlyViewedProductIds(storedViewed);
  }, []);

  useEffect(() => {
    if (!loadingAllProducts) {
      setLoadingFeatured(true);
      // New: Filter by the isFeatured flag instead of a static name list
      const fetchedFeatured = allAvailableProducts.filter(product => product.isFeatured);
      setFeaturedProducts(fetchedFeatured);
      setLoadingFeatured(false);
    }
  }, [loadingAllProducts, allAvailableProducts]);

  const [actualRecentlyViewedProducts, setActualRecentlyViewedProducts] = useState<Product[]>([]);
  useEffect(() => {
    const loadRecentlyViewed = async () => {
      const products = await getRecentlyViewedProducts(recentlyViewedProductIds);
      setActualRecentlyViewedProducts(products);
    };
    loadRecentlyViewed();
  }, [recentlyViewedProductIds]);


  const scrollToFeaturedProducts = () => {
    featuredProductsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-h-screen w-full">
      <HeroSection onScrollToFeatured={scrollToFeaturedProducts} />

      {/* Moved introductory text before CategoriesSection */}
      <motion.p
        className="font-semibold text-base md:text-xl lg:text-2xl text-primary mt-2 mb-2 px-4 sm:px-6 lg:px-8 text-center mx-auto lg:whitespace-nowrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" as Easing }}
      >
        Luxury Wholesale Fashion for Smart Resellers
      </motion.p>

      <CategoriesSection />

      {/* Featured Products Section */}
      <section id="featured-products-section" ref={featuredProductsRef} className="pt-4 pb-16 bg-muted/30">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Moved paragraph */}
          <motion.p
            className="text-sm md:text-lg lg:text-xl text-muted-foreground mt-2 mb-8 md:mb-12"
            variants={fadeInUp}
          >
            Explore the latest SHEIN gowns, vintage shirts, kids’ jeans, and fashion bundles with easy navigation, smart picks, and clear checkout.
          </motion.p>
          <motion.h2
            className="font-poppins font-bold text-xl md:text-4xl text-foreground"
            variants={fadeInUp}
          >
            Featured Collections
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground mt-2 mb-8 md:mb-12"
            variants={fadeInUp}
          >
            Discover our most popular SHEIN gowns, vintage shirts, and fashion bundles
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-5">
            {loadingFeatured
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12">
            <Button size="lg" variant="outline" asChild className="rounded-full">
              <Link to="/products">Shop the Collection</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Moved Banner Image */}
      <motion.div
        className="relative w-full max-w-5xl mx-auto h-48 md:h-64 rounded-xl overflow-hidden shadow-lg mt-8 mb-12 px-4 sm:px-6 lg:px-8"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <ImageWithFallback
          src="/my-banner.webp"
          alt="Unique Emporium Fashion Banner"
          containerClassName="w-full h-full"
        />
      </motion.div>

      {/* Top Selling Products Section (on Home Page) */}
      <motion.div
        className="mt-16"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <TopSellingProductsSection />
      </motion.div>

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* Customer Reviews Section */}
      <CustomerReviewsSection />

      {/* Recently Viewed Products Section (on Home Page) */}
      <motion.div
        className="mt-16 mb-20"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <RecentlyViewedProductsSection products={actualRecentlyViewedProducts} />
      </motion.div>
    </div>
  );
};

export default Index;
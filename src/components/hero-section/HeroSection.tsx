"use client";

import React from "react";
import { motion, Easing, RepeatType } from "framer-motion";
import { Button } from "@/components/ui/button";
import UniqueEmporiumLogo3D from "@/components/logo/UniqueEmporiumLogo3D.tsx";
import { mockProducts, ProductDetails } from "@/data/products.ts";
import { Link } from "react-router-dom";

interface HeroItem {
  id: string;
  image: string;
  headline: string;
  subHeadline: string;
  productName: string;
  productDescription: string;
  price: number;
  ctaText1: string;
  ctaLink1: string;
  ctaText2: string;
  ctaLink2: string;
}

// Select a single product from mockProducts for the hero section
const selectedProductForHero: ProductDetails | undefined = mockProducts.find(p => p.id === "shein-floral-maxi-gown");

const heroItem: HeroItem = selectedProductForHero ? {
  id: selectedProductForHero.id,
  image: selectedProductForHero.images[0],
  headline: "Unveil Your Uniqueness — Luxury Meets Everyday Comfort",
  subHeadline: "Nigeria’s futuristic fashion hub for SHEIN gowns, vintage shirts, kids’ jeans, and luxury thrift collections. Bold. Timeless. Truly you.",
  productName: selectedProductForHero.name,
  productDescription: selectedProductForHero.fullDescription.split('.')[0] + '.',
  price: selectedProductForHero.price,
  ctaText1: "Shop the Collection",
  ctaLink1: "/products",
  ctaText2: "Explore Trending Styles",
  ctaLink2: "/products?tag=trending",
} : { // Fallback if no product is found
  id: "default-hero",
  image: "/my-banner.webp", // Use a generic banner image
  headline: "Welcome to Unique Emporium",
  subHeadline: "Your destination for luxury thrift and fashion bundles.",
  productName: "Featured Fashion",
  productDescription: "Discover our hand-picked collections.",
  price: 0,
  ctaText1: "Shop Now",
  ctaLink1: "/products",
  ctaText2: "Learn More",
  ctaLink2: "/about",
};

const fadeInUpVariants = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.8, ease: "easeOut" as Easing } },
};

const ctaFloatVariants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: [0, -5, 0],
    transition: {
      y: {
        duration: 2,
        ease: "easeInOut" as Easing,
        repeat: Infinity,
        repeatType: "reverse" as RepeatType,
      },
      opacity: { duration: 0.8, ease: "easeOut" as Easing },
    },
  },
  hover: {
    scale: 1.05,
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.3 },
  },
  tap: { scale: 0.95 },
};

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
};

const HeroSection = () => {
  return (
    <section
      className="relative flex w-full flex-col justify-center overflow-hidden bg-black text-white h-[30vh] md:h-[50vh] lg:h-[60vh]"
    >
      {/* Background Image */}
      <img
        src={heroItem.image}
        alt={heroItem.productName}
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />

      {/* Main Content Block */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 py-8 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex flex-col space-y-4 md:w-1/2">
          {/* Product Info Card - Now displays custom text */}
          <motion.div
            className="mt-6 rounded-lg border border-white/20 bg-[oklch(0.15_0.02_240_/_0.2)] p-4 shadow-lg md:w-2/3 lg:w-full text-center"
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" as Easing }}
          >
            <h1 className="font-poppins text-lg font-bold text-white/90 md:text-xl">
              Unveil Your Uniqueness — Luxury Meets Everyday Comfort
            </h1>
            <h2 className="font-poppins text-sm text-white/80 md:text-base mt-2">
              Step into Nigeria’s fashion hub for SHEIN gowns, vintage shirts, kids’ jeans, and luxury thrift collections.
            </h2>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4"
            variants={ctaFloatVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              asChild
              className="px-6 py-2 text-base md:px-8 md:py-3 md:text-lg"
            >
              <Link to={heroItem.ctaLink1}>{heroItem.ctaText1}</Link>
            </Button>
          </motion.div>
        </div>

        {/* 3D Rotating Logo (Desktop Only) */}
        <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block">
          <UniqueEmporiumLogo3D />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
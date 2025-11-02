"use client";

import React from "react";
import { motion, Easing, RepeatType } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface HeroItem {
  headline: string;
  subHeadline: string;
  ctaText1: string;
  ctaLink1: string;
}

interface HeroSectionProps {
  onScrollToFeatured: () => void; // New prop for scrolling
}

const heroItem: HeroItem = {
  headline: "Unique Emporium | Nigeria’s #1 Wholesale Fashion Hub",
  subHeadline: "Shop SHEIN gowns, kidswear, and vintage shirts in bulk at unbeatable wholesale prices. Designed for resellers and fashion entrepreneurs across Nigeria.",
  ctaText1: "Order in Bulk Now",
  ctaLink1: "/products",
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

const HeroSection = ({ onScrollToFeatured }: HeroSectionProps) => {
  return (
    <section
      className="relative flex w-full flex-col justify-center overflow-hidden bg-black text-white h-[30vh] md:h-[50vh] lg:h-[60vh]"
    >
      {/* Background Image */}
      <img
        src="/unique-emporium-hero.webp" // Using the new image
        alt="Unique Emporium Hero Banner"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />

      {/* Main Content Block */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 py-8 md:flex-col md:items-center md:justify-center lg:px-8">
        <div className="flex flex-col space-y-4 w-full md:max-w-2xl lg:max-w-3xl mx-auto"> {/* Adjusted for centering */}
          {/* Product Info Card - Now displays custom text */}
          <motion.div
            className="mt-6 rounded-lg border border-white/20 bg-[oklch(0.15_0.02_240_/_0.2)] p-4 shadow-lg w-full text-center"
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" as Easing }}
          >
            <h1 className="font-poppins text-xl font-bold text-white md:text-4xl"> {/* Changed text-secondary to text-white */}
              {heroItem.headline}
            </h1>
            <h2 className="font-poppins text-xs text-white/80 md:text-lg mt-2">
              {heroItem.subHeadline}
            </h2>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center max-w-xs mx-auto"
            variants={ctaFloatVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              onClick={onScrollToFeatured}
              className="px-4 py-1.5 text-sm md:px-8 md:py-3 md:text-lg w-full"
            >
              {heroItem.ctaText1}
            </Button>
          </motion.div>
        </div>

        {/* Removed 3D Rotating Logo */}
      </div>
    </section>
  );
};

export default HeroSection;
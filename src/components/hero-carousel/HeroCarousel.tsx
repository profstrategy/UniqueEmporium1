"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Easing, RepeatType } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ElectroProLogo3D from "./ElectroProLogo3D.tsx";
import { mockProducts, ProductDetails } from "@/data/products.ts"; // Import mockProducts and ProductDetails
import { Link } from "react-router-dom"; // Import Link for CTA button

interface CarouselItem {
  id: string;
  image: string;
  headline: string;
  subHeadline: string;
  productName: string;
  productDescription: string;
  price: number;
  ctaText: string;
  ctaLink: string;
}

// Select specific products from mockProducts for the carousel
const selectedProductsForCarousel: ProductDetails[] = [
  mockProducts.find(p => p.id === "zenbook-pro-14-oled"),
  mockProducts.find(p => p.id === "soundwave-noise-cancelling-headphones"),
  mockProducts.find(p => p.id === "prodisplay-xdr"),
  mockProducts.find(p => p.id === "gaming-beast-desktop-pc"),
].filter((product): product is ProductDetails => product !== undefined);

const carouselItems: CarouselItem[] = selectedProductsForCarousel.map(product => ({
  id: product.id,
  image: product.images[0], // Use the first image for the carousel
  headline: `Discover the ${product.name} – ${product.category} Excellence.`, // Dynamic headline
  subHeadline: product.fullDescription.split('.')[0] + '.', // First sentence of full description
  productName: product.name,
  productDescription: product.fullDescription.split('.')[0] + '.', // Short description
  price: product.price,
  ctaText: `Shop ${product.category} Now`,
  ctaLink: `/products/${product.id}`, // Link to product details page
}));

const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? carouselItems.length - 1 : prevIndex - 1,
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(goToNext, 8000); // Change slide every 8 seconds
    return () => clearInterval(interval);
  }, []);

  const currentItem = carouselItems[currentIndex];

  const fadeInUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as Easing } },
  };

  const ctaFloatVariants = {
    initial: { opacity: 0, y: 50 },
    animate: {
      opacity: 1,
      y: [0, -5, 0], // Float animation
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

  return (
    <section
      className="relative flex w-full flex-col justify-center overflow-hidden bg-black text-white"
      style={{ height: "calc(100vh - 4rem)", minHeight: "600px" }}
    >
      {/* Background Image */}
      <AnimatePresence initial={false}>
        <motion.img
          key={currentItem.id}
          src={currentItem.image}
          alt={currentItem.productName}
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" as Easing }}
        />
      </AnimatePresence>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent" />

      {/* Main Content Block */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-4 py-8 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex flex-col space-y-4 md:w-1/2">
          <motion.h1
            className="font-poppins text-2xl font-bold leading-tight text-white md:text-6xl lg:text-7xl"
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
          >
            {currentItem.headline}
          </motion.h1>
          <motion.p
            className="text-base text-white/90 md:text-2xl"
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" as Easing }}
          >
            {currentItem.subHeadline}
          </motion.p>

          {/* Product Info Card */}
          <motion.div
            className="mt-6 rounded-lg border border-white/20 bg-[oklch(0.15_0.02_240_/_0.2)] p-4 shadow-lg md:w-2/3 lg:w-1/2"
            variants={fadeInUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" as Easing }}
          >
            <h3 className="font-poppins text-base font-semibold text-white md:text-xl">
              {currentItem.productName}
            </h3>
            <p className="text-sm text-white/80">
              {currentItem.productDescription}
            </p>
            <p className="mt-2 font-bold text-xl text-accent md:text-2xl">
              {formatCurrency(currentItem.price)}
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            className="mt-8"
            variants={ctaFloatVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              className="px-6 py-2 text-base md:px-8 md:py-3 md:text-lg"
              asChild // Use asChild to render Link inside Button
            >
              <Link to={currentItem.ctaLink}>
                {currentItem.ctaText}
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* 3D Rotating Logo (Desktop Only) */}
        <div className="absolute right-10 top-1/2 hidden -translate-y-1/2 lg:block">
          <ElectroProLogo3D />
        </div>
      </div>

      {/* Navigation Controls (Chevron Arrows) */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-4 top-1/2 hidden -translate-y-1/2 transform rounded-full bg-white/10 text-white hover:bg-white/20 sm:flex"
        onClick={goToPrevious}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-1/2 hidden -translate-y-1/2 transform rounded-full bg-white/10 text-white hover:bg-white/20 sm:flex"
        onClick={goToNext}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>

      {/* Navigation Controls (Dots Indicator) */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 space-x-2">
        {carouselItems.map((_, index) => (
          <button
            key={index}
            className={`h-1.5 w-1.5 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "scale-125 bg-accent"
                : "bg-white/40 hover:bg-white/60"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;
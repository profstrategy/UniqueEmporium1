"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, Easing } from "framer-motion";
import { Link } from "react-router-dom";
import { Shirt, Baby, Gem, ShoppingBag, LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils"; // Import cn for conditional classNames
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx"; // Import ImageWithFallback

interface Category {
  name: string;
  icon: LucideIcon;
  description: string;
  link: string;
  image: string | undefined; // Changed type to allow undefined
}

const categories: Category[] = [
  { name: "Kids", icon: Baby, description: "Wholesale kids' fashion", link: "/products?category=Kids", image: undefined },
  { name: "Kids Patpat", icon: Baby, description: "Patpat brand kids' wear", link: "/products?category=Kids Patpat", image: undefined },
  { name: "Children Jeans", icon: Baby, description: "Bulk children's denim", link: "/products?category=Children Jeans", image: undefined },
  { name: "Children Shirts", icon: Baby, description: "Wholesale kids' tops", link: "/products?category=Children Shirts", image: undefined },
  { name: "Men Vintage Shirts", icon: Shirt, description: "Bulk vintage shirts for men", link: "/products?category=Men Vintage Shirts", image: undefined },
  { name: "Amazon Ladies", icon: ShoppingBag, description: "Bulk Amazon ladies' wear", link: "/products?category=Amazon Ladies", image: undefined },
  { name: "SHEIN Gowns", icon: Shirt, description: "Wholesale SHEIN dresses", link: "/products?category=SHEIN Gowns", image: undefined },
  { name: "Others", icon: Gem, description: "Miscellaneous wholesale items", link: "/products?category=Others", image: undefined },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // Adjusted stagger for individual cards
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as Easing } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const CategoriesSection = () => {
  // Removed auto-scrolling logic as it was tied to duplicated categories
  // and is not desired for a single set of cards.

  return (
    <section className="relative py-[0.4rem]">
      <motion.div
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
          "p-6 rounded-xl bg-primary/40"
        )}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.h2
          className="font-poppins font-bold text-xl md:text-4xl text-foreground"
          variants={fadeInUp}
        >
          Explore Our Collections
        </motion.h2>
        <motion.p
          className="text-sm text-muted-foreground mt-2 mb-8 md:mb-12"
          variants={fadeInUp}
        >
          Find the perfect style to express your uniqueness
        </motion.p>

        {/* Category Cards Container */}
        <motion.div
          className="flex overflow-x-auto whitespace-nowrap gap-2 pb-4 md:grid md:grid-cols-4 lg:grid-cols-6 md:gap-4 no-scrollbar"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {categories.map((category, index) => (
            <motion.div
              key={`${category.name}-${index}`}
              variants={itemVariants}
              className="flex flex-col items-center cursor-pointer min-w-[120px] md:min-w-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to={category.link} className="flex flex-col items-center">
                {/* Image Container */}
                <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-md mb-3 bg-white flex items-center justify-center">
                  <ImageWithFallback
                    src={category.image}
                    alt={category.name}
                    containerClassName="w-full h-full"
                  />
                </div>
                {/* Category Name */}
                <p className="text-sm md:text-base lg:text-lg font-bold text-gray-900 text-center mt-2 leading-tight">
                  {category.name.split(' ').map((word, i) => (
                    <React.Fragment key={i}>
                      {word}
                      {i < category.name.split(' ').length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CategoriesSection;
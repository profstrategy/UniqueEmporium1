"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, Easing } from "framer-motion";
import { Link } from "react-router-dom";
import { Shirt, Baby, Gem, ShoppingBag, LucideIcon } from "lucide-react"; // Updated icons for fashion
import { useIsMobile } from "@/hooks/use-mobile";

interface Category {
  name: string;
  icon: LucideIcon;
  description: string;
  link: string;
}

const categories: Category[] = [
  { name: "SHEIN Gowns", icon: Shirt, description: "Elegant & trendy dresses", link: "/products?category=shein-gowns" },
  { name: "Vintage Shirts", icon: Shirt, description: "Unique retro styles", link: "/products?category=vintage-shirts" },
  { name: "Kids' Jeans", icon: Baby, description: "Durable & stylish denim for kids", link: "/products?category=kids-jeans" },
  { name: "Luxury Thrift", icon: Gem, description: "High-end pre-loved fashion", link: "/products?category=luxury-thrift" },
  { name: "Fashion Bundles", icon: ShoppingBag, description: "Curated outfits & collections", link: "/products?category=fashion-bundles" },
];

// Duplicate categories to create a seamless loop effect
const loopedCategories = [...categories, ...categories];

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

const CategoriesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();
  const scrollSpeed = 1;

  useEffect(() => {
    const scrollElement = scrollRef.current;
    const shouldBePaused = !isMobile && isPaused;

    if (!scrollElement || shouldBePaused) {
      return;
    }

    let animationFrameId: number;
    let lastTimestamp: DOMHighResTimeStamp;

    const scroll = (timestamp: DOMHighResTimeStamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      if (elapsed > 16) {
        scrollElement.scrollLeft += scrollSpeed;
        
        const singleSetWidth = scrollElement.scrollWidth / 2; 

        if (scrollElement.scrollLeft >= singleSetWidth) {
          scrollElement.scrollLeft = 0;
        }
        lastTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, isMobile, scrollSpeed]);

  return (
    <section className="py-16 bg-background">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
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

        <motion.div
          className="flex space-x-4 overflow-x-auto pb-4 no-scrollbar"
          ref={scrollRef}
          onMouseEnter={() => !isMobile && setIsPaused(true)}
          onMouseLeave={() => !isMobile && setIsPaused(false)}
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {loopedCategories.map((category, index) => (
            <motion.div key={`${category.name}-${index}`} variants={fadeInUp}>
              <Link
                to={category.link}
                className="group relative flex-shrink-0 w-[200px] h-16 lg:w-[250px] lg:h-24
                           bg-gradient-to-br from-primary/80 to-primary/60 border border-primary/50
                           rounded-xl overflow-hidden p-3 flex items-center justify-start text-left
                           transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 bg-primary/50 rounded-full flex items-center justify-center mr-3
                                transition-colors duration-300 group-hover:bg-primary/70">
                  <category.icon className="w-3 h-3 lg:w-6 lg:h-6 text-secondary transition-all duration-300 group-hover:text-white group-hover:scale-110" />
                </div>
                <div>
                  <h3 className="font-poppins font-semibold text-[10px] text-white lg:text-base
                                 transition-colors duration-300 group-hover:text-secondary">
                    {category.name}
                  </h3>
                  <p className="text-[8px] text-primary-foreground/80 lg:text-sm
                                transition-colors duration-300 group-hover:text-primary-foreground">
                    {category.description}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default CategoriesSection;
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Link } from "react-router-dom";
import { Shirt, Baby, Gem, ShoppingBag, LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { useCategories, Category } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";

// Map category names to Lucide icons (fallback if no image)
const getCategoryIcon = (categoryName: string): LucideIcon => {
  const lowerName = categoryName.toLowerCase();
  if (lowerName.includes("kid") || lowerName.includes("child")) return Baby;
  if (lowerName.includes("men") || lowerName.includes("shirt")) return Shirt;
  if (lowerName.includes("amazon")) return ShoppingBag;
  if (lowerName.includes("shein") || lowerName.includes("gown")) return Shirt;
  return Gem; // Default icon
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
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
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();
  const { categories, isLoading } = useCategories();
  const scrollSpeed = 1; // Pixels per frame for mobile auto-scroll

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Conditionally create the list of categories to display
  const categoriesToDisplay = isMobile ? [...categories, ...categories] : categories;

  // Function to update the state of the scroll buttons
  const updateScrollButtons = useCallback(() => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      setCanScrollPrev(scrollElement.scrollLeft > 0);
      // Check if there's more content to scroll to the right
      setCanScrollNext(scrollElement.scrollLeft < scrollElement.scrollWidth - scrollElement.clientWidth - 1); // -1 for floating point precision
    }
  }, []);

  // Effect for mobile auto-scrolling and general scroll event listener
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || isLoading) {
      updateScrollButtons(); // Ensure buttons are updated even if no categories or loading
      return;
    }

    let animationFrameId: number;
    let lastTimestamp: DOMHighResTimeStamp;

    const autoScroll = (timestamp: DOMHighResTimeStamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      if (elapsed > 16 && !isPaused && isMobile) { // Only auto-scroll if on mobile and not paused
        scrollElement.scrollLeft += scrollSpeed;
        
        const singleSetWidth = scrollElement.scrollWidth / 2; 

        if (scrollElement.scrollLeft >= singleSetWidth) {
          scrollElement.scrollLeft = 0;
        }
        updateScrollButtons(); // Update buttons during auto-scroll
        lastTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    // Start auto-scroll if on mobile
    if (isMobile) {
      animationFrameId = requestAnimationFrame(autoScroll);
    }
    
    // Add event listener for manual scroll on any device to update buttons
    const handleScroll = () => {
      updateScrollButtons();
    };
    scrollElement.addEventListener('scroll', handleScroll);
    
    // Initial update for buttons
    updateScrollButtons();

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [isPaused, isMobile, scrollSpeed, isLoading, updateScrollButtons]);

  // Manual scroll for desktop/tablet buttons
  const handleManualScroll = useCallback((direction: 'left' | 'right') => {
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      const scrollAmount = scrollElement.clientWidth / 2; // Scroll half the visible width
      scrollElement.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth',
      });
      // Update buttons after scroll animation might take a moment,
      // so we set a timeout to ensure they reflect the new scroll position.
      setTimeout(updateScrollButtons, 300); 
    }
  }, [updateScrollButtons]);

  if (isLoading) {
    return (
      <section className="relative py-[0.4rem] bg-primary/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6 pb-4 rounded-3xl bg-primary/20">
          <p className="text-muted-foreground">Loading categories...</p>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null; 
  }

  return (
    <section className="relative py-[0.4rem] bg-primary/10">
      <motion.div
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
          "pt-6 pb-4 rounded-3xl bg-primary/20"
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

        <div className="relative"> {/* Added relative container for buttons */}
          <motion.div
            className={cn(
              "flex overflow-x-auto whitespace-nowrap gap-2 pb-4 no-scrollbar",
              !isMobile && "md:grid md:gap-4 md:grid-rows-2 md:grid-flow-col md:whitespace-normal"
            )}
            ref={scrollRef}
            // Pause auto-scroll on hover for desktop, but only if auto-scroll is active (which it won't be on desktop)
            onMouseEnter={() => isMobile && setIsPaused(true)} 
            onMouseLeave={() => isMobile && setIsPaused(false)}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {categoriesToDisplay.map((category, index) => {
              const IconComponent = getCategoryIcon(category.name);
              
              return (
                <motion.div
                  key={`${category.id}-${index}`}
                  variants={itemVariants}
                  className="flex flex-col items-center cursor-pointer flex-shrink-0 min-w-[120px] md:w-[180px] md:min-w-[180px] lg:w-[200px] lg:min-w-[200px]"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link to={`/products?category=${encodeURIComponent(category.name)}`} className="flex flex-col items-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-md mb-3 bg-white flex items-center justify-center">
                      {category.image_url ? (
                        <ImageWithFallback
                          src={category.image_url}
                          alt={category.name}
                          containerClassName="w-full h-full object-cover"
                          fallbackLogoClassName="h-8 w-8"
                        />
                      ) : (
                        <IconComponent className="h-8 w-8 md:h-10 md:w-10 text-primary" />
                      )}
                    </div>
                    <p className="text-[10px] md:text-sm lg:text-sm font-bold text-gray-900 text-center mt-2 leading-tight">
                      {category.name.split(' ').map((word, i) => (
                        <React.Fragment key={i}>
                          {word}
                          {i < category.name.split(' ').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Chevron Buttons for Desktop/Tablet */}
          {!isMobile && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleManualScroll('left')}
                disabled={!canScrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full shadow-md h-10 w-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleManualScroll('right')}
                disabled={!canScrollNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full shadow-md h-10 w-10"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </motion.div>
    </section>
  );
};

export default CategoriesSection;
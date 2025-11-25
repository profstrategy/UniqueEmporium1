"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Link } from "react-router-dom";
import { Shirt, Baby, Gem, ShoppingBag, LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import ImageWithFallback from "@/components/common/ImageWithFallback";
import { useCategories, Category } from "@/hooks/useCategories";
import useEmblaCarousel from "embla-carousel-react";
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
  const isMobile = useIsMobile();
  const { categories, isLoading } = useCategories();
  const scrollSpeed = 1; // Pixels per frame for auto-scroll

  // Embla Carousel setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: isMobile, // Loop on mobile for continuous auto-scroll, not on desktop
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false); // New state for auto-scroll status

  const onSelect = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // Effect for Embla API listeners
  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    emblaApi.on("pointerDown", () => setIsAutoScrolling(false)); // Pause auto-scroll on user interaction
    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
      emblaApi.off("pointerDown", () => setIsAutoScrolling(false));
    };
  }, [emblaApi, onSelect]);

  // Effect for mobile auto-scrolling
  useEffect(() => {
    if (!emblaApi || !isMobile || isLoading) {
      return;
    }

    let animationFrameId: number;
    let lastTimestamp: DOMHighResTimeStamp;

    const autoScroll = (timestamp: DOMHighResTimeStamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      if (elapsed > 16 && isAutoScrolling) { // Only scroll if auto-scrolling is active
        emblaApi.scrollNext();
        if (emblaApi.selectedScrollSnap() === emblaApi.scrollSnapList().length - 1) {
          // If it's the last slide, jump back to the start to simulate loop
          emblaApi.scrollTo(0);
        }
        lastTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    // Start auto-scrolling after a delay
    const startAutoScroll = () => {
      setIsAutoScrolling(true);
      animationFrameId = requestAnimationFrame(autoScroll);
    };

    const autoScrollTimeout = setTimeout(startAutoScroll, 3000); // Start after 3 seconds

    return () => {
      clearTimeout(autoScrollTimeout);
      cancelAnimationFrame(animationFrameId);
      setIsAutoScrolling(false);
    };
  }, [emblaApi, isMobile, isLoading, isAutoScrolling]); // Added isAutoScrolling to dependencies

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
          <div
            className={cn(
              "embla overflow-hidden flex gap-2 pb-4 no-scrollbar",
              !isMobile && "md:grid md:gap-4 md:grid-rows-2 md:grid-flow-col md:whitespace-normal"
            )}
            ref={emblaRef}
          >
            <div className="embla__container flex"> {/* Embla container */}
              {categories.map((category, index) => {
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
            </div>
          </div>

          {/* Chevron Buttons for Desktop/Tablet */}
          {!isMobile && (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollPrev}
                disabled={!canScrollPrev}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/80 hover:bg-background rounded-full shadow-md h-10 w-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollNext}
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
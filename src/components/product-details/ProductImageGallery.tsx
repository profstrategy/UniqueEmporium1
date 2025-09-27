"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const imageVariants = {
    enter: { opacity: 0, scale: 0.95 },
    center: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeOut" as Easing } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.3, ease: "easeIn" as Easing } },
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-muted">
      {/* Main Image Area */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-muted flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={selectedIndex}
            className="embla h-full w-full relative group"
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="embla__container flex h-full">
              {images.map((image, index) => (
                <div className="embla__slide relative flex-none w-full h-full" key={index}>
                  <img
                    src={image}
                    alt={`Product image ${index + 1} of ${productName}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 text-foreground hover:bg-white z-10 h-6 w-6 p-2"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 text-foreground hover:bg-white z-10 h-6 w-6 p-2"
              onClick={scrollNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image Counter (changed from dots indicator) */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 z-10 px-3 py-1 rounded-full bg-black/50 text-white text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex p-4 space-x-3 overflow-x-auto no-scrollbar bg-card border-t">
          {images.map((image, index) => (
            <motion.button
              key={index}
              className={cn(
                "flex-shrink-0 h-10 w-10 md:h-20 md:w-20 rounded-md overflow-hidden border-2 transition-all duration-200",
                index === selectedIndex ? "border-primary shadow-md" : "border-transparent hover:border-muted-foreground",
              )}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1} of ${productName}`}
                className="w-full h-full object-contain"
              />
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
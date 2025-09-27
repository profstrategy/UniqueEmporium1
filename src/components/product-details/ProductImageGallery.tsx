"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Box, ZoomIn } from "lucide-react"; // Changed Cube to Box, added ZoomIn
import { cn } from "@/lib/utils";
import Product3DViewer from "./Product3DViewer.tsx"; // Import the new 3D viewer

interface ProductImageGalleryProps {
  images: string[];
  has3DModel?: boolean; // Placeholder for future 3D model integration
  productName: string; // Added productName for 3D viewer
  modelPath?: string; // Optional path for 3D model
}

const ProductImageGallery = ({ images, has3DModel = false, productName, modelPath }: ProductImageGalleryProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [is3DView, setIs3DView] = useState(false); // State to toggle 3D view
  const [isZoomed, setIsZoomed] = useState(false); // State for image zoom (placeholder)

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

  const handleImageClick = () => {
    // Placeholder for actual zoom functionality (e.g., open a modal with zoomable image)
    setIsZoomed(!isZoomed); // Toggle for visual feedback
    if (!isZoomed) {
      toast.info("Zoom functionality coming soon!", { description: "Clicking the image will open a zoomable view." });
    }
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-card border">
      {/* Main Image/3D View Area */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-muted flex items-center justify-center">
        <AnimatePresence initial={false} mode="wait">
          {is3DView ? (
            <motion.div
              key="3d-model"
              className="absolute inset-0"
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <Product3DViewer modelPath={modelPath} productName={productName} />
            </motion.div>
          ) : (
            <motion.div
              key={selectedIndex} // Key changes to trigger animation on slide change
              className="embla h-full w-full relative cursor-pointer group"
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              onClick={handleImageClick}
            >
              <div className="embla__container flex h-full">
                {images.map((image, index) => (
                  <div className="embla__slide relative flex-none w-full h-full" key={index}>
                    <img
                      src={image}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                ))}
              </div>
              {/* Zoom Indicator */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
                <ZoomIn className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Arrows */}
        {!is3DView && images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
              onClick={scrollPrev}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 text-white hover:bg-black/70 z-10"
              onClick={scrollNext}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        {/* Image Dots / 3D Toggle */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-10">
          {!is3DView && images.length > 1 && (
            <>
              {images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full bg-white/50 transition-colors duration-200",
                    index === selectedIndex && "bg-white",
                  )}
                  onClick={() => emblaApi && emblaApi.scrollTo(index)}
                  aria-label={`View image ${index + 1}`}
                />
              ))}
              <span className="ml-2 text-white text-sm">
                {selectedIndex + 1} / {images.length}
              </span>
            </>
          )}
          {has3DModel && (
            <Button
              variant="secondary"
              size="sm"
              className={cn("ml-4 text-xs", is3DView && "bg-primary text-primary-foreground")}
              onClick={() => setIs3DView(!is3DView)}
            >
              <Box className="h-4 w-4 mr-2" /> {is3DView ? "2D View" : "3D View"}
            </Button>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery (Desktop Only) */}
      {!is3DView && images.length > 1 && (
        <div className="hidden md:flex p-4 space-x-3 overflow-x-auto no-scrollbar bg-card border-t">
          {images.map((image, index) => (
            <motion.button
              key={index}
              className={cn(
                "flex-shrink-0 h-20 w-20 rounded-md overflow-hidden border-2 transition-all duration-200",
                index === selectedIndex ? "border-primary shadow-md" : "border-transparent hover:border-muted-foreground",
              )}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
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
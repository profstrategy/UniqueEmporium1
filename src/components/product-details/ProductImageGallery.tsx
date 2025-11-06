"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, Easing } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Dialog, DialogContent } from "@/components/ui/dialog"; // Import Dialog components
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx"; // Import ImageWithFallback

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false); // State to control the zoom dialog

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

  const handleImageClick = () => {
    setIsZoomed(true); // Open the dialog for zoom
  };

  return (
    <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-muted">
      {/* Main Image Area */}
      <div className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-muted flex items-center justify-center">
        {images.length === 0 ? (
          <ImageWithFallback src={undefined} alt={productName} containerClassName="h-full w-full" />
        ) : (
          <div
            className="embla h-full w-full relative cursor-pointer group"
            ref={emblaRef}
            onClick={handleImageClick}
          >
            <div className="embla__container flex h-full">
              {images.map((image, index) => (
                <div className="embla__slide relative flex-none w-full h-full" key={index}>
                  <ImageWithFallback
                    src={image}
                    alt={`Product image ${index + 1} of ${productName}`}
                    containerClassName="h-full w-full"
                  />
                </div>
              ))}
            </div>
            {/* Zoom Indicator */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
              <ZoomIn className="h-10 w-10 text-white" />
            </div>
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 text-foreground hover:bg-white z-20 h-6 w-6 p-2"
              onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 text-foreground hover:bg-white z-20 h-6 w-6 p-2"
              onClick={(e) => { e.stopPropagation(); scrollNext(); }}
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
              <ImageWithFallback
                src={image}
                alt={`Thumbnail ${index + 1} of ${productName}`}
                containerClassName="h-full w-full"
                fallbackLogoClassName="h-8 w-8"
              />
            </motion.button>
          ))}
        </div>
      )}

      {/* Zoom Dialog */}
      <Dialog open={isZoomed} onOpenChange={setIsZoomed}>
        <DialogContent className="max-w-4xl p-0 border-none bg-transparent">
          {images.length > 0 ? (
            <ImageWithFallback
              src={images[selectedIndex]}
              alt={`Zoomed view of ${productName}`}
              containerClassName="w-full h-full max-h-[90vh]"
            />
          ) : (
            <ImageWithFallback src={undefined} alt={productName} containerClassName="h-[90vh] w-full" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductImageGallery;
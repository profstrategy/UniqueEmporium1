"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, Easing, RepeatType } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, Scale, Cpu, MemoryStick, HardDrive } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import FloatingTag from "@/components/common/FloatingTag.tsx";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile"; // Import useIsMobile

export interface Product {
  id: string;
  name: string;
  category: string;
  images: string[];
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  rating: number;
  reviews: number;
  tag?: string;
  tagVariant?: "default" | "secondary" | "destructive" | "outline";
  limitedStock?: boolean;
  specs?: { icon: React.ElementType; label: string; value: string }[];
}

interface ProductCardProps {
  product: Product;
  disableEntryAnimation?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const ProductCard = ({ product, disableEntryAnimation = false }: ProductCardProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const specsScrollRef = useRef<HTMLDivElement>(null); // Ref for the specs row
  const isMobile = useIsMobile(); // Determine if on mobile

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

  // Auto-scrolling logic for specs row on desktop hover
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp: DOMHighResTimeStamp;
    const scrollSpeed = 0.5; // Adjust scroll speed as needed

    const scroll = (timestamp: DOMHighResTimeStamp) => {
      if (!specsScrollRef.current || !hovered || isMobile) {
        cancelAnimationFrame(animationFrameId); // Ensure animation stops if conditions change mid-scroll
        return;
      }

      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      if (elapsed > 16) { // Roughly 60fps
        const currentScrollLeft = specsScrollRef.current.scrollLeft;
        const maxScrollLeft = specsScrollRef.current.scrollWidth - specsScrollRef.current.clientWidth;

        if (maxScrollLeft <= 0 || currentScrollLeft >= maxScrollLeft) {
          // Reached the end or no scroll needed, stop scrolling
          cancelAnimationFrame(animationFrameId);
          return;
        }

        specsScrollRef.current.scrollLeft += scrollSpeed;
        lastTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    if (hovered && !isMobile) {
      // Start scrolling from the beginning when hover starts
      if (specsScrollRef.current) {
        specsScrollRef.current.scrollLeft = 0;
      }
      animationFrameId = requestAnimationFrame(scroll);
    } else if (specsScrollRef.current) {
      // Stop scrolling and reset position when not hovered or on mobile
      cancelAnimationFrame(animationFrameId);
      specsScrollRef.current.scrollLeft = 0;
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hovered, isMobile, product.specs]); // Re-run effect if specs change

  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      variants={disableEntryAnimation ? {} : fadeInUp}
      initial={disableEntryAnimation ? null : "hidden"}
      whileInView={disableEntryAnimation ? null : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      className="relative h-[420px] flex flex-col"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 30px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.3, ease: "easeOut" as Easing },
      }}
    >
      <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl shadow-lg">
        {product.tag && (
          <FloatingTag text={product.tag} variant={product.tagVariant} className="absolute top-2 left-2 md:right-2 md:left-auto z-50" />
        )}

        <div className="relative h-[200px] w-full overflow-hidden bg-gray-100">
          <div className="embla h-full" ref={emblaRef}>
            <div className="embla__container flex h-full">
              {product.images.map((image, index) => (
                <div className="embla__slide relative flex-none w-full" key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rating Overlay */}
          <div className="absolute top-3 right-3 z-10 md:bottom-3 md:top-auto">
            <Badge variant="secondary" className="flex items-center gap-1 text-xs md:text-sm font-medium">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {product.rating.toFixed(1)}
            </Badge>
          </div>

          {product.images.length > 1 && (
            <AnimatePresence>
              {hovered && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 z-10"
                    onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70 z-10"
                    onClick={(e) => { e.stopPropagation(); scrollNext(); }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          )}

          {product.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 space-x-1">
              {product.images.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "h-1.5 w-1.5 rounded-full bg-white/50 transition-colors duration-200",
                    index === selectedIndex && "bg-white",
                  )}
                  onClick={(e) => { e.stopPropagation(); emblaApi && emblaApi.scrollTo(index); }}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}

          {/* Desktop Hover Overlay with Action Buttons */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 hidden md:flex items-center justify-center space-x-4 bg-black/60 z-20"
              >
                <Button variant="secondary" size="icon" className="text-sm font-medium">
                  <Scale className="h-4 w-4" />
                </Button>
                <Button className="text-sm font-medium">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile "Add to Cart" and "Compare" Buttons */}
          <div className="md:hidden absolute bottom-2 left-2 z-10">
            <Button variant="secondary" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
          <div className="md:hidden absolute bottom-2 right-2 z-10">
            <Button variant="secondary" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
              <Scale className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <CardContent className="p-4 flex flex-col flex-grow text-left">
          {/* Category Text */}
          <span className="text-[0.55rem] text-muted-foreground uppercase tracking-wide truncate mb-1">
            {product.category}
          </span>

          {/* Product Name */}
          <h3 className="font-poppins font-semibold text-sm text-card-foreground line-clamp-2 mb-2">
            {product.name}
          </h3>

          {/* Price Display (Main Price always visible, Original Price/Discount hidden on mobile) */}
          <div className="flex items-center gap-2 mb-2">
            <p className="font-bold text-base text-primary">
              {product.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
            </p>
            {/* Original price and discount for desktop */}
            <span className="hidden md:flex items-center gap-2">
              {product.originalPrice && product.price < product.originalPrice && (
                <>
                  <p className="text-xs text-gray-400 line-through">
                    {product.originalPrice.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                  </p>
                  {discount > 0 && (
                    <Badge variant="destructive" className="text-xs md:text-sm font-medium px-1.5 py-0.5">
                      -{discount}%
                    </Badge>
                  )}
                </>
              )}
            </span>
          </div>

          {/* Limited Stock Message */}
          {product.limitedStock && (
            <p className="text-xs text-red-500 font-medium mb-2 hidden md:block">Limited Stock!</p>
          )}

          {/* Footer Actions */}
          <div className="mt-auto flex items-center justify-between pt-2">
            {/* Mobile-only original price and discount */}
            <div className="flex items-center gap-2 md:hidden">
              {product.originalPrice && product.price < product.originalPrice && (
                <>
                  <p className="text-xs text-gray-400 line-through">
                    {product.originalPrice.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                  </p>
                  {discount > 0 && (
                    <Badge variant="destructive" className="text-xs md:text-sm font-medium px-1.5 py-0.5">
                      -{discount}%
                    </Badge>
                  )}
                </>
              )}
            </div>

            {/* View Details Link (Desktop Only) */}
            <Link to={`/products/${product.id}`} className="hidden md:inline-flex">
              <span className="text-xs text-muted-foreground hover:underline">View Details</span>
            </Link>

            {/* Favorite Button */}
            <Button variant="ghost" size="icon" className="ml-auto">
              <Heart className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>

        {/* Horizontal Scrolling Specifications Section */}
        {product.specs && product.specs.length > 0 && (
          <div
            ref={specsScrollRef} // Attach ref here
            className="flex overflow-x-auto no-scrollbar rounded-b-2xl border-t border-border bg-muted/50 py-3 px-2 flex-shrink-0 space-x-2" // Added hover animations
          >
            {product.specs.map((spec, index) => (
              <div
                key={index}
                className="flex-shrink-0 min-w-[100px] border rounded-md bg-background p-2 flex items-center
                           transition-all duration-200 hover:-translate-y-1 hover:shadow-md" // Added hover animations
              >
                <spec.icon className="w-4 h-4 text-primary mr-1" />
                <div>
                  <p className="text-xs text-muted-foreground leading-none">{spec.label}</p>
                  <p className="text-xs font-medium text-foreground leading-none">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </motion.div>
  );
};

export default ProductCard;
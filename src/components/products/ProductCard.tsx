"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, Scale } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import FloatingTag from "@/components/common/FloatingTag.tsx"; // Added .tsx extension
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  images: string[];
  price: number;
  rating: number;
  reviews: number;
  tag?: string;
  tagVariant?: "default" | "secondary" | "destructive" | "outline";
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

  return (
    <motion.div
      variants={disableEntryAnimation ? {} : fadeInUp}
      initial={disableEntryAnimation ? null : "hidden"}
      whileInView={disableEntryAnimation ? null : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      className="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Card className="relative flex h-full flex-col overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
        {product.tag && (
          <FloatingTag text={product.tag} variant={product.tagVariant} />
        )}

        <div className="relative h-48 w-full overflow-hidden bg-gray-100">
          <div className="embla h-full" ref={emblaRef}>
            <div className="embla__container flex h-full">
              {product.images.map((image, index) => (
                <div className="embla__slide relative flex-none" key={index}>
                  <img
                    src={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
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
                    className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                    onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
                    onClick={(e) => { e.stopPropagation(); scrollNext(); }}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          )}

          {product.images.length > 1 && (
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 space-x-1">
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
        </div>

        <CardContent className="flex-grow p-4 text-center">
          <h3 className="mb-1 text-lg font-semibold">{product.name}</h3>
          <div className="mb-2 flex items-center justify-center text-sm text-muted-foreground">
            <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
          </div>
          <p className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 p-4 pt-0">
          <AnimatePresence>
            {hovered ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="flex w-full gap-2"
              >
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="flex-shrink-0">
                  <Scale className="h-4 w-4" />
                </Button>
                <Button className="flex-grow">
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </motion.div>
            ) : (
              <Button className="w-full">
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </Button>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
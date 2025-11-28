"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, Easing, RepeatType } from "framer-motion";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, ChevronLeft, ChevronRight, Shirt, Baby, Gem, Ruler, Palette, Tag, Loader2, XCircle } from "lucide-react"; // Added XCircle
import useEmblaCarousel from "embla-carousel-react";
import FloatingTag from "@/components/common/FloatingTag.tsx";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/context/CartContext.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import { Skeleton } from "@/components/ui/skeleton";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx"; // Import ImageWithFallback
import { toast } from "sonner"; // Import toast

export interface Product {
  id: string;
  name: string;
  category: string;
  images: string[];
  price: number; // This is the price for the MOQ
  originalPrice?: number; // This is also the original price for the MOQ
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  tag?: string;
  tagVariant?: "default" | "secondary" | "destructive" | "outline";
  limitedStock?: boolean;
  minOrderQuantity: number; // Added minOrderQuantity
  status: "active" | "inactive"; // Added status field
  isFeatured?: boolean; // New: Added isFeatured field
  unitType: "pcs" | "sets"; // NEW: Added unitType
}

interface ProductCardProps {
  product: Product;
  disableEntryAnimation?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const ProductCard = ({ product, disableEntryAnimation = false }: ProductCardProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hovered, setHovered] = useState(false);
  const isMobile = useIsMobile();
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

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

  const unitPrice = product.price / product.minOrderQuantity;
  const originalUnitPrice = product.originalPrice ? product.originalPrice / product.minOrderQuantity : undefined;

  const discount = originalUnitPrice && unitPrice < originalUnitPrice
    ? Math.round(((originalUnitPrice - unitPrice) / originalUnitPrice) * 100)
    : 0;

  const isOutOfStock = product.status === "inactive";

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOutOfStock) {
      toast.error("Product is currently out of stock.");
      return;
    }
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product, product.minOrderQuantity); // Add minOrderQuantity
    setIsAddingToCart(false);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorited(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleCardClick = () => {
    if (!isMobile) {
      navigate(`/products/${product.id}`);
    }
  };

  const favorited = isFavorited(product.id);

  return (
    <motion.div
      variants={disableEntryAnimation ? {} : fadeInUp}
      initial={disableEntryAnimation ? null : "hidden"}
      whileInView={disableEntryAnimation ? null : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      className="relative h-[340px] flex flex-col cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleCardClick}
      whileHover={{
        y: -8,
        boxShadow: "0 20px 30px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.3, ease: "easeOut" as Easing },
      }}
    >
      <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl shadow-lg">
        {product.tag && (
          <FloatingTag text={product.tag} variant={product.tagVariant} className="absolute top-2 right-2 z-50" />
        )}
        {isOutOfStock && (
          <Badge variant="destructive" className="absolute top-2 left-2 z-50 text-xs sm:text-sm px-2 py-0.5 sm:px-3 sm:py-1 flex items-center gap-1">
            <XCircle className="h-3 w-3 sm:h-4 sm:w-4" /> Out of Stock
          </Badge>
        )}

        {/* Product Image Area */}
        <div className="relative h-[250px] w-full overflow-hidden bg-gray-100">
          <Link to={`/products/${product.id}`} className="absolute inset-0 z-0">
            {product.images.length === 0 ? (
              <ImageWithFallback src={undefined} alt={product.name} containerClassName="h-full w-full" />
            ) : (
              <div className="embla h-full" ref={emblaRef}>
                <div className="embla__container flex h-full">
                  {product.images.map((image, index) => (
                    <div className="embla__slide relative flex-none w-full h-full" key={index}>
                      <ImageWithFallback
                        src={image}
                        alt={`${product.name} - Image ${index + 1}`}
                        containerClassName="h-full w-full"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Link>

          {/* Rating Overlay (positioned above the Link) */}
          <div className="absolute top-3 left-3 z-10 md:bottom-3 md:top-auto md:left-auto md:right-3">
            <Badge variant="secondary" className="flex items-center gap-1 text-xs md:text-sm font-medium">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {product.rating.toFixed(1)}
            </Badge>
          </div>

          {/* Navigation Arrows (positioned above the Link) */}
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
                <Button className="text-sm font-medium rounded-full" onClick={handleAddToCart} disabled={isAddingToCart || isOutOfStock}>
                  {isAddingToCart ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding {product.minOrderQuantity}
                    </>
                  ) : isOutOfStock ? (
                    <>
                      <XCircle className="mr-2 h-4 w-4" /> Out of Stock
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Add {product.minOrderQuantity} {product.unitType} to Cart
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile "Add to Cart" Button */}
          <div className="md:hidden absolute bottom-2 right-2 z-10">
            <Button variant="secondary" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 rounded-full" onClick={handleAddToCart} disabled={isAddingToCart || isOutOfStock}>
              {isAddingToCart ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isOutOfStock ? (
                <XCircle className="h-4 w-4" />
              ) : (
                <ShoppingCart className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <CardContent className="p-2 flex flex-col flex-grow text-left">
          {/* Category Text */}
          <span className="text-[0.55rem] text-muted-foreground uppercase tracking-wide truncate mb-1">
            {product.category}
          </span>

          {/* Product Name */}
          <Link to={`/products/${product.id}`} onClick={(e) => e.stopPropagation()}>
            <h3 className="font-poppins font-semibold text-sm text-card-foreground line-clamp-2 mb-1 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Price Display (Unit Price) */}
          <div className="flex items-center gap-2 mb-1">
            <p className="font-bold text-base text-primary">
              {unitPrice.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
            </p>
            {/* This span will only be visible on desktop (md and up) */}
            {originalUnitPrice && unitPrice < originalUnitPrice && (
              <span className="hidden md:flex items-center gap-2">
                <p className="text-xs text-gray-400 line-through">
                  {originalUnitPrice.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                </p>
                {discount > 0 && (
                  <Badge variant="destructive" className="text-xs md:text-sm font-medium px-1.5 py-0.5">
                    -{discount}%
                  </Badge>
                )}
              </span>
            )}
          </div>

          {/* MOQ Display */}
          <p className="text-xs text-muted-foreground font-medium mb-1">
            MOQ: {product.minOrderQuantity} {product.unitType}
          </p>

          {/* Limited Stock Message */}
          {product.limitedStock && !isOutOfStock && ( // Only show if not out of stock
            <motion.p
              className="text-xs text-red-500 font-medium mb-1 hidden md:block"
              initial={{ opacity: 0.5 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as Easing }}
            >
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
              Limited Stock!
            </motion.p>
          )}

          {/* Footer Actions - This div has mt-auto and will always be at the bottom */}
          <div className="mt-auto pt-2">
            {/* Mobile-specific layout: original price, discount, and favorite icon */}
            <div className="flex items-center justify-between md:hidden">
              {originalUnitPrice && unitPrice < originalUnitPrice && (
                <div className="flex items-center gap-2">
                  <p className="text-xs text-gray-400 line-through">
                    {originalUnitPrice?.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                  </p>
                  {discount > 0 && (
                    <Badge variant="destructive" className="text-xs font-medium px-1.5 py-0.5">
                      -{discount}%
                    </Badge>
                  )}
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleToggleFavorite}
              >
                <Heart className={cn("h-4 w-4", favorited && "fill-red-500 text-red-500")} />
              </Button>
            </div>

            {/* Desktop-specific layout: View Details link and favorite icon */}
            <div className="hidden md:flex items-center justify-between">
              <Link to={`/products/${product.id}`} className="inline-flex" onClick={(e) => e.stopPropagation()}>
                <span className="text-xs text-muted-foreground hover:underline">View Details</span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full"
                onClick={handleToggleFavorite}
              >
                <Heart className={cn("h-4 w-4", favorited && "fill-red-500 text-red-500")} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
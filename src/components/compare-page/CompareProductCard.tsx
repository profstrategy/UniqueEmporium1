"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, Scale, X, Shirt, Baby, Gem, Ruler, Palette, Tag } from "lucide-react"; // Updated icons
import { Badge } from "@/components/ui/badge";
import { Link, useLocation } from "react-router-dom";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import { useCart } from "@/context/CartContext.tsx";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/components/products/ProductCard.tsx";

interface CompareProductCardProps {
  product: Product;
  onRemove: (productId: string) => void;
  disableEntryAnimation?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const CompareProductCard = ({ product, onRemove, disableEntryAnimation = false }: CompareProductCardProps) => {
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const { addToCart } = useCart();
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Default specs if none are provided or if a spec icon is missing
  const defaultSpecs = [
    { icon: Shirt, label: "Material", value: "N/A" },
    { icon: Ruler, label: "Fit", value: "N/A" },
    { icon: Palette, label: "Color", value: "N/A" },
    { icon: Tag, label: "Brand", value: "N/A" },
    { icon: Gem, label: "Condition", value: "N/A" },
  ];

  // Merge provided specs with defaults, prioritizing provided
  const displaySpecs = defaultSpecs.map(defaultSpec => {
    const foundSpec = product.specs?.find(s => s.label === defaultSpec.label);
    return foundSpec || defaultSpec;
  });

  const favorited = isFavorited(product.id);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorited) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product);
    setIsAddingToCart(false);
  };

  return (
    <motion.div
      variants={disableEntryAnimation ? {} : fadeInUp}
      initial={disableEntryAnimation ? null : "hidden"}
      animate={disableEntryAnimation ? null : "visible"}
      viewport={{ once: true, amount: 0.2 }}
      className="relative h-full flex flex-col"
    >
      <Card className="relative flex h-full flex-col overflow-hidden rounded-2xl shadow-lg">
        {/* Remove Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 h-8 w-8 rounded-full bg-background/80 hover:bg-background"
          onClick={() => onRemove(product.id)}
          aria-label={`Remove ${product.name} from comparison`}
        >
          <X className="h-4 w-4" />
        </Button>

        {/* Product Image */}
        <Link to={`/products/${product.id}`} className="block h-[180px] w-full overflow-hidden bg-gray-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="h-full w-full object-contain"
          />
        </Link>

        <CardContent className="flex flex-col flex-grow p-4 text-left">
          {/* Product Name */}
          <Link to={`/products/${product.id}`}>
            <h3 className="font-poppins font-semibold text-base text-card-foreground line-clamp-2 mb-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>{product.rating.toFixed(1)} ({product.reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <p className="font-bold text-lg text-primary">
              {product.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
            </p>
            {product.originalPrice && product.price < product.originalPrice && (
              <>
                <p className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
                </p>
                {discount > 0 && (
                  <Badge variant="destructive" className="text-xs font-medium px-1.5 py-0.5">
                    -{discount}%
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Key Specifications */}
          <div className="mt-auto pt-4 border-t border-border">
            <h4 className="font-semibold text-sm mb-3 text-foreground">Key Specifications</h4>
            <div className="space-y-2">
              {displaySpecs.map((spec, index) => (
                <div key={index} className="flex items-center text-xs text-muted-foreground">
                  {spec.icon && React.createElement(spec.icon, { className: "w-4 h-4 text-primary mr-2 flex-shrink-0" })}
                  <span className="font-medium text-foreground mr-1">{spec.label}:</span>
                  <span className="truncate">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Button className="w-full" onClick={handleAddToCart} disabled={isAddingToCart}>
            {isAddingToCart ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
              </>
            )}
          </Button>
          <Button variant="outline" className="w-full" onClick={handleToggleFavorite}>
            <Heart className={cn("mr-2 h-4 w-4", favorited && "fill-red-500 text-red-500")} /> {favorited ? "Remove from Favorites" : "Add to Favorites"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default CompareProductCard;
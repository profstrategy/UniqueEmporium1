"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Heart, ShoppingCart, Scale, X, Cpu, MemoryStick, HardDrive, Monitor, BatteryCharging, Wifi, HardHat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Product } from "@/components/products/ProductCard.tsx"; // Re-using the Product interface

interface CompareProductCardProps {
  product: Product;
  onRemove: (productId: string) => void;
  disableEntryAnimation?: boolean;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const CompareProductCard = ({ product, onRemove, disableEntryAnimation = false }: CompareProductCardProps) => {
  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Default specs if none are provided or if a spec icon is missing
  const defaultSpecs = [
    { icon: Cpu, label: "Processor", value: "N/A" },
    { icon: MemoryStick, label: "RAM", value: "N/A" },
    { icon: HardDrive, label: "Storage", value: "N/A" },
    { icon: Monitor, label: "Display", value: "N/A" },
    { icon: BatteryCharging, label: "Battery", value: "N/A" },
    { icon: Wifi, label: "Connectivity", value: "N/A" },
    { icon: HardHat, label: "OS", value: "N/A" },
  ];

  // Merge provided specs with defaults, prioritizing provided
  const displaySpecs = defaultSpecs.map(defaultSpec => {
    const foundSpec = product.specs?.find(s => s.label === defaultSpec.label);
    return foundSpec || defaultSpec;
  });

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
            <span>{product.rating.toFixed(1)} ({product.reviews} reviews)</span>
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
                  <spec.icon className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                  <span className="font-medium text-foreground mr-1">{spec.label}:</span>
                  <span className="truncate">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <div className="p-4 border-t border-border flex flex-col gap-2">
          <Button className="w-full">
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
          <Button variant="outline" className="w-full">
            <Heart className="mr-2 h-4 w-4" /> Add to Favorites
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

export default CompareProductCard;
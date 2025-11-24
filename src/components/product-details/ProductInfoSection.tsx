"use client";

import React, { useState } from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Heart, ShoppingCart, Share2, Plus, Minus, Loader2, Truck, ShieldCheck, Headset, RefreshCw, Gem, XCircle } from "lucide-react"; // Updated icons
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProductDetails as ProductDetailsType } from "@/data/products.ts";
import { useCart } from "@/context/CartContext.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface ProductInfoSectionProps {
  product: ProductDetailsType;
}

const keyFeatures = [
  { icon: Truck, title: "Fast Nationwide Delivery", description: "Get it in 2-5 business days" },
  { icon: XCircle, title: "Final Sale Policy", description: "No returns, exchanges, or refunds" }, // Updated policy
  { icon: Gem, title: "Premium Quality", description: "Curated luxury thrift" },
];

const ProductInfoSection = ({ product }: ProductInfoSectionProps) => {
  const [quantity, setQuantity] = useState(product.minOrderQuantity); // Initialize with minOrderQuantity
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(product.minOrderQuantity, prev + amount));
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    addToCart(product, quantity); // Add the current quantity
    setIsAddingToCart(false);
  };

  const handleToggleFavorite = () => {
    if (isFavorited(product.id)) {
      removeFavorite(product.id);
    } else {
      addFavorite(product);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out this amazing fashion item: ${product.name} at Unique Emporium!`,
        url: window.location.href,
      })
      .then(() => toast.success("Product link shared!"))
      .catch((error) => toast.error(`Failed to share: ${error.message}`));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success("Product link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link."));
    }
  };

  const favorited = isFavorited(product.id);
  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  const unitPrice = product.price / product.minOrderQuantity;
  const originalUnitPrice = product.originalPrice ? product.originalPrice / product.minOrderQuantity : undefined;

  // Determine which description to display
  const displayDescription = product.shortDescription || (product.fullDescription ? product.fullDescription.split('.')[0] + '.' : 'No description available.');

  return (
    <div className="space-y-6">
      {product.tag && (
        <Badge variant={product.tagVariant} className="text-sm px-3 py-1">
          {product.tag}
        </Badge>
      )}

      <h1 className="font-poppins text-3xl md:text-4xl font-bold text-foreground">
        {product.name}
      </h1>

      <p className="text-base md:text-lg text-muted-foreground">{displayDescription}</p>

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4 md:h-5 md:w-5",
                i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
              )}
            />
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {product.rating.toFixed(1)} ({product.reviewCount} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <p className="font-poppins text-3xl md:text-4xl font-bold text-primary">
          {formatCurrency(product.price)}
        </p>
        {product.originalPrice && product.price < product.originalPrice && (
          <>
            <p className="text-base md:text-xl text-gray-400 line-through">
              {formatCurrency(product.originalPrice)}
            </p>
            {discount > 0 && (
              <Badge variant="destructive" className="text-sm font-medium px-3 py-1">
                -{discount}%
              </Badge>
            )}
          </>
        )}
      </div>

      {/* MOQ and Wholesale Info */}
      <p className="text-sm text-foreground font-semibold">
        MOQ: {product.minOrderQuantity} pcs ({formatCurrency(unitPrice)}/pc)
      </p>
      {product.originalPrice && product.price < product.originalPrice && (
        <p className="text-xs text-muted-foreground italic">
          Original unit price: {formatCurrency(originalUnitPrice!)}/pc
        </p>
      )}
      <p className="text-sm text-muted-foreground italic">
        Sold in bundles only. Minimum order applies.
      </p>

      {product.limitedStock && (
        <motion.p
          className="text-sm text-red-500 font-medium flex items-center"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" as Easing }}
        >
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          Only a few left in stock!
        </motion.p>
      )}

      {/* Purchase Options Card */}
      <Card className="rounded-xl p-6 space-y-6 shadow-sm border">
        <CardContent className="p-0 space-y-6">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <Label htmlFor="quantity" className="text-base">Quantity:</Label>
            <div className="flex items-center border rounded-md">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-r-none"
                onClick={() => handleQuantityChange(-product.minOrderQuantity)}
                disabled={quantity <= product.minOrderQuantity}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => {
                  const newValue = Number(e.target.value);
                  if (!isNaN(newValue) && newValue >= product.minOrderQuantity) {
                    setQuantity(newValue);
                  } else if (newValue < product.minOrderQuantity) {
                    setQuantity(product.minOrderQuantity);
                  }
                }}
                className="w-16 text-center border-y-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                min={product.minOrderQuantity}
                step={product.minOrderQuantity}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-l-none"
                onClick={() => handleQuantityChange(product.minOrderQuantity)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 w-full h-[52px] bg-primary text-primary-foreground hover:bg-primary/90 rounded-full"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add {quantity} to Cart
                </>
              )}
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 rounded-full"
                onClick={handleToggleFavorite}
              >
                <Heart className={cn("mr-2 h-5 w-5", favorited && "fill-red-500 text-red-500")} />
                {favorited ? "Remove" : "Add to Favorites"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1 rounded-full"
                onClick={handleShare}
                aria-label="Share Product"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Shipping/Policy Info */}
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Fast nationwide delivery available
            </p>
            <p className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-destructive" /> {/* Updated icon and color */}
              Final Sale Policy: No returns, exchanges, or refunds
            </p>
            <p className="flex items-center gap-2">
              <Gem className="h-4 w-4" />
              Curated premium quality
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
        {keyFeatures.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-3 p-4 rounded-lg bg-muted/30"
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" as Easing }}
          >
            {React.createElement(feature.icon, { className: cn("h-6 w-6 flex-shrink-0 mt-1", feature.icon === XCircle ? "text-destructive" : "text-primary") })}
            <div>
              <h3 className="font-semibold text-sm text-foreground">{feature.title}</h3>
              <p className="text-xs text-muted-foreground">{feature.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductInfoSection;
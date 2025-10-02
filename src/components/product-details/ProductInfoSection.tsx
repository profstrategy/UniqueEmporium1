"use client";

import React, { useState } from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, Heart, ShoppingCart, Share2, Plus, Minus, Loader2, Truck, ShieldCheck, Headset } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ProductDetails as ProductDetailsType } from "@/data/products.ts";
import { useCart } from "@/context/CartContext.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card"; // Import Card and CardContent

interface ProductInfoSectionProps {
  product: ProductDetailsType;
}

const keyFeatures = [
  { icon: Truck, title: "Fast Delivery", description: "Get it in 2-5 business days" },
  { icon: ShieldCheck, title: "1 Year Warranty", description: "Manufacturer's guarantee" },
  { icon: Headset, title: "24/7 Support", description: "Dedicated customer service" },
];

const ProductInfoSection = ({ product }: ProductInfoSectionProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();

  const handleQuantityChange = (amount: number) => {
    setQuantity((prev) => Math.max(1, prev + amount));
  };

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    addToCart(product, quantity);
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
        text: `Check out this amazing product: ${product.name} at ElectroPro!`,
        url: window.location.href,
      })
      .then(() => toast.success("Product link shared!"))
      .catch((error) => toast.error(`Failed to share: ${error.message}`));
    } else {
      // Fallback for browsers that don't support Web Share API
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

  return (
    <div className="space-y-6">
      {product.tag && (
        <Badge variant={product.tagVariant} className="text-sm px-3 py-1">
          {product.tag}
        </Badge>
      )}

      {/* Added Category Span */}
      <span className="text-xs text-muted-foreground uppercase tracking-wide block">
        {product.category}
      </span>

      <h1 className="font-poppins text-xl md:text-4xl font-bold text-foreground"> {/* Adjusted font size */}
        {product.name}
      </h1>

      <p className="text-sm md:text-lg text-muted-foreground">{product.fullDescription.split('.')[0]}.</p> {/* Adjusted font size */}

      {/* Rating & Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-5 w-5",
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
        <p className="font-poppins text-xl md:text-4xl font-bold text-primary"> {/* Adjusted font size */}
          {formatCurrency(product.price)}
        </p>
        {product.originalPrice && product.price < product.originalPrice && (
          <>
            <p className="text-base md:text-xl text-gray-400 line-through"> {/* Adjusted font size */}
              {formatCurrency(product.originalPrice)}
            </p>
            {discount > 0 && (
              <Badge variant="destructive" className="text-xs font-medium px-3 py-1"> {/* Adjusted font size and padding */}
                -{discount}%
              </Badge>
            )}
          </>
        )}
      </div>

      {/* Stock Status */}
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
      <Card className="rounded-xl p-6 space-y-6 shadow-sm border"> {/* Added Card wrapper */}
        <CardContent className="p-0 space-y-6"> {/* Removed default CardContent padding */}
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <Label htmlFor="quantity" className="text-base">Quantity:</Label>
            <div className="flex items-center border rounded-md">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-r-none" // Adjusted size
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-16 text-center border-y-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none"
                min={1}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-l-none" // Adjusted size
                onClick={() => handleQuantityChange(1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button
              className="flex-1 w-full h-[52px]" // Adjusted height
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto" // Ensure full width on mobile
              onClick={handleToggleFavorite}
            >
              <Heart className={cn("mr-2 h-5 w-5", favorited && "fill-red-500 text-red-500")} />
              {favorited ? "Remove from Favorites" : "Add to Favorites"}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="w-full sm:w-auto h-12 sm:h-auto sm:aspect-square"
              onClick={handleShare}
              aria-label="Share Product"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Key Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border"> {/* Adjusted grid-cols */}
        {keyFeatures.map((feature, index) => (
          <motion.div
            key={index}
            className="flex items-start gap-3 p-4 rounded-lg bg-muted/30" // Adjusted padding
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5, ease: "easeOut" as Easing }}
          >
            <feature.icon className="h-6 w-6 text-primary flex-shrink-0 mt-1" /> {/* Adjusted icon size */}
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
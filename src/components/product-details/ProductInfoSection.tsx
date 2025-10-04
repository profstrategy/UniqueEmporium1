"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, ShoppingCart, Heart, Share2, Truck, ShieldCheck, RotateCcw, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useToast } from "@/hooks/use-toast";
import QuantitySelector from "@/components/common/QuantitySelector";
import { Product } from "@/types/product";

interface ProductInfoSectionProps {
  product: Product;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const ProductInfoSection = ({ product }: ProductInfoSectionProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { addFavorite, removeFavorite, isFavorited } = useFavorites();
  const { toast } = useToast();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      addToCart({ ...product, quantity });
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleFavorite = () => {
    if (isFavorited(product.id)) {
      removeFavorite(product.id);
      toast({
        title: "Removed from favorites",
        description: `${product.name} has been removed from your favorites.`,
      });
    } else {
      addFavorite(product);
      toast({
        title: "Added to favorites",
        description: `${product.name} has been added to your favorites.`,
      });
    }
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this product: ${product.name}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "Product link copied to clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const isFavoritedItem = isFavorited(product.id);

  // Calculate discount percentage
  const discountPercentage = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeInUp}
      className="space-y-6"
    >
      {/* Product Header */}
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="text-xs">
              -{discountPercentage}%
            </Badge>
          )}
          {product.tag && (
            <Badge variant={product.tagVariant || "default"} className="text-xs">
              {product.tag}
            </Badge>
          )}
        </div>
        <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.rating.toFixed(1)} ({product.reviewCount} reviews)
          </span>
        </div>
      </div>

      {/* Price and Original Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold text-primary">
          {product.price.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
        </span>
        {product.originalPrice && product.price < product.originalPrice && (
          <span className="text-lg text-muted-foreground line-through">
            {product.originalPrice.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' })}
          </span>
        )}
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 gap-3">
        {product.specs?.slice(0, 4).map((spec, index) => (
          <div key={index} className="flex items-center gap-2">
            {spec.icon && React.createElement(spec.icon, { className: "w-4 h-4 text-primary" })}
            <span className="text-sm">
              <span className="font-medium">{spec.value}</span> {spec.label}
            </span>
          </div>
        ))}
      </div>

      {/* Separator */}
      <Separator />

      {/* Purchase Options Card */}
      <div className="bg-card border border-border rounded-xl p-6 space-y-6 shadow-sm">
        <div className="space-y-6">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quantity:</span>
            <QuantitySelector
              quantity={quantity}
              setQuantity={setQuantity}
              min={1}
              max={10}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              className="flex-1 w-full h-[52px] bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Adding to Cart...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleToggleFavorite}
              >
                <Heart className={`w-5 h-5 ${isFavoritedItem ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleShare}
                disabled={isSharing}
              >
                <Share2 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Shipping/Policy Info */}
          <div className="text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <Truck className="w-4 h-4" />
              Free shipping on orders over ₦500,000
            </p>
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Professional setup assistance available
            </p>
            <p className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />
              1-year manufacturer warranty included
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductInfoSection;
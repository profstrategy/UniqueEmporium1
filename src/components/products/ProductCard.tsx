"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  isLimitedStock?: boolean;
  rating?: number;
  reviews?: number;
}

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className }) => {
  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className={cn("w-[150px] md:w-[200px] lg:w-[250px] flex flex-col", className)}>
      <div className="relative w-full h-[150px] md:h-[200px] lg:h-[250px] overflow-hidden rounded-t-lg">
        <Image
          src={product.imageUrl}
          alt={product.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-lg"
        />
        {product.isLimitedStock && (
          <Badge variant="destructive" className="absolute top-2 left-2 text-[0.6rem] px-1 py-0.5">
            Limited Stock!
          </Badge>
        )}
      </div>
      <CardContent className="p-4 flex flex-col flex-grow text-left">
        {/* Category Text */}
        <span className="text-[0.55rem] text-muted-foreground uppercase tracking-wide truncate mb-0.5 md:mb-1">
          {product.category}
        </span>

        {/* Product Name */}
        <h3 className="text-sm font-medium truncate mb-0.5 md:mb-1">
          {product.name}
        </h3>

        {/* Current Price */}
        <p className="text-base font-semibold mb-1 md:mb-2">
          ${product.price.toFixed(2)}
        </p>

        {/* "Limited Stock!" message for desktop */}
        {product.isLimitedStock && (
          <div className="hidden md:block text-[0.65rem] text-red-500 font-medium mb-2">
            Limited Stock!
          </div>
        )}

        {/* Footer Actions (Original Price, Discount, Favorite Icon) */}
        {/* Mobile-specific layout: original price, discount, and favorite icon */}
        <div className="flex items-center justify-between md:hidden">
          {product.originalPrice && product.price < product.originalPrice && (
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
              {discount > 0 && (
                <span className="text-xs font-medium text-green-600">
                  -{discount}%
                </span>
              )}
            </div>
          )}
          <Heart size={16} className="text-gray-400 hover:text-red-500 cursor-pointer" />
        </div>

        {/* Desktop-specific layout: original price, discount, and favorite icon */}
        <div className="hidden md:flex items-center justify-between mt-auto">
          {product.originalPrice && product.price < product.originalPrice ? (
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-400 line-through">
                ${product.originalPrice.toFixed(2)}
              </p>
              {discount > 0 && (
                <span className="text-sm font-medium text-green-600">
                  -{discount}%
                </span>
              )}
            </div>
          ) : (
            <div className="flex-grow"></div> // Placeholder to push heart to right
          )}
          <Heart size={18} className="text-gray-400 hover:text-red-500 cursor-pointer" />
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
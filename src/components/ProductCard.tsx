"use client";

import React from 'react';
import { Product } from '@/data/products'; // Assuming Product type is available
import { Card, CardContent } from '@/components/ui/card';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import Image from 'next/image'; // Assuming Next.js Image component or similar
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  const discount = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link href={`/product/${product.id}`} className="block h-full">
      <Card className="h-full flex flex-col rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ease-in-out">
        <CardContent className="p-0 relative">
          <AspectRatio ratio={1 / 1}>
            {product.images && product.images.length > 0 && (
              <img
                src={product.images[0]}
                alt={product.name}
                className="object-cover w-full h-full"
                loading="lazy"
              />
            )}
          </AspectRatio>
          {product.tag && (
            <Badge
              variant={product.tagVariant || "default"}
              className="absolute top-2 left-2 text-xs px-2 py-1"
            >
              {product.tag}
            </Badge>
          )}
          {discount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-2 right-2 text-xs px-2 py-1"
            >
              -{discount}%
            </Badge>
          )}
        </CardContent>
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-base font-medium text-foreground line-clamp-2 mb-1">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
            {product.category}
          </p>
          <div className="flex items-center mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                )}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({product.reviewCount})
            </span>
          </div>
          <div className="flex items-baseline gap-2 mt-auto">
            <p className="text-lg font-semibold text-primary">
              {formatCurrency(product.price)}
            </p>
            {product.originalPrice && product.price < product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                {formatCurrency(product.originalPrice)}
              </p>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProductCard;
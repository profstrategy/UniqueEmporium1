"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton.tsx"; // Import ProductCardSkeleton

const ProductDetailsSkeleton = () => {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Skeleton */}
        <Skeleton className="h-6 w-64 mb-8" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* Product Media & Purchase Options Skeleton */}
          <div className="lg:sticky lg:top-24 h-fit space-y-8">
            {/* Image Gallery Skeleton */}
            <Card className="rounded-xl overflow-hidden shadow-lg bg-muted">
              <Skeleton className="h-[300px] sm:h-[400px] md:h-[500px] w-full" />
              <div className="flex p-4 space-x-3 overflow-x-auto no-scrollbar bg-card border-t">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="flex-shrink-0 h-10 w-10 md:h-20 md:w-20 rounded-md" />
                ))}
              </div>
            </Card>
            {/* Removed 3D Viewer Skeleton */}
          </div>

          {/* Product Info & Actions Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-6 w-24" /> {/* Tag */}
            <Skeleton className="h-10 w-3/4" /> {/* Product Name */}
            <Skeleton className="h-6 w-full" /> {/* Short Description Line 1 */}
            <Skeleton className="h-6 w-11/12" /> {/* Short Description Line 2 */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-24" /> {/* Rating Stars */}
              <Skeleton className="h-4 w-32" /> {/* Review Count */}
            </div>
            <div className="flex items-baseline gap-3">
              <Skeleton className="h-10 w-1/3" /> {/* Price */}
              <Skeleton className="h-6 w-1/4" /> {/* Original Price */}
              <Skeleton className="h-6 w-16" /> {/* Discount Badge */}
            </div>
            <Skeleton className="h-4 w-48" /> {/* Limited Stock */}

            {/* Purchase Options Card Skeleton */}
            <Card className="rounded-xl p-6 space-y-6 shadow-sm border">
              <CardContent className="p-0 space-y-6">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-6 w-20" /> {/* Quantity Label */}
                  <Skeleton className="h-10 w-32" /> {/* Quantity Selector */}
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Skeleton className="flex-1 w-full h-[52px]" /> {/* Add to Cart Button */}
                  <div className="flex gap-2 w-full sm:w-auto">
                    <Skeleton className="flex-1 h-[52px]" /> {/* Add to Favorites Button */}
                    <Skeleton className="flex-1 h-[52px]" /> {/* Share Button */}
                  </div>
                </div>
                <div className="text-sm text-muted-foreground space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Key Features Grid Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                  <Skeleton className="h-6 w-6 flex-shrink-0" />
                  <div>
                    <Skeleton className="h-4 w-24 mb-1" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs Skeleton */}
        <div className="mt-12">
          <div className="flex w-full justify-center border-b bg-transparent p-0 mb-6">
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-10 w-1/3" />
          </div>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-11/12" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-10/12" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>

        {/* Recommended Products Section Skeleton */}
        <div className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[280px]">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>

        {/* Recently Viewed Products Section Skeleton */}
        <div className="mt-16 mb-20">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-8 w-64" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <div className="flex gap-2 sm:gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[280px]">
                <ProductCardSkeleton />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsSkeleton;
"use client";

import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // Assuming shadcn Skeleton component is available

const ProductCardSkeleton = () => {
  return (
    <Card className="relative h-[340px] flex flex-col overflow-hidden rounded-2xl shadow-lg animate-pulse">
      <div className="relative h-[250px] w-full overflow-hidden bg-gray-200 dark:bg-gray-700">
        <Skeleton className="h-full w-full" />
      </div>

      <CardContent className="p-2 flex flex-col flex-grow text-left">
        <Skeleton className="h-3 w-1/3 mb-1" /> {/* Category */}
        <Skeleton className="h-5 w-2/3 mb-1" /> {/* Product Name */}
        <Skeleton className="h-4 w-1/4 mb-1" /> {/* Price */}
        <Skeleton className="h-3 w-1/2 mb-1" /> {/* Limited Stock / Rating */}
        
        <div className="mt-auto pt-2">
          <Skeleton className="h-4 w-full" /> {/* View Details / Favorite */}
        </div>
      </CardContent>

      {/* Removed the specs section from the skeleton as well */}
    </Card>
  );
};

export default ProductCardSkeleton;
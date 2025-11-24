"use client";

import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Define Review interface locally since it's not exported from products.ts
interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
}

interface ProductReviewsTabProps {
  reviews: Review[];
  productId?: string; // Added to resolve TS error 2
}

const ProductReviewsTab: React.FC<ProductReviewsTabProps> = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p className="text-lg">No reviews yet.</p>
        <p className="text-sm">Be the first to review this product!</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < fullStars ? "fill-yellow-500 text-yellow-500" : "fill-gray-300 text-gray-300"
          )}
        />
      );
    }
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  return (
    <div className="space-y-8">
      {reviews.map((review, index) => (
        <div key={index} className="border-b pb-6 last:border-b-0">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-lg md:text-xl text-foreground">{review.title}</h4>
            {renderStars(review.rating)}
          </div>
          <div className="mt-2">
            <p className="text-xs text-foreground mb-2 flex items-center"> {/* Changed text-sm to text-xs for better mobile compactness */}
              By <span className="font-medium text-xs ml-1">{review.author}</span> on {new Date(review.date).toLocaleDateString()}
              {review.isVerifiedBuyer && (
                <Badge variant="secondary" className="ml-3 text-xs px-2 py-0.5 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" /> Verified Buyer
                </Badge>
              )}
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductReviewsTab;
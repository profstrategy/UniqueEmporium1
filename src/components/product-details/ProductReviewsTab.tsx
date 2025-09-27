"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { motion, Easing } from "framer-motion";
import { ProductDetails as ProductDetailsType } from "@/data/products.ts";
import { cn } from "@/lib/utils";

interface ProductReviewsTabProps {
  reviews: ProductDetailsType['reviews'];
}

const reviewVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const ProductReviewsTab = ({ reviews }: ProductReviewsTabProps) => {
  if (reviews.length === 0) {
    return (
      <Card className="rounded-xl shadow-sm">
        <CardContent className="p-6 text-center text-muted-foreground">
          No reviews yet. Be the first to review this product!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-8">
          {reviews.map((review, index) => (
            <motion.div key={review.id} variants={reviewVariants} initial="hidden" animate="visible">
              <div className="flex items-center mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                    )}
                  />
                ))}
                <span className="ml-3 font-semibold text-foreground">{review.title}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                By <span className="font-medium text-foreground">{review.author}</span> on {new Date(review.date).toLocaleDateString()}
              </p>
              <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
              {index < reviews.length - 1 && <Separator className="mt-8" />}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductReviewsTab;
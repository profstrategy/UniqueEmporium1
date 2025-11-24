"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Star, CheckCircle, MessageSquarePlus, Edit, Loader2 } from "lucide-react"; // Added Loader2
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import ReviewForm from "@/components/customer-reviews/ReviewForm.tsx"; // Import the new ReviewForm
import { useAuth } from "@/context/AuthContext.tsx"; // Import useAuth
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

// Define Review interface locally since it's not exported from products.ts
interface Review {
  id: string;
  user_id: string; // Added user_id to check ownership
  author: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  isVerifiedBuyer: boolean;
}

interface ProductReviewsTabProps {
  reviews: Review[];
  productId: string; // productId is now required
}

const ProductReviewsTab: React.FC<ProductReviewsTabProps> = ({ productId }) => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [productReviews, setProductReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [userExistingReview, setUserExistingReview] = useState<Review | null>(null);
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);

  const fetchProductReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        id,
        user_id,
        rating,
        title,
        comment,
        is_verified_buyer,
        created_at,
        profiles(first_name, last_name)
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching product reviews:", error);
      toast.error("Failed to load product reviews.");
      setProductReviews([]);
    } else {
      const fetchedReviews: Review[] = data.map((review: any) => ({
        id: review.id,
        user_id: review.user_id,
        author: `${review.profiles?.first_name || ''} ${review.profiles?.last_name || ''}`.trim() || 'Anonymous',
        rating: review.rating,
        date: review.created_at,
        title: review.title,
        comment: review.comment,
        isVerifiedBuyer: review.is_verified_buyer,
      }));
      setProductReviews(fetchedReviews);

      // Check if the current user has an existing review
      if (user) {
        const existing = fetchedReviews.find(review => review.user_id === user.id);
        setUserExistingReview(existing || null);
      } else {
        setUserExistingReview(null);
      }
    }
    setIsLoadingReviews(false);
  }, [productId, user]);

  useEffect(() => {
    fetchProductReviews();
  }, [fetchProductReviews]);

  const handleReviewSubmitted = () => {
    fetchProductReviews(); // Re-fetch reviews after a new one is submitted
    setIsEditReviewModalOpen(false); // Close modal if it was an edit
  };

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

  const userCanReview = user && !isLoadingAuth && !userExistingReview;
  const userCanEditReview = user && !isLoadingAuth && userExistingReview;

  return (
    <div className="space-y-8">
      {/* Review Form Section */}
      {userCanReview && (
        <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
      )}

      {userCanEditReview && (
        <div className="text-center py-4 border rounded-xl bg-muted/20">
          <p className="text-muted-foreground mb-2">You have already reviewed this product.</p>
          <Dialog open={isEditReviewModalOpen} onOpenChange={setIsEditReviewModalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Edit className="h-4 w-4" /> Edit Your Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50 overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Edit className="h-6 w-6 text-primary" /> Edit Your Review
                </DialogTitle>
              </DialogHeader>
              <ReviewForm
                productId={productId}
                onReviewSubmitted={handleReviewSubmitted}
                existingReview={userExistingReview}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}

      {/* Display Reviews */}
      {isLoadingReviews ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <p className="ml-3 text-muted-foreground">Loading reviews...</p>
        </div>
      ) : productReviews.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          <p className="text-lg">No reviews yet.</p>
          <p className="text-sm">Be the first to review this product!</p>
        </div>
      ) : (
        productReviews.map((review, index) => (
          <div key={review.id} className="border-b pb-6 last:border-b-0">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-lg md:text-xl text-foreground">{review.title}</h4>
              {renderStars(review.rating)}
            </div>
            <div className="mt-2">
              <p className="text-xs text-foreground mb-2 flex items-center">
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
        ))
      )}
    </div>
  );
};

export default ProductReviewsTab;
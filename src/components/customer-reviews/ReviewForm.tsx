"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2, MessageSquarePlus, CheckCircle } from "lucide-react"; // Added CheckCircle
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext.tsx";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom"; // Import Link for sign-in button

// Zod schema for review form
const reviewFormSchema = z.object({
  rating: z.coerce.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title cannot exceed 100 characters"),
  comment: z.string().min(10, "Comment must be at least 10 characters").max(500, "Comment cannot exceed 500 characters"),
});

type ReviewFormData = z.infer<typeof reviewFormSchema>;

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void; // Callback to refresh reviews in parent
  existingReview?: { id: string; rating: number; title: string; comment: string; } | null; // For editing
}

const ReviewForm = ({ productId, onReviewSubmitted, existingReview }: ReviewFormProps) => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [isVerifiedBuyer, setIsVerifiedBuyer] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: existingReview ? {
      rating: existingReview.rating,
      title: existingReview.title,
      comment: existingReview.comment,
    } : {
      rating: 0,
      title: "",
      comment: "",
    },
  });

  const currentRating = watch("rating");

  // Check if user has already reviewed this product and if they are a verified buyer
  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user || isLoadingAuth) {
        setUserHasReviewed(false);
        setIsVerifiedBuyer(false);
        return;
      }

      // Check for existing review
      const { data: existingReviews, error: reviewError } = await supabase
        .from('product_reviews')
        .select('id, rating, title, comment, is_verified_buyer')
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (reviewError) {
        console.error("Error checking existing review:", reviewError);
        toast.error("Failed to check review status.");
        return;
      }

      if (existingReviews && existingReviews.length > 0) {
        setUserHasReviewed(true);
        const firstReview = existingReviews[0];
        setIsVerifiedBuyer(firstReview.is_verified_buyer);
        // If we are not in edit mode, pre-fill the form with the existing review
        if (!existingReview) {
          reset({
            rating: firstReview.rating,
            title: firstReview.title,
            comment: firstReview.comment,
          });
        }
      } else {
        setUserHasReviewed(false);
        // If no existing review, check verified buyer status via RPC
        const { data: verifiedBuyerStatus, error: rpcError } = await supabase.rpc('is_verified_buyer', {
          p_user_id: user.id,
          p_product_id: productId,
        });

        if (rpcError) {
          console.error("Error checking verified buyer status:", rpcError);
          // Don't show toast for this, it's a background check
        } else {
          setIsVerifiedBuyer(verifiedBuyerStatus || false);
        }
      }
    };

    checkUserStatus();
  }, [user, isLoadingAuth, productId, existingReview, reset]);

  const handleStarClick = useCallback((starIndex: number) => {
    setValue("rating", starIndex + 1, { shouldValidate: true });
  }, [setValue]);

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    setIsSubmittingReview(true);
    toast.loading(existingReview ? "Updating review..." : "Submitting review...", { id: "review-submit" });

    const reviewPayload = {
      user_id: user.id,
      product_id: productId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      is_verified_buyer: isVerifiedBuyer, // Set based on current status
    };

    let error;
    if (existingReview) {
      const { error: updateError } = await supabase
        .from('product_reviews')
        .update(reviewPayload)
        .eq('id', existingReview.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('product_reviews')
        .insert([reviewPayload]);
      error = insertError;
    }

    if (error) {
      toast.dismiss("review-submit");
      toast.error(existingReview ? "Failed to update review." : "Failed to submit review.", { description: error.message });
      console.error("Review submission error:", error);
    } else {
      toast.dismiss("review-submit");
      toast.success(existingReview ? "Review updated successfully!" : "Review submitted successfully!", {
        description: "Thank you for your feedback!",
      });
      reset(); // Clear form after submission
      onReviewSubmitted(); // Trigger parent to re-fetch reviews
      setUserHasReviewed(true); // Mark that user has now reviewed
    }
    setIsSubmittingReview(false);
  };

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading user status...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p className="text-lg mb-4">Please sign in to write a review.</p>
        <Button asChild>
          <Link to="/auth">Sign In</Link>
        </Button>
      </div>
    );
  }

  if (userHasReviewed && !existingReview) {
    return (
      <div className="py-8 text-center text-muted-foreground">
        <p className="text-lg mb-4">You have already submitted a review for this product.</p>
        <p className="text-sm">Thank you for your feedback!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-6 border rounded-xl shadow-sm bg-card">
      <h3 className="font-poppins font-bold text-xl text-foreground flex items-center gap-2">
        <MessageSquarePlus className="h-6 w-6 text-primary" /> {existingReview ? "Edit Your Review" : "Write a Review"}
      </h3>
      <p className="text-sm text-muted-foreground">
        Share your experience with this product. Your feedback helps others!
      </p>

      {isVerifiedBuyer && (
        <div className="flex items-center text-sm text-green-600 font-medium">
          <CheckCircle className="h-4 w-4 mr-2" /> You are a verified buyer for this product.
        </div>
      )}

      {/* Rating Input */}
      <div className="space-y-2">
        <Label htmlFor="rating" className="text-base">Your Rating</Label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              className={cn(
                "h-8 w-8 cursor-pointer transition-colors",
                index < currentRating ? "fill-yellow-400 text-yellow-400" : "fill-gray-300 text-gray-300",
              )}
              onClick={() => handleStarClick(index)}
            />
          ))}
        </div>
        {errors.rating && <p className="text-destructive text-sm mt-1">{errors.rating.message}</p>}
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <Label htmlFor="title">Review Title</Label>
        <Input
          id="title"
          {...register("title")}
          className={cn(errors.title && "border-destructive")}
          placeholder="e.g., Amazing quality and style!"
        />
        {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
      </div>

      {/* Comment Textarea */}
      <div className="space-y-2">
        <Label htmlFor="comment">Your Comment</Label>
        <Textarea
          id="comment"
          {...register("comment")}
          className={cn(errors.comment && "border-destructive")}
          rows={4}
          placeholder="Describe your experience with the product..."
        />
        {errors.comment && <p className="text-destructive text-sm">{errors.comment.message}</p>}
      </div>

      <Button type="submit" className="w-full" size="lg" disabled={isSubmittingReview}>
        {isSubmittingReview ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> {existingReview ? "Updating Review..." : "Submitting Review..."}
          </>
        ) : (
          existingReview ? "Update Review" : "Submit Review"
        )}
      </Button>
    </form>
  );
};

export default ReviewForm;
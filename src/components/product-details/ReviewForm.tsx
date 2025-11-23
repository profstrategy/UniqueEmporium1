"use client";

import React, { useState } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Send, Loader2, LogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext.tsx";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "Rating is required").max(5, "Rating must be between 1 and 5"),
  title: z.string()
    .min(5, "Title must be at least 5 characters")
    .refine(val => val.trim().split(/\s+/).length <= 3, {
      message: "Review Title cannot exceed 3 words.",
    }),
  comment: z.string().min(20, "Comment must be at least 20 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const ReviewForm = ({ productId, onReviewSubmitted }: ReviewFormProps) => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const navigate = useNavigate();
  const [hoverRating, setHoverRating] = useState(0);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      comment: "",
    },
  });

  const currentRating = watch("rating");

  const handleStarClick = (rating: number) => {
    setValue("rating", rating, { shouldValidate: true });
  };

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) {
      toast.error("Authentication Required", { description: "Please sign in to submit a review." });
      return;
    }

    // Check if the user is a verified buyer (Conceptual check, actual verification logic is complex)
    // For simplicity, we will assume the user is a verified buyer if they have a completed order.
    // NOTE: A real implementation would require a Supabase Edge Function or complex RLS to verify purchase history.
    
    const newReview = {
      user_id: user.id,
      product_id: productId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      // is_verified_buyer: true, // Set to true for now, assuming we'll implement verification later
    };

    const { error } = await supabase
      .from('product_reviews')
      .insert([newReview]);

    if (error) {
      console.error("Error submitting review:", error);
      toast.error("Failed to submit review.", { description: error.message });
    } else {
      toast.success("Review submitted successfully!", { description: "Thank you for your feedback. It will appear shortly." });
      reset();
      onReviewSubmitted(); // Trigger parent component to refresh reviews
    }
  };

  if (isLoadingAuth) {
    return (
      <Card className="rounded-2xl shadow-sm p-6 text-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary mx-auto" />
        <p className="text-sm text-muted-foreground mt-2">Loading authentication status...</p>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="rounded-2xl shadow-sm p-6 text-center">
        <h3 className="font-semibold text-xl mb-3 text-foreground">Share Your Thoughts</h3>
        <p className="text-muted-foreground mb-4">You must be logged in to submit a product review.</p>
        <Button onClick={() => navigate("/auth", { state: { from: window.location.pathname } })}>
          <LogIn className="h-4 w-4 mr-2" /> Sign In to Review
        </Button>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Send className="h-6 w-6 text-primary" /> Write a Review
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Rating Input */}
          <div className="space-y-2">
            <Label htmlFor="rating" className="text-base">Your Rating</Label>
            <div
              className="flex items-center space-x-1"
              onMouseLeave={() => setHoverRating(0)}
            >
              {Array.from({ length: 5 }).map((_, i) => {
                const ratingValue = i + 1;
                return (
                  <motion.div
                    key={i}
                    onMouseEnter={() => setHoverRating(ratingValue)}
                    onClick={() => handleStarClick(ratingValue)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="cursor-pointer"
                  >
                    <Star
                      className={cn(
                        "h-8 w-8 transition-colors duration-200",
                        (hoverRating >= ratingValue || currentRating >= ratingValue)
                          ? "fill-yellow-500 text-yellow-500"
                          : "text-muted-foreground",
                      )}
                    />
                  </motion.div>
                );
              })}
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
              placeholder="E.g., Amazing quality and fast delivery!"
            />
            {errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
          </div>

          {/* Comment Input */}
          <div className="space-y-2">
            <Label htmlFor="comment">Your Comment</Label>
            <Textarea 
              id="comment" 
              rows={4} 
              {...register("comment")} 
              className={cn(errors.comment && "border-destructive")} 
              placeholder="E.g., I was impressed by the fabric quality and the fit was perfect. Highly recommend this bundle!"
            />
            {errors.comment && <p className="text-destructive text-sm">{errors.comment.message}</p>}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting || currentRating === 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" /> Submit Review
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReviewForm;
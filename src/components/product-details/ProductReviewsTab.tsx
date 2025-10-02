"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Star, User, Mail, MessageSquare, Loader2, CheckCircle2 } from "lucide-react";
import { motion, Easing } from "framer-motion";
import { ProductDetails as ProductDetailsType } from "@/data/products.ts";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface ProductReviewsTabProps {
  reviews: ProductDetailsType['reviews'];
  productId: string;
}

interface NewReviewFormData {
  rating: number;
  title: string;
  comment: string;
  author: string;
  email: string;
}

const reviewVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const ProductReviewsTab = ({ reviews, productId }: ProductReviewsTabProps) => {
  const [newReview, setNewReview] = useState<NewReviewFormData>({
    rating: 0,
    title: "",
    comment: "",
    author: "",
    email: "",
  });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [submittedReviews, setSubmittedReviews] = useState<ProductDetailsType['reviews']>([]);

  const handleRatingChange = (newRating: number) => {
    setNewReview((prev) => ({ ...prev, rating: newRating }));
  };

  const handleReviewInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewReview((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      toast.error("Please provide a star rating.");
      return;
    }
    if (!newReview.title.trim() || !newReview.comment.trim() || !newReview.author.trim()) {
      toast.error("Please fill in all required fields (Rating, Title, Comment, Name).");
      return;
    }

    setIsSubmittingReview(true);
    toast.loading("Submitting your review...", { id: "review-submit" });

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const submittedReviewItem = {
      id: `new-rev-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      isVerifiedBuyer: false,
      ...newReview,
    };

    setSubmittedReviews((prev) => [submittedReviewItem, ...prev]);
    setNewReview({ rating: 0, title: "", comment: "", author: "", email: "" });

    toast.dismiss("review-submit");
    toast.success("Review submitted successfully!", {
      description: "Thank you for your feedback!",
    });
    setIsSubmittingReview(false);
  };

  const allReviews = [...submittedReviews, ...reviews];

  const averageRating = allReviews.length > 0
    ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1)
    : "N/A";

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-6">
        {/* Average Rating Summary */}
        {allReviews.length > 0 && (
          <motion.div variants={reviewVariants} initial="hidden" animate="visible" className="mb-8 text-center">
            <h3 className="font-poppins text-lg md:text-3xl font-bold text-foreground mb-2">{averageRating} / 5</h3> {/* Adjusted font size */}
            <div className="flex items-center justify-center mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-5 w-5", // Adjusted size
                    i < Math.floor(parseFloat(averageRating as string)) ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                  )}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Based on {allReviews.length} reviews</p>
            <Separator className="my-8" />
          </motion.div>
        )}

        {/* Review Form */}
        <motion.div variants={reviewVariants} initial="hidden" animate="visible" className="mb-12">
          <Card className="p-6 rounded-xl border shadow-sm"> {/* Added Card wrapper */}
            <CardContent className="p-0"> {/* Removed default CardContent padding */}
              <h3 className="font-poppins font-semibold text-xl text-foreground mb-4">Write a Review</h3> {/* Added font-poppins */}
              <form onSubmit={handleSubmitReview} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="review-rating">Your Rating</Label>
                  <div className="flex items-center gap-1" id="review-rating">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-6 w-6 cursor-pointer transition-colors", // Adjusted size
                          i < newReview.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground hover:text-yellow-300",
                        )}
                        onClick={() => handleRatingChange(i + 1)}
                      />
                    ))}
                  </div>
                  {newReview.rating === 0 && <p className="text-destructive text-sm">Please select a rating</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review-title">Review Title</Label>
                  <Input
                    id="review-title"
                    name="title"
                    placeholder="Summarize your experience"
                    value={newReview.title}
                    onChange={handleReviewInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="review-comment">Your Comment</Label>
                  <Textarea
                    id="review-comment"
                    name="comment"
                    placeholder="Tell us more about the product..."
                    rows={4}
                    value={newReview.comment}
                    onChange={handleReviewInputChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="review-author">Your Name</Label>
                    <Input
                      id="review-author"
                      name="author"
                      placeholder="John Doe"
                      value={newReview.author}
                      onChange={handleReviewInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="review-email">Your Email (Optional)</Label>
                    <Input
                      id="review-email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      value={newReview.email}
                      onChange={handleReviewInputChange}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmittingReview}>
                  {isSubmittingReview ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <Separator className="my-8" />

        {/* Review List */}
        <h3 className="font-semibold text-xl text-foreground mb-6">Customer Reviews</h3>
        {allReviews.length === 0 ? (
          <motion.div variants={reviewVariants} initial="hidden" animate="visible" className="text-center text-muted-foreground py-10">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p>No reviews yet. Be the first to share your thoughts!</p>
          </motion.div>
        ) : (
          <div className="space-y-8">
            {allReviews.map((review, index) => (
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
                <p className="text-sm text-foreground mb-2 flex items-center"> {/* Adjusted text-muted-foreground to text-foreground */}
                  By <span className="font-medium text-sm ml-1">{review.author}</span> on {new Date(review.date).toLocaleDateString()} {/* Adjusted font size */}
                  {review.isVerifiedBuyer && (
                    <Badge variant="secondary" className="ml-3 text-xs px-2 py-1 flex items-center"> {/* Adjusted padding */}
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Verified Purchase
                    </Badge>
                  )}
                </p>
                <p className="text-foreground leading-relaxed">{review.comment}</p> {/* Adjusted text-muted-foreground to text-foreground */}
                {index < allReviews.length - 1 && <Separator className="mt-8 border-border" />} {/* Added border-border */}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductReviewsTab;
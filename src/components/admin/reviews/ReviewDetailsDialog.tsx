"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Copy, MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { AdminReview } from "@/pages/admin/ReviewsManagement"; // Import the interface

interface ReviewDetailsDialogProps {
  review: AdminReview;
  isOpen: boolean;
  onClose: () => void;
}

const ReviewDetailsDialog = ({ review, isOpen, onClose }: ReviewDetailsDialogProps) => {
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-5 w-5",
            i < rating ? "fill-yellow-500 text-yellow-500" : "fill-gray-300 text-gray-300"
          )}
        />
      );
    }
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-primary" /> Full Review Details
          </DialogTitle>
          <DialogDescription>
            Review by {review.customer_name} for product {review.product_name}.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Customer Info */}
          <div className="border-b pb-3">
            <h3 className="font-semibold text-lg mb-2 text-foreground">Customer Details</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p className="text-muted-foreground">Name:</p>
              <p className="font-medium text-foreground">{review.customer_name}</p>
              
              <p className="text-muted-foreground">Email:</p>
              <div className="flex items-center gap-1">
                <p className="font-medium text-foreground break-all">{review.customer_email}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(review.customer_email, 'Email')}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Email</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>

              <p className="text-muted-foreground">Phone:</p>
              <div className="flex items-center gap-1">
                <p className="font-medium text-foreground">{review.customer_phone}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(review.customer_phone, 'Phone')}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Phone</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Review Content */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg mb-2 text-foreground">Review Content</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <p className="text-muted-foreground">Product:</p>
              <p className="font-medium text-primary">{review.product_name}</p>

              <p className="text-muted-foreground">Date:</p>
              <p className="font-medium text-foreground">{new Date(review.created_at).toLocaleDateString()}</p>

              <p className="text-muted-foreground">Rating:</p>
              <div>{renderStars(review.rating)}</div>

              <p className="text-muted-foreground">Verified Buyer:</p>
              <Badge variant={review.is_verified_buyer ? "default" : "secondary"} className="w-fit">
                {review.is_verified_buyer ? "Yes" : "No"}
              </Badge>
            </div>

            <div className="pt-3 border-t">
              <p className="text-muted-foreground mb-1">Title:</p>
              <p className="font-bold text-foreground text-xl">{review.title}</p>
            </div>

            <div className="pt-3">
              <p className="text-muted-foreground mb-1">Comment:</p>
              <p className="text-foreground italic leading-relaxed">{review.comment}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDetailsDialog;
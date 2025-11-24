"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  MessageSquare,
  Search,
  Filter,
  Trash2,
  Star,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// Define the AdminReview interface based on your database structure and joined data
export interface AdminReview {
  id: string;
  user_id: string;
  product_id: string;
  product_name: string; // From products table
  customer_name: string; // From profiles table
  customer_email: string; // From profiles table
  rating: number;
  title: string;
  comment: string;
  is_verified_buyer: boolean;
  created_at: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const ReviewsManagement = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");
  const [filterVerified, setFilterVerified] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 10;

  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingReviewId, setDeletingReviewId] = useState<string | null>(null);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const fetchReviews = useCallback(async () => {
    setIsLoadingReviews(true);
    const { data, error } = await supabase
      .from('product_reviews')
      .select(`
        id,
        user_id,
        product_id,
        rating,
        title,
        comment,
        is_verified_buyer,
        created_at,
        profiles(first_name, last_name, email),
        products!product_reviews_product_id_fkey(name) -- Explicitly specify the foreign key
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      toast.error("Failed to load reviews.", { description: error.message });
      setReviews([]);
    } else {
      const fetchedReviews: AdminReview[] = data.map((review: any) => ({
        id: review.id,
        user_id: review.user_id,
        product_id: review.product_id,
        product_name: review.products?.name || 'N/A', // Now we can get the product name
        customer_name: `${review.profiles?.first_name || ''} ${review.profiles?.last_name || ''}`.trim() || 'N/A',
        customer_email: review.profiles?.email || 'N/A',
        rating: review.rating,
        title: review.title,
        comment: review.comment,
        is_verified_buyer: review.is_verified_buyer,
        created_at: review.created_at,
      }));
      setReviews(fetchedReviews);
    }
    setIsLoadingReviews(false);
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const filteredReviews = useMemo(() => {
    let filtered = reviews;

    if (searchTerm) {
      filtered = filtered.filter(
        (review) =>
          review.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          review.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterRating !== "all") {
      filtered = filtered.filter(
        (review) => review.rating === parseInt(filterRating)
      );
    }

    if (filterVerified !== "all") {
      filtered = filtered.filter(
        (review) => review.is_verified_buyer === (filterVerified === "true")
      );
    }

    return filtered;
  }, [reviews, searchTerm, filterRating, filterVerified]);

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(filteredReviews.length / reviewsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  const handleDeleteReviewClick = (reviewId: string) => {
    setDeletingReviewId(reviewId);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteReview = useCallback(async () => {
    if (deletingReviewId) {
      const { error } = await supabase
        .from('product_reviews')
        .delete()
        .eq('id', deletingReviewId);

      if (error) {
        toast.error("Failed to delete review.", { description: error.message });
      } else {
        toast.info(`Review ${deletingReviewId} deleted.`);
        setDeletingReviewId(null);
        setIsDeleteAlertOpen(false);
        fetchReviews(); // Re-fetch reviews to update the list
      }
    }
  }, [deletingReviewId, fetchReviews]);

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "fill-yellow-500 text-yellow-500" : "fill-gray-300 text-gray-300"
          )}
        />
      );
    }
    return <div className="flex items-center space-x-0.5">{stars}</div>;
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground" variants={fadeInUp}>
          Reviews Management
        </motion.h1>
        <motion.p className="text-base md:text-lg text-muted-foreground" variants={fadeInUp}>
          Manage all customer product reviews.
        </motion.p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" /> All Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 p-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b p-4">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Review Title, Comment, Product, or Customer..."
                className="w-full pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterVerified} onValueChange={setFilterVerified}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Verified Buyer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Buyers</SelectItem>
                  <SelectItem value="true">Verified Buyers</SelectItem>
                  <SelectItem value="false">Unverified Buyers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoadingReviews ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading reviews...</p>
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p>No reviews found matching your filters.</p>
              <Button onClick={() => { setSearchTerm(""); setFilterRating("all"); setFilterVerified("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Review ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {currentReviews.map((review) => (
                      <motion.tr
                        key={review.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell className="font-medium text-xs">{review.id}</TableCell>
                        <TableCell className="font-medium">{review.product_name}</TableCell>
                        <TableCell>
                          <div className="font-medium">{review.customer_name}</div>
                          <div className="text-sm text-muted-foreground">{review.customer_email}</div>
                        </TableCell>
                        <TableCell>{renderStars(review.rating)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{review.title}</TableCell>
                        <TableCell>
                          {review.is_verified_buyer ? (
                            <Badge variant="default" className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" /> Yes
                            </Badge>
                          ) : (
                            <Badge variant="secondary">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <AlertDialog> {/* Added AlertDialog wrapper */}
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="icon" onClick={() => handleDeleteReviewClick(review.id)}>
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </AlertDialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete Review</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the review by "{review.customer_name}" for "{review.product_name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={confirmDeleteReview}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog> {/* Closed AlertDialog wrapper */}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredReviews.length > reviewsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstReview + 1} to {Math.min(indexOfLastReview, filteredReviews.length)} of {filteredReviews.length} reviews
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="hidden sm:flex"
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ReviewsManagement;
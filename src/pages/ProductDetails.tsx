"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { ProductDetails as ProductDetailsType, getRecentlyViewedProducts } from "@/data/products.ts";
import ProductBreadcrumb from "@/components/product-details/ProductBreadcrumb.tsx";
import ProductImageGallery from "@/components/product-details/ProductImageGallery.tsx";
import ProductInfoSection from "@/components/product-details/ProductInfoSection.tsx";
import ProductTabs from "@/components/product-details/ProductTabs.tsx";
import RecommendedProductsSection from "@/components/recommended-products/RecommendedProductsSection.tsx";
import RecentlyViewedProductsSection from "@/components/product-details/RecentlyViewedProductsSection.tsx";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ProductDetailsSkeleton from "@/components/product-details/ProductDetailsSkeleton.tsx";
import { fetchProductByIdFromSupabase } from "@/integrations/supabase/products";
import { Product } from "@/components/products/ProductCard.tsx";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const RECENTLY_VIEWED_KEY = "recentlyViewedProducts";
const MAX_RECENTLY_VIEWED = 8;

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyViewedProductIds, setRecentlyViewedProductIds] = useState<string[]>([]);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0); // New state for live review count

  useEffect(() => {
    setLoading(true);
    setError(null);
    const loadProductAndReviews = async () => {
      if (productId) {
        const fetchedProduct = await fetchProductByIdFromSupabase(productId);
        if (fetchedProduct) {
          setProduct(fetchedProduct);

          // Fetch live review count from product_reviews table
          const { count, error: countError } = await supabase
            .from('product_reviews')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', productId);

          if (countError) {
            console.error("Error fetching review count:", countError);
            setTotalReviewsCount(0); // Default to 0 on error
          } else {
            setTotalReviewsCount(count || 0);
          }

          setRecentlyViewedProductIds((prevIds) => {
            const currentViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]") as string[];
            const updatedViewed = [productId, ...currentViewed.filter(id => id !== productId)].slice(0, MAX_RECENTLY_VIEWED);
            localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(updatedViewed));
            return updatedViewed;
          });

        } else {
          setError("Product not found.");
          toast.error("Product not found.", { description: `No product found with ID: ${productId}` });
        }
      } else {
        setError("Invalid product ID.");
        toast.error("Invalid product ID.", { description: "Please provide a valid product identifier." });
      }
      setLoading(false);
    };
    loadProductAndReviews();
  }, [productId]);

  useEffect(() => {
    const storedViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]") as string[];
    setRecentlyViewedProductIds(storedViewed);
  }, []);

  const [actualRecentlyViewedProducts, setActualRecentlyViewedProducts] = useState<Product[]>([]);
  useEffect(() => {
    const loadRecentlyViewed = async () => {
      if (product) { // Only load if product is available
        const products = await getRecentlyViewedProducts(recentlyViewedProductIds, product.id);
        setActualRecentlyViewedProducts(products);
      }
    };
    loadRecentlyViewed();
  }, [recentlyViewedProductIds, product]);


  if (loading) {
    return <ProductDetailsSkeleton />;
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <motion.h1
          className="text-4xl font-bold text-destructive mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Error
        </motion.h1>
        <motion.p
          className="text-lg text-muted-foreground mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {error || "Something went wrong while fetching product details."}
        </motion.p>
        <Button onClick={() => navigate("/products")}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ProductBreadcrumb product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* Product Media & Purchase Options */}
          <motion.div
            className="lg:sticky lg:top-24 h-fit space-y-8"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            <ProductImageGallery
              images={product.images}
              productName={product.name}
            />
          </motion.div>

          {/* Product Info & Actions */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" as Easing }}
          >
            <ProductInfoSection product={product} totalReviewsCount={totalReviewsCount} />
          </motion.div>
        </div>

        {/* Detailed Information Tabs */}
        <motion.div
          className="mt-12"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          viewport={{ once: true, amount: 0.1 }}
          transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" as Easing }}
        >
          <ProductTabs product={product} totalReviewsCount={totalReviewsCount} /> {/* Pass totalReviewsCount */}
        </motion.div>

        {/* Recommended Products Section */}
        <motion.div
          className="mt-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <RecommendedProductsSection currentProductId={product.id} />
        </motion.div>

        {/* Recently Viewed Products Section */}
        <motion.div
          className="mt-16 mb-20"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <RecentlyViewedProductsSection products={actualRecentlyViewedProducts} />
        </motion.div>
      </div>
    </div>
  );
};

export default ProductDetails;
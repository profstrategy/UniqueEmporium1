"use client";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { getProductById, ProductDetails as ProductDetailsType, getRandomProducts, getRecentlyViewedProducts } from "@/data/products.ts";
import ProductBreadcrumb from "@/components/product-details/ProductBreadcrumb.tsx";
import ProductImageGallery from "@/components/product-details/ProductImageGallery.tsx";
import ProductInfoSection from "@/components/product-details/ProductInfoSection.tsx";
import ProductTabs from "@/components/product-details/ProductTabs.tsx";
import RecommendedProductsSection from "@/components/recommended-products/RecommendedProductsSection.tsx"; // Existing component
import RecentlyViewedProductsSection from "@/components/product-details/RecentlyViewedProductsSection.tsx"; // New component
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const RECENTLY_VIEWED_KEY = "recentlyViewedProducts";
const MAX_RECENTLY_VIEWED = 8;

const ProductDetails = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentlyViewedProductIds, setRecentlyViewedProductIds] = useState<string[]>([]); // Renamed state to clarify it holds IDs

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (productId) {
      const fetchedProduct = getProductById(productId);
      if (fetchedProduct) {
        setProduct(fetchedProduct);

        // Update recently viewed product IDs in localStorage
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
  }, [productId]);

  // Load recently viewed product IDs from localStorage on initial mount
  useEffect(() => {
    const storedViewed = JSON.parse(localStorage.getItem(RECENTLY_VIEWED_KEY) || "[]") as string[];
    setRecentlyViewedProductIds(storedViewed);
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-lg text-muted-foreground"
        >
          Loading product details...
        </motion.div>
      </div>
    );
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

  // Get the actual product objects for recently viewed products
  const actualRecentlyViewedProducts = getRecentlyViewedProducts(recentlyViewedProductIds, product.id);

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <ProductBreadcrumb product={product} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mt-8">
          {/* Product Media & Purchase Options */}
          <motion.div
            className="lg:sticky lg:top-24 h-fit" // Make it sticky on desktop
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
            <ProductInfoSection product={product} />
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
          <ProductTabs product={product} />
        </motion.div>

        {/* Recommended Products Section */}
        <motion.div
          className="mt-16"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          <RecommendedProductsSection currentProductId={product.id} /> {/* Pass currentProductId */}
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
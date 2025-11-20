"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products as productsData, ProductDetails as ProductDetailsType } from "@/data/products";
import { ProductInfoSection } from "@/components/product-details/ProductInfoSection";
import { ProductImageGallery } from "@/components/product-details/ProductImageGallery";
import { ProductDescriptionTabs } from "@/components/product-details/ProductDescriptionTabs";
import { RecommendedProductsSection } from "@/components/recommended-products/RecommendedProductsSection";
import { toast } from "sonner";

const ProductDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<ProductDetailsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const timer = setTimeout(() => {
      const foundProduct = productsData.find((p) => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        setError("Product not found.");
        toast.error("Product not found.");
      }
      setLoading(false);
    }, 500); // Simulate network delay
    return () => clearTimeout(timer);
  }, [id]);

  const recommendedProducts = useMemo(() => {
    if (!product) return [];
    return productsData
      .filter((p) => p.id !== product.id && p.category === product.category)
      .slice(0, 10);
  }, [product, productsData]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-80px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-destructive">
        <AlertCircle className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-lg">{error}</p>
        <Button onClick={() => window.history.back()} className="mt-6">
          Go Back
        </Button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] text-muted-foreground">
        <AlertCircle className="h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
        <p className="text-lg">The product you are looking for does not exist.</p>
        <Button onClick={() => window.history.back()} className="mt-6">
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="container py-8 md:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <ProductImageGallery images={product.images} />
          </motion.div>

          {/* Product Info Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <ProductInfoSection product={product} />
          </motion.div>
        </div>

        {/* Product Description Tabs */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-12 lg:mt-16"
        >
          <ProductDescriptionTabs product={product} />
        </motion.div>
      </div>

      {/* Recommended Products Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <RecommendedProductsSection
          title="Related Products"
          products={recommendedProducts}
          loading={false}
          error={null}
          currentProductId={product.id}
        />
      </motion.div>
    </motion.div>
  );
};

export default ProductDetailsPage;
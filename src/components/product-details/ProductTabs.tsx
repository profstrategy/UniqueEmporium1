"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductDetails as ProductDetailsType } from "@/data/products.ts";
import ProductDescriptionTab from "./ProductDescriptionTab.tsx";
import ProductSpecsTab from "./ProductSpecsTab.tsx";
import ProductReviewsTab from "./ProductReviewsTab.tsx";
import { motion, AnimatePresence, Easing } from "framer-motion"; // Import AnimatePresence

interface ProductTabsProps {
  product: ProductDetailsType;
}

const tabContentVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = React.useState("description");

  return (
    <Tabs defaultValue="description" onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="specifications">Specifications</TabsTrigger>
        <TabsTrigger value="reviews">Reviews ({product.reviews.length})</TabsTrigger>
      </TabsList>
      <AnimatePresence mode="wait"> {/* Use AnimatePresence for tab content transitions */}
        {activeTab === "description" && (
          <TabsContent value="description" className="mt-6">
            <motion.div
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden" // Add exit animation
              key="description-tab"
            >
              <ProductDescriptionTab description={product.fullDescription} />
            </motion.div>
          </TabsContent>
        )}
        {activeTab === "specifications" && (
          <TabsContent value="specifications" className="mt-6">
            <motion.div
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden" // Add exit animation
              key="specifications-tab"
            >
              <ProductSpecsTab detailedSpecs={product.detailedSpecs} />
            </motion.div>
          </TabsContent>
        )}
        {activeTab === "reviews" && (
          <TabsContent value="reviews" className="mt-6">
            <motion.div
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden" // Add exit animation
              key="reviews-tab"
            >
              <ProductReviewsTab reviews={product.reviews} />
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>
    </Tabs>
  );
};

export default ProductTabs;
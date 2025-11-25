"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductDetails as ProductDetailsType } from "@/data/products.ts";
import ProductDescriptionTab from "./ProductDescriptionTab.tsx";
import ProductSpecsTab from "./ProductSpecsTab.tsx";
import ProductReviewsTab from "./ProductReviewsTab.tsx";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  product: ProductDetailsType;
}

const tabContentVariants = {
  hidden: { opacity: 0, y: 20, x: -20 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = React.useState("description");

  return (
    <Tabs defaultValue="description" onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex w-full justify-center border-b bg-transparent p-0">
        <TabsTrigger
          value="description"
          className={cn(
            "py-4 px-1 border-b-2 border-transparent font-medium text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors duration-200",
            "flex-1"
          )}
        >
          Description
        </TabsTrigger>
        <TabsTrigger
          value="specifications"
          className={cn(
            "py-4 px-1 border-b-2 border-transparent font-medium text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors duration-200",
            "flex-1"
          )}
        >
          Specifications
        </TabsTrigger>
        <TabsTrigger
          value="reviews"
          className={cn(
            "py-4 px-1 border-b-2 border-transparent font-medium text-sm text-muted-foreground data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors duration-200",
            "flex-1"
          )}
        >
          Reviews ({product.reviews.length})
        </TabsTrigger>
      </TabsList>
      <AnimatePresence mode="wait">
        {activeTab === "description" && (
          <TabsContent value="description" className="py-6">
            <motion.div
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key="description-tab"
            >
              <ProductDescriptionTab
                description={product.fullDescription}
                keyFeatures={product.keyFeatures}
                styleNotes={product.styleNotes} // Pass styleNotes here
              />
            </motion.div>
          </TabsContent>
        )}
        {activeTab === "specifications" && (
          <TabsContent value="specifications" className="py-6">
            <motion.div
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key="specifications-tab"
            >
              <ProductSpecsTab detailedSpecs={product.detailedSpecs} />
            </motion.div>
          </TabsContent>
        )}
        {activeTab === "reviews" && (
          <TabsContent value="reviews" className="py-6">
            <motion.div
              variants={tabContentVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              key="reviews-tab"
            >
              <ProductReviewsTab reviews={product.reviews} productId={product.id} />
            </motion.div>
          </TabsContent>
        )}
      </AnimatePresence>
    </Tabs>
  );
};

export default ProductTabs;
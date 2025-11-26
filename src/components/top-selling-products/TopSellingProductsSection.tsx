"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, TrendingUp, Shirt } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";
import { ProductDetails } from "@/data/products.ts";
import ProductCardSkeleton from "@/components/products/ProductCardSkeleton.tsx";
import { supabase } from "@/integrations/supabase/client"; // Import supabase client
import { toast } from "sonner";

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const TopSellingProductsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    containScroll: "trimSnaps",
  });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [productsToDisplay, setProductsToDisplay] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const onSelect = useCallback((emblaApi: any) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      setLoading(true);
      try {
        // 1. Call the RPC function to get top selling product IDs
        const { data: topSellingIds, error: rpcError } = await supabase.rpc('get_top_selling_products', {
          time_period_days: 30, // Using the default 30 days
          limit_count: 10,
        });

        if (rpcError) {
          console.error("Error fetching top selling product IDs:", rpcError);
          toast.error("Failed to load top selling products.");
          setProductsToDisplay([]);
          setLoading(false);
          return;
        }

        if (!topSellingIds || topSellingIds.length === 0) {
          setProductsToDisplay([]);
          setLoading(false);
          return;
        }

        const productIds = topSellingIds.map(item => item.product_id);

        // 2. Fetch full product details for these IDs
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .in('id', productIds)
          .eq('status', 'active'); // Only show active products

        if (productsError) {
          console.error("Error fetching top selling product details:", productsError);
          toast.error("Failed to load top selling product details.");
          setProductsToDisplay([]);
          setLoading(false);
          return;
        }

        // Map snake_case from DB to camelCase for Product interface
        const fetchedProducts: Product[] = productsData.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category,
          images: p.images || [],
          price: p.price,
          originalPrice: p.original_price,
          discountPercentage: p.discount_percentage,
          rating: p.rating,
          reviewCount: p.review_count,
          tag: p.tag,
          tagVariant: p.tag_variant,
          limitedStock: p.limited_stock,
          minOrderQuantity: p.min_order_quantity,
          status: p.status,
        }));

        // Sort the fetched products to match the order from the RPC function
        const sortedProducts = productIds.map(id => fetchedProducts.find(p => p.id === id)).filter((p): p is Product => p !== undefined);
        setProductsToDisplay(sortedProducts);

      } catch (error: any) {
        console.error("An unexpected error occurred while fetching top selling products:", error);
        toast.error("An unexpected error occurred.", { description: error.message });
        setProductsToDisplay([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopSellingProducts();
  }, []);

  if (productsToDisplay.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-12 bg-background">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Shirt className="h-6 w-6 text-primary" /> Top Selling Styles
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev} disabled={!canScrollPrev || loading}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} disabled={!canScrollNext || loading}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-2 sm:gap-4">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[280px]">
                    <ProductCardSkeleton />
                  </div>
                ))
              : productsToDisplay.map((product) => (
                  <div key={product.id} className="flex-shrink-0 w-[calc(50%-4px)] sm:w-[280px]">
                    <ProductCard product={product} />
                  </div>
                ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default TopSellingProductsSection;
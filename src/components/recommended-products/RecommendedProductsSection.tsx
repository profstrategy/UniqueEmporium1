"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Cpu, MemoryStick, HardDrive, Monitor, BatteryCharging } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import ProductCard, { Product } from "@/components/products/ProductCard.tsx";

const recommendedProducts: Product[] = [
  {
    id: "rec1",
    name: "Gaming Beast Laptop",
    category: "Laptops",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 1200000.00,
    originalPrice: 1300000.00,
    discountPercentage: 8,
    rating: 4.9,
    reviewCount: 200, // Changed from 'reviews'
    tag: "Gaming",
    tagVariant: "destructive",
    limitedStock: false,
    specs: [
      { icon: Cpu, label: "CPU", value: "Intel i9" },
      { icon: MemoryStick, label: "RAM", value: "32GB" },
      { icon: HardDrive, label: "Storage", value: "1TB SSD" },
      { icon: Monitor, label: "Display", value: "17\" QHD 165Hz" },
      { icon: BatteryCharging, label: "Battery", value: "8 Hrs" },
    ],
  },
  {
    id: "rec2",
    name: "Noise Cancelling Earbuds",
    category: "Audio",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 85000.00,
    rating: 4.7,
    reviewCount: 180, // Changed from 'reviews'
    tag: "New",
    tagVariant: "default",
    specs: [
      { icon: Cpu, label: "Type", value: "In-ear" },
      { icon: MemoryStick, label: "ANC", value: "Hybrid" },
      { icon: HardDrive, label: "Battery", value: "24 Hrs" },
    ],
  },
  {
    id: "rec3",
    name: "Curved Ultrawide Monitor",
    category: "Monitors",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 550000.00,
    originalPrice: 600000.00,
    discountPercentage: 9,
    rating: 4.8,
    reviewCount: 110, // Changed from 'reviews'
    specs: [
      { icon: Cpu, label: "Resolution", value: "UWQHD" },
      { icon: MemoryStick, label: "Refresh Rate", value: "120Hz" },
      { icon: HardDrive, label: "Curvature", value: "1800R" },
    ],
  },
  {
    id: "rec4",
    name: "Mechanical RGB Keyboard",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 70000.00,
    rating: 4.6,
    reviewCount: 250, // Changed from 'reviews'
    tag: "Popular",
    tagVariant: "secondary",
    specs: [
      { icon: Cpu, label: "Switch", value: "Brown" },
      { icon: MemoryStick, label: "Backlight", value: "Per-key RGB" },
      { icon: HardDrive, label: "Layout", value: "Full-size" },
    ],
  },
  {
    id: "rec5",
    name: "Smart Doorbell Camera",
    category: "Smart Home",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 110000.00,
    rating: 4.5,
    reviewCount: 90, // Changed from 'reviews'
    limitedStock: true,
    specs: [
      { icon: Cpu, label: "Resolution", value: "1080p" },
      { icon: MemoryStick, label: "Field of View", value: "160°" },
      { icon: HardDrive, label: "Storage", value: "Cloud/Local" },
    ],
  },
  {
    id: "rec6",
    name: "Portable SSD 2TB",
    category: "Storage",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 150000.00,
    originalPrice: 165000.00,
    discountPercentage: 9,
    rating: 4.7,
    reviewCount: 130, // Changed from 'reviews'
    tag: "Sale",
    tagVariant: "destructive",
    specs: [
      { icon: Cpu, label: "Capacity", value: "2TB" },
      { icon: MemoryStick, label: "Interface", value: "USB 3.2 Gen2" },
      { icon: HardDrive, label: "Speed", value: "1000MB/s" },
    ],
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const RecommendedProductsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true, // Allows free dragging
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
          <h2 className="text-2xl font-bold text-foreground">Recommended for You</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev} disabled={!canScrollPrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} disabled={!canScrollNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-2 sm:gap-4">
            {recommendedProducts.map((product) => (
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

export default RecommendedProductsSection;
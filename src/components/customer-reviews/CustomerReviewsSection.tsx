"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Star, MessageSquare } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

const mockReviews: Review[] = [
  {
    id: "cr1",
    author: "Aisha O.",
    rating: 5,
    comment: "The SHEIN gown I ordered is absolutely stunning! Unique Emporium truly delivers on luxury and comfort. Fast delivery too!",
    date: "July 20, 2024",
  },
  {
    id: "cr2",
    author: "Chinedu E.",
    rating: 5,
    comment: "My vintage graphic tee is a gem! The quality is fantastic for a thrift find. I love the unique style.",
    date: "July 18, 2024",
  },
  {
    id: "cr3",
    author: "Blessing N.",
    rating: 5,
    comment: "The kids' distressed jeans are perfect for my son. Stylish, durable, and he loves them! Highly recommend Unique Emporium.",
    date: "July 22, 2024",
  },
  {
    id: "cr4",
    author: "Amaka J.",
    rating: 5,
    comment: "The Ladies' Casual Chic Fashion Bundle exceeded my expectations. Great value and all pieces are beautiful. Will definitely shop again!",
    date: "July 25, 2024",
  },
  {
    id: "cr5",
    author: "Fatima G.",
    rating: 5,
    comment: "My luxury silk scarf is exquisite! It feels so luxurious and looks brand new. A fantastic sustainable fashion choice.",
    date: "July 28, 2024",
  },
  {
    id: "cr6",
    author: "David O.",
    rating: 4,
    comment: "The vintage denim jacket is a classic. Great quality, though a bit stiff at first. It's a timeless piece.",
    date: "July 29, 2024",
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const CustomerReviewsSection = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: true, // Loop reviews for continuous scrolling
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

  if (mockReviews.length === 0) {
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
            <MessageSquare className="h-6 w-6 text-primary" /> What Our Customers Say
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={scrollPrev} disabled={!canScrollPrev}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={scrollNext} disabled={!canScrollNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Reviews Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {mockReviews.map((review) => (
              <div key={review.id} className="flex-shrink-0 w-[calc(100%-16px)] sm:w-[calc(50%-16px)] lg:w-[calc(33.333%-16px)]">
                <motion.div
                  className="h-full p-6 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm shadow-lg flex flex-col justify-between"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <div className="flex items-center mb-3">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={cn(
                            "h-5 w-5",
                            i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground",
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-base text-foreground mb-4 line-clamp-4">{review.comment}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-primary-foreground">{review.author}</p>
                    <p className="text-sm text-muted-foreground">{review.date}</p>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CustomerReviewsSection;
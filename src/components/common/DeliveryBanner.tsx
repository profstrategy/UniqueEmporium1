"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const DeliveryBanner: React.FC = () => {
  // Animation variants for continuous horizontal slide
  const slide = {
    animate: {
      // Start off-screen left, end off-screen right
      x: ["-100%", "100%"], 
      transition: {
        x: {
          duration: 70, // 70 seconds for extremely slow speed
          ease: "linear",
          repeat: Infinity,
        },
      },
    },
  };

  // Content block structure, now including the background gradient and fixed width
  const bannerContent = (
    <div className={cn(
        // Apply gradient and fixed minimum width here so the background slides with the content
        "h-10 flex items-center bg-gradient-to-r from-red-600 to-pink-600",
        "min-w-[400px] justify-center",
        "rounded-xl mr-4" // Added rounding and margin to separate blocks
    )}>
        <div className="flex items-center text-white font-semibold text-sm md:text-base">
          <Truck className="h-4 w-4 mr-3" />
          <Badge variant="secondary" className="bg-white text-red-600 text-xs md:text-sm px-3 py-1">
            Next Delivery Days: Monday & Thursday
          </Badge>
        </div>
    </div>
  );

  return (
    <div 
      className={cn(
        "fixed top-16 z-51 w-full overflow-hidden h-10 flex items-center", // Changed to fixed, top-16, and z-51
      )}
    >
      <motion.div
        className="h-full flex items-center whitespace-nowrap"
        variants={slide as any}
        initial={{ x: "-100%" }}
        animate="animate"
      >
        {/* Repeat content blocks, each carrying its own background */}
        {[...Array(7)].map((_, i) => (
          <React.Fragment key={i}>
            {bannerContent}
          </React.Fragment>
        ))}
      </motion.div>
    </div>
  );
};

export default DeliveryBanner;
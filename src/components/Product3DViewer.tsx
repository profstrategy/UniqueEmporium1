"use client";

import React from "react";
import "@google/model-viewer";
import { motion, Easing } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

interface Product3DViewerProps {
  modelPath: string;
  productName: string; // Added productName prop
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const Product3DViewer = ({ modelPath, productName }: Product3DViewerProps) => {
  return (
    <motion.div
      className="relative w-full h-72 lg:h-96 bg-muted border rounded-xl overflow-hidden"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      viewport={{ once: true, amount: 0.1 }}
    >
      <model-viewer
        src={modelPath}
        alt={`3D view of ${productName}`}
        auto-rotate
        camera-controls
        className="w-full h-full" // Fill the parent motion.div
      ></model-viewer>

      {/* Informational Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-md bg-background/70 backdrop-blur-sm text-xs text-muted-foreground text-center">
        Interactive 3D View of {productName}
      </div>
    </motion.div>
  );
};

export default Product3DViewer;
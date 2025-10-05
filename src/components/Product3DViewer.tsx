"use client";

import React from "react";
import "@google/model-viewer";
import { motion, Easing } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming cn utility is available

interface Product3DViewerProps {
  modelPath: string;
  productName: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const Product3DViewer = ({ modelPath, productName }: Product3DViewerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-72 lg:h-96 border rounded-xl overflow-hidden"
      style={{
        backgroundImage: "url('/3d-viewer-background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <model-viewer
        src={modelPath}
        alt={`3D view of ${productName}`}
        auto-rotate
        camera-controls
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent", // Make model-viewer background transparent to show container background
          borderRadius: "12px",
        }}
      ></model-viewer>

      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/70 backdrop-blur-sm text-xs text-muted-foreground px-2 py-1 rounded-md">
        Interactive 3D View of {productName}
      </div>
    </motion.div>
  );
};

export default Product3DViewer;
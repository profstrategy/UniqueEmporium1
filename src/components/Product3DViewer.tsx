"use client";

import "@google/model-viewer";
import { motion } from "framer-motion";
import React from "react";

interface Product3DViewerProps {
  productName?: string;
  modelPath?: string;
}

const Product3DViewer = ({ productName = "Sample Product", modelPath = "/models/sample-product.glb" }: Product3DViewerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative w-full h-72 lg:h-96 bg-muted border rounded-xl overflow-hidden"
    >
      <model-viewer
        src={modelPath}
        alt={`3D view of ${productName}`}
        auto-rotate
        camera-controls
        environment-image="/backgrounds/product-viewer-bg.webp"
        shadow-intensity="1"
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
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
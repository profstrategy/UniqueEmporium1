"use client";

import React from "react";
import "@google/model-viewer";

const Product3DViewer = () => {
  return (
    <model-viewer
      src="/models/sample-product.glb"
      alt="3D view of product"
      auto-rotate
      camera-controls
      className="w-full h-[300px] md:h-[500px] bg-[#f9f9f9] rounded-xl" // Using Tailwind classes for responsive height
    ></model-viewer>
  );
};

export default Product3DViewer;
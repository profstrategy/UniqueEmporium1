"use client";

import React from "react";
import "@google/model-viewer";

interface Product3DViewerProps {
  modelPath: string;
}

const Product3DViewer = ({ modelPath }: Product3DViewerProps) => {
  return (
    <model-viewer
      src={modelPath} // Use the dynamic modelPath prop
      alt="3D view of product"
      auto-rotate
      camera-controls
      className="w-full h-[300px] md:h-[500px] bg-[#f9f9f9] rounded-xl"
    ></model-viewer>
  );
};

export default Product3DViewer;
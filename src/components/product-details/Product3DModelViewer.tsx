"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment } from "@react-three/drei";
import { Loader2 } from "lucide-react";
import { motion, Easing } from "framer-motion";

interface Product3DModelViewerProps {
  modelPath: string;
}

// Component to load and display the GLTF model
const Model = ({ path }: { path: string }) => {
  const gltf = useGLTF(path);
  return <primitive object={gltf.scene} scale={1} />; // Adjust scale as needed for your models
};

const Product3DModelViewer = ({ modelPath }: Product3DModelViewerProps) => {
  return (
    <motion.div
      className="relative w-full rounded-xl overflow-hidden shadow-lg bg-muted h-[300px] sm:h-[400px] md:h-[500px]" // Fixed: Moved responsive height to className
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" as Easing }}
    >
      <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
        <Suspense
          fallback={
            <div className="absolute inset-0 flex items-center justify-center bg-muted/50 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin mr-2" /> Loading 3D Model...
            </div>
          }
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <directionalLight position={[-10, -10, -5]} intensity={0.5} />
          <Environment preset="city" /> {/* Adds realistic lighting and reflections */}
          <Model path={modelPath} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Suspense>
      </Canvas>
    </motion.div>
  );
};

export default Product3DModelViewer;
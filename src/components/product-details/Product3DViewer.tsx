"use client";

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage, PresentationControls, Html } from "@react-three/drei";
import { Loader2, Box } from "lucide-react";
import { motion } from "framer-motion";

interface Product3DViewerProps {
  modelPath?: string; // Path to the GLTF/GLB model
  productName: string;
}

// This component will only be rendered if modelPath is provided
const LoadedModel = ({ modelPath }: { modelPath: string }) => {
  const { scene } = useGLTF(modelPath);

  if (!scene) {
    console.warn(`Failed to load 3D model from: ${modelPath}. Rendering fallback box.`);
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gray" />
      </mesh>
    );
  }
  return <primitive object={scene} scale={1} />;
};

const Product3DViewer = ({ modelPath, productName }: Product3DViewerProps) => {
  return (
    <div className="relative h-full w-full bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden">
      <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }}>
        <color attach="background" args={["#f0f0f0"]} />
        <Suspense
          fallback={
            <Html center>
              <div className="flex flex-col items-center text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                <p>Loading 3D model...</p>
              </div>
            </Html>
          }
        >
          <PresentationControls
            speed={1.5}
            zoom={1}
            polar={[-Math.PI / 3, Math.PI / 3]}
            azimuth={[-Math.PI / 1.4, Math.PI / 2]}
          >
            <Stage environment="city" intensity={0.6} shadows={false}>
              {modelPath ? (
                <LoadedModel modelPath={modelPath} /> // Only call LoadedModel if modelPath exists
              ) : (
                <mesh> {/* Fallback if no modelPath is provided at all */}
                  <boxGeometry args={[1, 1, 1]} />
                  <meshStandardMaterial color="hotpink" />
                </mesh>
              )}
            </Stage>
          </PresentationControls>
          <OrbitControls enableZoom enablePan />
        </Suspense>
      </Canvas>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-muted-foreground"
      >
        {modelPath ? `Interactive 3D View of ${productName}` : "Placeholder 3D Model"}
      </motion.p>
    </div>
  );
};

export default Product3DViewer;
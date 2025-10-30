"use client";

import React from "react";
import { motion } from "framer-motion";

const UniqueEmporiumLogo3D = () => {
  return (
    <motion.div
      className="relative flex h-24 w-24 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg lg:h-32 lg:w-32"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -10, 0], // Float animation
        rotateY: [0, 10, -10, 0],
        rotateX: [0, 5, -5, 0],
      }}
      transition={{
        duration: 6,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
    >
      <span className="font-bold text-4xl lg:text-5xl">UE</span>
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-primary-foreground/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
      />
      {/* Subtle glow effect */}
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          boxShadow: "0 0 15px 5px var(--primary), inset 0 0 10px 2px var(--secondary)",
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{
          duration: 4,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
    </motion.div>
  );
};

export default UniqueEmporiumLogo3D;
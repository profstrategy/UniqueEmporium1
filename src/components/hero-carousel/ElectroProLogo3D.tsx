"use client";

import React from "react";
import { motion } from "framer-motion";

const ElectroProLogo3D = () => {
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
      <span className="font-bold text-4xl lg:text-5xl">EP</span>
      <motion.div
        className="absolute inset-0 rounded-lg border-2 border-primary-foreground/20"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, ease: "linear", repeat: Infinity }}
      />
    </motion.div>
  );
};

export default ElectroProLogo3D;
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Easing } from "framer-motion";

interface ProductDescriptionTabProps {
  description: string;
}

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing, staggerChildren: 0.1 } },
};

const paragraphVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const ProductDescriptionTab = ({ description }: ProductDescriptionTabProps) => {
  const paragraphs = description.split('\n').filter(p => p.trim() !== '');

  return (
    <Card className="rounded-xl shadow-sm">
      <CardContent className="p-6">
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4 text-muted-foreground leading-relaxed"
        >
          {paragraphs.map((paragraph, index) => (
            <motion.p key={index} variants={paragraphVariants}>
              {paragraph}
            </motion.p>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ProductDescriptionTab;
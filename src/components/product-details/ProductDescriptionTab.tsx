"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Easing } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

interface ProductDescriptionTabProps {
  description: string;
  keyFeatures: string[];
  applications: string;
}

const textVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing, staggerChildren: 0.1 } },
};

const paragraphVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const ProductDescriptionTab = ({ description, keyFeatures, applications }: ProductDescriptionTabProps) => {
  const paragraphs = description.split('\n').filter(p => p.trim() !== '');

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <motion.div
          variants={textVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 text-foreground leading-relaxed" // Changed text-muted-foreground to text-foreground
        >
          {paragraphs.map((paragraph, index) => (
            <motion.p key={`desc-p-${index}`} variants={paragraphVariants}>
              {paragraph}
            </motion.p>
          ))}

          {keyFeatures && keyFeatures.length > 0 && (
            <div className="mt-6">
              <motion.h3 className="font-poppins font-semibold text-lg text-foreground mb-3" variants={paragraphVariants}> {/* Added font-poppins */}
                Key Features
              </motion.h3>
              <ul className="space-y-2">
                {keyFeatures.map((feature, index) => (
                  <motion.li key={`feature-${index}`} variants={paragraphVariants} className="flex items-start text-sm text-foreground"> {/* Added text-foreground */}
                    <CheckCircle2 className="h-4 w-4 text-primary mr-2 flex-shrink-0 mt-1" />
                    <span>{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {applications && (
            <div className="mt-6">
              <motion.h3 className="font-poppins font-semibold text-lg text-foreground mb-3" variants={paragraphVariants}> {/* Added font-poppins */}
                Applications
              </motion.h3>
              <motion.p variants={paragraphVariants}>
                {applications}
              </motion.p>
            </div>
          )}
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default ProductDescriptionTab;
"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { motion, Easing } from "framer-motion";

interface DetailedSpecGroup {
  group: string;
  items: { label: string; value: string; icon?: React.ElementType }[];
}

interface ProductSpecsTabProps {
  detailedSpecs: DetailedSpecGroup[];
}

const groupVariants = {
  hidden: { opacity: 0, y: 20, x: -20 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.5, ease: "easeOut" as Easing, staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const ProductSpecsTab = ({ detailedSpecs }: ProductSpecsTabProps) => {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-8">
          {detailedSpecs.map((group, groupIndex) => (
            <motion.div key={group.group} variants={groupVariants} initial="hidden" animate="visible">
              <h3 className="font-poppins font-semibold text-lg text-foreground mb-4">{group.group}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {group.items.map((item, itemIndex) => (
                  <motion.div key={item.label} variants={itemVariants} className="flex justify-between items-center py-2 border-b border-border">
                    <div className="flex items-center">
                      {item.icon && React.createElement(item.icon, { className: "h-4 w-4 text-primary mr-2 flex-shrink-0" })}
                      <span className="text-muted-foreground mr-2">{item.label}:</span>
                    </div>
                    <span className="text-foreground font-medium">{item.value}</span>
                  </motion.div>
                ))}
              </div>
              {groupIndex < detailedSpecs.length - 1 && <Separator className="mt-8" />}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSpecsTab;
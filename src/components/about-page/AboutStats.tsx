"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ShoppingBag, Star, Award } from "lucide-react"; // Updated icon for products

interface Stat {
  icon: React.ElementType;
  value: string;
  label: string;
}

const stats: Stat[] = [
  { icon: Users, value: "50K+", label: "Happy Fashionistas" },
  { icon: ShoppingBag, value: "200+", label: "Bundles Shipped Daily" },
  { icon: Star, value: "4.8/5", label: "Average Rating" },
  { icon: Award, value: "5+", label: "Years in Fashion" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const AboutStats = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto text-center">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="p-6 h-full flex flex-col justify-center items-center rounded-2xl">
              <motion.div
                className="h-8 w-8 mx-auto mb-3 text-primary"
                animate={{
                  y: [0, -5, 0],
                  rotateX: [0, 5, 0],
                  rotateZ: [0, 2, 0],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut" as Easing,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.1,
                }}
              >
                {React.createElement(stat.icon, { className: "h-full w-full" })}
              </motion.div>
              <h3 className="text-2xl font-bold mb-2 text-foreground">{stat.value}</h3>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutStats;
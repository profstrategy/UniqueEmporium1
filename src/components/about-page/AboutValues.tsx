"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Handshake, Leaf, Sparkles, Gem, TrendingUp } from "lucide-react"; // Updated icons

interface Value {
  icon: React.ElementType;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    icon: Sparkles,
    title: "Uniqueness",
    description: "We celebrate individual style, offering pieces that help you stand out.",
  },
  {
    icon: Gem,
    title: "Quality Thrift",
    description: "Curating premium pre-loved fashion that feels luxurious and lasts.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Committed to eco-friendly fashion choices and reducing waste.",
  },
  {
    icon: TrendingUp,
    title: "Trendsetting",
    description: "Staying ahead of fashion curves to bring you the latest and timeless styles.",
  },
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

const AboutValues = () => {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto text-center">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Badge variant="outline" className="mb-4 text-sm">Our Principles</Badge>
        <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-6 text-foreground">
          The Values That Define Our Style
        </h2>
      </motion.div>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-8 mt-12"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {values.map((value, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="p-4 h-[130px] flex flex-col items-center justify-center text-center rounded-2xl">
              <motion.div
                className="h-8 w-8 text-primary mb-2"
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut" as Easing,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.1,
                }}
              >
                {React.createElement(value.icon, { className: "h-full w-full" })}
              </motion.div>
              <h3 className="text-base font-semibold mb-1 text-foreground">{value.title}</h3>
              <p className="text-xs text-muted-foreground">{value.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default AboutValues;
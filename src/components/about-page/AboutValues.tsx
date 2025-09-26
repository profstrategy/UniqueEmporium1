"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Handshake, Leaf, Rocket } from "lucide-react";

interface Value {
  icon: React.ElementType;
  title: string;
  description: string;
}

const values: Value[] = [
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We constantly seek new technologies and creative solutions to enhance your experience.",
  },
  {
    icon: Handshake,
    title: "Integrity",
    description: "Honesty and transparency guide all our interactions and business practices.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description: "Committed to eco-friendly practices and products for a better future.",
  },
  {
    icon: Rocket,
    title: "Excellence",
    description: "Striving for the highest standards in every product and service we offer.",
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
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
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
          The Values That Drive Us
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
              <value.icon className="h-8 w-8 text-primary mb-2" />
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
"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Calendar, Wrench, FileText, XCircle, Info } from "lucide-react";

interface WarrantyInfo {
  icon: React.ElementType;
  title: string;
  description: string;
}

const warrantyInfos: WarrantyInfo[] = [
  {
    icon: ShieldCheck,
    title: "Standard Warranty",
    description: "All new products come with a 1-year manufacturer's warranty against defects.",
  },
  {
    icon: Calendar,
    title: "Extended Coverage",
    description: "Optional extended warranty plans are available for purchase on select items.",
  },
  {
    icon: Wrench,
    title: "Repair Services",
    description: "We offer authorized repair services for products under warranty.",
  },
  {
    icon: FileText,
    title: "Terms & Conditions",
    description: "Review our detailed warranty terms and conditions for full policy information.",
  },
  {
    icon: XCircle,
    title: "Exclusions Apply",
    description: "Warranty does not cover accidental damage, misuse, or unauthorized repairs.",
  },
  {
    icon: Info,
    title: "Claim Process",
    description: "Contact our support team with your proof of purchase to initiate a warranty claim.",
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

const WarrantyInfoCards = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {warrantyInfos.map((info, index) => (
          <motion.div key={index} variants={fadeInUp}>
            <Card className="h-full p-4 text-center rounded-2xl">
              <motion.div
                className="h-8 w-8 mx-auto mb-3 text-primary"
                animate={{
                  y: [0, -5, 0], // Vertical float
                  rotateX: [0, 5, 0], // Subtle X-axis rotation
                  rotateZ: [0, 2, 0], // Subtle Z-axis rotation
                }}
                transition={{
                  duration: 3,
                  ease: "easeInOut" as Easing,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: index * 0.1, // Stagger the icon animation
                }}
              >
                {React.createElement(info.icon, { className: "h-full w-full" })}
              </motion.div>
              <h3 className="text-base font-semibold mb-2 text-foreground">{info.title}</h3>
              <p className="text-xs text-muted-foreground">{info.description}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WarrantyInfoCards;
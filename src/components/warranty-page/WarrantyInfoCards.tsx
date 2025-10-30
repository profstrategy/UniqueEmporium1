"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Calendar, Wrench, FileText, XCircle, Tag } from "lucide-react"; // Added Tag icon

interface WarrantyInfo {
  icon: React.ElementType;
  title: string;
  description: string;
}

const warrantyInfos: WarrantyInfo[] = [
  {
    icon: ShieldCheck,
    title: "Quality Guarantee",
    description: "All new fashion items come with a quality guarantee against manufacturing defects.",
  },
  {
    icon: Calendar,
    title: "Thrift Item Assurance",
    description: "Thrift items are guaranteed to be as described and in excellent condition upon arrival.",
  },
  {
    icon: Wrench,
    title: "Care & Maintenance Tips",
    description: "We provide guidance on how to care for your unique wears to ensure longevity.",
  },
  {
    icon: FileText,
    title: "Terms & Conditions",
    description: "Review our detailed warranty terms and conditions for full policy information.",
  },
  {
    icon: XCircle,
    title: "Exclusions Apply",
    description: "Warranty does not cover wear and tear, accidental damage, or misuse of fashion items.",
  },
  {
    icon: Tag,
    title: "Claim Process",
    description: "Contact our support team with your proof of purchase to discuss any quality concerns.",
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
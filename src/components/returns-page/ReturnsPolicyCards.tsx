"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RefreshCw, DollarSign, Package, Clock, ShieldCheck, XCircle } from "lucide-react";

interface PolicyInfo {
  icon: React.ElementType;
  title: string;
  description: string;
}

const policyInfos: PolicyInfo[] = [
  {
    icon: RefreshCw,
    title: "30-Day Returns",
    description: "Most products can be returned within 30 days of purchase for a full refund or exchange.",
  },
  {
    icon: DollarSign,
    title: "Full Refunds",
    description: "Eligible returns receive a full refund to the original payment method.",
  },
  {
    icon: Package,
    title: "Original Condition",
    description: "Items must be returned in their original packaging, unused, and with all accessories.",
  },
  {
    icon: Clock,
    title: "Processing Time",
    description: "Refunds are typically processed within 5-7 business days after receiving the returned item.",
  },
  {
    icon: ShieldCheck,
    title: "Warranty Claims",
    description: "Defective products beyond the return window may be covered by manufacturer warranty.",
  },
  {
    icon: XCircle,
    title: "Non-Returnable Items",
    description: "Certain items like software, gift cards, and personalized products are non-returnable.",
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

const ReturnsPolicyCards = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {policyInfos.map((info, index) => (
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

export default ReturnsPolicyCards;
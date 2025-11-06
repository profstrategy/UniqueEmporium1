"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card } from "@/components/ui/card";
import { RefreshCw, DollarSign, Package, Clock, ShieldCheck, XCircle, Tag, CheckCircle2 } from "lucide-react"; // Added CheckCircle2 icon

interface PolicyInfo {
  icon: React.ElementType;
  title: string;
  description: string;
}

const policyInfos: PolicyInfo[] = [
  {
    icon: XCircle,
    title: "No Returns, No Exchange, No Refunds",
    description: "All products sold in good condition are final sale.",
  },
  {
    icon: CheckCircle2,
    title: "Confirm Before Ordering",
    description: "Please confirm product details, sizes, and quantities before completing your wholesale order.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description: "Unique Emporium ensures all items are carefully checked before dispatch.",
  },
  {
    icon: Package,
    title: "Careful Packaging",
    description: "All unique wears are carefully packed to prevent damage during transit.",
  },
  {
    icon: Tag,
    title: "Wholesale Focus",
    description: "Our policies are tailored for wholesale transactions, ensuring competitive pricing.",
  },
  {
    icon: Clock,
    title: "Timely Dispatch",
    description: "Orders are processed and dispatched promptly after payment confirmation.",
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
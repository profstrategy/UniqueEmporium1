"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Truck, Clock, Package, MapPin, ShieldCheck, Globe } from "lucide-react"; // Added Globe for clarity

interface ShippingInfo {
  icon: React.ElementType;
  title: string;
  description: string;
}

const shippingInfos: ShippingInfo[] = [
  {
    icon: MapPin,
    title: "1. Pick-up (Free)",
    description: "Collect directly from our warehouse in Ilorin.", // Corrected from Lagos to Ilorin
  },
  {
    icon: Truck,
    title: "2. Dispatch Rider (@ ₦1)",
    description: "Riders handle delivery fees; we negotiate fair prices and inform you before dispatch.",
  },
  {
    icon: Truck,
    title: "3. Park Delivery (@ ₦1)", // Corrected here
    description: "Drivers handle delivery fees; we negotiate fair prices and inform you before dispatch.",
  },
  {
    icon: Package,
    title: "Order Tracking",
    description: "Receive a tracking number via email once your fashion bundle is dispatched.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description: "All unique wears are carefully checked before dispatch.",
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

const ShippingInfoCards = () => {
  return (
    <section className="py-16 px-4 max-w-6xl mx-auto">
      <motion.div
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {shippingInfos.map((info, index) => (
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
      <motion.p
        className="text-center text-sm md:text-base text-muted-foreground mt-12 max-w-3xl mx-auto"
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        💡 All delivery charges are handled between you and the dispatch/driver — Unique Emporium does not profit from delivery fees.
      </motion.p>
    </section>
  );
};

export default ShippingInfoCards;
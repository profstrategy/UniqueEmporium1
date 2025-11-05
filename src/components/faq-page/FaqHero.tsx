"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const FaqHero = () => {
  return (
    <section className="py-12 md:py-20 px-4 max-w-6xl mx-auto text-center">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Badge variant="outline" className="mb-4 text-sm rounded-md">
          Got Questions?
        </Badge>
        <div className="space-y-2">
          <h1 className="font-poppins text-3xl md:text-6xl font-bold text-foreground">
            Frequently Asked Fashion Questions
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Find quick answers to the most common questions about our unique collections, services, and policies.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default FaqHero;
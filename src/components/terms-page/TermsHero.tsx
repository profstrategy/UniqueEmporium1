"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const TermsHero = () => {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto text-center">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Badge variant="outline" className="mb-4 text-sm rounded-md">
          Our Policies
        </Badge>
        <div className="space-y-2">
          <h1 className="font-poppins text-2xl md:text-6xl font-bold text-foreground">
            Terms of Service
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Please read our terms and conditions carefully before using Unique Emporium's services.
          </p>
        </div>
      </motion.div>
    </section>
  );
};

export default TermsHero;
"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing, delay: 0.4 } },
};

const PrivacyCTA = () => {
  return (
    <motion.div
      className="mt-16 p-8 rounded-xl text-center bg-gradient-to-br from-primary/5 to-accent/5 max-w-4xl mx-auto mb-20"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-foreground">
        Questions About Your Fashion Privacy?
      </h2>
      <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-6">
        If you have any concerns or require further clarification on our privacy practices regarding your unique wears, please don't hesitate to reach out.
      </p>
      <Button asChild size="lg" className="rounded-full">
        <Link to="/contact">Contact Us</Link>
      </Button>
    </motion.div>
  );
};

export default PrivacyCTA;
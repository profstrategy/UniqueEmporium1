"use client";

import React from "react";
import { motion, Easing } from "framer-motion";

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.8, ease: "easeOut" as Easing } },
};

const HeroIntroBanner = () => {
  return (
    <section className="relative py-12 md:py-16 bg-gradient-to-br from-accent/5 to-primary/5 overflow-hidden">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.p
          className="text-sm md:text-lg lg:text-xl text-foreground leading-relaxed"
          variants={fadeInUp}
        >
          Unique Emporium makes luxury fashion accessible, fast, and inspiring.
        </motion.p>
        <motion.p
          className="text-sm md:text-lg lg:text-xl text-muted-foreground mt-4"
          variants={fadeInUp}
        >
          Explore the latest SHEIN gowns, vintage shirts, kids’ jeans, and curated fashion bundles with effortless navigation, smart
          recommendations, and a transparent checkout.
        </motion.p>
        <motion.p
          className="font-semibold text-base md:text-xl lg:text-2xl text-primary mt-6"
          variants={fadeInUp}
        >
          Choose Unique Emporium — where luxury meets everyday comfort.
        </motion.p>

        <motion.div
          className="relative w-full max-w-5xl mx-auto h-48 md:h-64 rounded-xl overflow-hidden shadow-lg mt-12"
          variants={fadeInUp}
        >
          <img
            src="/my-banner.webp"
            alt="Unique Emporium Fashion Banner"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroIntroBanner;
"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const AboutHero = () => {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto text-center">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Badge variant="outline" className="mb-4 text-sm">Our Journey</Badge>
        <h1 className="font-poppins text-2xl md:text-6xl font-bold mb-6 text-foreground">
          Empowering Your Digital Life
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
          At ElectroPro, we believe in the power of technology to transform lives. We're dedicated to bringing you the latest innovations with unparalleled service.
        </p>
      </motion.div>
    </section>
  );
};

export default AboutHero;
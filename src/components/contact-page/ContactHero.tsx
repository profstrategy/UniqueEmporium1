"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const ContactHero = () => {
  return (
    <section className="py-12 md:py-20 px-4 max-w-6xl mx-auto text-center">
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <Badge variant="outline" className="mb-4 text-sm">Get in Touch</Badge>
        <h1 className="font-poppins text-xl md:text-6xl font-bold mb-4 md:mb-6 text-foreground">
          We're Here to Help
        </h1>
        <p className="text-base md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Have questions, feedback, or need support? Reach out to us, and our dedicated team will assist you promptly.
        </p>
      </motion.div>
    </section>
  );
};

export default ContactHero;
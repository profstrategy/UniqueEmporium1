"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const AboutStory = () => {
  return (
    <section className="py-20 px-4 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="text-center md:text-left">
            <Badge variant="outline" className="mb-4 text-sm">Our Story</Badge>
          </div>
          <h2 className="font-poppins text-3xl md:text-4xl font-bold mb-6 text-foreground">
            From a Vision to a Digital Reality
          </h2>
          <div className="space-y-4 text-base text-muted-foreground">
            <p>
              ElectroPro began with a simple idea: to make cutting-edge technology accessible to everyone. Founded by a team of passionate tech enthusiasts, we set out to create a platform that not only offers the best products but also provides an exceptional shopping experience.
            </p>
            <p>
              Over the years, we've grown from a small startup to a trusted name in electronics retail. Our commitment to quality, customer satisfaction, and staying ahead of technological trends has been the driving force behind our success. We continuously strive to expand our curated selection, ensuring you always find the perfect device for your needs.
            </p>
          </div>
        </motion.div>
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
            <img
              src="/public/placeholder.svg" // Placeholder image
              alt="Our Story"
              className="w-full h-full object-cover"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutStory;
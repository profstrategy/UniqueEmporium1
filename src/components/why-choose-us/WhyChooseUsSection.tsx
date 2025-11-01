"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { ShieldCheck, Truck, Headset, DollarSign, RefreshCw, Award, Gem, Sparkles, HeartHandshake, Tag } from "lucide-react"; // Updated icons
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx"; // Import ImageWithFallback

interface Reason {
  icon: React.ElementType;
  title: string;
  description: string;
}

const reasons: Reason[] = [
  {
    icon: Gem,
    title: "Curated Premium Bundles",
    description: "Hand-picked luxury thrift and fashion bundles at unbeatable prices.",
  },
  {
    icon: Sparkles,
    title: "Luxury Feel, Everyday Comfort",
    description: "Experience high-end fashion designed for your daily comfort.",
  },
  {
    icon: Truck,
    title: "Fast Nationwide Delivery",
    description: "Get your unique wears delivered quickly and safely across Nigeria.",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns & Exchanges",
    description: "Hassle-free policy for your peace of mind and satisfaction.",
  },
  {
    icon: HeartHandshake,
    title: "Trusted by Fashion Lovers",
    description: "Join hundreds of satisfied Nigerian customers who love our style.",
  },
  {
    icon: Tag,
    title: "Unbeatable Value",
    description: "Enjoy premium quality and unique styles without breaking the bank.",
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

const WhyChooseUsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-accent/5 to-primary/5">
      <motion.div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Header (Title, Description, Badge) */}
        <div className="text-center mb-16">
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="mb-4 text-xs">Your Futuristic Fashion Hub</Badge>
          </motion.div>
          <motion.h2
            className="font-poppins font-bold text-sm md:text-5xl lg:text-2xl text-foreground mb-6"
            variants={fadeInUp}
          >
            Why Choose Unique Emporium?
          </motion.h2>
          <motion.p
            className="text-xs lg:text-sm text-muted-foreground max-w-3xl mx-auto"
            variants={fadeInUp}
          >
            Experience the difference with our commitment to unique style, quality, and exceptional service.
          </motion.p>
        </div>


        {/* Banner Image */}
        <motion.div
          className="relative w-full max-w-5xl mx-auto h-48 md:h-64 rounded-xl overflow-hidden shadow-lg mt-12 mb-12"
          variants={fadeInUp}
        >
          <ImageWithFallback
            src="/my-banner.webp"
            alt="Unique Emporium Fashion Advantage"
            containerClassName="w-full h-full"
          />
        </motion.div>

        {/* Main Content Grid (Image + Reasons) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Column (Large Illustrative Image - Desktop Only) */}
          <motion.div
            className="hidden lg:block relative h-96 rounded-xl overflow-hidden shadow-xl"
            variants={fadeInUp}
          >
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1523381294911-8d3cead13f7c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" // Fashion-related image
              alt="Unique Emporium Advantage"
              containerClassName="w-full h-full"
            />
          </motion.div>

          {/* Right Column (Reasons Grid) */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-6">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center text-center p-4 sm:p-4 lg:p-3 border rounded-2xl shadow-sm bg-card h-full"
                variants={fadeInUp}
              >
                <motion.div
                  className="mb-2 sm:mb-4 lg:mb-2"
                  animate={{
                    y: [0, -5, 0],
                    rotateX: [0, 5, 0],
                    rotateZ: [0, 2, 0],
                  }}
                  transition={{
                    duration: 3,
                    ease: "easeInOut" as Easing,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: index * 0.1,
                  }}
                >
                  {React.createElement(reason.icon, { className: "h-6 w-6 sm:h-8 sm:w-8 lg:h-5 lg:w-5 text-primary mx-auto" })}
                </motion.div>
                <h3 className="text-sm sm:text-lg lg:text-sm font-semibold mb-1 sm:mb-2 lg:mb-1 text-card-foreground">{reason.title}</h3>
                <p className="text-[10px] sm:text-sm lg:text-xs text-muted-foreground">{reason.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default WhyChooseUsSection;
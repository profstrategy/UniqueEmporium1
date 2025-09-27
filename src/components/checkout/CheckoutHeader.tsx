"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const CheckoutHeader = () => {
  return (
    <motion.div
      className="bg-background border-b border-border py-6 shadow-sm"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/cart">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="font-poppins text-2xl md:text-3xl font-bold text-foreground">Checkout</h1>
            <p className="text-sm md:text-base text-muted-foreground">Complete your purchase in a few easy steps</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CheckoutHeader;
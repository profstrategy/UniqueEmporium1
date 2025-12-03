"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 20, x: -20 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const CheckoutHeader = () => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center py-8 border-b border-border"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <h1 className="font-poppins text-3xl md:text-4xl font-bold text-foreground mb-2">Checkout</h1>
      <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto mb-6">
        Complete your purchase in a few easy steps.
      </p>
      <Button variant="outline" asChild>
        <Link to="/cart">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
        </Link>
      </Button>
    </motion.div>
  );
};

export default CheckoutHeader;
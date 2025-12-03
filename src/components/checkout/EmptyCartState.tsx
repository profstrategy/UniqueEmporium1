"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const EmptyCartState = () => {
  return (
    <motion.div
      className="text-center py-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-8" />
      <h2 className="text-2xl font-bold mb-4 text-foreground">Your Cart is Empty</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        It looks like you haven't added any products to your cart. Please add items to proceed with checkout.
      </p>
      <Button asChild size="lg">
        <Link to="/products">Continue Shopping</Link>
      </Button>
    </motion.div>
  );
};

export default EmptyCartState;
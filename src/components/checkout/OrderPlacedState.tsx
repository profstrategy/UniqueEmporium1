"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const OrderPlacedState = () => {
  return (
    <motion.div
      className="text-center py-20 flex flex-col items-center justify-center min-h-[calc(100vh-200px)]"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-8" />
      <h2 className="text-2xl font-bold mb-4 text-foreground">Order Placed Successfully!</h2>
      <p className="text-muted-foreground mb-4 max-w-md mx-auto">
        Thank you for your purchase. Your order has been confirmed and will be processed shortly.
      </p>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        You can track the status of your order and view details on your order history page.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" variant="outline">
          <Link to="/account/orders">Track Your Order</Link>
        </Button>
        <Button asChild size="lg">
          <Link to="/products">Continue Shopping</Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default OrderPlacedState;
"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { CartItem } from "@/context/CartContext.tsx";

interface OrderSummaryCardProps {
  cartItems: CartItem[];
  shippingCost: number;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const OrderSummaryCard = ({ cartItems, shippingCost }: OrderSummaryCardProps) => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const VAT_RATE = 0.075; // 7.5%
  const vat = subtotal * VAT_RATE;
  const total = subtotal + vat + shippingCost;

  const formatNaira = (amount: number) =>
    amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 2 });

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <Card className="rounded-lg shadow-lg sticky top-24">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <ShoppingBag className="h-5 w-5" /> Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Items ({cartItems.reduce((sum, item) => sum + item.quantity, 0)})</span>
            <span>{formatNaira(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>VAT (7.5%)</span>
            <span>{formatNaira(vat)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? "Free" : formatNaira(shippingCost)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg border-t pt-4 mt-4">
            <span>Order Total</span>
            <span>{formatNaira(total)}</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderSummaryCard;
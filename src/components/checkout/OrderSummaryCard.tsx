"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext.tsx";

interface OrderSummaryCardProps {
  vatRate?: number; // e.g., 0.075 for 7.5%
  freeShippingThreshold?: number; // e.g., 500000 for ₦500,000
  shippingCost?: number; // Base shipping cost if not free
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const OrderSummaryCard = ({
  vatRate = 0.075,
  freeShippingThreshold = 500000,
  shippingCost = 5000, // Default shipping cost ₦5,000
}: OrderSummaryCardProps) => {
  const { cartItems, totalItems, totalPrice } = useCart();

  const subtotal = totalPrice;
  const vat = subtotal * vatRate;
  const calculatedShipping = subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const total = subtotal + vat + calculatedShipping;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <Card className="rounded-2xl shadow-lg h-full">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Items ({totalItems})</span>
            <span className="font-medium text-foreground">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">VAT ({vatRate * 100}%)</span>
            <span className="font-medium text-foreground">{formatCurrency(vat)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-foreground">
              {calculatedShipping === 0 ? "Free" : formatCurrency(calculatedShipping)}
            </span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default OrderSummaryCard;
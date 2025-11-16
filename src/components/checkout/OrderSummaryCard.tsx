"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext.tsx";

interface OrderSummaryCardProps {
  vatRate?: number;
  freeShippingThreshold?: number;
  deliveryMethod?: string; // New prop for delivery method
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20, x: -20 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const OrderSummaryCard = ({
  vatRate = 0,
  freeShippingThreshold = 100000,
  deliveryMethod, // Destructure new prop
}: OrderSummaryCardProps) => {
  const { cartItems, totalItems, totalPrice } = useCart();

  // Calculate subtotal based on cart items (unit price * quantity)
  const subtotal = cartItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  
  const vat = subtotal * vatRate;

  let calculatedShipping = 0;
  let shippingDisplay = "TBD"; // To be determined

  if (deliveryMethod === "pickup") {
    calculatedShipping = 0;
    shippingDisplay = "Free (Pick-up)";
  } else if (deliveryMethod === "dispatch-rider" || deliveryMethod === "park-delivery") { // Corrected here
    // For these methods, we show a nominal ₦1 and clarify that actual fees are negotiated.
    calculatedShipping = 1; // Nominal charge for calculation, actual is negotiated
    shippingDisplay = "₦1 (Driver handles fees)";
  } else {
    // Default or if no method selected yet (e.g., before ShippingForm is filled)
    calculatedShipping = subtotal >= freeShippingThreshold ? 0 : 3500; // Fallback to old logic
    shippingDisplay = calculatedShipping === 0 ? "Free" : "Calculated at next step";
  }

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
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-foreground">
              {shippingDisplay}
            </span>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col items-start text-lg font-bold">
          <div className="flex justify-between w-full mb-2">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <p className="text-sm text-muted-foreground font-normal mt-2">
            Prices are final — no VAT or hidden charges.
          </p>
          {(deliveryMethod === "dispatch-rider" || deliveryMethod === "park-delivery") && ( // Corrected here
            <p className="text-xs text-primary font-medium mt-2">
              *Actual delivery fees for Dispatch/Park Delivery are negotiated directly with the driver.
            </p>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default OrderSummaryCard;
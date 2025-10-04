"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext.tsx";
import { Product } from "@/components/products/ProductCard.tsx"; // Import Product interface
import type { ShippingFormData } from "@/components/checkout/ShippingForm.tsx"; // Import ShippingFormData type
import type { PaymentFormData } from "@/components/checkout/PaymentForm.tsx"; // Import PaymentFormData type

interface OrderReviewProps {
  shippingInfo: ShippingFormData; // Use imported type
  paymentInfo: PaymentFormData;   // Use imported type
  onPrevious: () => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

const OrderReview = ({ shippingInfo, paymentInfo, onPrevious, onPlaceOrder, isPlacingOrder }: OrderReviewProps) => {
  const { cartItems, totalItems, totalPrice } = useCart();

  const vatRate = 0.075;
  const freeShippingThreshold = 500000;
  const shippingCost = 5000;

  const subtotal = totalPrice;
  const vat = subtotal * vatRate;
  const calculatedShipping = subtotal >= freeShippingThreshold ? 0 : shippingCost;
  const total = subtotal + vat + calculatedShipping;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CheckCircle2 className="h-6 w-6 text-primary" /> Review Your Order
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-8">
        {/* Shipping Address */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-foreground">Shipping Address</h3>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
            <p>{shippingInfo.address}</p>
            {shippingInfo.address2 && <p>{shippingInfo.address2}</p>}
            <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}</p>
            <p>Phone: {shippingInfo.phone}</p>
            <p>Email: {shippingInfo.email}</p>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-foreground">Payment Method</h3>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>Card Holder: {paymentInfo.cardName}</p>
            <p>Card Number: **** **** **** {paymentInfo.cardNumber.slice(-4)}</p>
            <p>Expiry Date: {paymentInfo.expiryDate}</p>
          </div>
        </div>

        {/* Items in Order */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Items in Order ({totalItems})
          </h3>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                <img src={item.images[0]} alt={item.name} className="h-16 w-16 object-contain rounded-md border" />
                <div className="flex-grow">
                  <p className="font-medium text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} x {formatCurrency(item.price)}
                  </p>
                </div>
                <p className="font-semibold text-foreground">{formatCurrency(item.quantity * item.price)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Total Summary */}
        <div className="border-t pt-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
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
          <div className="flex justify-between text-lg font-bold pt-2 border-t mt-3">
            <span>Grand Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
          <Button type="button" variant="outline" onClick={onPrevious} className="w-full sm:w-auto">
            Back to Payment
          </Button>
          <Button type="button" className="w-full sm:w-auto" size="lg" onClick={onPlaceOrder} disabled={isPlacingOrder}>
            {isPlacingOrder ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...
              </>
            ) : (
              "Place Order"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrderReview;
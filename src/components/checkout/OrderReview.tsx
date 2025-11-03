"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ShoppingBag, Package, Banknote } from "lucide-react"; // Added Banknote icon
import { useCart } from "@/context/CartContext.tsx";
import { Product } from "@/components/products/ProductCard.tsx";
import type { ShippingFormData } from "@/components/checkout/ShippingForm.tsx";
import type { BankTransferFormData } from "@/components/checkout/BankTransferPaymentForm.tsx"; // New import

interface OrderReviewProps {
  shippingInfo: ShippingFormData;
  bankTransferInfo: BankTransferFormData; // Changed from 'paymentInfo'
  onPrevious: () => void;
  onPlaceOrder: () => void;
  isPlacingOrder: boolean;
}

const OrderReview = ({ shippingInfo, bankTransferInfo, onPrevious, onPlaceOrder, isPlacingOrder }: OrderReviewProps) => {
  const { cartItems, totalItems, totalPrice } = useCart();

  const vatRate = 0;
  const freeShippingThreshold = 100000;

  const subtotal = totalPrice; // totalPrice from useCart now correctly reflects unit prices * quantity
  const vat = subtotal * vatRate;

  let calculatedShipping = 0;
  let shippingDisplay = "";

  switch (shippingInfo.deliveryMethod) {
    case "pickup":
      calculatedShipping = 0;
      shippingDisplay = "Free (Pick-up)";
      break;
    case "dispatch-rider":
      calculatedShipping = 1; // Nominal charge
      shippingDisplay = "₦1 (Driver handles fees)";
      break;
    case "park-delivery":
      calculatedShipping = 1; // Nominal charge
      shippingDisplay = "₦1 (Driver handles fees)";
      break;
    default:
      // Fallback if deliveryMethod is somehow not set (shouldn't happen with Zod enum)
      calculatedShipping = subtotal >= freeShippingThreshold ? 0 : 3500;
      shippingDisplay = calculatedShipping === 0 ? "Free" : "₦" + calculatedShipping.toLocaleString('en-NG', { minimumFractionDigits: 2 });
      break;
  }

  const total = subtotal + vat + calculatedShipping;

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  const getDeliveryMethodLabel = (method: ShippingFormData['deliveryMethod']) => {
    switch (method) {
      case "pickup": return "Pick-up (Free)";
      case "dispatch-rider": return "Dispatch Rider (@ ₦1)";
      case "park-delivery": return "Park Delivery (@ ₦1)";
      default: return "Unknown";
    }
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

        {/* Delivery Method */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
            <Package className="h-5 w-5" /> Delivery Method
          </h3>
          <p className="text-muted-foreground text-sm">{getDeliveryMethodLabel(shippingInfo.deliveryMethod)}</p>
          {(shippingInfo.deliveryMethod === "dispatch-rider" || shippingInfo.deliveryMethod === "park-delivery") && (
            <p className="text-xs text-primary font-medium mt-2">
              *Actual delivery fees are negotiated directly with the driver.
            </p>
          )}
        </div>

        {/* Payment Method (Bank Transfer) */}
        <div>
          <h3 className="font-semibold text-lg mb-3 text-foreground flex items-center gap-2">
            <Banknote className="h-5 w-5" /> Payment Method
          </h3>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>Bank Transfer to Unique Emporium (Zenith Bank)</p>
            <p>Account Number: 0123456789</p>
            {bankTransferInfo.receiptFile && (
              <p>Receipt Uploaded: <span className="font-medium text-foreground">{bankTransferInfo.receiptFile.name}</span></p>
            )}
            {!bankTransferInfo.receiptFile && (
              <p className="text-destructive">No receipt uploaded. Please go back to upload.</p>
            )}
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
                    {item.quantity} x {formatCurrency(item.unitPrice)} / pc
                  </p> {/* Display unit price */}
                </div>
                <p className="font-semibold text-foreground">{formatCurrency(item.quantity * item.unitPrice)}</p> {/* Use unitPrice */}
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
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-foreground">
              {shippingDisplay}
            </span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t mt-3">
            <span>Grand Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <p className="text-sm text-muted-foreground font-normal mt-2">
            Prices are final — no VAT or hidden charges.
          </p>
          {(shippingInfo.deliveryMethod === "dispatch-rider" || shippingInfo.deliveryMethod === "park-delivery") && (
            <p className="text-xs text-primary font-medium mt-2">
              *Actual delivery fees for Dispatch/Park Delivery are negotiated directly with the driver.
            </p>
          )}
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
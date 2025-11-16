"use client";

import React, { useState } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Package, ArrowLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Define the type for delivery methods, matching BankTransferFormData
type DeliveryMethod = "pickup" | "dispatch-rider" | "park-delivery";

interface DeliveryMethodSelectionProps {
  onSelectDeliveryMethod: (method: DeliveryMethod) => void;
  onDeliveryMethodChange: (method: DeliveryMethod) => void; // New prop for instant update
  initialDeliveryMethod?: DeliveryMethod;
  onPrevious: () => void; // To go back to cart
}

const deliveryOptions = [
  { label: "1. Pick-up (Free)", value: "pickup" },
  { label: "2. Dispatch Rider (@ ₦1)", value: "dispatch-rider" },
  { label: "3. Park Delivery (@ ₦1)", value: "park-delivery" },
];

const DeliveryMethodSelection = ({ onSelectDeliveryMethod, onDeliveryMethodChange, initialDeliveryMethod, onPrevious }: DeliveryMethodSelectionProps) => {
  const [selectedMethod, setSelectedMethod] = useState<DeliveryMethod>(initialDeliveryMethod || "pickup");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectChange = (value: DeliveryMethod) => {
    setSelectedMethod(value);
    onDeliveryMethodChange(value); // Instantly update parent state
  };

  const handleContinue = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate a small delay
    onSelectDeliveryMethod(selectedMethod); // This is for moving to the next step
    setIsSubmitting(false);
  };

  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" /> Select Delivery Method
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow space-y-6">
        <p className="text-muted-foreground">
          Choose how you'd like to receive your order.
        </p>

        <div className="space-y-2">
          <Label htmlFor="deliveryMethod" className="flex items-center gap-2">
            <Package className="h-4 w-4" /> Delivery Method
          </Label>
          <Select
            onValueChange={handleSelectChange} // Use the new handler
            value={selectedMethod}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a delivery method" />
            </SelectTrigger>
            <SelectContent>
              {deliveryOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(selectedMethod === "dispatch-rider" || selectedMethod === "park-delivery") && (
            <p className="text-xs text-primary font-medium mt-2">
              💡 All delivery charges for Dispatch Rider and Park Delivery are handled directly with the driver. We only help negotiate.
            </p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <div className="flex flex-col sm:flex-row justify-between gap-4 w-full">
          <Button type="button" variant="outline" onClick={onPrevious} className="w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Cart
          </Button>
          <Button type="button" className="w-full sm:w-auto" size="lg" onClick={handleContinue} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Continuing...
              </>
            ) : (
              "Continue to Payment"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DeliveryMethodSelection;
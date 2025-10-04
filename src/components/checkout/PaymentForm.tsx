"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

// Zod schema for payment information
const paymentSchema = z.object({
  cardName: z.string().min(1, "Card Holder Name is required"),
  cardNumber: z.string().regex(/^\d{16}$/, "Card Number must be 16 digits"),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Expiry Date must be MM/YY"),
  cvv: z.string().regex(/^\d{3,4}$/, "CVV must be 3 or 4 digits"),
});

export type PaymentFormData = z.infer<typeof paymentSchema>; // Export type for use in Checkout page

interface PaymentFormProps {
  onNext: (data: PaymentFormData) => void;
  onPrevious: () => void;
  initialData?: PaymentFormData | null;
}

const PaymentForm = ({ onNext, onPrevious, initialData }: PaymentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: initialData || {
      cardName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const onSubmit = async (data: PaymentFormData) => {
    // Simulate API call if needed
    onNext(data);
  };

  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" /> Payment Information
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cardName">Card Holder Name</Label>
            <Input id="cardName" {...register("cardName")} className={cn(errors.cardName && "border-destructive")} />
            {errors.cardName && <p className="text-destructive text-sm">{errors.cardName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input id="cardNumber" type="text" inputMode="numeric" {...register("cardNumber")} className={cn(errors.cardNumber && "border-destructive")} />
            {errors.cardNumber && <p className="text-destructive text-sm">{errors.cardNumber.message}</p>}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date (MM/YY)</Label>
              <Input id="expiryDate" type="text" placeholder="MM/YY" {...register("expiryDate")} className={cn(errors.expiryDate && "border-destructive")} />
              {errors.expiryDate && <p className="text-destructive text-sm">{errors.expiryDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" type="text" inputMode="numeric" {...register("cvv")} className={cn(errors.cvv && "border-destructive")} />
              {errors.cvv && <p className="text-destructive text-sm">{errors.cvv.message}</p>}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <Button type="button" variant="outline" onClick={onPrevious} className="w-full sm:w-auto">
              Back to Shipping
            </Button>
            <Button type="submit" className="w-full sm:w-auto" size="lg" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reviewing...
                </>
              ) : (
                "Review Order"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default PaymentForm;
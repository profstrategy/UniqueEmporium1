"use client";

import React, { useState } from "react";
import { motion, Easing } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreditCard, Loader2 } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const paymentFormSchema = z.object({
  cardHolderName: z.string().min(1, "Card Holder Name is required"),
  cardNumber: z.string().min(1, "Card Number is required").regex(/^\d{16}$/, "Card number must be 16 digits"),
  expiryDate: z.string().min(1, "Expiry Date is required").regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid expiry date (MM/YY)"),
  cvv: z.string().min(1, "CVV is required").regex(/^\d{3,4}$/, "Invalid CVV (3 or 4 digits)"),
});

export type PaymentFormValues = z.infer<typeof paymentFormSchema>; // Exported type

interface PaymentFormProps {
  onNext: (data: PaymentFormValues) => void;
  onBack: () => void;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const PaymentForm = ({ onNext, onBack }: PaymentFormProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      cardHolderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: "",
    },
  });

  const onSubmit = async (data: PaymentFormValues) => {
    setIsLoading(true);
    // Simulate API call or processing time
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    onNext(data);
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="w-full"
    >
      <Card className="rounded-lg shadow-md">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <CreditCard className="h-5 w-5" /> Payment Information
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="cardHolderName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cardNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Card Number</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="**** **** **** ****" maxLength={16} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="expiryDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expiry Date (MM/YY)</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="MM/YY" maxLength={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cvv"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CVV</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="***" maxLength={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between gap-4">
                <Button type="button" variant="outline" onClick={onBack} className="w-full md:w-auto">
                  Back to Shipping
                </Button>
                <Button type="submit" className="w-full md:w-auto" size="lg" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Reviewing...
                    </>
                  ) : (
                    "Review Order"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PaymentForm;
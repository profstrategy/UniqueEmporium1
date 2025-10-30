"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import CheckoutHeader from "@/components/checkout/CheckoutHeader.tsx";
import CheckoutProgress from "@/components/checkout/CheckoutProgress.tsx";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard.tsx";
import EmptyCartState from "@/components/checkout/EmptyCartState.tsx";
import OrderPlacedState from "@/components/checkout/OrderPlacedState.tsx";
import ShippingForm from "@/components/checkout/ShippingForm.tsx";
import PaymentForm from "@/components/checkout/PaymentForm.tsx";
import OrderReview from "@/components/checkout/OrderReview.tsx";
import { useCart } from "@/context/CartContext.tsx";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import type { ShippingFormData } from "@/components/checkout/ShippingForm.tsx";
import type { PaymentFormData } from "@/components/checkout/PaymentForm.tsx";

interface OrderData {
  shipping: ShippingFormData | null;
  payment: PaymentFormData | null;
}

const formTransitionVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    x: "0%",
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" as Easing },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.5, ease: "easeIn" as Easing },
  }),
};

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({ shipping: null, payment: null });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (cartItems.length === 0 && !isOrderPlaced) {
      // If cart becomes empty and order isn't placed, redirect or show empty state
    }
  }, [cartItems, isOrderPlaced]);

  const handleNextStep = (data: ShippingFormData | PaymentFormData) => {
    setDirection(1);
    if (currentStep === 1) {
      setOrderData((prev) => ({ ...prev, shipping: data as ShippingFormData }));
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setOrderData((prev) => ({ ...prev, payment: data as PaymentFormData }));
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    toast.loading("Placing your order...", { id: "place-order-toast" });
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Order Data:", orderData, "Cart Items:", cartItems);

    toast.dismiss("place-order-toast");
    toast.success("Order Placed Successfully!", {
      description: "You will receive an email confirmation shortly.",
    });

    clearCart();
    setIsOrderPlaced(true);
    setIsPlacingOrder(false);
    window.scrollTo(0, 0);
  };

  if (cartItems.length === 0 && !isOrderPlaced) {
    return <EmptyCartState />;
  }

  if (isOrderPlaced) {
    return <OrderPlacedState />;
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <ShippingForm onNext={handleNextStep} initialData={orderData.shipping} />;
      case 2:
        return <PaymentForm onNext={handleNextStep} onPrevious={handlePreviousStep} initialData={orderData.payment} />;
      case 3:
        if (!orderData.shipping || !orderData.payment) {
          return (
            <div className="text-center py-10">
              <p className="text-destructive">Error: Missing shipping or payment information.</p>
              <Button onClick={() => setCurrentStep(1)} className="mt-4">Start Over</Button>
            </div>
          );
        }
        return (
          <OrderReview
            shippingInfo={orderData.shipping!}
            paymentInfo={orderData.payment!}
            onPrevious={handlePreviousStep}
            onPlaceOrder={handlePlaceOrder}
            isPlacingOrder={isPlacingOrder}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen w-full bg-background">
      <CheckoutHeader />
      <CheckoutProgress currentStep={currentStep} />

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Forms (2/3 width on desktop) */}
        <motion.div
          className="lg:col-span-2"
          key={currentStep}
          custom={direction}
          variants={formTransitionVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {renderStepContent()}
        </motion.div>

        {/* Right Column: Order Summary (1/3 width on desktop, fixed) */}
        <div className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
          <OrderSummaryCard />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
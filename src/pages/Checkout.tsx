"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import CheckoutHeader from "@/components/checkout/CheckoutHeader.tsx";
import CheckoutProgress from "@/components/checkout/CheckoutProgress.tsx";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard.tsx";
import EmptyCartState from "@/components/checkout/EmptyCartState.tsx";
import OrderPlacedState from "@/components/checkout/OrderPlacedState.tsx";
import ShippingForm from "@/components/checkout/ShippingForm.tsx";
import BankTransferPaymentForm from "@/components/checkout/BankTransferPaymentForm.tsx";
import OrderReview from "@/components/checkout/OrderReview.tsx";
import DeliveryMethodSelection from "@/components/checkout/DeliveryMethodSelection.tsx"; // New import
import { useCart } from "@/context/CartContext.tsx";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import type { ShippingFormData } from "@/components/checkout/ShippingForm.tsx";
import type { BankTransferFormData } from "@/components/checkout/BankTransferPaymentForm.tsx";
import { useNavigate } from "react-router-dom";

interface OrderData {
  shipping: ShippingFormData | null;
  bankTransfer: BankTransferFormData | null;
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
  const [currentStep, setCurrentStep] = useState(0); // Start at step 0 for delivery method selection
  const [orderData, setOrderData] = useState<OrderData>({
    shipping: null,
    bankTransfer: {
      receiptFile: undefined,
      deliveryMethod: "pickup", // Default delivery method
    },
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0 && !isOrderPlaced) {
      navigate("/cart");
    }
  }, [cartItems, isOrderPlaced, navigate]);

  // New handler for delivery method selection
  const handleDeliveryMethodSelected = (method: BankTransferFormData['deliveryMethod']) => {
    setDirection(1); // Moving forward
    setOrderData((prev) => ({
      ...prev,
      bankTransfer: {
        ...prev.bankTransfer!,
        deliveryMethod: method,
      },
    }));
    setCurrentStep(1); // Move to the actual payment form
  };

  const handleNextStep = (data: ShippingFormData | BankTransferFormData) => {
    setDirection(1); // Moving forward
    if (currentStep === 1) { // From BankTransferPaymentForm to ShippingForm
      setOrderData((prev) => ({ ...prev, bankTransfer: data as BankTransferFormData }));
      setCurrentStep(2);
    } else if (currentStep === 2) { // From ShippingForm to OrderReview
      setOrderData((prev) => ({ ...prev, shipping: data as ShippingFormData }));
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    setDirection(-1); // Moving backward
    setCurrentStep((prev) => Math.max(0, prev - 1)); // Allow going back to step 0
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
      case 0: // Initial step: Select Delivery Method
        return (
          <DeliveryMethodSelection
            onSelectDeliveryMethod={handleDeliveryMethodSelected}
            initialDeliveryMethod={orderData.bankTransfer?.deliveryMethod}
            onPrevious={() => navigate("/cart")} // Go back to cart from this first step
          />
        );
      case 1: // Second step: Bank Transfer Payment (now receives selected delivery method)
        return (
          <BankTransferPaymentForm
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            initialData={orderData.bankTransfer}
            // onDeliveryMethodChange is no longer needed here as selection is done in step 0
          />
        );
      case 2: // Third step: Shipping Information
        return (
          <ShippingForm
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            initialData={orderData.shipping}
          />
        );
      case 3: // Fourth step: Order Review
        if (!orderData.shipping || !orderData.bankTransfer) {
          return (
            <div className="text-center py-10">
              <p className="text-destructive">Error: Missing payment or shipping information.</p>
              <Button onClick={() => setCurrentStep(0)} className="mt-4">Start Over</Button>
            </div>
          );
        }
        return (
          <OrderReview
            shippingInfo={orderData.shipping!}
            bankTransferInfo={orderData.bankTransfer!}
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
      {/* Adjust CheckoutProgress to display steps correctly (e.g., 1-4 instead of 0-3) */}
      <CheckoutProgress currentStep={currentStep + 1} totalSteps={4} />

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
          <OrderSummaryCard
            deliveryMethod={orderData.bankTransfer?.deliveryMethod}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
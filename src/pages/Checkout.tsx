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
import { useCart } from "@/context/CartContext.tsx";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import type { ShippingFormData } from "@/components/checkout/ShippingForm.tsx";
import type { BankTransferFormData } from "@/components/checkout/BankTransferPaymentForm.tsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate

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
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    shipping: null,
    bankTransfer: { // Initialize bankTransfer with a default delivery method
      receiptFile: undefined,
      deliveryMethod: "pickup",
    },
  });
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const isMobile = useIsMobile();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (cartItems.length === 0 && !isOrderPlaced) {
      // If cart becomes empty and order isn't placed, redirect to cart
      navigate("/cart");
    }
  }, [cartItems, isOrderPlaced, navigate]);

  const handleNextStep = (data: ShippingFormData | BankTransferFormData) => {
    setDirection(1);
    if (currentStep === 1) { // From BankTransferPaymentForm
      setOrderData((prev) => ({ ...prev, bankTransfer: data as BankTransferFormData }));
      setCurrentStep(2); // Move to ShippingForm
    } else if (currentStep === 2) { // From ShippingForm
      setOrderData((prev) => ({ ...prev, shipping: data as ShippingFormData }));
      setCurrentStep(3); // Move to OrderReview
    }
  };

  const handlePreviousStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleDeliveryMethodChange = (method: BankTransferFormData['deliveryMethod']) => {
    setOrderData((prev) => ({
      ...prev,
      bankTransfer: {
        ...prev.bankTransfer!, // Ensure bankTransfer is not null
        deliveryMethod: method,
      },
    }));
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
      case 1: // First step: Bank Transfer Payment
        return (
          <BankTransferPaymentForm
            onNext={handleNextStep}
            onPrevious={() => navigate("/cart")} // Go back to cart from first step
            initialData={orderData.bankTransfer}
            onDeliveryMethodChange={handleDeliveryMethodChange} // Pass the new callback
          />
        );
      case 2: // Second step: Shipping Information
        return (
          <ShippingForm
            onNext={handleNextStep}
            onPrevious={handlePreviousStep}
            initialData={orderData.shipping}
          />
        );
      case 3: // Third step: Order Review
        if (!orderData.shipping || !orderData.bankTransfer) {
          return (
            <div className="text-center py-10">
              <p className="text-destructive">Error: Missing payment or shipping information.</p>
              <Button onClick={() => setCurrentStep(1)} className="mt-4">Start Over</Button>
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
          <OrderSummaryCard
            deliveryMethod={orderData.bankTransfer?.deliveryMethod} // Pass the selected delivery method
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;
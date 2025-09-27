"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext.tsx";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ShoppingBag, CheckCircle2 } from "lucide-react";
import CheckoutHeader from "@/components/checkout/CheckoutHeader.tsx";
import CheckoutProgress from "@/components/checkout/CheckoutProgress.tsx";
import OrderSummaryCard from "@/components/checkout/OrderSummaryCard.tsx";

// Placeholder forms (will be created in subsequent steps)
const ShippingForm = ({ onNext, onBack, setShippingDetails }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.3, ease: "easeOut" as Easing }}
    className="p-6 bg-card rounded-lg shadow-md"
  >
    <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
    <p className="text-muted-foreground mb-6">Form fields will go here.</p>
    <Button onClick={() => onNext({ /* mock data */ })}>Continue to Payment</Button>
  </motion.div>
);

const PaymentForm = ({ onNext, onBack, setPaymentDetails }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.3, ease: "easeOut" as Easing }}
    className="p-6 bg-card rounded-lg shadow-md"
  >
    <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
    <p className="text-muted-foreground mb-6">Form fields will go here.</p>
    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack}>Back to Shipping</Button>
      <Button onClick={() => onNext({ /* mock data */ })}>Review Order</Button>
    </div>
  </motion.div>
);

const OrderReview = ({ onPlaceOrder, onBack, shippingDetails, paymentDetails }: any) => (
  <motion.div
    initial={{ opacity: 0, x: 100 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100 }}
    transition={{ duration: 0.3, ease: "easeOut" as Easing }}
    className="p-6 bg-card rounded-lg shadow-md"
  >
    <h2 className="text-2xl font-bold mb-4">Order Review</h2>
    <p className="text-muted-foreground mb-6">Review your order details below.</p>
    <div className="space-y-4 mb-6">
      <div>
        <h3 className="font-semibold text-lg">Shipping Address</h3>
        <p>{shippingDetails?.fullName}</p>
        <p>{shippingDetails?.address1}</p>
        <p>{shippingDetails?.city}, {shippingDetails?.state} {shippingDetails?.zipCode}</p>
      </div>
      <div>
        <h3 className="font-semibold text-lg">Payment Method</h3>
        <p>Card ending in **** **** **** {paymentDetails?.cardNumber?.slice(-4)}</p>
        <p>Card Holder: {paymentDetails?.cardHolderName}</p>
      </div>
    </div>
    <div className="flex justify-between">
      <Button variant="outline" onClick={onBack}>Back to Payment</Button>
      <Button onClick={onPlaceOrder}>Place Order</Button>
    </div>
  </motion.div>
);

const EmptyCartState = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-20"
  >
    <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-8" />
    <h2 className="text-2xl font-bold mb-4 text-foreground">Your Cart is Empty</h2>
    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
      It looks like you haven't added any products to your cart. Start shopping to proceed to checkout!
    </p>
    <Button asChild size="lg">
      <Link to="/products">Continue Shopping</Link>
    </Button>
  </motion.div>
);

const OrderPlacedState = ({ onContinueShopping }: { onContinueShopping: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="text-center py-20"
  >
    <CheckCircle2 className="h-24 w-24 text-green-500 mx-auto mb-8" />
    <h2 className="text-2xl font-bold mb-4 text-foreground">Order Placed Successfully!</h2>
    <p className="text-muted-foreground mb-8 max-w-md mx-auto">
      Thank you for your purchase. Your order has been confirmed and will be processed shortly.
    </p>
    <Button onClick={onContinueShopping} size="lg">
      Continue Shopping
    </Button>
  </motion.div>
);

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<any>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    if (cartItems.length === 0 && !orderPlaced) {
      // If cart is empty and order not placed, show empty cart state
      // Or, if you prefer, redirect to cart page: navigate('/cart');
    }
  }, [cartItems, orderPlaced, navigate]);

  const handleNextStep = (data: any) => {
    if (currentStep === 1) {
      setShippingDetails(data);
      setCurrentStep(2);
    } else if (currentStep === 2) {
      setPaymentDetails(data);
      setCurrentStep(3);
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handlePlaceOrder = () => {
    // Simulate order placement
    console.log("Placing order with:", { shippingDetails, paymentDetails, cartItems });
    setOrderPlaced(true);
    clearCart(); // Clear cart after successful order
  };

  const handleContinueShopping = () => {
    setOrderPlaced(false);
    setCurrentStep(1);
    setShippingDetails(null);
    setPaymentDetails(null);
    navigate("/products");
  };

  // Calculate shipping cost
  const SHIPPING_THRESHOLD = 500000; // ₦500,000
  const BASE_SHIPPING_COST = 5000; // ₦5,000
  const shippingCost = totalPrice >= SHIPPING_THRESHOLD ? 0 : BASE_SHIPPING_COST;

  if (cartItems.length === 0 && !orderPlaced) {
    return <EmptyCartState />;
  }

  if (orderPlaced) {
    return <OrderPlacedState onContinueShopping={handleContinueShopping} />;
  }

  return (
    <div className="min-h-screen w-full bg-background pb-16">
      <CheckoutHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CheckoutProgress currentStep={currentStep} />

        <div className={isMobile ? "flex flex-col gap-8 mt-8" : "grid grid-cols-3 gap-8 mt-8"}>
          {/* Left Column (Forms) - 2/3 width on desktop */}
          <div className={isMobile ? "col-span-1" : "col-span-2"}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <ShippingForm key="shipping" onNext={handleNextStep} onBack={handlePreviousStep} setShippingDetails={setShippingDetails} />
              )}
              {currentStep === 2 && (
                <PaymentForm key="payment" onNext={handleNextStep} onBack={handlePreviousStep} setPaymentDetails={setPaymentDetails} />
              )}
              {currentStep === 3 && (
                <OrderReview
                  key="review"
                  onPlaceOrder={handlePlaceOrder}
                  onBack={handlePreviousStep}
                  shippingDetails={shippingDetails}
                  paymentDetails={paymentDetails}
                />
              )}
            </AnimatePresence>
          </div>

          {/* Right Column (Order Summary) - 1/3 width on desktop */}
          <div className={isMobile ? "col-span-1" : "col-span-1"}>
            <OrderSummaryCard cartItems={cartItems} shippingCost={shippingCost} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext.tsx";
import { Plus, Minus, Trash2, CreditCard, Loader2, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence, Easing } from "framer-motion";

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCheckingOut(false);
    // In a real app, you'd navigate to checkout page and clear cart there
    // For now, just clear the cart and show a success message
    clearCart();
    // toast.success("Checkout successful!", { description: "Your order has been placed." });
  };

  return (
    <div className="container mx-auto p-8">
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        variants={fadeInUp}
        initial="hidden"
        animate="visible"
      >
        Your Shopping Cart
      </motion.h1>
      {cartItems.length === 0 ? (
        <motion.div
          className="text-center py-20"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <ShoppingBag className="h-24 w-24 text-muted-foreground mx-auto mb-8" />
          <p className="text-lg text-muted-foreground mb-4">Your cart is currently empty.</p>
          <Button asChild size="lg">
            <Link to="/products">Start Shopping</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col sm:flex-row items-center justify-between border rounded-lg p-4 shadow-sm"
                >
                  <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                    <img src={item.images[0]} alt={item.name} className="h-20 w-20 object-contain rounded-md border" />
                    <div>
                      <h2 className="font-semibold text-xl">{item.name}</h2>
                      <p className="text-muted-foreground">₦{item.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })} each</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-lg font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="font-bold text-2xl">₦{(item.quantity * item.price).toLocaleString('en-NG', { minimumFractionDigits: 2 })}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button variant="outline" className="w-full mt-4" onClick={clearCart} disabled={cartItems.length === 0}>
              Clear All Items
            </Button>
          </div>
          <div className="md:col-span-1 bg-card border rounded-lg p-6 shadow-lg h-fit">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between text-lg mb-2">
              <span>Subtotal:</span>
              <span>₦{totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total:</span>
              <span>₦{totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
            </div>
            <Button asChild className="w-full text-lg" disabled={cartItems.length === 0 || isCheckingOut}>
              <Link to="/checkout"> {/* Link to checkout page */}
                {isCheckingOut ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-5 w-5" /> Proceed to Checkout
                  </>
                )}
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
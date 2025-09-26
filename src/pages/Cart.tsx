"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Cart = () => {
  // Placeholder for cart items
  const cartItems = [
    { id: "1", name: "ZenBook Pro 14 OLED", price: 950000, quantity: 1 },
    { id: "2", name: "SoundWave Max Headphones", price: 175000, quantity: 2 },
  ];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p className="text-lg text-muted-foreground mb-4">Your cart is currently empty.</p>
          <Button asChild>
            <Link to="/products">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border rounded-lg p-4 shadow-sm">
                <div>
                  <h2 className="font-semibold text-xl">{item.name}</h2>
                  <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                  <p className="font-medium">₦{item.price.toFixed(2)} each</p>
                </div>
                <p className="font-bold text-2xl">₦{(item.quantity * item.price).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="md:col-span-1 bg-card border rounded-lg p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
            <div className="flex justify-between text-lg mb-2">
              <span>Subtotal:</span>
              <span>₦{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold mb-6">
              <span>Total:</span>
              <span>₦{total.toFixed(2)}</span>
            </div>
            <Button className="w-full text-lg">Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
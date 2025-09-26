"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  // Placeholder for cart items
  const cartItems = [
    { id: "1", name: "ZenBook Pro 14 OLED", price: 950000, quantity: 1 },
    { id: "2", name: "SoundWave Max Headphones", price: 175000, quantity: 2 },
  ];
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="h-6 w-6" /> Your Cart
          </SheetTitle>
          <SheetDescription>
            Review your selected items before checkout.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto py-4">
          {cartItems.length === 0 ? (
            <p className="text-center text-muted-foreground">Your cart is empty.</p>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.quantity} x ₦{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-semibold">₦{(item.quantity * item.price).toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-auto border-t pt-4">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total:</span>
            <span>₦{total.toFixed(2)}</span>
          </div>
          <Button asChild className="w-full">
            <Link to="/cart" onClick={onClose}>
              View Cart & Checkout
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
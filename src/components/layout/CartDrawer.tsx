"use client";

import React, { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Plus, Minus, Trash2, CreditCard, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext.tsx";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartDrawer = ({ isOpen, onClose }: CartDrawerProps) => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate checkout process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsCheckingOut(false);
    // In a real app, you'd navigate to checkout page and clear cart there
    onClose();
    // For now, just clear the cart and show a success message
    clearCart();
    // toast.success("Checkout successful!", { description: "Your order has been placed." });
  };

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
                  <div className="flex items-center gap-3">
                    <img src={item.images[0]} alt={item.name} className="h-12 w-12 object-contain rounded-md border" />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₦{item.price.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:bg-destructive/10"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="mt-auto border-t pt-4">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Total:</span>
            <span>₦{totalPrice.toLocaleString('en-NG', { minimumFractionDigits: 2 })}</span>
          </div>
          <Button asChild className="w-full mb-2" disabled={cartItems.length === 0 || isCheckingOut}>
            <Link to="/checkout"> {/* Link to checkout page */}
              {isCheckingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                <>
                  <CreditCard className="mr-2 h-4 w-4" /> Proceed to Checkout
                </>
              )}
            </Link>
          </Button>
          <Button variant="outline" className="w-full" onClick={clearCart} disabled={cartItems.length === 0}>
            Clear Cart
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Badge from "./Badge.tsx";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/context/CartContext.tsx"; // Fixed import path

interface CartIconProps {
  onOpenCartDrawer: () => void;
}

const CartIcon = ({ onOpenCartDrawer }: CartIconProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const { totalItems } = useCart(); // Get totalItems from CartContext

  const handleClick = () => {
    if (isMobile) {
      navigate("/cart");
    } else {
      onOpenCartDrawer();
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={handleClick} className="rounded-full hover:bg-secondary/80">
        <ShoppingBag className="h-5 w-5" />
      </Button>
      <Badge count={totalItems} variant="destructive" /> {/* Use totalItems */}
    </div>
  );
};

export default CartIcon;
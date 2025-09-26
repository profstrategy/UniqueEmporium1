"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Badge from "./Badge.tsx"; // Add .tsx extension
import { useIsMobile } from "@/hooks/use-mobile";

interface CartIconProps {
  itemCount: number;
  onOpenCartDrawer: () => void;
}

const CartIcon = ({ itemCount, onOpenCartDrawer }: CartIconProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const handleClick = () => {
    if (isMobile) {
      navigate("/cart");
    } else {
      onOpenCartDrawer();
    }
  };

  return (
    <div className="relative">
      <Button variant="ghost" size="icon" onClick={handleClick}>
        <ShoppingBag className="h-5 w-5" />
      </Button>
      <Badge count={itemCount} variant="destructive" />
    </div>
  );
};

export default CartIcon;
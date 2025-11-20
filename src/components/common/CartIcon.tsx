"use client";

import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Fixed import path, added useLocation
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Badge from "./Badge.tsx";
import { useIsMobile } from "@/hooks/use-mobile";
import { useCart } from "@/context/CartContext.tsx";
import { useAuth } from "@/context/AuthContext.tsx"; // Import useAuth

interface CartIconProps {
  onOpenCartDrawer: () => void;
}

const CartIcon = ({ onOpenCartDrawer }: CartIconProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation
  const { totalItems } = useCart();
  const { user } = useAuth(); // Get user from AuthContext

  const handleClick = () => {
    if (!user) {
      navigate("/auth", { state: { from: location.pathname } });
      return;
    }

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
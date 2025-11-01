"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Shirt, Baby, Gem, ShoppingBag, Info, Mail } from "lucide-react";
import Badge from "@/components/common/Badge.tsx";
import { motion, Easing } from "framer-motion";
import { useCart } from "@/context/CartContext.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx"; // Import the new logo component

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteCount: number;
  itemCount: number;
}

const categories = [
  { name: "Kids", icon: Baby, link: "/products?category=Kids" },
  { name: "Kids Patpat", icon: Baby, link: "/products?category=Kids Patpat" },
  { name: "Children Jeans", icon: Baby, link: "/products?category=Children Jeans" },
  { name: "Children Shirts", icon: Baby, link: "/products?category=Children Shirts" },
  { name: "Men Vintage Shirts", icon: Shirt, link: "/products?category=Men Vintage Shirts" },
  { name: "Amazon Ladies", icon: ShoppingBag, link: "/products?category=Amazon Ladies" },
  { name: "SHEIN Gowns", icon: Shirt, link: "/products?category=SHEIN Gowns" },
  { name: "Others", icon: Gem, link: "/products?category=Others" },
];

const MobileMenu = ({ isOpen, onClose, favoriteCount, itemCount }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();

  const handleLinkClick = (path: string) => {
    onClose();
    navigate(path);
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as Easing } },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[80vw] max-w-sm flex flex-col">
        <SheetHeader className="flex items-center justify-center py-4"> {/* Center the logo */}
          <UniqueEmporiumLogo className="h-[100px]" /> {/* Updated height to 100px */}
        </SheetHeader>
        <motion.nav
          className="flex flex-col space-y-4 py-4 overflow-y-auto"
          initial="hidden"
          animate="visible"
          variants={menuVariants}
        >
          <Button variant="ghost" className="justify-start text-base" onClick={() => handleLinkClick("/")}>
            <Info className="mr-2 h-5 w-5" /> Home
          </Button>
          <Button variant="ghost" className="justify-start text-base" onClick={() => handleLinkClick("/products")}>
            <ShoppingBag className="mr-2 h-5 w-5" /> Shop All
          </Button>

          <div className="border-t border-border pt-4">
            <h3 className="mb-3 px-4 text-sm font-semibold text-muted-foreground">Categories</h3>
            <div className="grid grid-cols-2 gap-2 px-2">
              {categories.map((category) => (
                <Button
                  key={category.name}
                  variant="ghost"
                  className="flex flex-col h-auto py-3 justify-center items-center text-center text-sm"
                  onClick={() => handleLinkClick(category.link)}
                >
                  <category.icon className="h-5 w-5 mb-1" />
                  {category.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <Button variant="ghost" className="justify-start text-base relative" onClick={() => handleLinkClick("/favorites")}>
              <Heart className="mr-2 h-5 w-5" /> Favorites
              <Badge count={totalFavorites} variant="destructive" className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Button>
            <Button variant="ghost" className="justify-start text-base relative" onClick={() => handleLinkClick("/cart")}>
              <ShoppingBag className="mr-2 h-5 w-5" /> Cart
              <Badge count={totalItems} variant="destructive" className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Button>
          </div>

          <div className="border-t border-border pt-4">
            <Button variant="ghost" className="justify-start text-base" onClick={() => handleLinkClick("/about")}>
              <Info className="mr-2 h-5 w-5" /> About Us
            </Button>
            <Button variant="ghost" className="justify-start text-base" onClick={() => handleLinkClick("/contact")}>
              <Mail className="mr-2 h-5 w-5" /> Contact
            </Button>
          </div>
        </motion.nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Scale, Laptop, Tablet, Headphones, Home, Info, Mail, LayoutGrid, ShoppingBag } from "lucide-react";
import Badge from "@/components/common/Badge.tsx";
import { motion, Easing } from "framer-motion";
import { useCart } from "@/context/CartContext.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import { useCompare } from "@/context/CompareContext.tsx"; // Import useCompare

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteCount: number;
  compareCount: number;
  itemCount: number; // For cart badge in mobile menu
}

const categories = [
  { name: "Laptops", icon: Laptop, link: "/products?category=laptops" },
  { name: "Tablets", icon: Tablet, link: "/products?category=tablets" },
  { name: "Audio", icon: Headphones, link: "/products?category=audio" },
  { name: "Monitors", icon: LayoutGrid, link: "/products?category=monitors" },
  { name: "Accessories", icon: LayoutGrid, link: "/products?category=accessories" },
  { name: "Smart Home", icon: Home, link: "/products?category=smart-home" },
];

const MobileMenu = ({ isOpen, onClose, favoriteCount, compareCount, itemCount }: MobileMenuProps) => {
  const navigate = useNavigate();
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { totalCompareItems } = useCompare(); // Get totalCompareItems from CompareContext

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
      <SheetContent side="left" className="w-[80vw] max-w-sm flex flex-col"> {/* Adjusted width */}
        <SheetHeader>
          <SheetTitle className="text-2xl font-bold text-primary">ElectroPro</SheetTitle>
        </SheetHeader>
        <motion.nav
          className="flex flex-col space-y-4 py-4 overflow-y-auto"
          initial="hidden"
          animate="visible"
          variants={menuVariants}
        >
          <Button variant="ghost" className="justify-start text-base" onClick={() => handleLinkClick("/")}> {/* Adjusted font size */}
            <Home className="mr-2 h-5 w-5" /> Home
          </Button>
          <Button variant="ghost" className="justify-start text-base" onClick={() => handleLinkClick("/products")}> {/* Adjusted font size */}
            <Laptop className="mr-2 h-5 w-5" /> Electronics
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
            <Button variant="ghost" className="justify-start text-base relative" onClick={() => handleLinkClick("/favorites")}> {/* Adjusted font size */}
              <Heart className="mr-2 h-5 w-5" /> Favorites
              <Badge count={totalFavorites} variant="destructive" className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Button>
            <Button variant="ghost" className="justify-start text-base relative" onClick={() => handleLinkClick("/compare")}> {/* Adjusted font size */}
              <Scale className="mr-2 h-5 w-5" /> Compare
              <Badge count={totalCompareItems} variant="secondary" className="absolute right-4 top-1/2 -translate-y-1/2" /> {/* Use totalCompareItems */}
            </Button>
            <Button variant="ghost" className="justify-start text-base relative" onClick={() => handleLinkClick("/cart")}> {/* Adjusted font size */}
              <ShoppingBag className="mr-2 h-5 w-5" /> Cart
              <Badge count={totalItems} variant="destructive" className="absolute right-4 top-1/2 -translate-y-1/2" />
            </Button>
          </div>

          <div className="border-t border-border pt-4">
            <Button variant="ghost" className="justify-start text-base" onClick={() => handleLinkClick("/about")}> {/* Adjusted font size */}
              <Info className="mr-2 h-5 w-5" /> About Us
            </Button>
            <Button variant="ghost" className="justify-start text-base" onClick={() => handleLinkClick("/contact")}> {/* Adjusted font size */}
              <Mail className="mr-2 h-5 w-5" /> Contact
            </Button>
          </div>
        </motion.nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
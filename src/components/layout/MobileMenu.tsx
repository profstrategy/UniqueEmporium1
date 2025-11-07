"use client";

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Heart, Shirt, Baby, Gem, ShoppingBag, Info, Mail, List, User, LogOut, Home, LayoutDashboard } from "lucide-react"; // Import Home and LayoutDashboard icon
import Badge from "@/components/common/Badge.tsx";
import { motion, Easing } from "framer-motion";
import { useCart } from "@/context/CartContext.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { accountNavItems } from "@/data/accountNavItems.ts"; // Import account nav items
import { toast } from "sonner"; // Import toast

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

  const handleLogout = () => {
    // Handle logout logic here (e.g., clear user session, tokens)
    onClose();
    navigate("/"); // Redirect to home after logout
    toast.info("You have been logged out.");
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as Easing } },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[80vw] max-w-sm flex flex-col bg-secondary text-secondary-foreground">
        <SheetHeader className="flex items-center justify-center py-[5px]">
          <UniqueEmporiumLogo className="h-[130px]" />
        </SheetHeader>
        <motion.nav
          className="flex flex-col space-y-1 py-0 overflow-y-auto"
          initial="hidden"
          animate="visible"
          variants={menuVariants}
        >
          {/* 1. Home */}
          <Button variant="ghost" className="justify-start text-base py-1 text-foreground hover:bg-primary/70" onClick={() => handleLinkClick("/")}>
            <Home className="mr-2 h-5 w-5" /> Home
          </Button>

          {/* 2. My Account Accordion */}
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="account" className="border-b-0">
                <AccordionTrigger className="flex items-center justify-between px-4 py-1 text-base font-semibold text-foreground hover:no-underline">
                  <div className="flex items-center">
                    <User className="mr-2 h-5 w-5" /> My Account
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="flex flex-col space-y-1 px-2">
                    {accountNavItems.map((item) => (
                      <Button
                        key={item.name}
                        variant="ghost"
                        className="justify-start text-sm py-1 text-foreground hover:bg-primary/70"
                        onClick={() => handleLinkClick(item.path)}
                      >
                        <item.icon className="mr-2 h-4 w-4" /> {item.name}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* 3. Categories Accordion */}
          <div>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="categories" className="border-b-0">
                <AccordionTrigger className="flex items-center justify-between px-4 py-1 text-base font-semibold text-foreground hover:no-underline">
                  <div className="flex items-center">
                    <List className="mr-2 h-5 w-5" /> Categories
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pb-0">
                  <div className="grid grid-cols-2 gap-2 px-2">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant="ghost"
                        className="flex flex-col h-auto py-3 justify-center items-center text-center text-xs text-foreground hover:bg-primary/70"
                        onClick={() => handleLinkClick(category.link)}
                      >
                        <category.icon className="h-5 w-5 mb-1" />
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          {/* 4. Shop All */}
          <Button variant="ghost" className="justify-start text-base py-1 text-foreground hover:bg-primary/70" onClick={() => handleLinkClick("/products")}>
            <ShoppingBag className="mr-2 h-5 w-5" /> Shop All
          </Button>

          {/* 5. Favorites */}
          <Button variant="ghost" className="justify-start text-base relative w-full py-1 text-foreground hover:bg-primary/70" onClick={() => handleLinkClick("/favorites")}>
            <Heart className="mr-2 h-5 w-5" /> Favorites
            <Badge count={totalFavorites} variant="destructive" className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Button>

          {/* 6. Cart */}
          <Button variant="ghost" className="justify-start text-base relative w-full py-1 text-foreground hover:bg-primary/70" onClick={() => handleLinkClick("/cart")}>
            <ShoppingBag className="mr-2 h-5 w-5" /> Cart
            <Badge count={totalItems} variant="destructive" className="absolute right-4 top-1/2 -translate-y-1/2" />
          </Button>

          {/* 7. About Us */}
          <Button variant="ghost" className="justify-start text-base py-1 text-foreground hover:bg-primary/70" onClick={() => handleLinkClick("/about")}>
            <Info className="mr-2 h-5 w-5" /> About Us
          </Button>

          {/* 8. Contact */}
          <Button variant="ghost" className="justify-start text-base py-1 text-foreground hover:bg-primary/70" onClick={() => handleLinkClick("/contact")}>
            <Mail className="mr-2 h-5 w-5" /> Contact
          </Button>

          {/* Temporary Admin Link */}
          <Button variant="ghost" className="justify-start text-base py-1 text-foreground hover:bg-primary/70" onClick={() => handleLinkClick("/admin")}>
            <LayoutDashboard className="mr-2 h-5 w-5" /> Admin Dashboard
          </Button>

          {/* 9. Logout (top-level) */}
          <Button
            variant="ghost"
            className="justify-start text-base py-1 text-foreground hover:text-destructive hover:bg-destructive/70"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" /> Logout
          </Button>
        </motion.nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
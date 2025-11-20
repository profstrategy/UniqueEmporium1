"use client";

import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, Search, Heart, ChevronDown, Shirt, Baby, Gem, ShoppingBag, User, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import Badge from "@/components/common/Badge.tsx";
import CartIcon from "@/components/common/CartIcon.tsx";
import SlideOutSearchBar from "./SlideOutSearchBar.tsx";
import MobileMenu from "./MobileMenu.tsx";
import CartDrawer from "./CartDrawer.tsx";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import { useAuth } from "@/context/AuthContext.tsx"; // Use AuthContext
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";
import { cn } from "@/lib/utils";

interface HeaderProps {
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
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

const Header = ({ isCartDrawerOpen, setIsCartDrawerOpen }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Initialize useLocation
  const isMobile = useIsMobile();
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { user, isAdmin, signOut } = useAuth(); // Use AuthContext

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogoClick = () => {
    navigate("/");
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-sm border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between h-16 px-4 sm:px-6 lg:px-8 text-foreground">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={handleLogoClick}>
            <UniqueEmporiumLogo className="h-[100px]" />
          </Link>

          {/* Desktop Navigation Links (hidden on mobile/tablet, visible on large screens) */}
          <nav className="hidden lg:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "hover:text-primary/80"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "hover:text-primary/80"}`
              }
            >
              Shop All
            </NavLink>

            {/* Categories Dropdown (Desktop) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1 text-foreground hover:bg-secondary/80 rounded-full">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <DropdownMenuItem 
                    key={category.name} 
                    asChild 
                    className="rounded-full p-0 hover:bg-accent" // Applied rounded-full and hover here
                  >
                    <Link 
                      to={category.link} 
                      className="flex items-center gap-2 cursor-pointer w-full h-full p-2" // Ensure link fills the item
                    >
                      <category.icon className="h-4 w-4" />
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <NavLink
              to="/about"
              className={({ isActive }) =>
                `transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "hover:text-primary/80"}`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "hover:text-primary/80"}`
              }
            >
              Contact
            </NavLink>
            {/* Admin Link (Visible only if user is admin) */}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "hover:text-primary/80"}`
                }
              >
                Admin
              </NavLink>
            )}
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchBarOpen(!isSearchBarOpen)} className="text-foreground hover:bg-secondary/80 rounded-full">
              <Search className="h-5 w-5" />
            </Button>

            <Link to="/favorites" className="relative">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
              <Badge count={totalFavorites} variant="destructive" />
            </Link>

            <CartIcon onOpenCartDrawer={() => setIsCartDrawerOpen(true)} />

            {/* Auth/Account Icon */}
            {user ? (
              <>
                {/* Account Dashboard Link (Desktop) */}
                {!isMobile && !isAdmin && (
                  <Link to="/account" className="relative">
                    <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {/* Logout Button (Desktop) */}
                {!isMobile && user && (
                  <Button variant="ghost" size="icon" onClick={signOut} className="text-foreground hover:bg-secondary/80 rounded-full">
                    <LogOut className="h-5 w-5" />
                  </Button>
                )}
              </>
            ) : (
              /* Sign In Icon */
              <Link to="/auth" state={{ from: location.pathname }} className="relative"> {/* Added state here */}
                <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full">
                  <LogIn className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Mobile Menu Button (visible on mobile/tablet, hidden on large screens) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground hover:bg-secondary/80 rounded-full"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      {/* Slide-out Search Bar */}
      <SlideOutSearchBar isOpen={isSearchBarOpen} onClose={() => setIsSearchBarOpen(false)} />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        favoriteCount={totalFavorites}
        itemCount={totalItems}
      />

      {/* Cart Drawer (Desktop Only) */}
      {!isMobile && <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />}
    </>
  );
};

export default Header;
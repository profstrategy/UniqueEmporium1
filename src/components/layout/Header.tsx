"use client";

import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, Search, Heart, Scale, ChevronDown, Laptop, Tablet, Headphones, Home, Info, Mail, LayoutGrid } from "lucide-react";
import Badge from "@/components/common/Badge.tsx"; // Added .tsx extension
import CartIcon from "@/components/common/CartIcon.tsx"; // Added .tsx extension
import SlideOutSearchBar from "./SlideOutSearchBar.tsx"; // Added .tsx extension
import MobileMenu from "./MobileMenu.tsx"; // Added .tsx extension
import CartDrawer from "./CartDrawer.tsx"; // Added .tsx extension
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";

const categories = [
  { name: "Laptops", icon: Laptop, link: "/products?category=laptops" },
  { name: "Tablets", icon: Tablet, link: "/products?category=tablets" },
  { name: "Audio", icon: Headphones, link: "/products?category=audio" },
  { name: "Monitors", icon: LayoutGrid, link: "/products?category=monitors" },
  { name: "Accessories", icon: LayoutGrid, link: "/products?category=accessories" },
  { name: "Smart Home", icon: Home, link: "/products?category=smart-home" },
];

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  // Placeholder counts for badges
  const favoriteCount = 3;
  const compareCount = 1;
  const itemCount = 2;

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogoClick = () => {
    navigate("/");
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  const handleCategoryClick = (link: string) => {
    navigate(link);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto flex max-w-7xl items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2" onClick={handleLogoClick}>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              EP
            </div>
            <span className="font-poppins font-bold text-xl text-foreground">ElectroPro</span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `text-foreground transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "hover:text-primary"}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `text-foreground transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "hover:text-primary"}`
              }
            >
              Electronics
            </NavLink>

            {/* Categories Dropdown (Desktop) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 p-2 grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <DropdownMenuItem key={category.name} asChild>
                    <Link to={category.link} className="flex items-center gap-2 cursor-pointer hover:bg-accent rounded-md p-2">
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
                `text-foreground transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "hover:text-primary"}`
              }
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-foreground transition-colors duration-200 ${isActive ? "text-primary font-semibold" : "hover:text-primary"}`
              }
            >
              Contact
            </NavLink>
          </nav>

          {/* Utility Icons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchBarOpen(!isSearchBarOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            <Link to="/favorites" className="relative">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Badge count={favoriteCount} variant="destructive" />
            </Link>

            <Link to="/compare" className="relative">
              <Button variant="ghost" size="icon">
                <Scale className="h-5 w-5" />
              </Button>
              <Badge count={compareCount} variant="secondary" />
            </Link>

            <CartIcon itemCount={itemCount} onOpenCartDrawer={() => setIsCartDrawerOpen(true)} />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
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
        favoriteCount={favoriteCount}
        compareCount={compareCount}
        itemCount={itemCount}
      />

      {/* Cart Drawer (Desktop Only) */}
      {!isMobile && <CartDrawer isOpen={isCartDrawerOpen} onClose={() => setIsCartDrawerOpen(false)} />}
    </>
  );
};

export default Header;
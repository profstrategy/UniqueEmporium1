"use client";

import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, Search, Heart, ChevronDown, Shirt, Baby, Gem, ShoppingBag, User, LayoutDashboard, LogIn, LogOut } from "lucide-react";
import Badge from "@/components/common/Badge.tsx";
import CartIcon from "@/components/common/CartIcon.tsx";
import SlideOutSearchBar from "./SlideOutSearchBar.tsx";
import MobileMenu from "./MobileMenu.tsx";
import CartDrawer from "./CartDrawer.tsx";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { useCart } from "@/context/CartContext.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";
import { cn } from "@/lib/utils";
import { useCategories } from "@/hooks/useCategories"; // Import the new hook

interface HeaderProps {
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (isOpen: boolean) => void;
}

// Map category names to Lucide icons (same logic as CategoriesSection)
const getCategoryIcon = (categoryName: string) => {
  const lowerName = categoryName.toLowerCase();
  if (lowerName.includes("kid") || lowerName.includes("child")) return Baby;
  if (lowerName.includes("men") || lowerName.includes("shirt")) return Shirt;
  if (lowerName.includes("amazon")) return ShoppingBag;
  if (lowerName.includes("shein") || lowerName.includes("gown")) return Shirt;
  return Gem; // Default icon
};

const Header = ({ isCartDrawerOpen, setIsCartDrawerOpen }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { user, isAdmin, signOut } = useAuth();
  const { categories, isLoading } = useCategories(); // Use the new hook

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogoClick = () => {
    navigate("/");
    if (isMobileMenuOpen) {
      closeMobileMenu();
    }
  };

  const handleFavoritesClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate("/auth", { state: { from: location.pathname } });
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
                <Button
                  variant="ghost"
                  className="flex items-center gap-1 text-foreground hover:bg-secondary/80 rounded-full"
                >
                  Categories <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-64 p-2 grid grid-cols-2 gap-2 bg-card border rounded-xl shadow-lg max-h-[70vh] overflow-y-auto"
              >
                {isLoading ? (
                  <div className="col-span-2 text-center py-2 text-muted-foreground">Loading...</div>
                ) : categories.length === 0 ? (
                  <div className="col-span-2 text-center py-2 text-muted-foreground">No categories</div>
                ) : (
                  categories.map((category) => {
                    const IconComponent = getCategoryIcon(category.name);
                    return (
                      <DropdownMenuItem 
                        key={category.id} 
                        asChild 
                        className="rounded-full p-2 hover:bg-accent"
                      >
                        <Link 
                          to={`/products?category=${encodeURIComponent(category.name)}`} 
                          className="flex items-center gap-2 cursor-pointer w-full h-full p-2"
                          onClick={closeMobileMenu} // Close menu on click
                        >
                          <IconComponent className="h-4 w-4 flex-shrink-0" />
                          <span className="truncate">{category.name}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })
                )}
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

            <Link to="/favorites" className="relative" onClick={handleFavoritesClick}>
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
              <Badge count={totalFavorites} variant="destructive" />
            </Link>

            <CartIcon onOpenCartDrawer={() => setIsCartDrawerOpen(true)} />

            {/* User/Account Icon (Always visible on desktop) */}
            {!isMobile && (
              <Button
                variant="ghost"
                size="icon"
                className="text-foreground hover:bg-secondary/80 rounded-full"
                onClick={() => {
                  if (!user) {
                    navigate("/auth", { state: { from: location.pathname } });
                  } else if (isAdmin) {
                    navigate("/admin");
                  } else {
                    navigate("/account");
                  }
                }}
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            {/* Mobile Menu Button (visible on mobile/tablet, hidden on large screens) */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden text-foreground rounded-full"
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
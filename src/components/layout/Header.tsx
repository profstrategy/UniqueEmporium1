"use client";

import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, User, LogIn, LogOut, LayoutDashboard } from "lucide-react";
import Badge from "@/components/common/Badge.tsx";
import MobileMenu from "@/components/layout/MobileMenu.tsx";
import { useCart } from "@/context/CartContext.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";
import { toast } from "sonner";

interface HeaderProps {
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: Dispatch<SetStateAction<boolean>>;
}

const Header = ({ isCartDrawerOpen, setIsCartDrawerOpen }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { user, isAdmin, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success("Logged out successfully!");
  };

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section: Mobile Menu Toggle & Logo */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-foreground hover:bg-secondary/80 rounded-full"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="sr-only">Toggle mobile menu</span>
          </Button>
          <Link to="/" className="flex items-center">
            <UniqueEmporiumLogo className="h-[100px] w-auto" />
          </Link>
        </div>

        {/* Center section: Desktop Navigation (hidden on mobile) */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Shop All
          </Link>
          <Link to="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            About Us
          </Link>
          <Link to="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
            Contact
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              Admin
            </Link>
          )}
        </nav>

        {/* Right section: Icons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {user && !isAdmin && (
            <Link to="/favorites" className="relative">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
              <Badge count={totalFavorites} variant="destructive" className="absolute -top-1 -right-1" />
            </Link>
          )}

          {!isAdmin && (
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full" onClick={() => setIsCartDrawerOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              <Badge count={totalItems} variant="destructive" className="absolute -top-1 -right-1" />
            </Button>
          )}

          {user ? (
            <>
              {!isAdmin && (
                <Link to="/account" className="relative">
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </>
          ) : (
            null
          )}
        </div>
      </div>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        favoriteCount={totalFavorites}
        itemCount={totalItems}
      />
    </header>
  );
};

export default Header;
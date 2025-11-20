"use client";

import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Heart, User, LogIn, Menu } from "lucide-react";
import Badge from "@/components/common/Badge.tsx";
import MobileMenu from "@/components/layout/MobileMenu.tsx";
import { useCart } from "@/context/CartContext.tsx";
import { useFavorites } from "@/context/FavoritesContext.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";

interface HeaderProps {
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header = ({ isCartDrawerOpen, setIsCartDrawerOpen }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { totalFavorites } = useFavorites();
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        {/* Left section: Mobile Menu Toggle */}
        <div className="flex items-center md:hidden">
          <Button variant="ghost" size="icon" onClick={handleMobileMenuToggle} className="text-foreground hover:bg-secondary/80 rounded-full">
            <Menu className="h-6 w-6" />
          </Button>
        </div>

        {/* Center section: Logo */}
        <div className="flex-1 flex justify-center md:justify-start">
          <Link to="/" className="flex items-center">
            <UniqueEmporiumLogo className="h-[100px] w-auto" />
          </Link>
        </div>

        {/* Right section: Navigation Icons */}
        <nav className="flex items-center space-x-2">
          {/* Favorites Icon (visible only if logged in and not admin) */}
          {user && !isAdmin && (
            <Link to="/favorites" className="relative">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full">
                <Heart className="h-5 w-5" />
              </Button>
              <Badge count={totalFavorites} variant="destructive" className="absolute -right-1 -top-1" />
            </Link>
          )}

          {/* Cart Icon (always visible, unless admin) */}
          {!isAdmin && (
            <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full" onClick={() => setIsCartDrawerOpen(true)}>
              <ShoppingBag className="h-5 w-5" />
              <Badge count={totalItems} variant="destructive" className="absolute -right-1 -top-1" />
            </Button>
          )}

          {/* User/Admin Icon (visible if logged in) */}
          {user ? (
            <Link to={isAdmin ? "/admin" : "/account"} className="relative">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            // Sign In / Register Icon (hidden on mobile, shown on medium and larger screens)
            <Link to="/auth" state={{ from: location.pathname }} className="relative hidden md:block">
              <Button variant="ghost" size="icon" className="text-foreground hover:bg-secondary/80 rounded-full">
                <LogIn className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </nav>

        <MobileMenu
          isOpen={isMobileMenuOpen}
          onClose={handleMobileMenuToggle}
          favoriteCount={totalFavorites}
          itemCount={totalItems}
        />
      </div>
    </header>
  );
};

export default Header;
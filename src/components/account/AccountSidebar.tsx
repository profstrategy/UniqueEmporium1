"use client";

import React from "react";
import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, User, ShoppingBag, ReceiptText, LogOut, ChevronRight, Menu } from "lucide-react";
import { motion, Easing } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

interface AccountSidebarProps {
  onCloseMobileMenu?: () => void; // Callback for mobile menu close
}

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/account" },
  { name: "Profile", icon: User, path: "/account/profile" },
  { name: "Orders", icon: ShoppingBag, path: "/account/orders" },
  { name: "Receipts", icon: ReceiptText, path: "/account/receipts" },
];

const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as Easing } },
};

const AccountSidebar = ({ onCloseMobileMenu }: AccountSidebarProps) => {
  const isMobile = useIsMobile();

  const renderNavLinks = () => (
    <motion.ul className="space-y-2" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
      {navItems.map((item, index) => (
        <motion.li key={item.name} variants={linkVariants}>
          <NavLink
            to={item.path}
            end={item.path === "/account"} // Only exact match for dashboard home
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
              )
            }
            onClick={onCloseMobileMenu}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
            <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
          </NavLink>
        </motion.li>
      ))}
      <motion.li variants={linkVariants} className="pt-4 border-t border-border mt-4">
        <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10">
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </motion.li>
    </motion.ul>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="w-full justify-start text-base md:hidden">
            <Menu className="mr-2 h-5 w-5" /> Account Menu
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[70vw] sm:w-[250px] flex flex-col">
          <h2 className="text-xl font-bold mb-6 text-foreground">My Account</h2>
          {renderNavLinks()}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <motion.aside
      className="hidden md:block w-64 shrink-0 border-r bg-card p-6"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as Easing }}
    >
      <h2 className="text-xl font-bold mb-6 text-foreground">My Account</h2>
      {renderNavLinks()}
    </motion.aside>
  );
};

export default AccountSidebar;
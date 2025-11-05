"use client";

import React from "react";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { X, LogOut, ChevronRight } from "lucide-react";
import { motion, Easing } from "framer-motion";
import { cn } from "@/lib/utils";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";
import { adminNavItems, linkVariants } from "@/data/adminNavItems.ts";
import { toast } from "sonner";

interface AdminMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const AdminMobileMenu = ({ isOpen, onClose }: AdminMobileMenuProps) => {
  const navigate = useNavigate();

  const handleLinkClick = (path: string) => {
    onClose();
    navigate(path);
  };

  const handleLogout = () => {
    // Handle admin logout logic here (e.g., clear admin session, tokens)
    onClose();
    navigate("/admin"); // Redirect to admin login or dashboard after logout
    toast.info("You have been logged out from Admin.");
  };

  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as Easing } },
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="left" className="w-[80vw] max-w-sm flex flex-col bg-card text-foreground">
        <SheetHeader className="flex items-center justify-center py-[5px]">
          <Link to="/admin" onClick={() => handleLinkClick("/admin")}>
            <UniqueEmporiumLogo className="h-[100px]" />
          </Link>
          <SheetTitle className="text-xl font-bold text-center">Admin Panel</SheetTitle>
        </SheetHeader>
        <motion.nav
          className="flex flex-col space-y-1 py-4 overflow-y-auto"
          initial="hidden"
          animate="visible"
          variants={menuVariants}
        >
          <motion.ul className="space-y-2" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }}>
            {adminNavItems.map((item) => (
              <motion.li key={item.name} variants={linkVariants}>
                <NavLink
                  to={item.path}
                  end={item.path === "/admin"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                      isActive ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground",
                    )
                  }
                  onClick={() => handleLinkClick(item.path)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                  <ChevronRight className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                </NavLink>
              </motion.li>
            ))}
            <motion.li variants={linkVariants} className="pt-4 border-t border-border mt-4">
              <Button
                variant="ghost"
                className="w-full justify-start text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </Button>
            </motion.li>
          </motion.ul>
        </motion.nav>
      </SheetContent>
    </Sheet>
  );
};

export default AdminMobileMenu;
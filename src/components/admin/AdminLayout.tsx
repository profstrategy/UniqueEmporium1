"use client";

import React, { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.tsx";
import AdminMobileMenu from "./AdminMobileMenu.tsx"; // Import the new mobile menu
import { motion, AnimatePresence, Easing } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Import Button
import { Menu } from "lucide-react"; // Import Menu icon
import { useIsMobile } from "@/hooks/use-mobile"; // Import useIsMobile

const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" as Easing } },
};

const AdminLayout = () => {
  const location = useLocation();
  const isMobile = useIsMobile(); // Determine if on mobile/tablet
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background flex overflow-x-hidden"> {/* Added overflow-x-hidden here */}
      {/* Desktop Sidebar */}
      <AdminSidebar />

      {/* Mobile Menu Toggle Button */}
      {isMobile && (
        <div className="fixed top-20 left-4 z-50 md:hidden">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(true)}
            className="bg-card shadow-md"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobile && (
        <AdminMobileMenu
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className={cn("flex-grow p-4 md:p-8 lg:p-10", isMobile && "pt-20")}> {/* Add padding-top on mobile to avoid overlap with menu button */}
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminLayout;
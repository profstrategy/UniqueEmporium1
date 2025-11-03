"use client";

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AccountSidebar from "@/components/account/AccountSidebar.tsx";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { cn } from "@/lib/utils";

const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" as Easing } },
};

const Account = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-background flex flex-col md:flex-row">
      {/* Sidebar for Desktop, Menu Button for Mobile */}
      <div className="md:hidden p-4 border-b border-border">
        <AccountSidebar />
      </div>
      <div className="hidden md:block">
        <AccountSidebar />
      </div>

      {/* Main Content Area */}
      <main className="flex-grow p-4 md:p-8 lg:p-10">
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

export default Account;
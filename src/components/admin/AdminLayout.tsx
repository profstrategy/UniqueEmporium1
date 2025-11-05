"use client";

import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.tsx";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { cn } from "@/lib/utils";

const pageTransitionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" as Easing } },
};

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen w-full bg-background flex">
      <AdminSidebar />
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

export default AdminLayout;
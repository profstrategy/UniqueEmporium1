"use client";

import React from "react";
import { NavLink, Link } from "react-router-dom";
import { LogOut, ChevronRight } from "lucide-react";
import { motion, Easing } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { adminNavItems, linkVariants } from "@/data/adminNavItems.ts";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";

const AdminSidebar = () => {
  const renderNavLinks = () => (
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

  return (
    <motion.aside
      className="w-64 shrink-0 border-r bg-card p-6 hidden md:block"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" as Easing }}
    >
      <Link to="/admin" className="mb-6 flex items-center justify-center">
        <UniqueEmporiumLogo className="h-[100px]" />
      </Link>
      <h2 className="text-xl font-bold mb-6 text-foreground text-center">Admin Dashboard</h2>
      {renderNavLinks()}
    </motion.aside>
  );
};

export default AdminSidebar;
"use client";

import { LayoutDashboard, ShoppingBag, Package, Users, BarChart2, Settings, LogOut, ChevronRight } from "lucide-react";
import { Easing } from "framer-motion";

export const adminNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/admin" },
  { name: "Orders", icon: ShoppingBag, path: "/admin/orders" },
  { name: "Products", icon: Package, path: "/admin/products" },
  { name: "Categories", icon: Settings, path: "/admin/categories" },
  { name: "Users", icon: Users, path: "/admin/users" },
  { name: "Analytics", icon: BarChart2, path: "/admin/analytics" }, // Added Analytics link
];

export const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as Easing } },
};
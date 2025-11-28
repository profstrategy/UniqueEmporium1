"use client";

import { LayoutDashboard, User, ShoppingBag, ReceiptText, LogOut, ChevronRight } from "lucide-react";
import { Easing } from "framer-motion";

export const accountNavItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/account" },
  { name: "Profile", icon: User, path: "/account/profile" },
  { name: "Orders", icon: ShoppingBag, path: "/account/orders" },
  { name: "Receipts", icon: ReceiptText, path: "/account/receipts" },
];

export const linkVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" as Easing } },
};
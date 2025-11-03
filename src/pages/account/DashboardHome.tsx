"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, ShoppingBag, ReceiptText, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { mockOrders, mockReceipts } from "@/data/accountData.ts";
import { useFavorites } from "@/context/FavoritesContext.tsx";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const DashboardHome = () => {
  const { totalFavorites } = useFavorites();

  const totalOrders = mockOrders.length;
  const pendingOrders = mockOrders.filter(order => order.status === "pending").length;
  const confirmedReceipts = mockReceipts.filter(receipt => receipt.status === "confirmed").length;

  return (
    <motion.div
      className="space-y-8" // Keep space-y-8 for spacing between major sections
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2" variants={fadeInUp}> {/* Added mb-2 here */}
        Welcome, Fashionista!
      </motion.h1>
      <motion.p className="text-sm md:text-lg text-muted-foreground" variants={fadeInUp}>
        Here's a quick overview of your Unique Emporium account.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={staggerContainer}
      >
        <motion.div variants={fadeInUp}>
          <Card className="h-full rounded-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {pendingOrders} pending orders
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
                <Link to="/account/orders">View all orders</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="h-full rounded-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorite Items</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalFavorites}</div>
              <p className="text-xs text-muted-foreground">
                Items you've loved
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
                <Link to="/favorites">Go to favorites</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <Card className="h-full rounded-xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed Receipts</CardTitle>
              <ReceiptText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{confirmedReceipts}</div>
              <p className="text-xs text-muted-foreground">
                Payments confirmed
              </p>
              <Button variant="link" className="p-0 h-auto mt-2 text-primary" asChild>
                <Link to="/account/receipts">View all receipts</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <motion.div variants={fadeInUp}>
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Account Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button asChild variant="outline" className="h-12">
              <Link to="/account/profile">
                <User className="mr-2 h-4 w-4" /> Edit Profile
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-12">
              <Link to="/products">
                <ShoppingBag className="mr-2 h-4 w-4" /> Continue Shopping
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardHome;
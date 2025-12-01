"use client";

import React, { useState, useEffect } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User, ShoppingBag, ReceiptText, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext.tsx";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  const { user, isLoading: isLoadingAuth } = useAuth();
  const { totalFavorites } = useFavorites();
  const [dashboardData, setDashboardData] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    confirmedReceipts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      
      try {
        // Fetch total orders
        const { count: totalOrders, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        if (ordersError) throw ordersError;

        // Fetch pending orders
        const { count: pendingOrders, error: pendingError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'pending');

        if (pendingError) throw pendingError;

        // Fetch confirmed receipts
        const { count: confirmedReceipts, error: receiptsError } = await supabase
          .from('payment_receipts')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('status', 'confirmed');

        if (receiptsError) throw receiptsError;

        setDashboardData({
          totalOrders: totalOrders || 0,
          pendingOrders: pendingOrders || 0,
          confirmedReceipts: confirmedReceipts || 0,
        });
      } catch (error: any) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data.", { description: error.message });
      } finally {
        setIsLoading(false);
      }
    };

    if (!isLoadingAuth && user) {
      fetchDashboardData();
    } else if (!isLoadingAuth && !user) {
      setIsLoading(false);
    }
  }, [user, isLoadingAuth]);

  if (isLoadingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  const userFirstName = user?.first_name || "Fashionista"; // Get first name from user object
  const userCustomId = user?.custom_user_id; // NEW: Get custom_user_id

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground" variants={fadeInUp}>
          Welcome, {userFirstName}!
        </motion.h1>
        {userCustomId && ( // NEW: Display custom_user_id if available
          <motion.p className="text-sm text-muted-foreground" variants={fadeInUp}>
            Your Unique ID: <span className="font-semibold text-foreground">{userCustomId}</span>
          </motion.p>
        )}
        <motion.p className="text-sm md:text-lg text-muted-foreground" variants={fadeInUp}>
          Here's a quick overview of your Unique Emporium account.
        </motion.p>
      </div>

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
              <div className="text-2xl font-bold">{dashboardData.totalOrders}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.pendingOrders} pending orders
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
              <div className="text-2xl font-bold">{dashboardData.confirmedReceipts}</div>
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
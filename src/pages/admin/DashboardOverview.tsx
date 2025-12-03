"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import AdminStatCard from "@/components/admin/AdminStatCard.tsx";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingBag, DollarSign, CheckCircle2, Users, Clock, Package, Activity, List, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge"; // Import Badge for activity status

// Define interface for RecentActivity, consistent with AnalyticsDashboard
interface RecentActivity {
  id: string;
  type: "order" | "payment" | "user" | "product";
  description: string;
  timestamp: string; // ISO string
  status?: "new" | "verified" | "updated" | "deleted" | "pending" | "confirmed" | "declined";
}

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

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingPayments: 0,
    completedOrders: 0,
    activeUsers: 0,
    totalRevenue: 0,
    newProductsLastMonth: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "default";
      case "verified":
        return "secondary";
      case "updated":
        return "outline";
      case "deleted":
        return "destructive";
      case "pending":
        return "secondary";
      case "confirmed":
        return "default";
      case "declined":
        return "destructive";
      case "completed":
        return "default";
      case "processing":
        return "secondary";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const fetchDashboardStats = useCallback(async () => {
    setIsLoading(true);
    try {
      // Total Orders
      const { count: totalOrdersCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      if (ordersError) throw ordersError;

      // Pending Payments
      const { count: pendingPaymentsCount, error: paymentsError } = await supabase
        .from('payment_receipts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      if (paymentsError) throw paymentsError;

      // Completed Orders
      const { count: completedOrdersCount, error: completedOrdersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      if (completedOrdersError) throw completedOrdersError;

      // Active Users
      const { count: activeUsersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      if (usersError) throw usersError;

      // Total Revenue (from completed orders)
      const { data: completedOrdersData, error: revenueError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed');
      if (revenueError) throw revenueError;
      const totalRevenueAmount = completedOrdersData.reduce((sum, order) => sum + order.total_amount, 0);

      // New Products Last Month
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const { count: newProductsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneMonthAgo.toISOString());
      if (productsError) throw productsError;

      setStats({
        totalOrders: totalOrdersCount || 0,
        pendingPayments: pendingPaymentsCount || 0,
        completedOrders: completedOrdersCount || 0,
        activeUsers: activeUsersCount || 0,
        totalRevenue: totalRevenueAmount || 0,
        newProductsLastMonth: newProductsCount || 0,
      });

    } catch (error: any) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics.", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRecentActivities = useCallback(async () => {
    setIsLoadingActivities(true);
    try {
      const combinedActivities: RecentActivity[] = [];

      // Fetch recent orders
      const { data: recentOrdersData, error: recentOrdersError } = await supabase
        .from('orders')
        .select('id, order_number, status, created_at, profiles(first_name, last_name)') // Include order_number
        .order('created_at', { ascending: false })
        .limit(5);
      if (recentOrdersError) throw recentOrdersError;

      recentOrdersData.forEach((order: any) => {
        const customerName = `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim();
        const displayOrderId = order.order_number || order.id; // Use order_number if available
        combinedActivities.push({
          id: order.id,
          type: "order",
          description: `${customerName || 'A user'} placed a new order (${displayOrderId})`,
          timestamp: order.created_at,
          status: order.status,
        });
      });

      // Fetch recent payment receipts
      const { data: recentReceiptsData, error: recentReceiptsError } = await supabase
        .from('payment_receipts')
        .select('id, status, created_at, orders(id, order_number)') // Include order_number from joined orders
        .order('created_at', { ascending: false })
        .limit(5);
      if (recentReceiptsError) throw recentReceiptsError;

      recentReceiptsData.forEach((receipt: any) => {
        const displayOrderId = receipt.orders?.order_number || receipt.orders?.id || 'N/A'; // Use order_number if available
        combinedActivities.push({
          id: receipt.id,
          type: "payment",
          description: `Payment for order ${displayOrderId} is ${receipt.status}`,
          timestamp: receipt.created_at,
          status: receipt.status,
        });
      });

      // Fetch recent user sign-ups (from profiles table)
      const { data: recentUsersData, error: recentUsersError } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      if (recentUsersError) throw recentUsersError;

      recentUsersData.forEach((user: any) => {
        const userName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
        combinedActivities.push({
          id: user.id,
          type: "user",
          description: `New user registered: ${userName || 'Unknown User'}`,
          timestamp: user.created_at,
          status: "new",
        });
      });

      // Sort all activities by timestamp
      combinedActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivities(combinedActivities.slice(0, 5)); // Limit to top 5 recent activities

    } catch (error: any) {
      console.error("Error fetching recent activities:", error);
      toast.error("Failed to load recent activities.", { description: error.message });
    } finally {
      setIsLoadingActivities(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardStats();
    fetchRecentActivities();
  }, [fetchDashboardStats, fetchRecentActivities]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground" variants={fadeInUp}>
          Admin Dashboard
        </motion.h1>
        <motion.p className="text-base md:text-lg text-muted-foreground" variants={fadeInUp}>
          Welcome to your Unique Emporium Admin Panel.
        </motion.p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AdminStatCard
          title="Total Orders"
          value={stats.totalOrders}
          description="All time orders"
          icon={ShoppingBag}
          delay={0.1}
        />
        <AdminStatCard
          title="Pending Payments"
          value={stats.pendingPayments}
          description="Awaiting verification"
          icon={Clock}
          iconColorClass="text-yellow-500"
          delay={0.2}
        />
        <AdminStatCard
          title="Completed Orders"
          value={stats.completedOrders}
          description="Successfully delivered"
          icon={CheckCircle2}
          iconColorClass="text-green-500"
          delay={0.3}
        />
        <AdminStatCard
          title="Active Users"
          value={stats.activeUsers}
          description="Currently registered"
          icon={Users}
          delay={0.4}
        />
        <AdminStatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          description="All time sales"
          icon={DollarSign}
          iconColorClass="text-green-600"
          delay={0.5}
        />
        <AdminStatCard
          title="New Products"
          value={stats.newProductsLastMonth}
          description="Last 30 days"
          icon={Package}
          delay={0.6}
        />
      </div>

      {/* Recent Activities */}
      <motion.div variants={fadeInUp} transition={{ delay: 0.7 }}>
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" /> Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoadingActivities ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="ml-3 text-muted-foreground">Loading activities...</p>
              </div>
            ) : recentActivities.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No recent activities to display.</p>
            ) : (
              <ul className="space-y-4">
                {recentActivities.map((activity) => (
                  <motion.li
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/20 border border-border"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <List className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-sm text-foreground">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {new Date(activity.timestamp).toLocaleString()}
                        </span>
                        {activity.status && (
                          <Badge variant={getStatusBadgeVariant(activity.status)} className="text-xs px-2 py-0.5">
                            {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
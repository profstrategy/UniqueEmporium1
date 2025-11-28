"use client";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AdminStatCard from "@/components/admin/AdminStatCard.tsx";
import {
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  Users,
  Clock,
  Package,
  Activity, // Correctly imported
  LineChart as LineChartIcon, // Correctly imported
  BarChart as BarChartIcon, // Correctly imported
  PieChart as PieChartIcon, // Correctly imported
  List, // Correctly imported
  Loader2, // Correctly imported
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  mockAdminStats, // Keeping for structure reference, but will replace with fetched data
  mockSalesData, // Keeping for structure reference
  mockCategorySales, // Keeping for structure reference
  mockPaymentMethods, // Keeping for structure reference
  mockRecentActivities, // Keeping for structure reference
} from "@/data/adminData.ts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define interfaces for fetched data
interface SalesDataPoint {
  date: string; // e.g., "Jan", "Feb"
  sales: number;
  orders: number;
}

interface CategorySalesData {
  name: string;
  orders: number; // Changed from sales to orders for simplicity in aggregation
}

interface PaymentMethodData {
  name: string;
  value: number; // Percentage or count
}

interface RecentActivity {
  id: string;
  type: "order" | "payment" | "user" | "product";
  description: string;
  timestamp: string; // ISO string
  status?: "new" | "verified" | "updated" | "deleted";
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

const COLORS = ["hsl(40, 30%, 65%)", "hsl(260, 70%, 79%)", "#8884d8", "#82ca9d", "#ffc658"]; // Earthy primary, soft purple secondary, and other shades

const AnalyticsDashboard = () => {
  const [selectedFilter, setSelectedFilter] = useState("month"); // Non-functional for now
  const [dashboardStats, setDashboardStats] = useState({
    totalOrders: 0,
    pendingPayments: 0,
    completedOrders: 0,
    activeUsers: 0,
    totalRevenue: 0,
    newProductsLastMonth: 0,
  });
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySalesData[]>([]);
  const [paymentMethodsData, setPaymentMethodsData] = useState<PaymentMethodData[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Global loading for initial fetch

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-NG", { style: "currency", currency: "NGN" });
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
      default:
        return "outline";
    }
  };

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    try {
      // --- Fetch Dashboard Stats ---
      const { count: totalOrdersCount, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
      if (ordersError) throw ordersError;

      const { count: pendingPaymentsCount, error: paymentsError } = await supabase
        .from('payment_receipts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      if (paymentsError) throw paymentsError;

      const { count: completedOrdersCount, error: completedOrdersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');
      if (completedOrdersError) throw completedOrdersError;

      const { count: activeUsersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');
      if (usersError) throw usersError;

      const { data: completedOrdersData, error: revenueError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed');
      if (revenueError) throw revenueError;
      const totalRevenueAmount = completedOrdersData.reduce((sum, order) => sum + order.total_amount, 0);

      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      const { count: newProductsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneMonthAgo.toISOString());
      if (productsError) throw productsError;

      setDashboardStats({
        totalOrders: totalOrdersCount || 0,
        pendingPayments: pendingPaymentsCount || 0,
        completedOrders: completedOrdersCount || 0,
        activeUsers: activeUsersCount || 0,
        totalRevenue: totalRevenueAmount || 0,
        newProductsLastMonth: newProductsCount || 0,
      });

      // --- Fetch Sales Trend Data ---
      const { data: allOrders, error: allOrdersError } = await supabase
        .from('orders')
        .select('order_date, total_amount, items'); // Added 'items' here
      if (allOrdersError) throw allOrdersError;

      const monthlySalesMap = new Map<string, { sales: number; orders: number }>();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      allOrders.forEach(order => {
        const date = new Date(order.order_date);
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const key = `${month} ${year}`; // Group by month and year

        if (!monthlySalesMap.has(key)) {
          monthlySalesMap.set(key, { sales: 0, orders: 0 });
        }
        const current = monthlySalesMap.get(key)!;
        current.sales += order.total_amount;
        current.orders += 1;
      });

      // Sort by date and format for chart
      const sortedSalesData = Array.from(monthlySalesMap.entries())
        .sort(([keyA], [keyB]) => {
          const [monthA, yearA] = keyA.split(' ');
          const [monthB, yearB] = keyB.split(' ');
          const dateA = new Date(`${monthA} 1, ${yearA}`);
          const dateB = new Date(`${monthB} 1, ${yearB}`);
          return dateA.getTime() - dateB.getTime();
        })
        .map(([key, value]) => ({ date: key.split(' ')[0], sales: value.sales, orders: value.orders })); // Only show month name on X-axis

      setSalesData(sortedSalesData);

      // --- Fetch Orders by Category Data ---
      const { data: productsData, error: productsDataError } = await supabase
        .from('products')
        .select('id, category');
      if (productsDataError) throw productsDataError;

      const categoryOrderCounts = new Map<string, number>();
      productsData.forEach(product => categoryOrderCounts.set(product.category, 0)); // Initialize all categories

      allOrders.forEach(order => {
        order.items.forEach((item: any) => { // Assuming order.items is jsonb array
          const product = productsData.find(p => p.id === item.product_id);
          if (product && categoryOrderCounts.has(product.category)) {
            categoryOrderCounts.set(product.category, categoryOrderCounts.get(product.category)! + 1);
          }
        });
      });

      const sortedCategorySales = Array.from(categoryOrderCounts.entries())
        .map(([name, orders]) => ({ name, orders }))
        .sort((a, b) => b.orders - a.orders); // Sort by orders count
      setCategorySales(sortedCategorySales);

      // --- Fetch Payment Methods Data ---
      const { data: allReceipts, error: allReceiptsError } = await supabase
        .from('payment_receipts')
        .select('status');
      if (allReceiptsError) throw allReceiptsError;

      const paymentStatusCounts = new Map<string, number>();
      allReceipts.forEach(receipt => {
        const status = receipt.status;
        paymentStatusCounts.set(status, (paymentStatusCounts.get(status) || 0) + 1);
      });

      const totalReceipts = allReceipts.length;
      const formattedPaymentMethods: PaymentMethodData[] = Array.from(paymentStatusCounts.entries()).map(([status, count]) => ({
        name: status.charAt(0).toUpperCase() + status.slice(1),
        value: totalReceipts > 0 ? (count / totalReceipts) * 100 : 0, // Convert to percentage
      }));
      setPaymentMethodsData(formattedPaymentMethods);

      // --- Fetch Recent Activity Feed ---
      const { data: recentOrdersData, error: recentOrdersError } = await supabase
        .from('orders')
        .select('id, order_number, status, created_at, profiles(first_name, last_name)') // Include order_number
        .order('created_at', { ascending: false })
        .limit(5);
      if (recentOrdersError) throw recentOrdersError;

      const { data: recentReceiptsData, error: recentReceiptsError } = await supabase
        .from('payment_receipts')
        .select('id, status, created_at, orders(id, order_number)') // Include order_number from joined orders
        .order('created_at', { ascending: false })
        .limit(5);
      if (recentReceiptsError) throw recentReceiptsError;

      const combinedActivities: RecentActivity[] = [];

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

      // Sort all activities by timestamp
      combinedActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setRecentActivities(combinedActivities.slice(0, 5)); // Limit to top 5 recent activities

    } catch (error: any) {
      console.error("Error fetching analytics data:", error);
      toast.error("Failed to load analytics data.", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading analytics dashboard...</p>
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
          Analytics Dashboard
        </motion.h1>
        <motion.p className="text-base md:text-lg text-muted-foreground" variants={fadeInUp}>
          Insights into your store's performance.
        </motion.p>
      </div>

      {/* Filter and Summary Cards */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-8">
        <motion.div variants={fadeInUp} className="w-full lg:w-auto">
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            title="Total Orders"
            value={dashboardStats.totalOrders}
            description="All time orders"
            icon={ShoppingBag}
            delay={0.1}
          />
          <AdminStatCard
            title="Completed Orders"
            value={dashboardStats.completedOrders}
            description="Successfully delivered"
            icon={CheckCircle2}
            iconColorClass="text-green-500"
            delay={0.2}
          />
          <AdminStatCard
            title="Pending Payments"
            value={dashboardStats.pendingPayments}
            description="Awaiting verification"
            icon={Clock}
            iconColorClass="text-yellow-500"
            delay={0.3}
          />
          <AdminStatCard
            title="Total Revenue"
            value={formatCurrency(dashboardStats.totalRevenue)}
            description="All time sales"
            icon={DollarSign}
            iconColorClass="text-green-600"
            delay={0.4}
          />
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sales Trend Chart */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="rounded-xl shadow-lg h-[400px]">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <LineChartIcon className="h-5 w-5 text-primary" /> Sales Trend
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(value) => formatCurrency(value)} />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="hsl(var(--primary))"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="hsl(var(--secondary))"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Order Volume by Category */}
        <motion.div variants={fadeInUp}>
          <Card className="rounded-xl shadow-lg h-[400px]">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <BarChartIcon className="h-5 w-5 text-primary" /> Orders by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={categorySales}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                  <Bar dataKey="orders" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Method Breakdown */}
        <motion.div variants={fadeInUp}>
          <Card className="rounded-xl shadow-lg h-[400px]">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <PieChartIcon className="h-5 w-5 text-primary" /> Payment Methods
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentMethodsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {paymentMethodsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value.toFixed(1)}%`, name]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div variants={fadeInUp} className="lg:col-span-2">
          <Card className="rounded-xl shadow-lg h-[400px]">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" /> Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[calc(100%-80px)] overflow-y-auto">
              <ul className="space-y-4">
                {recentActivities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No recent activities.</p>
                ) : (
                  recentActivities.map((activity) => (
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
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
"use client";

import React, { useState, useMemo } from "react";
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
  Activity,
  LineChart as LineChartIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  List,
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
  mockAdminStats,
  mockSalesData,
  mockCategorySales,
  mockPaymentMethods,
  mockRecentActivities,
} from "@/data/adminData.ts";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

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

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-NG", { style: "currency", currency: "NGN" });
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "new":
        return "default";
      case "verified":
        return "secondary";
      case "updated":
        return "outline";
      case "deleted":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-3xl font-bold text-foreground" variants={fadeInUp}>
          Analytics Dashboard
        </motion.h1>
        <motion.p className="text-lg text-muted-foreground" variants={fadeInUp}>
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

        <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AdminStatCard
            title="Total Orders"
            value={mockAdminStats.totalOrders}
            description="All time orders"
            icon={ShoppingBag}
            delay={0.1}
          />
          <AdminStatCard
            title="Completed Orders"
            value={mockAdminStats.completedOrders}
            description="Successfully delivered"
            icon={CheckCircle2}
            iconColorClass="text-green-500"
            delay={0.2}
          />
          <AdminStatCard
            title="Pending Payments"
            value={mockAdminStats.pendingPayments}
            description="Awaiting verification"
            icon={Clock}
            iconColorClass="text-yellow-500"
            delay={0.3}
          />
          <AdminStatCard
            title="Total Revenue"
            value={formatCurrency(mockAdminStats.totalRevenue)}
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
                  data={mockSalesData}
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
                  data={mockCategorySales}
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
                    data={mockPaymentMethods}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                  >
                    {mockPaymentMethods.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [`${value}%`, name]}
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
                {mockRecentActivities.map((activity) => (
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
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
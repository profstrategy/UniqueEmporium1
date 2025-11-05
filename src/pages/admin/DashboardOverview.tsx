"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import AdminStatCard from "@/components/admin/AdminStatCard.tsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, DollarSign, CheckCircle2, Users, Clock, Package } from "lucide-react";
import { mockAdminStats } from "@/data/adminData.ts";

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
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
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
          Admin Dashboard
        </motion.h1>
        <motion.p className="text-lg text-muted-foreground" variants={fadeInUp}>
          Welcome to your Unique Emporium Admin Panel.
        </motion.p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AdminStatCard
          title="Total Orders"
          value={mockAdminStats.totalOrders}
          description="All time orders"
          icon={ShoppingBag}
          delay={0.1}
        />
        <AdminStatCard
          title="Pending Payments"
          value={mockAdminStats.pendingPayments}
          description="Awaiting verification"
          icon={Clock}
          iconColorClass="text-yellow-500"
          delay={0.2}
        />
        <AdminStatCard
          title="Completed Orders"
          value={mockAdminStats.completedOrders}
          description="Successfully delivered"
          icon={CheckCircle2}
          iconColorClass="text-green-500"
          delay={0.3}
        />
        <AdminStatCard
          title="Active Users"
          value={mockAdminStats.activeUsers}
          description="Currently registered"
          icon={Users}
          delay={0.4}
        />
        <AdminStatCard
          title="Total Revenue"
          value={formatCurrency(mockAdminStats.totalRevenue)}
          description="All time sales"
          icon={DollarSign}
          iconColorClass="text-green-600"
          delay={0.5}
        />
        <AdminStatCard
          title="New Products"
          value={mockAdminStats.newProductsLastMonth}
          description="Last 30 days"
          icon={Package}
          delay={0.6}
        />
      </div>

      {/* Placeholder for recent activities or quick actions */}
      <motion.div variants={fadeInUp} transition={{ delay: 0.7 }}>
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">No recent activities to display.</p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
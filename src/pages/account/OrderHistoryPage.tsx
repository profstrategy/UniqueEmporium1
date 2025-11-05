"use client";

import React from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, CalendarDays, DollarSign, Info } from "lucide-react";
import { mockOrders, OrderStatus } from "@/data/accountData.ts";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const getStatusBadgeVariant = (status: OrderStatus) => {
  switch (status) {
    case "completed":
      return "default";
    case "processing":
      return "secondary";
    case "pending":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "outline";
  }
};

const OrderHistoryPage = () => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  return (
    <motion.div
      className="space-y-8"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Order History</h1>
        <p className="text-muted-foreground text-lg">View your past orders and their current status.</p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Your Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {mockOrders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p>No orders found. Start shopping to place your first order!</p>
              <Button asChild className="mt-4">
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full"> {/* Added w-full to ensure the container takes full width */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center -space-x-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <ImageWithFallback
                              key={index}
                              src={item.imageUrl}
                              alt={item.productName}
                              containerClassName="h-8 w-8 rounded-full border-2 border-background"
                              className="object-cover"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <span className="text-xs text-muted-foreground ml-2">
                              +{order.items.length - 3} more
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <Info className="h-4 w-4 mr-2" /> View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrderHistoryPage;
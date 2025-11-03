"use client";

import React, { useState, useEffect } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, FileText, Loader2, ShoppingBag, CheckCircle2, Clock, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext.tsx";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";

// Mock Order Data (replace with Supabase fetch later)
interface OrderItem {
  productId: string;
  name: string;
  imageUrl: string;
  unitPrice: number;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  totalAmount: number;
  deliveryMethod: string;
  items: OrderItem[];
  receiptUrl?: string; // URL to the uploaded payment receipt
}

const mockOrders: Order[] = [
  {
    id: "ORD001",
    date: "2024-07-25",
    status: "completed",
    totalAmount: 70000,
    deliveryMethod: "Pick-up",
    items: [
      { productId: "shein-floral-maxi-gown", name: "SHEIN Elegant Floral Maxi Gown", imageUrl: "https://images.unsplash.com/photo-1581044777550-4cfa607037dc?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", unitPrice: 3500, quantity: 10 },
      { productId: "luxury-thrift-silk-scarf", name: "Luxury Thrift Silk Scarf", imageUrl: "https://images.unsplash.com/photo-1588891237197-f7171102282a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D", unitPrice: 2800, quantity: 10 },
    ],
    receiptUrl: "https://via.placeholder.com/600x400/FFD700/000000?text=Payment+Receipt+ORD001",
  },
  {
    id: "ORD002",
    date: "2024-08-01",
    status: "processing",
    totalAmount: 120000,
    deliveryMethod: "Dispatch Rider",
    items: [
      { productId: "mens-fashion-bundle-streetwear", name: "Men's Urban Streetwear Fashion Bundle", imageUrl: "https://images.unsplash.com/photo-1523381294911-8d3cead13f7c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D", unitPrice: 7500, quantity: 10 },
      { productId: "vintage-graphic-tee-90s", name: "Vintage 90s Graphic T-Shirt", imageUrl: "https://images.unsplash.com/photo-1576566588028-cdfd73055d8b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D", unitPrice: 1200, quantity: 10 },
    ],
    receiptUrl: "https://via.placeholder.com/600x400/ADD8E6/000000?text=Payment+Receipt+ORD002",
  },
  {
    id: "ORD003",
    date: "2024-08-10",
    status: "pending",
    totalAmount: 40000,
    deliveryMethod: "Park Delivery",
    items: [
      { productId: "kids-distressed-denim-jeans", name: "Kids' Stylish Distressed Denim Jeans", imageUrl: "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D", unitPrice: 1800, quantity: 10 },
    ],
  },
];

const getStatusIcon = (status: Order['status']) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "processing":
      return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
    case "pending":
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return null;
  }
};

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      // In a real app, you'd fetch orders from Supabase for the current user.
      // For now, we'll simulate with mock data.
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders); // Filter by user.id if mockOrders had a userId field
      setLoadingOrders(false);
    };

    if (user) {
      fetchOrders();
    } else {
      setLoadingOrders(false);
      setOrders([]);
    }
  }, [user]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  if (loadingOrders) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-3 text-muted-foreground">Loading orders...</span>
      </div>
    );
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible">
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-secondary" /> Your Order History
          </CardTitle>
          <CardDescription>View your past purchases and their current status.</CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-10">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">You haven't placed any orders yet.</p>
              <Button asChild className="mt-6">
                <a href="/products">Start Shopping</a>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Delivery</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="capitalize">{order.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                      <TableCell>{order.deliveryMethod}</TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" className="mr-2">
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md md:max-w-lg lg:max-w-xl">
                            <DialogHeader>
                              <DialogTitle>Order Details: {order.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <p><strong>Date:</strong> {order.date}</p>
                              <p><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
                              <p><strong>Delivery Method:</strong> {order.deliveryMethod}</p>
                              <p className="font-semibold">Items:</p>
                              <ul className="space-y-2">
                                {order.items.map((item, index) => (
                                  <li key={index} className="flex items-center gap-3">
                                    <ImageWithFallback src={item.imageUrl} alt={item.name} containerClassName="h-12 w-12 rounded-md object-cover border" />
                                    <div>
                                      <p className="font-medium">{item.name}</p>
                                      <p className="text-sm text-muted-foreground">{item.quantity} x {formatCurrency(item.unitPrice)}</p>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                              <p className="font-bold text-lg">Total: {formatCurrency(order.totalAmount)}</p>
                              {order.receiptUrl && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="secondary" size="sm" className="mt-4">
                                      <FileText className="mr-2 h-4 w-4" /> View Receipt
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-3xl p-0">
                                    <DialogHeader className="p-4 border-b">
                                      <DialogTitle>Payment Receipt for {order.id}</DialogTitle>
                                    </DialogHeader>
                                    <div className="p-4">
                                      <img src={order.receiptUrl} alt={`Payment Receipt for ${order.id}`} className="max-w-full h-auto rounded-md" />
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </DialogContent>
                        </Dialog>
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

export default OrderHistory;
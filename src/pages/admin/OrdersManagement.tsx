"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Truck,
  XCircle,
  Clock,
  Copy,
  User,
  ChevronLeft,
  ChevronRight,
  List,
  ChevronFirst,
  ChevronLast,
  ReceiptText,
  Loader2, // Added Loader2 import
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client"; // Import Supabase client

// Define the order item interface based on your database structure and joined data
interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url: string;
  unit_type: "pcs" | "sets"; // NEW: Added unit_type
}

export interface AdminOrder {
  id: string;
  orderNumber?: string; // NEW: Added orderNumber
  user_id: string; // Added user_id to link to profiles
  orderDate: string;
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    phone?: string; // Added phone to shippingAddress
  };
  deliveryMethod: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string; // This is the profile phone, not necessarily shipping phone
  paymentStatus: "pending" | "confirmed" | "declined";
  paymentReceiptId?: string;
  receiptImageUrl?: string;
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

// Helper to get color-coded badge classes for Payment Status
const getPaymentStatusBadgeClass = (status: AdminOrder["paymentStatus"]) => {
  switch (status) {
    case "pending":
      return "bg-[#EAB308] text-white hover:bg-[#EAB308]/90"; // Yellow
    case "confirmed":
      return "bg-[#22C55E] text-white hover:bg-[#22C55E]/90"; // Green
    case "declined":
      return "bg-[#EF4444] text-white hover:bg-[#EF4444]/90"; // Red
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

// Helper to get color-coded badge classes for Order Status
const getOrderStatusBadgeClass = (status: AdminOrder["status"]) => {
  switch (status) {
    case "pending":
      return "bg-[#3B82F6] text-white hover:bg-[#3B82F6]/90"; // Blue
    case "processing":
      return "bg-[#F59E0B] text-white hover:bg-[#F59E0B]/90"; // Orange
    case "completed":
      return "bg-[#16A34A] text-white hover:bg-[#16A34A]/90"; // Darker Green
    case "cancelled":
      return "bg-[#DC2626] text-white hover:bg-[#DC2626]/90"; // Darker Red
    default:
      return "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  }
};

interface OrderDetailsDialogProps {
  order: AdminOrder;
  onClose: () => void;
}

const OrderDetailsDialog = ({ order, onClose }: OrderDetailsDialogProps) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    toast.success("Phone number copied!", { description: phone });
  };

  return (
    <DialogContent className="sm:max-w-3xl p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50 overflow-y-auto max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" /> Order Details: {order.orderNumber || order.id} {/* NEW: Display orderNumber */}
        </DialogTitle>
        <DialogDescription>
          Comprehensive details for this customer order.
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-6 py-4">
        {/* 1. Customer & Contact Details */}
        <div className="border-b pb-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
            <User className="h-5 w-5" /> Customer Information
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Name (from profile)</p>
              <p className="font-bold text-foreground">{order.customerName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Email (from profile)</p>
              <p className="font-medium text-foreground">{order.customerEmail}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-muted-foreground">Phone Number (from profile)</p>
              <div className="flex items-center gap-2">
                <p className="font-bold text-xl text-primary">{order.customerPhone}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={() => handleCopyPhone(order.customerPhone)} className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Profile Phone</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Shipping Details */}
        <div className="border-b pb-4">
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
            <Truck className="h-5 w-5" /> Shipping Details
          </h3>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><strong>Recipient:</strong> {order.shippingAddress.name}</p>
            <p><strong>Address:</strong> {order.shippingAddress.address}</p>
            <p><strong>City, State:</strong> {order.shippingAddress.city}, {order.shippingAddress.state}</p>
            {order.shippingAddress.phone && ( // Display shipping phone if available
              <div className="space-y-1">
                <p><strong>Shipping Phone:</strong></p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-xl text-primary">{order.shippingAddress.phone}</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleCopyPhone(order.shippingAddress.phone!)} className="h-8 w-8">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy Shipping Phone</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            )}
            <p><strong>Delivery Method:</strong> <Badge variant="secondary">{order.deliveryMethod}</Badge></p>
          </div>
        </div>

        {/* 3. Order Items */}
        <div>
          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
            <List className="h-5 w-5" /> Items Purchased ({order.items.reduce((sum, item) => sum + item.quantity, 0)} total units)
          </h3>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                <ImageWithFallback
                  src={item.image_url}
                  alt={item.product_name}
                  containerClassName="h-16 w-16 object-contain rounded-md border flex-shrink-0"
                  fallbackLogoClassName="h-8 w-8"
                />
                <div className="flex-grow">
                  <p className="font-medium text-foreground">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} {item.unit_type} @ {formatCurrency(item.unit_price)} / {item.unit_type === 'pcs' ? 'pc' : 'set'}
                  </p>
                </div>
                <p className="font-semibold text-foreground text-lg flex-shrink-0">
                  {formatCurrency(item.quantity * item.unit_price)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div> {/* Closing tag for the div with space-y-6 py-4 */}
    </DialogContent>
  );
};


const OrdersManagement = () => {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterOrderStatus, setFilterOrderStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [isCustomerDetailsModalOpen, setIsCustomerDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);


  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  const fetchOrders = useCallback(async () => {
    setIsLoadingOrders(true);
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_number,
        profiles(first_name, last_name, email, phone),
        payment_receipts(id, status, receipt_image_url)
      `)
      .order('order_date', { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders.", { description: error.message });
      setOrders([]);
    } else {
      const fetchedOrders: AdminOrder[] = data.map((order: any) => ({
        id: order.id,
        orderNumber: order.order_number, // NEW: Map order_number
        user_id: order.user_id,
        orderDate: new Date(order.created_at).toLocaleDateString(), // Use created_at for order date
        totalAmount: order.total_amount,
        status: order.status,
        items: order.items.map((item: any) => ({ // Map items to include unit_type
          product_id: item.product_id,
          product_name: item.product_name,
          quantity: item.quantity,
          unit_price: item.unit_price,
          image_url: item.image_url,
          unit_type: item.unit_type || 'pcs', // NEW: Map unit_type
        })) || [],
        shippingAddress: {
          name: order.shipping_address.name,
          address: order.shipping_address.address,
          city: order.shipping_address.city,
          state: order.shipping_address.state,
          phone: order.shipping_address.phone, // Map phone from shipping_address
        },
        deliveryMethod: order.delivery_method,
        customerName: `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim(),
        customerEmail: order.profiles?.email || 'N/A',
        customerPhone: order.profiles?.phone || 'N/A',
        paymentStatus: order.payment_receipts?.[0]?.status || 'pending', // Assuming one receipt per order
        paymentReceiptId: order.payment_receipts?.[0]?.id,
        receiptImageUrl: order.payment_receipts?.[0]?.receipt_image_url,
      }));
      setOrders(fetchedOrders);
    }
    setIsLoadingOrders(false);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);


  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || // NEW: Search by orderNumber
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerPhone.includes(searchTerm) ||
          order.shippingAddress.phone?.includes(searchTerm) // Search by shipping phone too
      );
    }

    if (filterPaymentStatus !== "all") {
      filtered = filtered.filter(
        (order) => order.paymentStatus === filterPaymentStatus
      );
    }

    if (filterOrderStatus !== "all") {
      filtered = filtered.filter(
        (order) => order.status === filterOrderStatus
      );
    }

    return filtered;
  }, [orders, searchTerm, filterPaymentStatus, filterOrderStatus]);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  // New pagination functions
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  const handleAction = useCallback(async (orderId: string, action: string, receiptId?: string) => {
    let successMessage = "";
    let errorMessage = "";

    try {
      if (action === "verifyPayment" || action === "declinePayment") {
        if (!receiptId) {
          toast.error("No receipt ID found for this action.");
          return;
        }
        const newPaymentStatus = action === "verifyPayment" ? "confirmed" : "declined";
        const { error } = await supabase
          .from('payment_receipts')
          .update({ status: newPaymentStatus })
          .eq('id', receiptId);

        if (error) throw error;
        successMessage = `Payment for Order ${orderId} ${newPaymentStatus}!`;
      } else {
        let newOrderStatus: AdminOrder["status"];
        switch (action) {
          case "processOrder":
            newOrderStatus = "processing";
            break;
          case "completeOrder":
            newOrderStatus = "completed";
            break;
          case "cancelOrder":
            newOrderStatus = "cancelled";
            break;
          default:
            throw new Error("Invalid order action.");
        }
        const { error } = await supabase
          .from('orders')
          .update({ status: newOrderStatus })
          .eq('id', orderId);

        if (error) throw error;
        successMessage = `Order ${orderId} status updated to "${newOrderStatus}"!`;
      }
      toast.success(successMessage);
      fetchOrders(); // Re-fetch orders to update the UI
    } catch (error: any) {
      errorMessage = `Failed to perform action: ${error.message}`;
      toast.error("Action Failed", { description: errorMessage });
      console.error("Action error:", error);
    }
  }, [fetchOrders]);

  const handleCustomerClick = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsCustomerDetailsModalOpen(true);
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* New wrapper div for the heading and paragraph with reduced spacing */}
      <div className="space-y-2">
        <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground" variants={fadeInUp}>
          Orders Management
        </motion.h1>
        <motion.p className="text-base md:text-lg text-muted-foreground" variants={fadeInUp}>
          Manage all customer orders and their statuses.
        </motion.p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> All Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="min-w-0 p-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b p-4">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID, Customer Name, or Phone..."
                className="w-full pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Payment Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Statuses</SelectItem>
                  <SelectItem value="pending">Pending Payment</SelectItem>
                  <SelectItem value="confirmed">Confirmed Payment</SelectItem>
                  <SelectItem value="declined">Declined Payment</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterOrderStatus} onValueChange={setFilterOrderStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Order Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Order Statuses</SelectItem>
                  <SelectItem value="pending">Pending Order</SelectItem>
                  <SelectItem value="processing">Processing Order</SelectItem>
                  <SelectItem value="completed">Completed Order</SelectItem>
                  <SelectItem value="cancelled">Cancelled Order</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoadingOrders ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p>No orders found matching your filters.</p>
              <Button onClick={() => { setSearchTerm(""); setFilterPaymentStatus("all"); setFilterOrderStatus("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {currentOrders.map((order) => (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell className="font-medium">{order.orderNumber || order.id}</TableCell> {/* NEW: Display orderNumber */}
                        <TableCell>
                          <Dialog open={isCustomerDetailsModalOpen && selectedOrder?.id === order.id} onOpenChange={setIsCustomerDetailsModalOpen}>
                            <DialogTrigger asChild>
                              <div className="cursor-pointer hover:bg-muted/50 p-1 -m-1 rounded-md transition-colors" onClick={() => handleCustomerClick(order)}>
                                <div className="font-medium">{order.customerName}</div>
                                <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
                              </div>
                            </DialogTrigger>
                            {selectedOrder && selectedOrder.id === order.id && (
                              <OrderDetailsDialog order={selectedOrder} onClose={() => setIsCustomerDetailsModalOpen(false)} />
                            )}
                          </Dialog>
                        </TableCell>
                        <TableCell className="font-semibold">{formatCurrency(order.totalAmount)}</TableCell>
                        <TableCell>
                          <Badge className={getPaymentStatusBadgeClass(order.paymentStatus)}>
                            {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusBadgeClass(order.status)}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>{order.orderDate}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            {/* View Receipt */}
                            <Dialog>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="icon" disabled={!order.paymentReceiptId}>
                                        <ReceiptText className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>View Receipt</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <DialogContent className="max-w-3xl p-0">
                                <DialogHeader className="p-4 border-b">
                                  <DialogTitle>Payment Receipt for {order.orderNumber || order.id}</DialogTitle> {/* NEW: Display orderNumber */}
                                  <DialogDescription>
                                    Viewing the uploaded payment receipt image.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="p-4">
                                  {order.receiptImageUrl ? (
                                    <ImageWithFallback
                                      src={order.receiptImageUrl}
                                      alt={`Payment Receipt for ${order.id}`}
                                      containerClassName="w-full h-auto max-h-[80vh] object-contain"
                                    />
                                  ) : (
                                    <p className="text-center text-muted-foreground">No receipt available for this order.</p>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* Verify Payment */}
                            {order.paymentStatus === "pending" && (
                              <AlertDialog>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="icon">
                                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                                        </Button>
                                      </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Verify Payment</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Verify or Decline Payment?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Review the receipt. Mark as confirmed if payment is verified, or decline if the receipt is invalid.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex-row justify-between space-x-2">
                                    <AlertDialogCancel className="w-1/3">Cancel</AlertDialogCancel>
                                    <Button variant="destructive" onClick={() => handleAction(order.id, "declinePayment", order.paymentReceiptId)} className="w-1/3">
                                      Decline
                                    </Button>
                                    <AlertDialogAction onClick={() => handleAction(order.id, "verifyPayment", order.paymentReceiptId)} className="w-1/3">
                                      Verify
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            {/* Process Order */}
                            {order.status === "pending" && order.paymentStatus === "confirmed" && (
                              <AlertDialog>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="icon">
                                          <Truck className="h-4 w-4 text-orange-500" />
                                        </Button>
                                      </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Process Order</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Processing</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action will change the status of Order {order.id} to "Processing".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleAction(order.id, "processOrder")}>
                                      Process
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            {/* Complete Order */}
                            {order.status === "processing" && (
                              <AlertDialog>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="icon">
                                          <CheckCircle2 className="h-4 w-4 text-green-700" />
                                        </Button>
                                      </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Complete Order</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Confirm Completion</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action will mark Order {order.id} as "Completed".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleAction(order.id, "completeOrder")}>
                                      Complete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            {/* Cancel Order */}
                            {(order.status === "pending" || order.status === "processing") && (
                              <AlertDialog>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="icon">
                                          <XCircle className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Cancel Order</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will permanently cancel Order {order.id}.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleAction(order.id, "cancelOrder")}>
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredOrders.length > ordersPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstOrder + 1} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                  className="hidden sm:flex"
                >
                  <ChevronFirst className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    Page {currentPage} of {totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                  className="hidden sm:flex"
                >
                  <ChevronLast className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Order Details Dialog (formerly Customer Details Dialog) */}
      <Dialog open={isCustomerDetailsModalOpen && selectedOrder?.id === selectedOrder?.id} onOpenChange={setIsCustomerDetailsModalOpen}>
        {selectedOrder && (
          <OrderDetailsDialog order={selectedOrder} onClose={() => setIsCustomerDetailsModalOpen(false)} />
        )}
      </Dialog>
    </motion.div>
  );
};

export default OrdersManagement;
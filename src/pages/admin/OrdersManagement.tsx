"use client";

import React, { useState, useMemo, useCallback } from "react";
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
} from "lucide-react";
import { mockAdminOrders, AdminOrder, mockAdminUsers } from "@/data/adminData.ts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
import { Link, useNavigate } from "react-router-dom";

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
    case "verified":
      return "bg-[#22C55E] text-white hover:bg-[#22C55E]/90"; // Green
    case "declined": // Changed from 'failed'
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

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(order.customerPhone);
    toast.success("Phone number copied!", { description: order.customerPhone });
  };

  return (
    <DialogContent className="sm:max-w-3xl p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50 overflow-y-auto max-h-[90vh]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-primary" /> Order Details: {order.id}
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
              <p className="text-muted-foreground">Name</p>
              <p className="font-bold text-foreground">{order.customerName}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium text-foreground">{order.customerEmail}</p>
            </div>
            <div className="space-y-1 col-span-2">
              <p className="text-muted-foreground">Phone Number</p>
              <div className="flex items-center gap-2">
                <p className="font-bold text-xl text-primary">{order.customerPhone}</p>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" onClick={handleCopyPhone} className="h-8 w-8">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Phone Number</TooltipContent>
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
                  src={item.imageUrl}
                  alt={item.productName}
                  containerClassName="h-16 w-16 object-contain rounded-md border flex-shrink-0"
                  fallbackLogoClassName="h-8 w-8"
                />
                <div className="flex-grow">
                  <p className="font-medium text-foreground">{item.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} units @ {formatCurrency(item.unitPrice)} / unit
                  </p>
                </div>
                <p className="font-semibold text-foreground text-lg flex-shrink-0">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DialogContent>
  );
};


const OrdersManagement = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(mockAdminOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterOrderStatus, setFilterOrderStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const [isCustomerDetailsModalOpen, setIsCustomerDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);


  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  const filteredOrders = useMemo(() => {
    let filtered = orders;

    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customerPhone.includes(searchTerm) // Added phone search
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

  const handleAction = useCallback(async (orderId: string, action: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setOrders((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          let newOrderStatus = order.status;
          let newPaymentStatus = order.paymentStatus;

          switch (action) {
            case "verifyPayment":
              newPaymentStatus = "verified";
              toast.success(`Payment for Order ${orderId} verified!`);
              break;
            case "declinePayment": // New action
              newPaymentStatus = "declined"; // Changed from 'failed'
              toast.error(`Payment for Order ${orderId} declined!`);
              break;
            case "processOrder":
              newOrderStatus = "processing";
              toast.success(`Order ${orderId} is now processing!`);
              break;
            case "completeOrder":
              newOrderStatus = "completed";
              toast.success(`Order ${orderId} completed!`);
              break;
            case "cancelOrder":
              newOrderStatus = "cancelled";
              toast.info(`Order ${orderId} cancelled.`);
              break;
          }
          return { ...order, status: newOrderStatus, paymentStatus: newPaymentStatus };
        }
        return order;
      })
    );
  }, []);

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
                  <SelectItem value="verified">Verified Payment</SelectItem>
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

          {filteredOrders.length === 0 ? (
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
                        <TableCell className="font-medium">{order.id}</TableCell>
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
                                        <Eye className="h-4 w-4" />
                                      </Button>
                                    </DialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>View Receipt</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <DialogContent className="max-w-3xl p-0">
                                <DialogHeader className="p-4 border-b">
                                  <DialogTitle>Payment Receipt for {order.id}</DialogTitle>
                                </DialogHeader>
                                <div className="p-4">
                                  {order.paymentReceiptId ? (
                                    <ImageWithFallback
                                      src={`https://via.placeholder.com/400x600/D8C4A6/000000?text=Receipt+${order.id}`} // Placeholder image
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
                                      Review the receipt. Mark as verified if payment is confirmed, or decline if the receipt is invalid.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="flex-row justify-between space-x-2">
                                    <AlertDialogCancel className="w-1/3">Cancel</AlertDialogCancel>
                                    <Button variant="destructive" onClick={() => handleAction(order.id, "declinePayment")} className="w-1/3">
                                      Decline
                                    </Button>
                                    <AlertDialogAction onClick={() => handleAction(order.id, "verifyPayment")} className="w-1/3">
                                      Verify
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            )}

                            {/* Process Order */}
                            {order.status === "pending" && order.paymentStatus === "verified" && (
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
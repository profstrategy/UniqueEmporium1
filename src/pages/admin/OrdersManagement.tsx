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
  CalendarDays,
  User,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { mockAdminOrders, AdminOrder } from "@/data/adminData.ts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";

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
    case "failed":
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

const OrdersManagement = () => {
  const [orders, setOrders] = useState<AdminOrder[]>(mockAdminOrders);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterOrderStatus, setFilterOrderStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

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
          order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* New wrapper div for the heading and paragraph with reduced spacing */}
      <div className="space-y-2">
        <motion.h1 className="text-3xl font-bold text-foreground" variants={fadeInUp}>
          Orders Management
        </motion.h1>
        <motion.p className="text-lg text-muted-foreground" variants={fadeInUp}>
          Manage all customer orders and their statuses.
        </motion.p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> All Orders
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 min-w-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 border-b">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Order ID, Customer Name, or Email..."
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
                  <SelectItem value="failed">Failed Payment</SelectItem>
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
              <Table className="min-w-full"> {/* Added min-w-full here */}
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
                          <div className="font-medium">{order.customerName}</div>
                          <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
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
                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action will mark the payment for Order {order.id} as verified.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleAction(order.id, "verifyPayment")}>
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

          {/* Pagination */}
          {filteredOrders.length > ordersPerPage && (
            <div className="flex items-center justify-end space-x-2 py-4 pr-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default OrdersManagement;
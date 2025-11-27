"use client";

import React, { useState, useEffect } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, CalendarDays, DollarSign, Info, Loader2, ReceiptText } from "lucide-react";
import { Link } from "react-router-dom";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import OrderDetailsDialog from "@/components/account/OrderDetailsDialog.tsx"; // Import the new dialog
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Import Dialog for receipt view

// Define the order item interface
interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url: string;
}

// Define the Order interface based on your database structure, including payment status and receipt image
export interface Order { // Exported for use in OrderDetailsDialog
  id: string;
  orderDate: string;
  totalAmount: number;
  status: string;
  paymentStatus: string; // New: Payment status
  receiptImageUrl?: string; // New: Receipt image URL
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    phone?: string;
  };
  deliveryMethod: string;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const getOrderStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
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

// Helper to get color-coded badge classes for Payment Status
const getPaymentStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "declined":
      return "destructive";
    default:
      return "outline";
  }
};

const OrderHistoryPage = () => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      // Fetch orders for the logged-in user, joining with payment_receipts
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          payment_receipts(status, receipt_image_url)
        `)
        .eq('user_id', user.id)
        .order('order_date', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders.", { description: error.message });
      } else {
        // Transform the data to match the expected camelCase format
        const transformedOrders: Order[] = data.map((order: any) => ({
          id: order.id,
          orderDate: new Date(order.order_date).toLocaleDateString(),
          totalAmount: order.total_amount,
          status: order.status,
          paymentStatus: order.payment_receipts?.[0]?.status || 'pending', // Get status from first receipt, default to 'pending'
          receiptImageUrl: order.payment_receipts?.[0]?.receipt_image_url, // Get image URL from first receipt
          items: order.items || [],
          shippingAddress: order.shipping_address,
          deliveryMethod: order.delivery_method,
        }));
        setOrders(transformedOrders);
      }
      setIsLoading(false);
    };

    if (!isLoadingAuth && user) {
      fetchOrders();
    } else if (!isLoadingAuth && !user) {
      setIsLoading(false);
    }
  }, [user, isLoadingAuth]);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  const handleViewDetailsClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsModalOpen(true);
  };

  if (isLoadingAuth || isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading orders...</p>
      </div>
    );
  }

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
          {orders.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4" />
              <p>No orders found. Start shopping to place your first order!</p>
              <Button asChild className="mt-4">
                <Link to="/products">Shop Now</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Payment Status</TableHead> {/* New column */}
                    <TableHead>Order Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.orderDate}</TableCell>
                      <TableCell>
                        <div className="flex items-center -space-x-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <ImageWithFallback
                              key={index}
                              src={item.image_url}
                              alt={item.product_name}
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
                        <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          {order.receiptImageUrl && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <ReceiptText className="h-4 w-4 mr-2" /> Receipt
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-3xl p-0">
                                <DialogHeader className="p-4 border-b">
                                  <DialogTitle>Payment Receipt for {order.id}</DialogTitle>
                                </DialogHeader>
                                <div className="p-4">
                                  <ImageWithFallback
                                    src={order.receiptImageUrl}
                                    alt={`Payment Receipt for ${order.id}`}
                                    containerClassName="w-full h-auto max-h-[80vh] object-contain"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          <Button variant="outline" size="sm" onClick={() => handleViewDetailsClick(order)}>
                            <Info className="h-4 w-4 mr-2" /> Details
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <OrderDetailsDialog
          order={selectedOrder}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </motion.div>
  );
};

export default OrderHistoryPage;
"use client";

import React, { useState, useEffect } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Package, CalendarDays, DollarSign, Info, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
import { useAuth } from "@/context/AuthContext.tsx";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define the order interface based on your database structure
interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url: string;
}

interface Order {
  id: string;
  orderDate: string; // Changed to camelCase
  totalAmount: number; // Changed to camelCase
  status: string;
  items: OrderItem[];
  shippingAddress: { // Changed to camelCase
    name: string;
    address: string;
    city: string;
    state: string;
  };
  deliveryMethod: string; // Changed to camelCase
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const getStatusBadgeVariant = (status: string) => {
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

const OrderHistoryPage = () => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      // Fetch orders for the logged-in user
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('order_date', { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        toast.error("Failed to load orders.", { description: error.message });
      } else {
        // Transform the data to match the expected camelCase format
        const transformedOrders: Order[] = data.map(order => ({
          id: order.id,
          orderDate: new Date(order.order_date).toLocaleDateString(), // Map from snake_case
          totalAmount: order.total_amount, // Map from snake_case
          status: order.status,
          items: order.items || [],
          shippingAddress: order.shipping_address, // Map from snake_case
          deliveryMethod: order.delivery_method, // Map from snake_case
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
                    <TableHead>Status</TableHead>
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
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild> {/* Added asChild */}
                          <Link to={`/account/orders/${order.id}`}> {/* Added Link with dynamic path */}
                            <Info className="h-4 w-4 mr-2" /> View Details
                          </Link>
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
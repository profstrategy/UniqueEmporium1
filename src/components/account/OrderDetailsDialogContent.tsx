"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShoppingBag,
  Package,
  User,
  Mail,
  Phone,
  MapPin,
  ReceiptText,
  Copy,
  Eye,
  Loader2,
} from "lucide-react";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define the order item interface based on your database structure
interface OrderItem {
  product_id: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  image_url: string;
}

// Define the shipping address interface
interface ShippingAddress {
  name: string;
  address: string;
  city: string;
  state: string;
  zip_code?: string;
  phone?: string;
}

// Define the payment receipt interface
interface PaymentReceipt {
  id: string;
  transaction_id: string;
  status: string;
  receipt_image_url: string;
}

// Define the full order details interface, including joined data
interface OrderDetails {
  id: string;
  user_id: string;
  order_date: string;
  total_amount: number;
  status: string;
  items: OrderItem[];
  shipping_address: ShippingAddress;
  delivery_method: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  } | null;
  payment_receipts: PaymentReceipt[] | null;
}

// Helper function to determine badge variant based on status
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
    case "confirmed":
      return "default";
    case "declined":
      return "destructive";
    default:
      return "outline";
  }
};

// Props for the OrderDetailsDialogContent component
interface OrderDetailsDialogContentProps {
  orderId: string;
  onClose: () => void; // Callback to close the dialog
}

const OrderDetailsDialogContent = ({ orderId, onClose }: OrderDetailsDialogContentProps) => {
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch order details from Supabase
  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) {
      setError("No order ID provided.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { data, error: fetchError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles(first_name, last_name, email, phone),
        payment_receipts(id, transaction_id, status, receipt_image_url)
      `)
      .eq('id', orderId)
      .single();

    if (fetchError) {
      console.error("Error fetching order details:", fetchError);
      setError("Failed to load order details. " + fetchError.message);
      toast.error("Failed to load order details.", { description: fetchError.message });
      setOrder(null);
    } else if (data) {
      setOrder(data as OrderDetails);
    } else {
      setError("Order not found.");
      toast.error("Order not found.", { description: `No order found with ID: ${orderId}` });
      setOrder(null);
    }
    setIsLoading(false);
  }, [orderId]);

  // Fetch details when the component mounts or orderId changes
  useEffect(() => {
    fetchOrderDetails();
  }, [fetchOrderDetails]);

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  // Helper to copy text to clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  // Display loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  // Display error state
  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[200px] p-4 text-center">
        <h1 className="text-xl font-bold text-destructive mb-4">Error</h1>
        <p className="text-sm text-muted-foreground mb-4">{error || "Order details could not be loaded."}</p>
        <Button onClick={onClose} variant="outline">Close</Button>
      </div>
    );
  }

  // Extract customer and payment info for easier access
  const customerName = `${order.profiles?.first_name || ''} ${order.profiles?.last_name || ''}`.trim() || 'N/A';
  const customerEmail = order.profiles?.email || 'N/A';
  const customerPhone = order.profiles?.phone || 'N/A';
  const paymentReceipt = order.payment_receipts?.[0];

  return (
    <div className="space-y-6">
      {/* Order Summary Card */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" /> Order Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order ID</span>
            <span className="font-medium text-foreground">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Order Date</span>
            <span className="font-medium text-foreground">{new Date(order.order_date).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Status</span>
            <Badge variant={getStatusBadgeVariant(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Items</span>
            <span className="font-medium text-foreground">{order.items.reduce((sum, item) => sum + item.quantity, 0)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold pt-2 border-t mt-3">
            <span>Total Amount</span>
            <span>{formatCurrency(order.total_amount)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Customer & Shipping Details */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Customer & Shipping
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 space-y-4 text-sm">
          {/* Customer Info */}
          <div className="space-y-2">
            <h3 className="font-semibold text-base text-foreground">Customer Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-medium text-foreground">{customerName}</span>
              <span className="text-muted-foreground">Email:</span>
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground break-all">{customerEmail}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(customerEmail, 'Email')}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Email</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="text-muted-foreground">Phone:</span>
              <div className="flex items-center gap-1">
                <span className="font-medium text-foreground">{customerPhone}</span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(customerPhone, 'Phone')}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Copy Phone</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="space-y-2 border-t pt-4 mt-4">
            <h3 className="font-semibold text-base text-foreground">Shipping Information</h3>
            <div className="grid grid-cols-2 gap-2">
              <span className="text-muted-foreground">Recipient:</span>
              <span className="font-medium text-foreground">{order.shipping_address.name}</span>
              <span className="text-muted-foreground">Address:</span>
              <span className="font-medium text-foreground text-right">{order.shipping_address.address}</span>
              <span className="text-muted-foreground">City, State:</span>
              <span className="font-medium text-foreground">{order.shipping_address.city}, {order.shipping_address.state}</span>
              {order.shipping_address.zip_code && (
                <>
                  <span className="text-muted-foreground">ZIP Code:</span>
                  <span className="font-medium text-foreground">{order.shipping_address.zip_code}</span>
                </>
              )}
              {order.shipping_address.phone && (
                <>
                  <span className="text-muted-foreground">Shipping Phone:</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium text-foreground">{order.shipping_address.phone}</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(order.shipping_address.phone!, 'Shipping Phone')}>
                            <Copy className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy Shipping Phone</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </>
              )}
              <span className="text-muted-foreground">Delivery Method:</span>
              <Badge variant="secondary" className="w-fit">{order.delivery_method}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Details */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-primary" /> Payment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 space-y-3 text-sm">
          {paymentReceipt ? (
            <>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium text-foreground">{paymentReceipt.transaction_id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant={getStatusBadgeVariant(paymentReceipt.status)}>
                  {paymentReceipt.status.charAt(0).toUpperCase() + paymentReceipt.status.slice(1)}
                </Badge>
              </div>
              <div className="flex justify-end mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={!paymentReceipt.receipt_image_url}>
                      <Eye className="h-4 w-4 mr-2" /> View Receipt
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl p-0">
                    <DialogHeader className="p-4 border-b">
                      <DialogTitle>Payment Receipt for {order.id}</DialogTitle>
                      <DialogDescription>
                        Viewing the uploaded payment receipt image.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="p-4">
                      {paymentReceipt.receipt_image_url ? (
                        <ImageWithFallback
                          src={paymentReceipt.receipt_image_url}
                          alt={`Payment Receipt for ${order.id}`}
                          containerClassName="w-full h-auto max-h-[80vh] object-contain"
                        />
                      ) : (
                        <p className="text-center text-muted-foreground">No receipt image available.</p>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </>
          ) : (
            <p className="text-muted-foreground">No payment receipt found for this order.</p>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card className="rounded-xl shadow-lg">
        <CardHeader className="border-b pb-4">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> Items in Order
          </CardTitle>
        </CardHeader>
        <CardContent className="py-6 space-y-4">
          {order.items.length > 0 ? (
            order.items.map((item, index) => (
              <div key={index} className="flex items-center gap-4 border-b pb-3 last:border-b-0 last:pb-0">
                <ImageWithFallback
                  src={item.image_url}
                  alt={item.product_name}
                  containerClassName="h-16 w-16 object-contain rounded-md border flex-shrink-0"
                  fallbackLogoClassName="h-8 w-8"
                />
                <div className="flex-grow">
                  <p className="font-medium text-foreground text-sm">{item.product_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {item.quantity} units @ {formatCurrency(item.unit_price)} / unit
                  </p>
                </div>
                <p className="font-semibold text-foreground text-lg flex-shrink-0">
                  {formatCurrency(item.quantity * item.unit_price)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-center">No items found for this order.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderDetailsDialogContent;
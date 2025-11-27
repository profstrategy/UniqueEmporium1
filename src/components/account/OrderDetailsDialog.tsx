"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, CalendarDays, DollarSign, User, List, Copy, MessageSquarePlus, ReceiptText } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
import { Order } from "@/pages/account/OrderHistoryPage.tsx"; // Import the updated Order interface
import { Link } from "react-router-dom";

interface OrderDetailsDialogProps {
  order: Order;
  isOpen: boolean;
  onClose: () => void;
}

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

const OrderDetailsDialog = ({ order, isOpen, onClose }: OrderDetailsDialogProps) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="h-6 w-6 text-primary" /> Order Details: {order.id}
          </DialogTitle>
          <DialogDescription>
            Comprehensive details for your order.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          {/* 1. Order Summary */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
              <DollarSign className="h-5 w-5" /> Order Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <p className="text-muted-foreground">Order Date:</p>
              <p className="font-medium text-foreground">{order.orderDate}</p>

              <p className="text-muted-foreground">Total Amount:</p>
              <p className="font-bold text-foreground text-lg">{formatCurrency(order.totalAmount)}</p>

              <p className="text-muted-foreground">Order Status:</p>
              <Badge variant={getStatusBadgeVariant(order.status)} className="w-fit">
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>

              <p className="text-muted-foreground">Payment Status:</p>
              <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)} className="w-fit">
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </Badge>
            </div>
            {order.receiptImageUrl && (
              <div className="mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <ReceiptText className="h-4 w-4 mr-2" /> View Payment Receipt
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
              </div>
            )}
          </div>

          {/* 2. Shipping Details */}
          <div className="border-b pb-4">
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-foreground">
              <Package className="h-5 w-5" /> Shipping Details
            </h3>
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong>Recipient:</strong> {order.shippingAddress.name}</p>
              <p><strong>Address:</strong> {order.shippingAddress.address}</p>
              <p><strong>City, State:</strong> {order.shippingAddress.city}, {order.shippingAddress.state}</p>
              {order.shippingAddress.phone && (
                <div className="flex items-center gap-2">
                  <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={() => handleCopy(order.shippingAddress.phone!, 'Phone')} className="h-8 w-8">
                          <Copy className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copy Phone</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
                      {item.quantity} units @ {formatCurrency(item.unit_price)} / unit
                    </p>
                  </div>
                  <p className="font-semibold text-foreground text-lg flex-shrink-0">
                    {formatCurrency(item.quantity * item.unit_price)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Package, CalendarDays, DollarSign, User, List, Copy, MessageSquarePlus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
import { Order } from "@/pages/account/OrderHistoryPage.tsx";
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
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
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
              <CalendarDays className="h-5 w-5" /> Order Summary
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Order Date</p>
                <p className="font-medium text-foreground">{order.orderDate}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Total Amount</p>
                <p className="font-bold text-foreground text-lg">{formatCurrency(order.totalAmount)}</p>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Order Status</p>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground">Delivery Method</p>
                <p className="font-medium text-foreground">{order.deliveryMethod}</p>
              </div>
            </div>
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
                <div className="space-y-1">
                  <p><strong>Phone:</strong></p>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-xl text-primary">{order.shippingAddress.phone}</p>
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
                </div>
              )}
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
                    <p className="font-medium text-[11.3px] sm:text-sm text-foreground">{item.product_name}</p>
                    <p className="text-[10px] sm:text-sm text-muted-foreground">
                      {item.quantity} units @ {formatCurrency(item.unit_price)} / unit
                    </p>
                  </div>
                  {/* New wrapper for price and button */}
                  <div className="flex flex-col items-end">
                    <p className="font-semibold text-foreground text-xs sm:text-lg flex-shrink-0">
                      {formatCurrency(item.quantity * item.unit_price)}
                    </p>
                    <Button 
                      variant="link" 
                      size="sm" 
                      asChild 
                      className="p-0 h-auto text-secondary text-xs mt-1"
                      onClick={onClose} // Close the dialog when this button is clicked
                    >
                      <Link to={`/products/${item.product_id}?tab=reviews`}>
                        <MessageSquarePlus className="h-3 w-3 mr-1" /> Leave a Review
                      </Link>
                    </Button>
                  </div>
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
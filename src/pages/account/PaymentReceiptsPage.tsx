"use client";

import React, { useState } from "react";
import { motion, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReceiptText, Eye, FileText, DollarSign, CalendarDays } from "lucide-react";
import { mockReceipts } from "@/data/accountData.ts";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const getReceiptStatusBadgeVariant = (status: "pending" | "confirmed" | "failed") => {
  switch (status) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
};

const PaymentReceiptsPage = () => {
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
        <h1 className="text-3xl font-bold text-foreground">Payment Receipts</h1>
        <p className="text-muted-foreground text-lg">View your uploaded payment receipts and their status.</p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <ReceiptText className="h-5 w-5 text-primary" /> Your Receipts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 min-w-0"> {/* Added min-w-0 here */}
          {mockReceipts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4" />
              <p>No payment receipts found.</p>
              <p className="text-sm mt-2">Receipts will appear here after you place an order and upload proof of payment.</p>
            </div>
          ) : (
            <div className="overflow-x-auto w-full"> {/* Added w-full to ensure the container takes full width */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[180px]">Transaction ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-medium">{receipt.transactionId}</TableCell>
                      <TableCell>{receipt.date}</TableCell>
                      <TableCell className="font-semibold">{formatCurrency(receipt.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={getReceiptStatusBadgeVariant(receipt.status)}>
                          {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" /> View Receipt
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl p-0">
                            <DialogHeader className="p-4 border-b">
                              <DialogTitle>Receipt for {receipt.transactionId}</DialogTitle>
                            </DialogHeader>
                            <div className="p-4">
                              <ImageWithFallback
                                src={receipt.receiptImageUrl}
                                alt={`Payment Receipt for ${receipt.transactionId}`}
                                containerClassName="w-full h-auto max-h-[80vh] object-contain"
                              />
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

export default PaymentReceiptsPage;
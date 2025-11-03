"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Banknote, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Zod schema for bank transfer information
const bankTransferSchema = z.object({
  receiptFile: z.any()
    .refine((file) => file instanceof File, "Payment receipt is required.")
    .optional(), // Make optional for initial load, but required for submission
});

export type BankTransferFormData = z.infer<typeof bankTransferSchema>;

interface BankTransferPaymentFormProps {
  onNext: (data: BankTransferFormData) => void;
  onPrevious: () => void;
  initialData?: BankTransferFormData | null;
}

const BankTransferPaymentForm = ({ onNext, onPrevious, initialData }: BankTransferPaymentFormProps) => {
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    watch,
  } = useForm<BankTransferFormData>({
    resolver: zodResolver(bankTransferSchema),
    defaultValues: {
      receiptFile: initialData?.receiptFile,
    },
  });

  const currentReceiptFile = watch("receiptFile");

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("receiptFile", file);
      setFileName(file.name);
      setReceiptUploaded(true);
      toast.success("Receipt uploaded successfully!", { description: file.name });
    } else {
      setValue("receiptFile", undefined);
      setFileName(null);
      setReceiptUploaded(false);
      toast.info("No receipt selected.");
    }
  };

  const onSubmit = async (data: BankTransferFormData) => {
    if (!data.receiptFile) {
      toast.error("Please upload your payment receipt to continue.");
      return;
    }
    // In a real application, you would upload the file to a server here.
    // For this example, we'll just pass a confirmation.
    onNext(data);
  };

  return (
    <Card className="rounded-2xl shadow-lg h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Banknote className="h-6 w-6 text-primary" /> Bank Transfer Payment
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-muted/30 rounded-lg p-6 border border-border">
            <p className="font-semibold text-lg text-foreground">Please make your payment to:</p>
            <ul className="mt-3 space-y-1 text-muted-foreground text-sm">
              <li><strong>Bank Name:</strong> Zenith Bank</li>
              <li><strong>Account Name:</strong> Unique Emporium</li>
              <li><strong>Account Number:</strong> 0123456789</li>
            </ul>

            <p className="mt-4 text-xs text-muted-foreground">
              💡 Use your <strong>Order ID</strong> or <strong>Full Name</strong> as the payment reference.
            </p>
          </div>

          {/* Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="receiptFile" className="flex items-center gap-2">
              <Upload className="h-4 w-4" /> Upload Payment Receipt
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id="receiptFile"
                type="file"
                accept="image/*,application/pdf"
                className="flex-grow"
                onChange={handleReceiptUpload}
              />
              {fileName && (
                <span className="text-sm text-muted-foreground truncate max-w-[150px]">{fileName}</span>
              )}
            </div>
            {!receiptUploaded && (
              <p className="text-destructive text-sm">Please upload your payment receipt.</p>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
            <Button type="button" variant="outline" onClick={onPrevious} className="w-full sm:w-auto">
              Back to Shipping
            </Button>
            <Button type="submit" className="w-full sm:w-auto" size="lg" disabled={isSubmitting || !receiptUploaded}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
                </>
              ) : (
                "Continue to Review"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BankTransferPaymentForm;
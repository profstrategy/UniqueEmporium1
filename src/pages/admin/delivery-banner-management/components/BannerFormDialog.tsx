"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, Edit } from "lucide-react";
import { cn } from "@/lib/utils";
import { BannerFormData, bannerFormSchema, DeliveryBannerMessage } from "@/hooks/useAdminBanners";

interface BannerFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: DeliveryBannerMessage | null;
  onSubmit: (data: BannerFormData) => Promise<void>;
  isSubmitting: boolean;
}

const BannerFormDialog = ({
  isOpen,
  onOpenChange,
  initialData,
  onSubmit,
  isSubmitting,
}: BannerFormDialogProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<BannerFormData>({ // Changed type to BannerFormData directly
    resolver: zodResolver(bannerFormSchema),
    defaultValues: {
      message_type: "delivery",
      is_active: true,
      priority: 0,
      start_date: null,
      end_date: null,
      link_url: null,
      link_text: null,
      background_color: null,
      text_color: null,
      icon_name: null,
    },
  });

  const currentIsActive = watch("is_active");
  const currentLinkUrl = watch("link_url");

  useEffect(() => {
    if (isOpen) {
      reset({
        // No need to explicitly omit 'id' here, as BannerFormData already excludes it
        message_type: initialData?.message_type || "delivery",
        content: initialData?.content || "",
        start_date: initialData?.start_date ? new Date(initialData.start_date).toISOString().split('T')[0] : null,
        end_date: initialData?.end_date ? new Date(initialData.end_date).toISOString().split('T')[0] : null,
        is_active: initialData?.is_active ?? true,
        priority: initialData?.priority ?? 0,
        link_url: initialData?.link_url || null,
        link_text: initialData?.link_text || null,
        background_color: initialData?.background_color || null,
        text_color: initialData?.text_color || null,
        icon_name: initialData?.icon_name || null,
      });
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: BannerFormData) => {
    // 'id' is already omitted from BannerFormData, so 'data' is directly the payload
    await onSubmit(data);
    if (!isSubmitting) { // Only close if submission was successful and not still submitting
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {initialData ? <Edit className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
            {initialData ? "Edit Banner Message" : "Add New Banner Message"}
          </DialogTitle>
          <DialogDescription>
            {initialData ? "Update the details for this banner message." : "Create a new banner message to display on your site."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 py-4">
          {/* Removed hidden input for 'id' as it's not part of BannerFormData */}
          <div className="space-y-2">
            <Label htmlFor="message_type">Message Type</Label>
            <Select onValueChange={(value) => setValue("message_type", value)} value={watch("message_type")}>
              <SelectTrigger className={cn(errors.message_type && "border-destructive")}>
                <SelectValue placeholder="Select message type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="delivery">Delivery Update</SelectItem>
                <SelectItem value="promo">Promotion</SelectItem>
                <SelectItem value="discount">Discount Offer</SelectItem>
                <SelectItem value="alert">General Alert</SelectItem>
              </SelectContent>
            </Select>
            {errors.message_type && <p className="text-destructive text-sm">{errors.message_type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...register("content")}
              className={cn(errors.content && "border-destructive")}
              placeholder="e.g., Next Delivery Days: Monday & Thursday"
              rows={3}
            />
            {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date (Optional)</Label>
              <Input id="start_date" type="date" {...register("start_date")} />
              {errors.start_date && <p className="text-destructive text-sm">{errors.start_date.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date (Optional)</Label>
              <Input id="end_date" type="date" {...register("end_date")} />
              {errors.end_date && <p className="text-destructive text-sm">{errors.end_date.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority (Higher number = higher priority)</Label>
            <Input id="priority" type="number" {...register("priority")} className={cn(errors.priority && "border-destructive")} />
            {errors.priority && <p className="text-destructive text-sm">{errors.priority.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_url">Link URL (Optional)</Label>
            <Input id="link_url" type="url" {...register("link_url")} placeholder="https://example.com/promo" />
            {errors.link_url && <p className="text-destructive text-sm">{errors.link_url.message}</p>}
          </div>

          {currentLinkUrl && (
            <div className="space-y-2">
              <Label htmlFor="link_text">Link Text (Optional, if URL provided)</Label>
              <Input id="link_text" {...register("link_text")} placeholder="Shop Now!" />
              {errors.link_text && <p className="text-destructive text-sm">{errors.link_text.message}</p>}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active-toggle"
              checked={currentIsActive}
              onCheckedChange={(checked) => setValue("is_active", checked)}
            />
            <Label htmlFor="is_active-toggle">Active: {currentIsActive ? "Yes" : "No"}</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                initialData ? "Save Changes" : "Add Banner"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BannerFormDialog;
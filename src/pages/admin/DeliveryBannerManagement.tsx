"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  BellRing,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ChevronFirst,
  ChevronLast,
  CalendarDays,
  Link as LinkIcon,
  MessageSquare,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";

// Define the DeliveryBannerMessage interface based on your database structure
export interface DeliveryBannerMessage {
  id: string;
  message_type: string;
  content: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  priority: number;
  link_url: string | null;
  link_text: string | null;
  background_color: string | null;
  text_color: string | null;
  icon_name: string | null;
  created_at: string;
  updated_at: string;
}

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

// Form Schema for Add/Edit Banner Message
const bannerFormSchema = z.object({
  id: z.string().optional(),
  message_type: z.string().min(1, "Message Type is required"),
  content: z.string().min(1, "Content is required").max(200, "Content cannot exceed 200 characters"),
  start_date: z.string().nullable().optional(),
  end_date: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
  priority: z.coerce.number().min(0).default(0),
  link_url: z.string().url("Invalid URL format").nullable().optional().or(z.literal("")),
  link_text: z.string().nullable().optional(),
  background_color: z.string().nullable().optional(),
  text_color: z.string().nullable().optional(),
  icon_name: z.string().nullable().optional(),
});

type BannerFormData = z.infer<typeof bannerFormSchema>;

const DeliveryBannerManagement = () => {
  const [banners, setBanners] = useState<DeliveryBannerMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const bannersPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<DeliveryBannerMessage | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingBannerId, setDeletingBannerId] = useState<string | null>(null);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BannerFormData>({
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
    }
  });

  const currentIsActive = watch("is_active");
  const currentLinkUrl = watch("link_url");

  const fetchBanners = useCallback(async () => {
    setIsLoadingBanners(true);
    const { data, error } = await supabase
      .from('delivery_banner_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banner messages.", { description: error.message });
      setBanners([]);
    } else {
      setBanners(data as DeliveryBannerMessage[]);
    }
    setIsLoadingBanners(false);
  }, []);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  const filteredBanners = useMemo(() => {
    let filtered = banners;

    if (searchTerm) {
      filtered = filtered.filter(
        (banner) =>
          banner.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          banner.message_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          banner.link_text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (banner) => banner.is_active === (filterStatus === "active")
      );
    }

    if (filterType !== "all") {
      filtered = filtered.filter(
        (banner) => banner.message_type === filterType
      );
    }

    return filtered;
  }, [banners, searchTerm, filterStatus, filterType]);

  // Pagination logic
  const indexOfLastBanner = currentPage * bannersPerPage;
  const indexOfFirstBanner = indexOfLastBanner - bannersPerPage;
  const currentBanners = filteredBanners.slice(indexOfFirstBanner, indexOfLastBanner);
  const totalPages = Math.ceil(filteredBanners.length / bannersPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  const handleAddBannerClick = () => {
    reset();
    setIsAddModalOpen(true);
  };

  const handleEditBannerClick = (banner: DeliveryBannerMessage) => {
    setEditingBanner(banner);
    reset({
      id: banner.id,
      message_type: banner.message_type,
      content: banner.content,
      start_date: banner.start_date ? new Date(banner.start_date).toISOString().split('T')[0] : null,
      end_date: banner.end_date ? new Date(banner.end_date).toISOString().split('T')[0] : null,
      is_active: banner.is_active,
      priority: banner.priority,
      link_url: banner.link_url,
      link_text: banner.link_text,
      background_color: banner.background_color,
      text_color: banner.text_color,
      icon_name: banner.icon_name,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteBannerClick = (bannerId: string) => {
    setDeletingBannerId(bannerId);
    setIsDeleteAlertOpen(true);
  };

  const handleAddOrUpdateBanner = async (data: BannerFormData) => {
    const payload = {
      message_type: data.message_type,
      content: data.content,
      start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
      end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
      is_active: data.is_active,
      priority: data.priority,
      link_url: data.link_url || null,
      link_text: data.link_text || null,
      background_color: data.background_color || null,
      text_color: data.text_color || null,
      icon_name: data.icon_name || null,
    };

    if (editingBanner) {
      const { error } = await supabase
        .from('delivery_banner_messages')
        .update(payload)
        .eq('id', editingBanner.id);

      if (error) {
        toast.error("Failed to update banner message.", { description: error.message });
      } else {
        toast.success(`Banner "${data.content}" updated successfully!`);
        setIsEditModalOpen(false);
        setEditingBanner(null);
        fetchBanners();
      }
    } else {
      const { error } = await supabase
        .from('delivery_banner_messages')
        .insert([payload]);

      if (error) {
        toast.error("Failed to add banner message.", { description: error.message });
      } else {
        toast.success(`Banner "${data.content}" added successfully!`);
        setIsAddModalOpen(false);
        fetchBanners();
      }
    }
  };

  const confirmDeleteBanner = useCallback(async () => {
    if (deletingBannerId) {
      const { error } = await supabase
        .from('delivery_banner_messages')
        .delete()
        .eq('id', deletingBannerId);

      if (error) {
        toast.error("Failed to delete banner message.", { description: error.message });
      } else {
        toast.info(`Banner message deleted.`);
        setDeletingBannerId(null);
        setIsDeleteAlertOpen(false);
        fetchBanners();
      }
    }
  }, [deletingBannerId, fetchBanners]);

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? "default" : "destructive";
  };

  const getMessageTypeBadgeVariant = (type: string) => {
    switch (type.toLowerCase()) {
      case "delivery": return "secondary";
      case "promo": return "default";
      case "discount": return "primary";
      case "alert": return "destructive";
      default: return "outline";
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground" variants={fadeInUp}>
          Delivery Banner Management
        </motion.h1>
        <motion.p className="text-base md:text-lg text-muted-foreground" variants={fadeInUp}>
          Manage the scrolling banner messages displayed to visitors.
        </motion.p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" /> All Banner Messages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b p-4">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by content or type..."
                className="w-full pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                  <SelectItem value="promo">Promotion</SelectItem>
                  <SelectItem value="discount">Discount</SelectItem>
                  <SelectItem value="alert">Alert</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddBannerClick} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Banner
              </Button>
            </div>
          </div>

          {isLoadingBanners ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading banners...</p>
            </div>
          ) : filteredBanners.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p>No banner messages found matching your filters.</p>
              <Button onClick={() => { setSearchTerm(""); setFilterStatus("all"); setFilterType("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Type</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Active</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Link</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {currentBanners.map((banner) => (
                      <motion.tr
                        key={banner.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell>
                          <Badge variant={getMessageTypeBadgeVariant(banner.message_type)}>
                            {banner.message_type.charAt(0).toUpperCase() + banner.message_type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[250px] truncate">{banner.content}</TableCell>
                        <TableCell>
                          {banner.is_active ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>{banner.priority}</TableCell>
                        <TableCell className="text-xs">
                          {banner.start_date && new Date(banner.start_date).toLocaleDateString()}
                          {banner.start_date && banner.end_date && " - "}
                          {banner.end_date && new Date(banner.end_date).toLocaleDateString()}
                          {!banner.start_date && !banner.end_date && "Always"}
                        </TableCell>
                        <TableCell>
                          {banner.link_url ? (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <a href={banner.link_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                    <LinkIcon className="h-4 w-4" /> {banner.link_text || "View Link"}
                                  </a>
                                </TooltipTrigger>
                                <TooltipContent>{banner.link_url}</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={() => handleEditBannerClick(banner)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Banner</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <AlertDialog>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="icon" onClick={() => handleDeleteBannerClick(banner.id)}>
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </AlertDialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete Banner</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will permanently delete the banner message: "{banner.content}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={confirmDeleteBanner}>
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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
          {filteredBanners.length > bannersPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstBanner + 1} to {Math.min(indexOfLastBanner, filteredBanners.length)} of {filteredBanners.length} banners
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

      {/* Add/Edit Banner Dialog */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={isAddModalOpen ? setIsAddModalOpen : setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {editingBanner ? <Edit className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
              {editingBanner ? "Edit Banner Message" : "Add New Banner Message"}
            </DialogTitle>
            <DialogDescription>
              {editingBanner ? "Update the details for this banner message." : "Create a new banner message to display on your site."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateBanner)} className="space-y-6 py-4">
            <input type="hidden" {...register("id")} />
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
              <Button type="button" variant="outline" onClick={() => { isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false); }}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  editingBanner ? "Save Changes" : "Add Banner"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default DeliveryBannerManagement;
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
  Megaphone,
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
  CalendarIcon,
  Eye,
} from "lucide-react";
import * as LucideIcons from "lucide-react"; // Import all Lucide icons for dynamic rendering
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// Define the BannerMessage interface based on your database structure
export interface BannerMessage {
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
const bannerMessageFormSchema = z.object({
  id: z.string().optional(),
  message_type: z.string().min(1, "Message Type is required"),
  content: z.string().min(1, "Content is required").max(255, "Content cannot exceed 255 characters"),
  start_date: z.date().nullable().optional(),
  end_date: z.date().nullable().optional(),
  is_active: z.boolean().default(true),
  priority: z.coerce.number().min(0, "Priority must be 0 or greater").default(0),
  link_url: z.string().url("Must be a valid URL").nullable().optional().or(z.literal('')),
  link_text: z.string().nullable().optional().or(z.literal('')),
  background_color: z.string().nullable().optional().or(z.literal('')),
  text_color: z.string().nullable().optional().or(z.literal('')),
  icon_name: z.string().nullable().optional().or(z.literal('')),
});

type BannerMessageFormData = z.infer<typeof bannerMessageFormSchema>;

// Type guard to check if a string is a valid Lucide icon key
const isLucideIconKey = (key: string): keyof typeof LucideIcons => {
  if (key && key in LucideIcons) {
    return key as keyof typeof LucideIcons;
  }
  return "Megaphone"; // Default fallback icon
};

const messageTypes = [
  "Delivery Info",
  "Promotion",
  "Warning",
  "General Announcement",
  "Holiday Special",
  "New Collection",
];

const BannerMessagesManagement = () => {
  const [bannerMessages, setBannerMessages] = useState<BannerMessage[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // "all", "active", "inactive"
  const [currentPage, setCurrentPage] = useState(1);
  const messagesPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState<BannerMessage | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BannerMessageFormData>({
    resolver: zodResolver(bannerMessageFormSchema),
    defaultValues: {
      is_active: true,
      priority: 0,
      link_url: "",
      link_text: "",
      background_color: "",
      text_color: "",
      icon_name: "",
    },
  });

  const currentIsActive = watch("is_active");
  const currentStartDate = watch("start_date");
  const currentEndDate = watch("end_date");
  const currentMessageType = watch("message_type");

  const fetchBannerMessages = useCallback(async () => {
    setIsLoadingMessages(true);
    const { data, error } = await supabase
      .from('delivery_banner_messages')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching banner messages:", error);
      toast.error("Failed to load banner messages.", { description: error.message });
      setBannerMessages([]);
    } else {
      setBannerMessages(data as BannerMessage[]);
    }
    setIsLoadingMessages(false);
  }, []);

  useEffect(() => {
    fetchBannerMessages();
  }, [fetchBannerMessages]);

  const filteredMessages = useMemo(() => {
    let filtered = bannerMessages;

    if (searchTerm) {
      filtered = filtered.filter(
        (message) =>
          message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.message_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          message.link_text?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (message) => message.is_active === (filterStatus === "active")
      );
    }

    return filtered;
  }, [bannerMessages, searchTerm, filterStatus]);

  // Pagination logic
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  const handleAddMessageClick = () => {
    reset();
    setIsAddModalOpen(true);
  };

  const handleEditMessageClick = (message: BannerMessage) => {
    setEditingMessage(message);
    reset({
      id: message.id,
      message_type: message.message_type,
      content: message.content,
      start_date: message.start_date ? new Date(message.start_date) : null,
      end_date: message.end_date ? new Date(message.end_date) : null,
      is_active: message.is_active,
      priority: message.priority,
      link_url: message.link_url || "",
      link_text: message.link_text || "",
      background_color: message.background_color || "",
      text_color: message.text_color || "",
      icon_name: message.icon_name || "",
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteMessageClick = (messageId: string) => {
    setDeletingMessageId(messageId);
    setIsDeleteAlertOpen(true);
  };

  const handleAddOrUpdateMessage = async (data: BannerMessageFormData) => {
    const payload = {
      message_type: data.message_type,
      content: data.content,
      start_date: data.start_date ? data.start_date.toISOString() : null,
      end_date: data.end_date ? data.end_date.toISOString() : null,
      is_active: data.is_active,
      priority: data.priority,
      link_url: data.link_url || null,
      link_text: data.link_text || null,
      background_color: data.background_color || null,
      text_color: data.text_color || null,
      icon_name: data.icon_name || null,
    };

    if (editingMessage) {
      const { error } = await supabase
        .from('delivery_banner_messages')
        .update(payload)
        .eq('id', editingMessage.id);

      if (error) {
        toast.error("Failed to update banner message.", { description: error.message });
      } else {
        toast.success(`Banner message "${data.content}" updated successfully!`);
        setIsEditModalOpen(false);
        setEditingMessage(null);
        fetchBannerMessages();
      }
    } else {
      const { error } = await supabase
        .from('delivery_banner_messages')
        .insert([payload]);

      if (error) {
        toast.error("Failed to add banner message.", { description: error.message });
      } else {
        toast.success(`Banner message "${data.content}" added successfully!`);
        setIsAddModalOpen(false);
        fetchBannerMessages();
      }
    }
  };

  const confirmDeleteMessage = useCallback(async () => {
    if (deletingMessageId) {
      const { error } = await supabase
        .from('delivery_banner_messages')
        .delete()
        .eq('id', deletingMessageId);

      if (error) {
        toast.error("Failed to delete banner message.", { description: error.message });
      } else {
        toast.info(`Banner message ${deletingMessageId} deleted.`);
        setDeletingMessageId(null);
        setIsDeleteAlertOpen(false);
        fetchBannerMessages();
      }
    }
  }, [deletingMessageId, fetchBannerMessages]);

  const getStatusBadgeVariant = (isActive: boolean) => {
    return isActive ? "default" : "secondary";
  };

  const getMessageTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "Delivery Info": return "default";
      case "Promotion": return "primary";
      case "Warning": return "destructive";
      case "Holiday Special": return "accent";
      default: return "outline";
    }
  };

  if (isLoadingMessages) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-muted-foreground">Loading banner messages...</p>
      </div>
    );
  }

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground" variants={fadeInUp}>
          Banner Messages Management
        </motion.h1>
        <motion.p className="text-base md:text-lg text-muted-foreground" variants={fadeInUp}>
          Manage the rotating banner messages displayed at the top of your website.
        </motion.p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-primary" /> All Banner Messages
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
              <Button onClick={handleAddMessageClick} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Message
              </Button>
            </div>
          </div>

          {filteredMessages.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p>No banner messages found matching your filters.</p>
              <Button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Type</TableHead>
                    <TableHead>Content</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {currentMessages.map((message) => {
                      const IconComponent = LucideIcons[isLucideIconKey(message.icon_name || "Megaphone")] as React.ElementType;
                      const isActiveNow = message.is_active &&
                        (!message.start_date || new Date(message.start_date) <= new Date()) &&
                        (!message.end_date || new Date(message.end_date) >= new Date());

                      return (
                        <motion.tr
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell>
                            <Badge variant={getMessageTypeBadgeVariant(message.message_type)} className="flex items-center gap-1 w-fit">
                              {IconComponent && <IconComponent className="h-3 w-3" />}
                              {message.message_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-[250px] truncate">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="cursor-help">{message.content}</span>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  {message.content}
                                  {message.link_url && (
                                    <p className="mt-2 text-xs text-muted-foreground">
                                      Link: <a href={message.link_url} target="_blank" rel="noopener noreferrer" className="underline">{message.link_text || message.link_url}</a>
                                    </p>
                                  )}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </TableCell>
                          <TableCell className="text-xs">
                            {message.start_date ? format(new Date(message.start_date), "MMM d, yyyy") : "No Start"}
                            {" - "}
                            {message.end_date ? format(new Date(message.end_date), "MMM d, yyyy") : "No End"}
                          </TableCell>
                          <TableCell>{message.priority}</TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(message.is_active)}>
                              {message.is_active ? "Active" : "Inactive"}
                            </Badge>
                            {isActiveNow && (
                              <Badge variant="default" className="ml-2 bg-green-500 text-white">Live</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end space-x-2">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={() => handleEditMessageClick(message)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit Message</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <AlertDialog>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <AlertDialogTrigger asChild>
                                        <Button variant="outline" size="icon" onClick={() => handleDeleteMessageClick(message.id)}>
                                          <Trash2 className="h-4 w-4 text-red-600" />
                                        </Button>
                                      </AlertDialogTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete Message</TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action will permanently delete the banner message: "{message.content}".
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={confirmDeleteMessage}>
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {filteredMessages.length > messagesPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstMessage + 1} to {Math.min(indexOfLastMessage, filteredMessages.length)} of {filteredMessages.length} messages
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

      {/* Add/Edit Message Dialog */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={isAddModalOpen ? setIsAddModalOpen : setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[550px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              {editingMessage ? <Edit className="h-6 w-6 text-primary" /> : <Plus className="h-6 w-6 text-primary" />}
              {editingMessage ? "Edit Banner Message" : "Add New Banner Message"}
            </DialogTitle>
            <DialogDescription>
              {editingMessage ? "Update the details for this banner message." : "Create a new banner message to display on your website."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateMessage)} className="space-y-6 py-4">
            <input type="hidden" {...register("id")} />

            <div className="space-y-2">
              <Label htmlFor="message_type">Message Type</Label>
              <Select onValueChange={(value) => setValue("message_type", value)} value={currentMessageType}>
                <SelectTrigger className={cn(errors.message_type && "border-destructive")}>
                  <SelectValue placeholder="Select message type" />
                </SelectTrigger>
                <SelectContent>
                  {messageTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
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
                rows={2}
              />
              {errors.content && <p className="text-destructive text-sm">{errors.content.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !currentStartDate && "text-muted-foreground",
                        errors.start_date && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentStartDate ? format(currentStartDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={currentStartDate || undefined}
                      onSelect={(date) => setValue("start_date", date || null, { shouldValidate: true })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.start_date && <p className="text-destructive text-sm">{errors.start_date.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date (Optional)</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !currentEndDate && "text-muted-foreground",
                        errors.end_date && "border-destructive"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentEndDate ? format(currentEndDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={currentEndDate || undefined}
                      onSelect={(date) => setValue("end_date", date || null, { shouldValidate: true })}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.end_date && <p className="text-destructive text-sm">{errors.end_date.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority (0 = lowest)</Label>
                <Input
                  id="priority"
                  type="number"
                  {...register("priority")}
                  className={cn(errors.priority && "border-destructive")}
                />
                {errors.priority && <p className="text-destructive text-sm">{errors.priority.message}</p>}
              </div>
              <div className="flex items-center space-x-2 mt-7">
                <Switch
                  id="is_active-toggle"
                  checked={currentIsActive}
                  onCheckedChange={(checked) => setValue("is_active", checked)}
                />
                <Label htmlFor="is_active-toggle">Status: {currentIsActive ? "Active" : "Inactive"}</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_url">Link URL (Optional)</Label>
              <Input
                id="link_url"
                type="url"
                {...register("link_url")}
                className={cn(errors.link_url && "border-destructive")}
                placeholder="https://example.com/promo"
              />
              {errors.link_url && <p className="text-destructive text-sm">{errors.link_url.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="link_text">Link Text (Optional)</Label>
              <Input
                id="link_text"
                {...register("link_text")}
                placeholder="Shop Now!"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="background_color">Background Color (Tailwind class or hex)</Label>
                <Input
                  id="background_color"
                  {...register("background_color")}
                  placeholder="e.g., bg-red-600 or #FF0000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="text_color">Text Color (Tailwind class or hex)</Label>
                <Input
                  id="text_color"
                  {...register("text_color")}
                  placeholder="e.g., text-white or #FFFFFF"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon_name">Icon Name (Lucide icon name, e.g., 'Truck', 'Gift', 'Megaphone')</Label>
              <Input
                id="icon_name"
                {...register("icon_name")}
                placeholder="e.g., Truck"
              />
              {watch("icon_name") && (
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  Preview: {React.createElement(LucideIcons[isLucideIconKey(watch("icon_name"))] as React.ElementType, { className: "h-4 w-4" })}
                  <span>{watch("icon_name")}</span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => (isAddModalOpen ? setIsAddModalOpen(false) : setIsEditModalOpen(false))}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  editingMessage ? "Save Changes" : "Add Message"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Message Confirmation Dialog */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this banner message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteMessage}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default BannerMessagesManagement;
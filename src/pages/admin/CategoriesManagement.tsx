"use client";

import React, { useState, useMemo, useCallback } from "react";
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
  Settings,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { mockAdminCategories, AdminCategory } from "@/data/adminData.ts";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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

// Form Schema for Add/Edit Category
const categoryFormSchema = z.object({
  id: z.string().optional(), // For editing
  name: z.string().min(1, "Category Name is required"),
  status: z.enum(["active", "inactive"]).default("active"),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

const CategoriesManagement = () => {
  const [categories, setCategories] = useState<AdminCategory[]>(mockAdminCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      status: "active", // Default status for new categories
    }
  });

  const currentStatus = watch("status");

  const filteredCategories = useMemo(() => {
    let filtered = categories;

    if (searchTerm) {
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          category.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (category) => category.status === filterStatus
      );
    }

    return filtered;
  }, [categories, searchTerm, filterStatus]);

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddCategoryClick = () => {
    reset(); // Clear form fields
    setIsAddModalOpen(true);
  };

  const handleEditCategoryClick = (category: AdminCategory) => {
    setEditingCategory(category);
    reset({
      id: category.id,
      name: category.name,
      status: category.status,
    });
    setIsEditModalOpen(true);
  };

  const handleDeleteCategoryClick = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    setIsDeleteAlertOpen(true);
  };

  const handleAddOrUpdateCategory = async (data: CategoryFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newCategoryData: AdminCategory = {
      id: data.id || `cat-${Date.now()}`, // Generate new ID if adding
      name: data.name,
      status: data.status,
      productCount: editingCategory?.productCount || 0, // Preserve productCount or default to 0
    };

    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c.id === newCategoryData.id ? newCategoryData : c))
      );
      toast.success(`Category "${newCategoryData.name}" updated successfully!`);
      setIsEditModalOpen(false);
      setEditingCategory(null);
    } else {
      setCategories((prev) => [...prev, newCategoryData]);
      toast.success(`Category "${newCategoryData.name}" added successfully!`);
      setIsAddModalOpen(false);
    }
  };

  const confirmDeleteCategory = useCallback(async () => {
    if (deletingCategoryId) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setCategories((prev) => prev.filter((c) => c.id !== deletingCategoryId));
      toast.info(`Category ${deletingCategoryId} deleted.`);
      setDeletingCategoryId(null);
      setIsDeleteAlertOpen(false);
    }
  }, [deletingCategoryId]);

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-3xl font-bold text-foreground" variants={fadeInUp}>
          Categories Management
        </motion.h1>
        <motion.p className="text-lg text-muted-foreground" variants={fadeInUp}>
          Manage your product categories, including adding, editing, and deleting them.
        </motion.p>
      </div>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" /> All Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 border-b">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Category Name or ID..."
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
              <Button onClick={handleAddCategoryClick} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add New Category
              </Button>
            </div>
          </div>

          {filteredCategories.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p>No categories found matching your filters.</p>
              <Button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table className="min-w-full"> {/* Added min-w-full here */}
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Category ID</TableHead>
                    <TableHead>Category Name</TableHead>
                    <TableHead>Products Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {currentCategories.map((category) => (
                      <motion.tr
                        key={category.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell className="font-medium text-xs">{category.id}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell>{category.productCount}</TableCell>
                        <TableCell>
                          <Badge variant={category.status === "active" ? "default" : "destructive"}>
                            {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={() => handleEditCategoryClick(category)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Category</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <AlertDialog>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="icon" onClick={() => handleDeleteCategoryClick(category.id)}>
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </AlertDialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete Category</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action will permanently delete the category "{category.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={confirmDeleteCategory}>
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

          {/* Pagination */}
          {filteredCategories.length > categoriesPerPage && (
            <div className="flex items-center justify-end space-x-2 py-4 pr-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Category Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" /> Add New Category
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateCategory)} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" {...register("name")} className={cn(errors.name && "border-destructive")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="status-toggle"
                checked={currentStatus === "active"}
                onCheckedChange={(checked) => setValue("status", checked ? "active" : "inactive")}
              />
              <Label htmlFor="status-toggle">Category Status: {currentStatus === "active" ? "Active" : "Inactive"}</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Add Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Edit className="h-6 w-6 text-primary" /> Edit Category
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateCategory)} className="space-y-6 py-4">
            <input type="hidden" {...register("id")} /> {/* Hidden field for category ID */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" {...register("name")} className={cn(errors.name && "border-destructive")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="status-toggle-edit"
                checked={currentStatus === "active"}
                onCheckedChange={(checked) => setValue("status", checked ? "active" : "inactive")}
              />
              <Label htmlFor="status-toggle-edit">Category Status: {currentStatus === "active" ? "Active" : "Inactive"}</Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CategoriesManagement;
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
  Settings,
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
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import ImageWithFallback from "@/components/common/ImageWithFallback";

// Define the AdminCategory interface based on your database structure
export interface AdminCategory {
  id: string;
  name: string;
  product_count: number; // This is the static count from the categories table
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
  image_url?: string;
}

// Extended interface for display with live count
interface CategoryWithLiveCount extends AdminCategory {
  live_product_count?: number; // The dynamically fetched count
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

// Form Schema for Add/Edit Category
const categoryFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Category Name is required"),
  status: z.enum(["active", "inactive"]).default("active"),
  image_url: z.string().optional(),
});

type CategoryFormData = z.infer<typeof categoryFormSchema>;

// --- Category ID Generation Logic ---
const categoryShortCodes: { [key: string]: string } = {
  "Kids Patpat": "KP",
  "Shein Gowns": "SG",
  "Vintage Shirts": "VS",
  "Children Jeans": "CJ",
  "Children Shirts": "CS",
  "Men Vintage Shirts": "MVS",
  "Amazon Ladies": "AL",
  "Others": "OT",
  // Add more as needed
};

const generateCategoryShortCode = (categoryName: string): string => {
  const mappedCode = categoryShortCodes[categoryName];
  if (mappedCode) return mappedCode;

  // Fallback: take first two letters, uppercase, or a generic code
  return categoryName.substring(0, 2).toUpperCase() || "XX";
};

const generateUniqueCategoryId = async (categoryName: string): Promise<string> => {
  const shortCode = generateCategoryShortCode(categoryName);
  let newId: string;
  let isUnique = false;
  let attempts = 0;

  do {
    const randomDigits = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit number
    newId = `UC-${shortCode}-${randomDigits}`;
    attempts++;

    // Check uniqueness in Supabase
    const { count, error } = await supabase
      .from('categories')
      .select('id', { count: 'exact', head: true })
      .eq('id', newId);

    if (error) {
      console.error("Error checking category ID uniqueness:", error);
      // Fallback to a timestamp-based ID if database check fails
      return `UC-${shortCode}-${Date.now()}`;
    }

    isUnique = (count === 0);
    if (attempts > 10) { // Prevent infinite loops
      console.warn("Failed to generate unique category ID after multiple attempts.");
      return `UC-${shortCode}-${Date.now()}`; // Fallback
    }
  } while (!isUnique);

  return newId;
};
// --- End Category ID Generation Logic ---

const CategoriesManagement = () => {
  const [categoriesWithCounts, setCategoriesWithCounts] = useState<CategoryWithLiveCount[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AdminCategory | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(null);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  
  // State for image preview and file handling
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);

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
      status: "active",
    }
  });

  const currentStatus = watch("status");

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    try {
      // 1. Fetch all categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, name, product_count, status, created_at, updated_at, image_url')
        .order('name', { ascending: true });

      if (categoriesError) throw categoriesError;

      // 2. Fetch live product counts for all categories using the RPC function
      let liveCountsMap: Record<string, number> = {};

      if (categoriesData && categoriesData.length > 0) {
        // Call the RPC function to get counts for all active products grouped by category
        const { data: countsData, error: countsError } = await supabase.rpc('get_category_product_counts');

        if (countsError) {
          console.error("Error fetching product counts via RPC:", countsError);
          toast.error("Failed to load accurate product counts via RPC.");
          // Initialize countsMap with 0 if fetch fails
          liveCountsMap = categoriesData.reduce((acc, cat) => { acc[cat.id] = 0; return acc; }, {} as Record<string, number>);
        } else {
          // If data is returned and is an array, process it
          if (countsData && Array.isArray(countsData)) {
            // countsData is expected to be an array like [{ category_id: 'cat1', product_count: 5 }, ...]
            liveCountsMap = countsData.reduce((acc, item) => {
              // Map category_id to product_count
              acc[item.category_id] = item.product_count;
              return acc;
            }, {} as Record<string, number>);
          } else {
            // If RPC returns no data or unexpected format, initialize to 0
            console.warn("RPC 'get_category_product_counts' returned unexpected data:", countsData);
            liveCountsMap = categoriesData.reduce((acc, cat) => { acc[cat.id] = 0; return acc; }, {} as Record<string, number>);
          }
        }

        // Ensure all categories from the list are represented in the map, even if count is 0
        categoriesData.forEach(cat => {
          if (liveCountsMap[cat.id] === undefined) {
            liveCountsMap[cat.id] = 0; // Default to 0 if not found in counts
          }
        });
      } else {
        // Handle case where there are no categories
        liveCountsMap = {};
      }

      // 3. Combine category data with live counts
      const categoriesWithLiveCounts: CategoryWithLiveCount[] = (categoriesData || []).map(cat => ({
        ...cat,
        // Use the live count fetched from the RPC function
        live_product_count: liveCountsMap[cat.id] ?? 0 // Fallback to 0 if somehow missing
      }));

      setCategoriesWithCounts(categoriesWithLiveCounts);
    } catch (error: any) {
      console.error("Error fetching categories or counts:", error);
      toast.error("Failed to load categories or product counts.", { description: error.message || "An unexpected error occurred." });
      setCategoriesWithCounts([]);
    } finally {
      setIsLoadingCategories(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    let filtered = categoriesWithCounts;

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
  }, [categoriesWithCounts, searchTerm, filterStatus]);

  // Pagination logic
  const indexOfLastCategory = currentPage * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  
  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = () => setCurrentPage(totalPages);
  const goToPrevPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  const handleAddCategoryClick = () => {
    reset();
    setImagePreview(null);
    setSelectedImageFile(null);
    setIsAddModalOpen(true);
  };

  const handleEditCategoryClick = (category: AdminCategory) => {
    setEditingCategory(category);
    reset({
      id: category.id,
      name: category.name,
      status: category.status,
      image_url: category.image_url || "",
    });
    setImagePreview(category.image_url || null);
    setSelectedImageFile(null);
    setIsEditModalOpen(true);
  };

  const handleDeleteCategoryClick = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    setIsDeleteAlertOpen(true);
  };

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove image preview and file
  const handleRemoveImage = () => {
    setImagePreview(null);
    setSelectedImageFile(null);
    setValue("image_url", "");
  };

  const handleAddOrUpdateCategory = async (data: CategoryFormData) => {
    let imageUrl = data.image_url;
    
    // If a new file is selected, upload it
    if (selectedImageFile) {
      const fileExtension = selectedImageFile.name.split('.').pop();
      const filePath = `categories/${data.name.replace(/\s+/g, '_')}_${Date.now()}.${fileExtension}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('category_images')
        .upload(filePath, selectedImageFile, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        toast.error("Failed to upload category image.", { description: uploadError.message });
        return;
      } else {
        const { data: publicUrlData } = supabase.storage.from('category_images').getPublicUrl(uploadData.path);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    const categoryPayload = {
      name: data.name,
      status: data.status,
      image_url: imageUrl,
    };

    if (editingCategory) {
      const { error } = await supabase
        .from('categories')
        .update(categoryPayload)
        .eq('id', editingCategory.id);

      if (error) {
        toast.error("Failed to update category.", { description: error.message });
      } else {
        toast.success(`Category "${data.name}" updated successfully!`);
        setIsEditModalOpen(false);
        setEditingCategory(null);
        fetchCategories();
      }
    } else {
      // NEW: Generate unique category ID
      const newId = await generateUniqueCategoryId(data.name);
      const { error } = await supabase
        .from('categories')
        .insert([{ ...categoryPayload, id: newId, product_count: 0 }]);

      if (error) {
        toast.error("Failed to add category.", { description: error.message });
      } else {
        toast.success(`Category "${data.name}" added successfully!`);
        setIsAddModalOpen(false);
        fetchCategories();
      }
    }
  };

  const confirmDeleteCategory = useCallback(async () => {
    if (deletingCategoryId) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', deletingCategoryId);

      if (error) {
        toast.error("Failed to delete category.", { description: error.message });
      } else {
        toast.info(`Category ${deletingCategoryId} deleted.`);
        setDeletingCategoryId(null);
        setIsDeleteAlertOpen(false);
        fetchCategories();
      }
    }
  }, [deletingCategoryId, fetchCategories]);

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="space-y-2">
        <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground" variants={fadeInUp}>
          Categories Management
        </motion.h1>
        <motion.p className="text-base md:text-lg text-muted-foreground" variants={fadeInUp}>
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
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b p-4">
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

          {isLoadingCategories ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-3 text-muted-foreground">Loading categories...</p>
            </div>
          ) : filteredCategories.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p>No categories found matching your filters.</p>
              <Button onClick={() => { setSearchTerm(""); setFilterStatus("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
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
                        <TableCell>
                          <ImageWithFallback
                            src={category.image_url}
                            alt={category.name}
                            containerClassName="h-10 w-10 rounded-md overflow-hidden border"
                            fallbackLogoClassName="h-6 w-6"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-xs">{category.id}</TableCell>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        {/* --- This is the key change: Display live_product_count --- */}
                        <TableCell className="font-medium">
                          {category.live_product_count !== undefined ? category.live_product_count : 'N/A'}
                        </TableCell>
                        {/* ---------------------------------------------------------- */}
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

          {/* Pagination Controls */}
          {filteredCategories.length > categoriesPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {indexOfFirstCategory + 1} to {Math.min(indexOfLastCategory, filteredCategories.length)} of {filteredCategories.length} categories
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

      {/* Add Category Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" /> Add New Category
            </DialogTitle>
            <DialogDescription>
              Enter the details for the new product category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateCategory)} className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" {...register("name")} className={cn(errors.name && "border-destructive")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="categoryImage">Category Image</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="categoryImage"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label
                  htmlFor="categoryImage"
                  className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-xs text-gray-500">Upload Image</p>
                    </div>
                  )}
                </Label>
                {imagePreview && (
                  <Button type="button" variant="ghost" size="icon" onClick={handleRemoveImage}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input type="hidden" {...register("image_url")} value={imagePreview || ""} />
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
            <DialogDescription>
              Update the details for this product category.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateCategory)} className="space-y-6 py-4">
            <input type="hidden" {...register("id")} />
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input id="name" {...register("name")} className={cn(errors.name && "border-destructive")} />
              {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
            </div>

            {/* Image Upload Section */}
            <div className="space-y-2">
              <Label htmlFor="categoryImageEdit">Category Image</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="categoryImageEdit"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label
                  htmlFor="categoryImageEdit"
                  className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                >
                  {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-500" />
                      <p className="text-xs text-gray-500">Upload Image</p>
                    </div>
                  )}
                </Label>
                {imagePreview && (
                  <Button type="button" variant="ghost" size="icon" onClick={handleRemoveImage}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Input type="hidden" {...register("image_url")} value={imagePreview || ""} />
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
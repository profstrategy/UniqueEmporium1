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
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { mockAdminProducts } from "@/data/adminData.ts"; // Using mockAdminProducts
import { ProductDetails } from "@/data/products.ts"; // Using ProductDetails interface
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
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

// Form Schema for Add/Edit Product
const productFormSchema = z.object({
  id: z.string().optional(), // For editing
  name: z.string().min(1, "Product Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(1, "Price is required and must be positive"), // Price for MOQ
  originalPrice: z.coerce.number().optional().refine((val) => val === undefined || val > 0, "Original Price must be positive if provided"), // New: Optional original price
  minOrderQuantity: z.coerce.number().min(1, "Minimum Order Quantity is required and must be positive"),
  status: z.enum(["active", "inactive"]).default("active"),
  limitedStock: z.boolean().default(false),
  fullDescription: z.string().min(1, "Description is required"),
  images: z.array(z.string()).optional(), // For existing images (URLs)
  newImageFiles: z.instanceof(FileList).optional(), // For new file uploads (FileList)
  // New fields for product tag
  tag: z.string().optional(),
  tagVariant: z.enum(["default", "secondary", "destructive", "outline"]).optional(),
  // Simplified other fields for admin UI, providing defaults
  rating: z.coerce.number().min(0).max(5).default(4.5),
  reviewCount: z.coerce.number().min(0).default(0),
  styleNotes: z.string().optional(),
  keyFeatures: z.array(z.string()).optional(),
  reviews: z.array(z.any()).optional(), // Simplified
  relatedProducts: z.array(z.string()).optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

const ProductsManagement = () => {
  const [products, setProducts] = useState<ProductDetails[]>(mockAdminProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStockStatus, setFilterStockStatus] = useState("all");
  const [filterProductStatus, setFilterProductStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetails | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      status: "active",
      limitedStock: false,
      rating: 4.5,
      reviewCount: 0,
      keyFeatures: [],
      reviews: [],
      relatedProducts: [],
      tag: "", // Default empty tag
      tagVariant: "default", // Default tag variant
    }
  });

  const currentImageFiles = watch("newImageFiles");
  const currentImages = watch("images");
  const currentLimitedStock = watch("limitedStock");
  const currentProductStatus = watch("status");
  const currentTagVariant = watch("tagVariant"); // Watch tag variant

  // Effect to update image preview when newImageFiles changes
  React.useEffect(() => {
    if (currentImageFiles && currentImageFiles.length > 0) {
      const file = currentImageFiles[0];
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else if (currentImages && currentImages.length > 0) {
      setImagePreview(currentImages[0]);
    } else {
      setImagePreview(null);
    }
  }, [currentImageFiles, currentImages]);


  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  const uniqueCategories = useMemo(() => {
    const categories = new Set(mockAdminProducts.map(p => p.category));
    return ["all", ...Array.from(categories)];
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === filterCategory
      );
    }

    if (filterStockStatus !== "all") {
      filtered = filtered.filter(
        (product) => (filterStockStatus === "limited-stock" ? product.limitedStock : !product.limitedStock)
      );
    }

    if (filterProductStatus !== "all") {
      filtered = filtered.filter(
        (product) => product.status === filterProductStatus
      );
    }

    return filtered;
  }, [products, searchTerm, filterCategory, filterStockStatus, filterProductStatus]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleAddProductClick = () => {
    reset({
      status: "active",
      limitedStock: false,
      rating: 4.5,
      reviewCount: 0,
      keyFeatures: [],
      reviews: [],
      relatedProducts: [],
      tag: "", // Default empty tag
      tagVariant: "default", // Default tag variant
    }); // Clear form fields and set defaults
    setImagePreview(null);
    setIsAddModalOpen(true);
  };

  const handleEditProductClick = (product: ProductDetails) => {
    setEditingProduct(product);
    reset({
      ...product,
      limitedStock: product.limitedStock,
      status: product.status,
      originalPrice: product.originalPrice,
      newImageFiles: undefined,
      tag: product.tag || "", // Pre-fill tag
      tagVariant: product.tagVariant || "default", // Pre-fill tag variant
    });
    setImagePreview(product.images?.[0] || null);
    setIsEditModalOpen(true);
  };

  const handleDeleteProductClick = (productId: string) => {
    setDeletingProductId(productId);
    setIsDeleteAlertOpen(true);
  };

  const handleAddOrUpdateProduct = async (data: ProductFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Calculate discount percentage if originalPrice is provided and greater than current price
    let discountPercentage: number | undefined;
    if (data.originalPrice && data.price < data.originalPrice) {
      discountPercentage = Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);
    }

    const newProductData: ProductDetails = {
      id: data.id || `prod-${Date.now()}`, // Generate new ID if adding
      name: data.name,
      category: data.category,
      price: data.price,
      originalPrice: data.originalPrice, // Use originalPrice from form
      discountPercentage: discountPercentage, // Calculated discount
      minOrderQuantity: data.minOrderQuantity,
      fullDescription: data.fullDescription,
      rating: data.rating || 0,
      reviewCount: data.reviewCount || 0,
      tag: data.tag, // Use tag from form
      tagVariant: data.tagVariant, // Use tagVariant from form
      limitedStock: data.limitedStock,
      status: data.status,
      images: (data.images && data.images.length > 0) ? data.images : (editingProduct?.images || []),
      keyFeatures: data.keyFeatures || editingProduct?.keyFeatures || [],
      styleNotes: data.styleNotes || editingProduct?.styleNotes || "",
      detailedSpecs: editingProduct?.detailedSpecs || [], // Preserve existing detailedSpecs or default to empty array
      reviews: data.reviews || editingProduct?.reviews || [],
      relatedProducts: data.relatedProducts || editingProduct?.relatedProducts || [],
    };

    // Handle new image files
    if (data.newImageFiles && data.newImageFiles.length > 0) {
      const newImageUrls: string[] = [];
      for (let i = 0; i < data.newImageFiles.length; i++) {
        const file = data.newImageFiles[i];
        if (file instanceof File) {
          // In a real app, upload file and get URL. For mock, use a placeholder URL based on the file index.
          newImageUrls.push(`https://via.placeholder.com/400x400?text=${newProductData.name.replace(/\s/g, '+')}+Img${i + 1}`);
        }
      }
      newProductData.images = newImageUrls;
    }


    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === newProductData.id ? newProductData : p))
      );
      toast.success(`Product "${newProductData.name}" updated successfully!`);
      setIsEditModalOpen(false);
      setEditingProduct(null);
    } else {
      setProducts((prev) => [...prev, newProductData]);
      toast.success(`Product "${newProductData.name}" added successfully!`);
      setIsAddModalOpen(false);
    }
  };

  const confirmDeleteProduct = useCallback(async () => {
    if (deletingProductId) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProducts((prev) => prev.filter((p) => p.id !== deletingProductId));
      toast.info(`Product ${deletingProductId} deleted.`);
      setDeletingProductId(null);
      setIsDeleteAlertOpen(false);
    }
  }, [deletingProductId]);

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="text-3xl font-bold text-foreground" variants={fadeInUp}>
        Products Management
      </motion.h1>
      <motion.p className="text-lg text-muted-foreground" variants={fadeInUp}>
        Manage your product catalog, including adding, editing, and deleting items.
      </motion.p>

      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" /> All Products
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 min-w-0">
          <div className="flex flex-col md:flex-row items-center justify-between p-4 gap-4 border-b">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by Product Name or ID..."
                className="w-full pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.filter(cat => cat !== "all").map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
              </Select>
              <Select value={filterStockStatus} onValueChange={setFilterStockStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock Statuses</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="limited-stock">Limited Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterProductStatus} onValueChange={setFilterProductStatus}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Product Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Product Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleAddProductClick} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Filter className="h-12 w-12 mx-auto mb-4" />
              <p>No products found matching your filters.</p>
              <Button onClick={() => { setSearchTerm(""); setFilterCategory("all"); setFilterStockStatus("all"); setFilterProductStatus("all"); }} className="mt-4">
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Image</TableHead>
                    <TableHead className="w-[150px]">Product ID</TableHead>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>MOQ</TableHead>
                    <TableHead>Price/Unit</TableHead>
                    <TableHead>Price/MOQ</TableHead>
                    <TableHead>Stock Status</TableHead>
                    <TableHead>Product Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {currentProducts.map((product) => (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -100 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell>
                          <ImageWithFallback
                            src={product.images[0]}
                            alt={product.name}
                            containerClassName="h-10 w-10 rounded-md overflow-hidden border"
                            fallbackLogoClassName="h-6 w-6"
                          />
                        </TableCell>
                        <TableCell className="font-medium text-xs">{product.id}</TableCell>
                        <TableCell className="font-medium">{product.name}</TableCell>
                        <TableCell>{product.category}</TableCell>
                        <TableCell>{product.minOrderQuantity}</TableCell>
                        <TableCell>{formatCurrency(product.price / product.minOrderQuantity)}</TableCell>
                        <TableCell>{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <Badge variant={product.limitedStock ? "destructive" : "default"}>
                            {product.limitedStock ? "Ltd. stock" : "In Stock"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={product.status === "active" ? "default" : "secondary"}>
                            {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end space-x-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={() => handleEditProductClick(product)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Product</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <AlertDialog>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <AlertDialogTrigger asChild>
                                      <Button variant="outline" size="icon" onClick={() => handleDeleteProductClick(product.id)}>
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                      </Button>
                                    </AlertDialogTrigger>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete Product</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the product "{product.name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={confirmDeleteProduct}>
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
          {filteredProducts.length > productsPerPage && (
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

      {/* Add Product Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" /> Add New Product
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateProduct)} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...register("name")} className={cn(errors.name && "border-destructive")} />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue("category", value)} value={watch("category")}>
                  <SelectTrigger className={cn(errors.category && "border-destructive")}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.filter(cat => cat !== "all").map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (for MOQ)</Label>
                <Input id="price" type="number" step="0.01" {...register("price")} className={cn(errors.price && "border-destructive")} />
                {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (Optional, for discount)</Label>
                <Input id="originalPrice" type="number" step="0.01" {...register("originalPrice")} className={cn(errors.originalPrice && "border-destructive")} />
                {errors.originalPrice && <p className="text-destructive text-sm">{errors.originalPrice.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderQuantity">Min Order Quantity</Label>
                <Input id="minOrderQuantity" type="number" {...register("minOrderQuantity")} className={cn(errors.minOrderQuantity && "border-destructive")} />
                {errors.minOrderQuantity && <p className="text-destructive text-sm">{errors.minOrderQuantity.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Product Description</Label>
              <Textarea id="fullDescription" rows={4} {...register("fullDescription")} className={cn(errors.fullDescription && "border-destructive")} />
              {errors.fullDescription && <p className="text-destructive text-sm">{errors.fullDescription.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag">Product Tag (e.g., "New Arrival", "Best Seller")</Label>
                <Input id="tag" {...register("tag")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagVariant">Tag Style</Label>
                <Select onValueChange={(value) => setValue("tagVariant", value as "default" | "secondary" | "destructive" | "outline")} value={currentTagVariant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="newImageFiles">Upload Product Images (Max 5)</Label>
                <Input
                  id="newImageFiles"
                  type="file"
                  accept="image/*"
                  multiple // Allow multiple files
                  {...register("newImageFiles")}
                />
                <p className="text-xs text-muted-foreground">Upload up to 5 images. Only the first image will be used for preview.</p>
              </div>
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="h-24 w-24 rounded-md border flex items-center justify-center overflow-hidden bg-muted">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Image Preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="limitedStock-toggle"
                  checked={currentLimitedStock}
                  onCheckedChange={(checked) => setValue("limitedStock", checked)}
                />
                <Label htmlFor="limitedStock-toggle">Limited Stock: {currentLimitedStock ? "Yes" : "No"}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-status">Product Status</Label>
                <Select onValueChange={(value) => setValue("status", value as "active" | "inactive")} value={currentProductStatus}>
                  <SelectTrigger className={cn(errors.status && "border-destructive")}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-destructive text-sm">{errors.status.message}</p>}
              </div>
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
                  "Add Product"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Edit className="h-6 w-6 text-primary" /> Edit Product
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(handleAddOrUpdateProduct)} className="space-y-6 py-4">
            <input type="hidden" {...register("id")} /> {/* Hidden field for product ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" {...register("name")} className={cn(errors.name && "border-destructive")} />
                {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => setValue("category", value)} value={watch("category")}>
                  <SelectTrigger className={cn(errors.category && "border-destructive")}>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueCategories.filter(cat => cat !== "all").map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-destructive text-sm">{errors.category.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (for MOQ)</Label>
                <Input id="price" type="number" step="0.01" {...register("price")} className={cn(errors.price && "border-destructive")} />
                {errors.price && <p className="text-destructive text-sm">{errors.price.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price (Optional, for discount)</Label>
                <Input id="originalPrice" type="number" step="0.01" {...register("originalPrice")} className={cn(errors.originalPrice && "border-destructive")} />
                {errors.originalPrice && <p className="text-destructive text-sm">{errors.originalPrice.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderQuantity">Min Order Quantity</Label>
                <Input id="minOrderQuantity" type="number" {...register("minOrderQuantity")} className={cn(errors.minOrderQuantity && "border-destructive")} />
                {errors.minOrderQuantity && <p className="text-destructive text-sm">{errors.minOrderQuantity.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullDescription">Product Description</Label>
              <Textarea id="fullDescription" rows={4} {...register("fullDescription")} className={cn(errors.fullDescription && "border-destructive")} />
              {errors.fullDescription && <p className="text-destructive text-sm">{errors.fullDescription.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tag">Product Tag (e.g., "New Arrival", "Best Seller")</Label>
                <Input id="tag" {...register("tag")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tagVariant">Tag Style</Label>
                <Select onValueChange={(value) => setValue("tagVariant", value as "default" | "secondary" | "destructive" | "outline")} value={currentTagVariant}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select tag style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="secondary">Secondary</SelectItem>
                    <SelectItem value="destructive">Destructive</SelectItem>
                    <SelectItem value="outline">Outline</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              <div className="space-y-2">
                <Label htmlFor="newImageFiles">Upload New Product Images (Max 5)</Label>
                <Input
                  id="newImageFiles"
                  type="file"
                  accept="image/*"
                  multiple // Allow multiple files
                  {...register("newImageFiles")}
                />
                <p className="text-xs text-muted-foreground">Upload new images to replace existing ones. Only the first image will be used for preview.</p>
              </div>
              <div className="space-y-2">
                <Label>Image Preview</Label>
                <div className="h-24 w-24 rounded-md border flex items-center justify-center overflow-hidden bg-muted">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Image Preview" className="h-full w-full object-cover" />
                  ) : (
                    <ImageIcon className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="limitedStock-toggle-edit"
                  checked={currentLimitedStock}
                  onCheckedChange={(checked) => setValue("limitedStock", checked)}
                />
                <Label htmlFor="limitedStock-toggle-edit">Limited Stock: {currentLimitedStock ? "Yes" : "No"}</Label>
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-status-edit">Product Status</Label>
                <Select onValueChange={(value) => setValue("status", value as "active" | "inactive")} value={currentProductStatus}>
                  <SelectTrigger className={cn(errors.status && "border-destructive")}>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                {errors.status && <p className="text-destructive text-sm">{errors.status.message}</p>}
              </div>
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

export default ProductsManagement;
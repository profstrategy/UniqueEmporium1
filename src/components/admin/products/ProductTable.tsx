"use client";

import React from "react";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  // AlertDialogTrigger, // Removed AlertDialogTrigger import
} from "@/components/ui/alert-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Package,
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
} from "lucide-react";
import { ProductDetails } from "@/data/products.ts";
import { cn } from "@/lib/utils";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
import { AdminCategory } from "@/pages/admin/CategoriesManagement.tsx"; // Corrected import path

interface ProductTableProps {
  products: ProductDetails[];
  isLoadingProducts: boolean;
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  filterCategory: string;
  onFilterCategoryChange: (value: string) => void;
  filterStockStatus: string;
  onFilterStockStatusChange: (value: string) => void;
  filterProductStatus: string;
  onFilterProductStatusChange: (value: string) => void;
  availableCategories: AdminCategory[];
  onAddProduct: () => void;
  onEditProduct: (product: ProductDetails) => void;
  onDeleteProduct: (productId: string, productName: string) => void;
  currentPage: number;
  totalPages: number;
  goToFirstPage: () => void;
  goToPrevPage: () => void;
  goToNextPage: () => void;
  goToLastPage: () => void;
  totalFilteredProductsCount: number; // Added new prop
  productsPerPage: number; // Added new prop
}

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as Easing } },
};

const ProductTable = ({
  products,
  isLoadingProducts,
  searchTerm,
  onSearchChange,
  filterCategory,
  onFilterCategoryChange,
  filterStockStatus,
  onFilterStockStatusChange,
  filterProductStatus,
  onFilterProductStatusChange,
  availableCategories,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  currentPage,
  totalPages,
  goToFirstPage,
  goToPrevPage,
  goToNextPage,
  goToLastPage,
  totalFilteredProductsCount, // Destructure new prop
  productsPerPage, // Destructure new prop
}: ProductTableProps) => {
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('en-NG', { style: 'currency', currency: 'NGN' });
  };

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" /> All Products
        </CardTitle>
      </CardHeader>
      <CardContent className="min-w-0 p-0">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b p-4">
          <div className="relative flex-grow w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by Product Name or ID..."
              className="w-full pl-9"
              value={searchTerm}
              onChange={onSearchChange}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <Select value={filterCategory} onValueChange={onFilterCategoryChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterStockStatus} onValueChange={onFilterStockStatusChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Stock Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stock Statuses</SelectItem>
                <SelectItem value="in-stock">In Stock</SelectItem>
                <SelectItem value="limited-stock">Limited Stock</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterProductStatus} onValueChange={onFilterProductStatusChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Product Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Product Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={onAddProduct} className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4" /> Add Product
            </Button>
          </div>
        </div>

        {isLoadingProducts ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-3 text-muted-foreground">Loading products...</p>
          </div>
        ) : totalFilteredProductsCount === 0 ? ( /* Updated condition */
          <div className="text-center py-10 text-muted-foreground">
            <Filter className="h-12 w-12 mx-auto mb-4" />
            <p>No products found matching your filters.</p>
            <Button onClick={() => { onSearchChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>); onFilterCategoryChange("all"); onFilterStockStatusChange("all"); onFilterProductStatusChange("all"); }} className="mt-4">
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
                  {products.map((product) => (
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
                                <Button variant="outline" size="icon" onClick={() => onEditProduct(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit Product</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                {/* Removed AlertDialogTrigger here */}
                                <Button variant="outline" size="icon" onClick={() => onDeleteProduct(product.id, product.name)}>
                                  <Trash2 className="h-4 w-4 text-red-600" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Delete Product</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
        {totalFilteredProductsCount > 0 && ( /* Updated condition */
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * productsPerPage + 1} to {Math.min(currentPage * productsPerPage, totalFilteredProductsCount)} of {totalFilteredProductsCount} products
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
  );
};

export default ProductTable;
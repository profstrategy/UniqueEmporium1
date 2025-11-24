"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, Easing } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { Plus, Edit } from "lucide-react";
import { ProductDetails } from "@/data/products.ts";
import { useAdminProducts } from "@/hooks/useAdminProducts";
import ProductForm, { ProductFormData } from "@/components/admin/products/ProductForm.tsx";
import ProductTable from "@/components/admin/products/ProductTable.tsx";
import DeleteProductAlertDialog from "@/components/admin/products/DeleteProductAlertDialog.tsx";

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

const ProductsManagement = () => {
  const {
    products,
    isLoadingProducts,
    availableCategories,
    isLoadingCategories,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useAdminProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStockStatus, setFilterStockStatus] = useState("all");
  const [filterProductStatus, setFilterProductStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10; // Define productsPerPage here

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDetails | null>(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [deletingProductName, setDeletingProductName] = useState<string>("");

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

  const handleAddProductClick = () => {
    setEditingProduct(null); // Clear any previous editing state
    setIsAddModalOpen(true);
  };

  const handleEditProductClick = (product: ProductDetails) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleDeleteProductClick = (productId: string, productName: string) => {
    setDeletingProductId(productId);
    setDeletingProductName(productName);
    setIsDeleteAlertOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (deletingProductId) {
      await deleteProduct(deletingProductId);
      setIsDeleteAlertOpen(false);
      setDeletingProductId(null);
      setDeletingProductName("");
    }
  };

  const handleFormSubmit = async (data: ProductFormData, newFiles: File[]) => { // Updated signature
    let success = false;
    if (editingProduct) {
      success = await updateProduct(editingProduct.id, data, newFiles); // Pass newFiles
      if (success) setIsEditModalOpen(false);
    } else {
      success = await addProduct(data, newFiles); // Pass newFiles
      if (success) setIsAddModalOpen(false);
    }
  };

  return (
    <motion.div
      className="space-y-8"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.h1 className="text-2xl md:text-3xl font-bold text-foreground" variants={fadeInUp}>
        Products Management
      </motion.h1>
      <motion.p className="text-base md:text-lg text-muted-foreground" variants={fadeInUp}>
        Manage your product catalog, including adding, editing, and deleting items.
      </motion.p>

      <ProductTable
        products={currentProducts}
        isLoadingProducts={isLoadingProducts || isLoadingCategories}
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        filterCategory={filterCategory}
        onFilterCategoryChange={setFilterCategory}
        filterStockStatus={filterStockStatus}
        onFilterStockStatusChange={setFilterStockStatus}
        filterProductStatus={filterProductStatus}
        onFilterProductStatusChange={setFilterProductStatus}
        availableCategories={availableCategories}
        onAddProduct={handleAddProductClick}
        onEditProduct={handleEditProductClick}
        onDeleteProduct={handleDeleteProductClick}
        currentPage={currentPage}
        totalPages={totalPages}
        goToFirstPage={() => setCurrentPage(1)}
        goToPrevPage={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
        goToNextPage={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
        goToLastPage={() => setCurrentPage(totalPages)}
        totalFilteredProductsCount={filteredProducts.length} // Pass the total filtered count
        productsPerPage={productsPerPage} // Pass productsPerPage
      />

      {/* Add Product Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Plus className="h-6 w-6 text-primary" /> Add New Product
            </DialogTitle>
            <DialogDescription>
              Enter the details for a new product to add to your catalog.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={handleFormSubmit}
            onCancel={() => setIsAddModalOpen(false)}
            availableCategories={availableCategories}
            // isSubmitting prop removed
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[600px] p-6 rounded-xl shadow-lg bg-card/80 backdrop-blur-md border border-border/50 overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <Edit className="h-6 w-6 text-primary" /> Edit Product
            </DialogTitle>
            <DialogDescription>
              Update the details for this product.
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            initialData={editingProduct}
            onSubmit={handleFormSubmit}
            onCancel={() => setIsEditModalOpen(false)}
            availableCategories={availableCategories}
            // isSubmitting prop removed
          />
        </DialogContent>
      </Dialog>

      {/* Delete Product Confirmation Dialog */}
      <DeleteProductAlertDialog
        isOpen={isDeleteAlertOpen}
        onOpenChange={setIsDeleteAlertOpen}
        onConfirm={confirmDeleteProduct}
        productName={deletingProductName}
      />
    </motion.div>
  );
};

export default ProductsManagement;
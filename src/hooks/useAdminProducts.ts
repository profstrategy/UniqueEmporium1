"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductDetails } from "@/data/products.ts";
import { AdminCategory } from "@/pages/admin/CategoriesManagement.tsx";
import { ProductFormData } from "@/components/admin/products/ProductForm.tsx";
import { generateProductId } from "@/utils/id-generator"; // Import the async ID generator
import { uploadMultipleImages } from "@/integrations/cloudinary/uploader"; // NEW: Import Cloudinary uploader

interface UseAdminProductsResult {
  products: ProductDetails[];
  isLoadingProducts: boolean;
  availableCategories: AdminCategory[];
  isLoadingCategories: boolean;
  fetchProducts: () => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (data: ProductFormData, newFiles: File[]) => Promise<boolean>; // Updated signature
  updateProduct: (id: string, data: ProductFormData, newFiles: File[]) => Promise<boolean>; // Updated signature
  deleteProduct: (id: string) => Promise<boolean>;
}

export const useAdminProducts = (): UseAdminProductsResult => {
  const [products, setProducts] = useState<ProductDetails[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [availableCategories, setAvailableCategories] = useState<AdminCategory[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  const fetchProducts = useCallback(async () => {
    setIsLoadingProducts(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products.", { description: error.message });
      setProducts([]);
    } else {
      const fetchedProducts: ProductDetails[] = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        images: p.images || [],
        price: p.price,
        originalPrice: p.original_price,
        discountPercentage: p.discount_percentage,
        rating: p.rating,
        reviewCount: p.review_count,
        tag: p.tag,
        tagVariant: p.tag_variant,
        limitedStock: p.limited_stock,
        isFeatured: p.is_featured, // New: Map is_featured
        minOrderQuantity: p.min_order_quantity,
        status: p.status,
        shortDescription: p.short_description,
        fullDescription: p.full_description,
        keyFeatures: (p.key_features || []).map((feature: string) => ({ value: feature })),
        styleNotes: p.style_notes || "",
        detailedSpecs: p.detailed_specs || [],
        reviews: p.reviews || [],
        relatedProducts: p.related_products || [],
        unitType: p.unit_type || 'pcs', // NEW: Map unit_type, default to 'pcs'
      }));
      setProducts(fetchedProducts);
    }
    setIsLoadingProducts(false);
  }, []);

  const fetchCategories = useCallback(async () => {
    setIsLoadingCategories(true);
    const { data, error } = await supabase.from('categories').select('id, name').order('name', { ascending: true });
    if (error) {
      console.error("Error fetching categories for product form:", error);
      toast.error("Failed to load categories for product form.");
      setAvailableCategories([]);
    } else {
      setAvailableCategories(data as AdminCategory[]);
    }
    setIsLoadingCategories(false);
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // NOTE: Removed the internal uploadImages function as it is replaced by Cloudinary uploader

  const addProduct = useCallback(async (data: ProductFormData, newFiles: File[]): Promise<boolean> => {
    const newProductId = await generateProductId(data.category);
    let imageUrls: string[] = [];

    // Upload new images to Cloudinary
    if (newFiles.length > 0) {
      try {
        imageUrls = await uploadMultipleImages(newFiles);
      } catch (e) {
        // Error handled and toasted inside uploadMultipleImages
        return false;
      }
      
      if (imageUrls.length === 0 && newFiles.length > 0) {
        toast.error("Failed to upload product images. Product not added.");
        return false;
      }
    }

    let discountPercentage: number | undefined;
    if (data.originalPrice && data.price < data.originalPrice) {
      discountPercentage = Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);
    }

    const productPayload = {
      id: newProductId,
      name: data.name,
      category: data.category,
      unit_type: data.unitType,
      price: data.price,
      original_price: data.originalPrice,
      discount_percentage: discountPercentage,
      min_order_quantity: data.minOrderQuantity,
      status: data.status,
      limited_stock: data.limitedStock,
      is_featured: data.isFeatured,
      short_description: data.shortDescription,
      full_description: data.fullDescription,
      images: imageUrls, // Store Cloudinary URLs
      tag: data.tag,
      tag_variant: data.tagVariant,
      rating: data.rating,
      review_count: data.reviewCount,
      style_notes: data.styleNotes,
      key_features: data.keyFeatures.map(f => f.value),
      detailed_specs: data.detailedSpecs,
      reviews: data.reviews,
      related_products: data.relatedProducts,
    };

    const { error } = await supabase.from('products').insert([productPayload]);

    if (error) {
      toast.error("Failed to add product.", { description: error.message });
      return false;
    } else {
      toast.success(`Product "${data.name}" added successfully!`);
      fetchProducts();
      return true;
    }
  }, [fetchProducts]);

  const updateProduct = useCallback(async (id: string, data: ProductFormData, newFiles: File[]): Promise<boolean> => {
    // NOTE: Since we are using Cloudinary, we no longer need to delete images from Supabase Storage.
    // Cloudinary handles image deletion via its API if needed, but for simplicity here, 
    // we only focus on uploading new images and updating the URL list in Supabase.
    
    let finalImageUrls: string[] = data.images || []; // Retained existing URLs

    // 1. Upload new images to Cloudinary
    let newlyUploadedUrls: string[] = [];
    if (newFiles.length > 0) {
      try {
        newlyUploadedUrls = await uploadMultipleImages(newFiles);
      } catch (e) {
        // Error handled and toasted inside uploadMultipleImages
        return false;
      }
      if (newlyUploadedUrls.length === 0 && newFiles.length > 0) {
        toast.error("Failed to upload new product images. Product update may be incomplete.");
      }
    }

    // 2. Combine retained existing URLs and newly uploaded URLs for the final list
    finalImageUrls = finalImageUrls.concat(newlyUploadedUrls);

    let discountPercentage: number | undefined;
    if (data.originalPrice && data.price < data.originalPrice) {
      discountPercentage = Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);
    }

    const productPayload = {
      name: data.name,
      category: data.category,
      unit_type: data.unitType,
      price: data.price,
      original_price: data.originalPrice,
      discount_percentage: discountPercentage,
      min_order_quantity: data.minOrderQuantity,
      status: data.status,
      limited_stock: data.limitedStock,
      is_featured: data.isFeatured,
      short_description: data.shortDescription,
      full_description: data.fullDescription,
      images: finalImageUrls, // The final list of image URLs (Cloudinary URLs)
      tag: data.tag,
      tag_variant: data.tagVariant,
      rating: data.rating,
      review_count: data.reviewCount,
      style_notes: data.styleNotes,
      key_features: data.keyFeatures.map(f => f.value),
      detailed_specs: data.detailedSpecs,
      reviews: data.reviews,
      related_products: data.relatedProducts,
    };

    const { error } = await supabase
      .from('products')
      .update(productPayload)
      .eq('id', id);

    if (error) {
      toast.error("Failed to update product.", { description: error.message });
      return false;
    } else {
      toast.success(`Product "${data.name}" updated successfully!`);
      fetchProducts();
      return true;
    }
  }, [fetchProducts]);

  // NOTE: The deleteProduct function is simplified as we no longer delete from Supabase Storage.
  // If Cloudinary deletion is required, it would need a server-side function call.
  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    // We skip Cloudinary deletion here for simplicity, assuming images can remain on Cloudinary
    // or will be cleaned up manually/via a separate process.

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete product.", { description: error.message });
      return false;
    } else {
      toast.info(`Product ${id} deleted.`);
      fetchProducts();
      return true;
    }
  }, [fetchProducts]);

  return {
    products,
    isLoadingProducts,
    availableCategories,
    isLoadingCategories,
    fetchProducts,
    fetchCategories,
    addProduct,
    updateProduct,
    deleteProduct,
  };
};
"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ProductDetails } from "@/data/products.ts";
import { AdminCategory } from "@/pages/admin/CategoriesManagement.tsx";
import { ProductFormData } from "@/components/admin/products/ProductForm.tsx";

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
        minOrderQuantity: p.min_order_quantity,
        status: p.status,
        shortDescription: p.short_description,
        fullDescription: p.full_description,
        keyFeatures: (p.key_features || []).map((feature: string) => ({ value: feature })),
        styleNotes: p.style_notes || "",
        detailedSpecs: p.detailed_specs || [],
        reviews: p.reviews || [],
        relatedProducts: p.related_products || [],
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

  const uploadImages = async (files: File[], productId: string): Promise<string[]> => { // Changed FileList to File[]
    if (files.length === 0) return [];

    const uploadPromises = files.map(async (file) => {
      const fileExtension = file.name.split('.').pop();
      const filePath = `products/${productId}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product_images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error(`Error uploading image ${file.name}:`, uploadError);
        toast.error(`Failed to upload image: ${file.name}.`, { description: uploadError.message });
        return null;
      } else {
        const { data: publicUrlData } = supabase.storage.from('product_images').getPublicUrl(uploadData.path);
        return publicUrlData.publicUrl;
      }
    });

    const results = await Promise.all(uploadPromises);
    return results.filter(url => url !== null) as string[];
  };

  const getFilePathFromUrl = (url: string): string | null => {
    // Assuming Supabase public URL format: https://<project_id>.supabase.co/storage/v1/object/public/<bucket_name>/<path_to_file>
    const urlParts = url.split('/storage/v1/object/public/product_images/');
    return urlParts.length > 1 ? urlParts[1] : null;
  };

  const addProduct = useCallback(async (data: ProductFormData, newFiles: File[]): Promise<boolean> => { // Updated signature
    const newProductId = `prod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    let imageUrls: string[] = [];

    // Upload new images
    if (newFiles.length > 0) {
      imageUrls = await uploadImages(newFiles, newProductId);
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
      price: data.price,
      original_price: data.originalPrice,
      discount_percentage: discountPercentage,
      min_order_quantity: data.minOrderQuantity,
      status: data.status,
      limited_stock: data.limitedStock,
      short_description: data.shortDescription,
      full_description: data.fullDescription,
      images: imageUrls, // Store all newly uploaded image URLs
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

  const updateProduct = useCallback(async (id: string, data: ProductFormData, newFiles: File[]): Promise<boolean> => { // Updated signature
    const originalProduct = products.find(p => p.id === id);
    if (!originalProduct) {
      toast.error("Original product not found for update.");
      return false;
    }

    let finalImageUrls: string[] = data.images || []; // This now contains the *desired* set of existing image URLs from the form

    // 1. Identify images to delete from storage
    const imagesToDeleteFromStorage: string[] = [];
    originalProduct.images.forEach(originalUrl => {
      if (!finalImageUrls.includes(originalUrl)) { // If an original URL is NOT in the final list, it means it was removed
        const filePath = getFilePathFromUrl(originalUrl);
        if (filePath) imagesToDeleteFromStorage.push(filePath);
      }
    });

    if (imagesToDeleteFromStorage.length > 0) {
      const { error: deleteStorageError } = await supabase.storage
        .from('product_images')
        .remove(imagesToDeleteFromStorage);

      if (deleteStorageError) {
        console.error("Error deleting old product images from storage:", deleteStorageError);
        toast.error("Failed to delete some old product images from storage.", { description: deleteStorageError.message });
      } else {
        toast.info("Old product images removed from storage.");
      }
    }

    // 2. Upload new images
    let newlyUploadedUrls: string[] = [];
    if (newFiles.length > 0) { // Use newFiles here
      newlyUploadedUrls = await uploadImages(newFiles, id);
      if (newlyUploadedUrls.length === 0 && newFiles.length > 0) {
        toast.error("Failed to upload new product images. Product update may be incomplete.");
      }
    }

    // 3. Combine retained existing URLs and newly uploaded URLs for the final list
    finalImageUrls = finalImageUrls.concat(newlyUploadedUrls);

    let discountPercentage: number | undefined;
    if (data.originalPrice && data.price < data.originalPrice) {
      discountPercentage = Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100);
    }

    const productPayload = {
      name: data.name,
      category: data.category,
      price: data.price,
      original_price: data.originalPrice,
      discount_percentage: discountPercentage,
      min_order_quantity: data.minOrderQuantity,
      status: data.status,
      limited_stock: data.limitedStock,
      short_description: data.shortDescription,
      full_description: data.fullDescription,
      images: finalImageUrls, // This is the crucial part: the final list of image URLs
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
  }, [products, fetchProducts]);

  const deleteProduct = useCallback(async (id: string): Promise<boolean> => {
    const productToDelete = products.find(p => p.id === id);
    if (productToDelete && productToDelete.images && productToDelete.images.length > 0) {
      const filePathsToDelete = productToDelete.images.map(url => getFilePathFromUrl(url)).filter(path => path !== null) as string[];

      if (filePathsToDelete.length > 0) {
        const { error: deleteStorageError } = await supabase.storage
          .from('product_images')
          .remove(filePathsToDelete);

        if (deleteStorageError) {
          console.error("Error deleting product images from storage:", deleteStorageError);
          toast.error("Failed to delete some product images from storage.", { description: deleteStorageError.message });
        } else {
          toast.info("Product images deleted from storage.");
        }
      }
    }

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
  }, [products, fetchProducts]);

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
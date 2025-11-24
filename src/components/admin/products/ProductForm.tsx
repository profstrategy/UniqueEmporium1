"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useForm, useFieldArray, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Loader2, PlusCircle, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import ImageUploadPreview from "./ImageUploadPreview.tsx";
import NestedDetailedSpecs from "./NestedDetailedSpecs.tsx";
import { AdminCategory } from "@/pages/admin/CategoriesManagement.tsx";

// Zod Schema for Product Form
export const productFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Product Name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.coerce.number().min(1, "Price is required and must be positive"),
  originalPrice: z.coerce.number().optional().refine((val) => val === undefined || val > 0, "Original Price must be positive if provided"),
  minOrderQuantity: z.coerce.number().min(1, "Minimum Order Quantity is required and must be positive"),
  status: z.enum(["active", "inactive"]).default("active"),
  limitedStock: z.boolean().default(false),
  shortDescription: z.string().max(500, "Concise description cannot exceed 500 characters.").optional(),
  fullDescription: z.string().min(1, "Full Description is required"),
  images: z.array(z.string()).optional(), // Existing image URLs (from DB)
  // newImageFiles is handled separately as FileList is not directly validated by Zod for file content
  tag: z.string().optional(),
  tagVariant: z.enum(["default", "secondary", "destructive", "outline"]).optional(),
  rating: z.coerce.number().min(0).max(5).default(4.5),
  reviewCount: z.coerce.number().min(0).default(0),
  styleNotes: z.string().optional(),
  keyFeatures: z.array(z.object({ value: z.string().min(1, "Feature cannot be empty") })),
  detailedSpecs: z.array(z.object({
    group: z.string().min(1, "Group name is required"),
    items: z.array(z.object({
      label: z.string().min(1, "Label is required"),
      value: z.string().min(1, "Value is required"),
      icon: z.string().optional(),
    })),
  })),
  reviews: z.array(z.any()).optional(),
  relatedProducts: z.array(z.string()).optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  initialData?: ProductFormData | null;
  onSubmit: (data: ProductFormData, newFiles: File[]) => Promise<void>; // Modified onSubmit signature
  onCancel: () => void;
  availableCategories: AdminCategory[];
  // Removed isSubmitting prop, as it's managed internally by react-hook-form
}

const ProductForm = ({
  initialData,
  onSubmit,
  onCancel,
  availableCategories,
}: ProductFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors, isSubmitting }, // Destructure isSubmitting from formState
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData ? {
      ...initialData,
      keyFeatures: initialData.keyFeatures || [],
      detailedSpecs: initialData.detailedSpecs || [],
      images: initialData.images || [], // Ensure images array is initialized
    } : {
      status: "active",
      limitedStock: false,
      rating: 4.5,
      reviewCount: 0,
      keyFeatures: [],
      reviews: [],
      relatedProducts: [],
      tag: "",
      tagVariant: "default",
      images: [], // Initialize empty array for existing images
      shortDescription: "",
      fullDescription: "",
      styleNotes: "",
      detailedSpecs: [],
    },
  });

  const { fields: keyFeaturesFields, append: appendKeyFeature, remove: removeKeyFeature } = useFieldArray<ProductFormData, "keyFeatures">({
    control: control,
    name: "keyFeatures",
  });

  const { fields: detailedSpecsGroups, append: appendDetailedSpecGroup, remove: removeDetailedSpecGroup } = useFieldArray<ProductFormData, "detailedSpecs">({
    control: control,
    name: "detailedSpecs",
  });

  const currentLimitedStock = watch("limitedStock");
  const currentProductStatus = watch("status");
  const currentTagVariant = watch("tagVariant");
  const currentExistingImageUrls = watch("images") || []; // Watch the 'images' field for existing URLs

  const [newlySelectedFiles, setNewlySelectedFiles] = useState<File[]>([]); // State to hold actual File objects

  // Effect to initialize existing image URLs from initialData
  useEffect(() => {
    if (initialData?.images) {
      setValue("images", initialData.images);
    } else {
      setValue("images", []);
    }
    setNewlySelectedFiles([]); // Clear new files on initial load/reset
  }, [initialData, setValue]);

  // Callback to handle new file selections from ImageUploadPreview
  const handleFilesSelected = useCallback((files: FileList | null) => {
    if (files) {
      setNewlySelectedFiles(prev => [...prev, ...Array.from(files)]);
    }
  }, []);

  // Callback to remove an existing image (from DB)
  const handleRemoveExistingImage = useCallback((urlToRemove: string) => {
    setValue("images", currentExistingImageUrls.filter(url => url !== urlToRemove));
  }, [currentExistingImageUrls, setValue]);

  // Callback to remove a newly selected file (before upload)
  const handleRemoveNewFile = useCallback((indexToRemove: number) => {
    setNewlySelectedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  // Override the default handleSubmit to include the newlySelectedFiles
  const onSubmitHandler = async (data: ProductFormData) => {
    await onSubmit(data, newlySelectedFiles);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="space-y-6 py-4">
      <input type="hidden" {...register("id")} />
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
              {availableCategories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
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
        <Label htmlFor="shortDescription">Concise Description (Max 500 chars)</Label>
        <Textarea id="shortDescription" rows={2} {...register("shortDescription")} className={cn(errors.shortDescription && "border-destructive")} />
        {errors.shortDescription && <p className="text-destructive text-sm">{errors.shortDescription.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="fullDescription">Full Product Description</Label>
        <Textarea id="fullDescription" rows={4} {...register("fullDescription")} className={cn(errors.fullDescription && "border-destructive")} />
        {errors.fullDescription && <p className="text-destructive text-sm">{errors.fullDescription.message}</p>}
      </div>

      <div className="space-y-2 border p-4 rounded-md">
        <div className="flex items-center justify-between">
          <Label className="text-base">Key Features</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => appendKeyFeature({ value: "" })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Feature
          </Button>
        </div>
        {keyFeaturesFields.map((field, index) => (
          <div key={field.id} className="flex items-center space-x-2">
            <Input
              {...register(`keyFeatures.${index}.value` as const)}
              placeholder="e.g., High-quality fabric"
              className={cn(errors.keyFeatures?.[index]?.value && "border-destructive")}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeKeyFeature(index)}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
        {errors.keyFeatures && <p className="text-destructive text-sm">{errors.keyFeatures.message}</p>}
      </div>

      <div className="space-y-4 border p-4 rounded-md">
        <div className="flex items-center justify-between">
          <Label className="text-base">Detailed Specifications</Label>
          <Button type="button" variant="outline" size="sm" onClick={() => appendDetailedSpecGroup({ group: "", items: [{ label: "", value: "" }] })}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add Spec Group
          </Button>
        </div>
        {detailedSpecsGroups.map((groupField, groupIndex) => (
          <Card key={groupField.id} className="p-4 space-y-3 border-l-2 border-primary/50">
            <div className="flex items-center space-x-2">
              <Input
                {...register(`detailedSpecs.${groupIndex}.group` as const)}
                placeholder="Group Name (e.g., Material, Dimensions)"
                className={cn(errors.detailedSpecs?.[groupIndex]?.group && "border-destructive")}
              />
              <Button type="button" variant="ghost" size="icon" onClick={() => removeDetailedSpecGroup(groupIndex)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
            {errors.detailedSpecs?.[groupIndex]?.group && <p className="text-destructive text-sm">{errors.detailedSpecs?.[groupIndex]?.group?.message}</p>}

            <div className="space-y-2 pl-4 border-l border-border">
              <Label className="text-sm">Items in Group</Label>
              <NestedDetailedSpecs control={control} name={`detailedSpecs.${groupIndex}.items`} errors={errors} />
            </div>
          </Card>
        ))}
        {errors.detailedSpecs && <p className="text-destructive text-sm">{errors.detailedSpecs.message}</p>}
      </div>

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

      <ImageUploadPreview
        register={register}
        existingImageUrls={currentExistingImageUrls}
        newlySelectedFiles={newlySelectedFiles}
        onRemoveExistingImage={handleRemoveExistingImage}
        onRemoveNewFile={handleRemoveNewFile}
        onFilesSelected={handleFilesSelected}
        errors={errors}
        label="Upload Product Images (Max 5)"
        description="Add new images or remove existing ones. New uploads will be added to the current set."
      />

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

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}> {/* Use isSubmitting here */}
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
            </>
          ) : (
            initialData ? "Save Changes" : "Add Product"
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProductForm;
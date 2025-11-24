"use client";

import React, { ChangeEvent, useCallback } from "react"; // Added useCallback
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, XCircle, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadPreviewProps {
  register: any; // from react-hook-form
  existingImageUrls: string[]; // Existing image URLs from DB
  newlySelectedFiles: File[]; // Newly selected File objects
  onRemoveExistingImage: (url: string) => void; // Callback to remove an existing image
  onRemoveNewFile: (index: number) => void; // Callback to remove a newly selected file
  onFilesSelected: (files: FileList | null) => void; // Callback to handle new file input
  errors: any; // from react-hook-form
  label: string;
  description: string;
}

const ImageUploadPreview = ({
  register,
  existingImageUrls,
  newlySelectedFiles,
  onRemoveExistingImage,
  onRemoveNewFile,
  onFilesSelected,
  errors,
  label,
  description,
}: ImageUploadPreviewProps) => {

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onFilesSelected(e.target.files);
    // Clear the input's value to allow re-selecting the same file(s)
    e.target.value = '';
  }, [onFilesSelected]);

  const allPreviewUrls = [
    ...existingImageUrls,
    ...newlySelectedFiles.map(file => URL.createObjectURL(file))
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        <Label htmlFor="newImageFiles" className="text-base">{label}</Label>
        <p className="text-xs text-muted-foreground">{description}</p>
        {errors.newImageFiles && <p className="text-destructive text-sm">{errors.newImageFiles.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Image Previews</Label>
        <div className="flex flex-wrap gap-2">
          {allPreviewUrls.length > 0 ? (
            allPreviewUrls.map((url, index) => (
              <div key={url} className="relative h-24 w-24 rounded-md border flex items-center justify-center overflow-hidden bg-muted">
                <img src={url} alt={`Image Preview ${index + 1}`} className="h-full w-full object-cover" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background/80 text-destructive hover:bg-background"
                  onClick={() => {
                    if (index < existingImageUrls.length) {
                      onRemoveExistingImage(url);
                    } else {
                      onRemoveNewFile(index - existingImageUrls.length);
                    }
                  }}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : null}
          {/* Always show the clickable "+" button to add images */}
          <Label
            htmlFor="newImageFilesInput" // Changed ID to avoid conflict with register
            className="h-24 w-24 rounded-md border border-dashed flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <PlusCircle className="h-8 w-8" />
            <span className="text-sm mt-1">Add Image</span>
            <Input
              id="newImageFilesInput" // Changed ID
              type="file"
              accept="image/*"
              multiple
              {...register("newImageFiles")} // Keep register for validation, but handle change manually
              onChange={handleFileChange} // Use custom handler
              className="hidden" // Visually hide the input
            />
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPreview;
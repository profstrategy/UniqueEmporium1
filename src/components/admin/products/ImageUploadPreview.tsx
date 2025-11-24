"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, XCircle, PlusCircle } from "lucide-react"; // Added PlusCircle icon
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadPreviewProps {
  register: any; // from react-hook-form
  imagePreviewUrls: string[]; // Array of all image URLs (existing + new)
  onRemoveImage: (url: string) => void; // Callback to remove an image
  errors: any; // from react-hook-form
  label: string;
  description: string;
}

const ImageUploadPreview = ({
  register,
  imagePreviewUrls,
  onRemoveImage,
  errors,
  label,
  description,
}: ImageUploadPreviewProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="space-y-2">
        {/* The actual file input is hidden, but still functional via the Label */}
        <Label htmlFor="newImageFiles" className="sr-only">{label}</Label>
        <Input
          id="newImageFiles"
          type="file"
          accept="image/*"
          multiple
          {...register("newImageFiles")}
          className="hidden" // Visually hide the input
        />
        <p className="text-xs text-muted-foreground">{description}</p>
        {errors.newImageFiles && <p className="text-destructive text-sm">{errors.newImageFiles.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Image Previews</Label>
        <div className="flex flex-wrap gap-2">
          {imagePreviewUrls.length > 0 ? (
            imagePreviewUrls.map((url, index) => (
              <div key={url} className="relative h-24 w-24 rounded-md border flex items-center justify-center overflow-hidden bg-muted">
                <img src={url} alt={`Image Preview ${index + 1}`} className="h-full w-full object-cover" />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute -right-2 -top-2 h-6 w-6 rounded-full bg-background/80 text-destructive hover:bg-background"
                  onClick={() => onRemoveImage(url)}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            // This block is now removed as the "Add Image" button is always present
            null
          )}
          {/* Always show the clickable "+" button to add images */}
          <Label
            htmlFor="newImageFiles"
            className="h-24 w-24 rounded-md border border-dashed flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:border-primary hover:text-primary transition-colors"
          >
            <PlusCircle className="h-8 w-8" />
            <span className="text-sm mt-1">Add Image</span>
          </Label>
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPreview;
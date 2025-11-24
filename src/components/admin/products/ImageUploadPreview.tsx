"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, XCircle } from "lucide-react"; // Added XCircle icon
import { Button } from "@/components/ui/button"; // Import Button
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      <div className="space-y-2">
        <Label htmlFor="newImageFiles">{label}</Label>
        <Input
          id="newImageFiles"
          type="file"
          accept="image/*"
          multiple
          {...register("newImageFiles")}
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
            <div className="h-24 w-24 rounded-md border flex items-center justify-center overflow-hidden bg-muted">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPreview;
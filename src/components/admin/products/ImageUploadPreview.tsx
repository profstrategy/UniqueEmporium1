"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx";
import { cn } from "@/lib/utils";

interface ImageUploadPreviewProps {
  register: any; // from react-hook-form
  imagePreviewUrl: string | null;
  errors: any; // from react-hook-form
  label: string;
  description: string;
}

const ImageUploadPreview = ({
  register,
  imagePreviewUrl,
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
        <Label>Image Preview</Label>
        <div className="h-24 w-24 rounded-md border flex items-center justify-center overflow-hidden bg-muted">
          {imagePreviewUrl ? (
            <img src={imagePreviewUrl} alt="Image Preview" className="h-full w-full object-cover" />
          ) : (
            <ImageIcon className="h-10 w-10 text-muted-foreground" />
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploadPreview;
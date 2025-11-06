"use client";

import React, { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const initialImage = images && images.length > 0 ? images[0] : '';
  const [selectedImage, setSelectedImage] = useState(initialImage);

  if (!images || images.length === 0) {
    return <div className="text-center py-10 text-gray-500">No images available for this product.</div>;
  }

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail Selector (Left/Bottom) */}
      <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto p-1 md:p-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 cursor-pointer rounded-md overflow-hidden border-2 transition-all duration-200",
              selectedImage === image ? "border-primary ring-2 ring-primary/50" : "border-gray-200 hover:border-gray-400"
            )}
            onClick={() => setSelectedImage(image)}
          >
            <img
              src={image}
              alt={`${productName} thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Main Image Display with Zoom Dialog */}
      <div className="flex-1 min-h-[300px] md:min-h-[500px]">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative aspect-square cursor-pointer overflow-hidden rounded-lg shadow-xl group">
              <img
                src={selectedImage}
                alt={`${productName} - Main View`}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Zoom Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
                <ZoomIn className="h-10 w-10 text-white" />
              </div>
            </div>
          </DialogTrigger>
          
          {/* Dialog Content for Zoomed Image */}
          <DialogContent className="max-w-full w-[95vw] h-[95vh] md:max-w-6xl p-0 border-none bg-transparent shadow-none flex items-center justify-center">
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={selectedImage}
                alt={`${productName} - Zoomed View`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ProductImageGallery;
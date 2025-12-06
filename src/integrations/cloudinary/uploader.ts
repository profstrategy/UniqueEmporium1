"use client";

import { toast } from "sonner";
// Removed: getOptimizedImageUrl import is no longer needed here

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUD_UPLOAD_PRESET;

if (!CLOUD_NAME || !UPLOAD_PRESET) {
  console.error("Cloudinary environment variables are not set.");
}

/**
 * Uploads a single File object directly to Cloudinary using an unsigned upload preset.
 * @param file The File object to upload.
 * @returns The secure URL of the uploaded image.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error("Cloudinary configuration missing.");
  }

  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET);
  formData.append('cloud_name', CLOUD_NAME);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Cloudinary upload failed:", errorData);
      throw new Error(errorData.error?.message || `Cloudinary upload failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error during Cloudinary upload:", error);
    throw new Error(`Image upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Uploads multiple File objects concurrently to Cloudinary.
 * @param files An array of File objects.
 * @returns A promise that resolves to an array of secure URLs.
 */
export async function uploadMultipleImages(files: File[]): Promise<string[]> {
  if (files.length === 0) {
    return [];
  }

  const uploadPromises = files.map(file => uploadToCloudinary(file));

  try {
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    // If any upload fails, Promise.all rejects.
    toast.error("One or more images failed to upload.", {
      description: error instanceof Error ? error.message : 'Please check file types and try again.',
    });
    throw error; // Re-throw the error to be handled by the calling component (e.g., ProductForm)
  }
}

/**
 * Uploads a single image file and returns the secure URL.
 * @param file The File object to upload.
 * @returns The secure URL of the uploaded image.
 */
export async function uploadSingleImage(file: File): Promise<string> {
  return uploadToCloudinary(file);
}
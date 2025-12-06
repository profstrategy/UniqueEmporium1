import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Helper function to apply Cloudinary transformations for optimization.
 * @param url The original image URL.
 * @param type The type of image (main, thumbnail, category) to apply specific transformations.
 * @returns The optimized Cloudinary URL.
 */
export const getOptimizedImageUrl = (url: string | undefined, type: 'main' | 'thumbnail' | 'category' = 'main'): string | undefined => {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return original URL if it's not a Cloudinary URL or is undefined
  }
  
  // Split the URL at '/upload/' and insert the transformation parameters
  const parts = url.split('/upload/');
  if (parts.length < 2) {
    return url;
  }
  
  let transformation = '';

  switch (type) {
    case 'main':
      // Responsive, max 800x800, rounded corners (r_20), limited crop (c_limit)
      transformation = 'f_auto,q_auto,w_auto,c_limit,w_800,h_800,r_20/';
      break;
    case 'thumbnail':
      // Fixed size fill, max 200x200, rounded corners (r_20), fill crop (c_fill)
      transformation = 'f_auto,q_auto,c_fill,w_200,h_200,r_20/';
      break;
    case 'category':
      // Fixed size fill, max 200x200, circular (r_max)
      transformation = 'f_auto,q_auto,c_fill,w_200,h_200,r_max/';
      break;
    default:
      // Default safe transformation
      transformation = 'f_auto,q_auto,w_auto,c_limit/';
      break;
  }

  return parts[0] + '/upload/' + transformation + parts[1];
};
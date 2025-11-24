import { Shirt, Baby, Gem, Ruler, Palette, Tag, ShieldCheck, Star, Heart, ShoppingBag, Sun, Watch, Glasses } from "lucide-react";
import { fetchProductsFromSupabase, fetchProductByIdFromSupabase } from "@/integrations/supabase/products";

export interface Product {
  id: string;
  name: string;
  category: string;
  images: string[];
  price: number; // This is the price for the MOQ
  originalPrice?: number; // This is also the original price for the MOQ
  discountPercentage?: number;
  rating: number;
  reviewCount: number;
  tag?: string;
  tagVariant?: "default" | "secondary" | "destructive" | "outline";
  limitedStock?: boolean;
  minOrderQuantity: number; // Added minOrderQuantity
  status: "active" | "inactive"; // Added status field
}

export interface ProductDetails extends Product {
  shortDescription?: string; // Fix 3: Added shortDescription
  fullDescription: string;
  keyFeatures: { value: string }[]; // Changed to array of objects
  styleNotes: string; // New field for fashion styling tips
  detailedSpecs: {
    group: string;
    items: { label: string; value: string; icon?: string }[]; // Fix 2: Changed icon type to string
  }[];
  reviews: {
    id: string;
    author: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
    isVerifiedBuyer: boolean;
  }[];
  relatedProducts: string[];
}

// mockProducts is now an empty array as data will be fetched from Supabase
export const mockProducts: ProductDetails[] = [];

export const getProductById = async (id: string): Promise<ProductDetails | undefined> => {
  return await fetchProductByIdFromSupabase(id) || undefined;
};

export const getProductsByIds = async (ids: string[]): Promise<ProductDetails[]> => {
  const products: ProductDetails[] = [];
  for (const id of ids) {
    const product = await fetchProductByIdFromSupabase(id);
    if (product) {
      products.push(product);
    }
  }
  return products;
};

// Helper to get a few random products for recommendations
export const getRandomProducts = async (count: number, excludeId?: string): Promise<Product[]> => {
  const allLiveProducts = await fetchProductsFromSupabase();
  const filteredProducts = excludeId ? allLiveProducts.filter(p => p.id !== excludeId) : allLiveProducts;
  const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    images: p.images,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercentage: p.discountPercentage,
    rating: p.rating,
    reviewCount: p.reviewCount,
    tag: p.tag,
    tagVariant: p.tagVariant,
    limitedStock: p.limitedStock,
    minOrderQuantity: p.minOrderQuantity,
    status: p.status,
  }));
};

// Helper to get products for "Recently Viewed" (now uses actual IDs)
export const getRecentlyViewedProducts = async (recentlyViewedIds: string[], currentProductId?: string): Promise<Product[]> => {
  const filteredIds = currentProductId ? recentlyViewedIds.filter(id => id !== currentProductId) : recentlyViewedIds;
  const products = await getProductsByIds(filteredIds);
  return products;
};
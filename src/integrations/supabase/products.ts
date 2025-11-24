import { supabase } from "./client";
import { ProductDetails } from "@/data/products"; // Re-use your existing ProductDetails interface

export async function fetchProductsFromSupabase(): Promise<ProductDetails[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'active') // Only fetch active products for public display
    .order('created_at', { ascending: false }); // Order by creation date, newest first

  if (error) {
    console.error("Error fetching products from Supabase:", error);
    return [];
  }

  // Map snake_case from DB to camelCase for ProductDetails interface
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
    fullDescription: p.full_description,
    keyFeatures: (p.key_features || []).map((feature: string) => ({ value: feature })), // Map to new structure
    styleNotes: p.style_notes || "",
    detailedSpecs: p.detailed_specs || [],
    reviews: p.reviews || [],
    relatedProducts: p.related_products || [],
  }));

  return fetchedProducts;
}

export async function fetchProductByIdFromSupabase(id: string): Promise<ProductDetails | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('status', 'active') // Only fetch active products
    .single();

  if (error) {
    console.error(`Error fetching product ${id} from Supabase:`, error);
    return null;
  }

  if (!data) return null;

  // Map snake_case from DB to camelCase for ProductDetails interface
  const fetchedProduct: ProductDetails = {
    id: data.id,
    name: data.name,
    category: data.category,
    images: data.images || [],
    price: data.price,
    originalPrice: data.original_price,
    discountPercentage: data.discount_percentage,
    rating: data.rating,
    reviewCount: data.review_count,
    tag: data.tag,
    tagVariant: data.tag_variant,
    limitedStock: data.limited_stock,
    minOrderQuantity: data.min_order_quantity,
    status: data.status,
    fullDescription: data.full_description,
    keyFeatures: (data.key_features || []).map((feature: string) => ({ value: feature })), // Map to new structure
    styleNotes: data.style_notes || "",
    detailedSpecs: data.detailed_specs || [],
    reviews: data.reviews || [],
    relatedProducts: data.related_products || [],
  };

  return fetchedProduct;
}
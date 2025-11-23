import { supabase } from "./client";

export interface PublicCategory {
  id: string;
  name: string;
  image_url: string | null;
}

export async function fetchActiveCategories(): Promise<PublicCategory[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, image_url')
    .eq('status', 'active')
    .order('name', { ascending: true });

  if (error) {
    console.error("Error fetching active categories:", error);
    return [];
  }

  return data as PublicCategory[];
}
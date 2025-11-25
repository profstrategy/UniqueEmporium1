"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Category {
  id: string;
  name: string;
  product_count: number;
  status: string;
  created_at?: string;
  updated_at?: string;
  image_url?: string; // Added image_url
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, product_count, image_url') // Fetch image_url
      .eq('status', 'active') // Only fetch active categories
      .order('name', { ascending: true });

    if (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories.");
      setCategories([]);
    } else {
      setCategories(data as Category[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, isLoading, refetchCategories: fetchCategories };
};
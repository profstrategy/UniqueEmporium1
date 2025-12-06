import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Define the DeliveryBannerMessage interface based on your database structure
export interface DeliveryBannerMessage {
  id: string;
  message_type: string;
  content: string;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  priority: number;
  link_url: string | null;
  link_text: string | null;
  background_color: string | null;
  text_color: string | null;
  icon_name: string | null;
  created_at: string;
  updated_at: string;
}

// Form Data type for adding/editing, excluding auto-generated fields
export type BannerFormData = Omit<DeliveryBannerMessage, 'id' | 'created_at' | 'updated_at'>;

interface UseBannersResult {
  banners: DeliveryBannerMessage[];
  isLoadingBanners: boolean;
  fetchBanners: () => Promise<void>;
  addBanner: (data: BannerFormData) => Promise<boolean>;
  updateBanner: (id: string, data: BannerFormData) => Promise<boolean>;
  deleteBanner: (id: string) => Promise<boolean>;
}

export const useBanners = (): UseBannersResult => {
  const [banners, setBanners] = useState<DeliveryBannerMessage[]>([]);
  const [isLoadingBanners, setIsLoadingBanners] = useState(true);

  const fetchBanners = useCallback(async () => {
    setIsLoadingBanners(true);
    const { data, error } = await supabase
      .from('delivery_banner_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banner messages.", { description: error.message });
      setBanners([]);
    } else {
      setBanners(data as DeliveryBannerMessage[]);
    }
    setIsLoadingBanners(false);
  }, []);

  const addBanner = useCallback(async (data: BannerFormData): Promise<boolean> => {
    const payload = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
      end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
      link_url: data.link_url || null,
      link_text: data.link_text || null,
      background_color: data.background_color || null,
      text_color: data.text_color || null,
      icon_name: data.icon_name || null,
    };
    const { error } = await supabase
      .from('delivery_banner_messages')
      .insert([payload]);

    if (error) {
      toast.error("Failed to add banner message.", { description: error.message });
      return false;
    } else {
      toast.success(`Banner "${data.content}" added successfully!`);
      fetchBanners();
      return true;
    }
  }, [fetchBanners]);

  const updateBanner = useCallback(async (id: string, data: BannerFormData): Promise<boolean> => {
    const payload = {
      ...data,
      start_date: data.start_date ? new Date(data.start_date).toISOString() : null,
      end_date: data.end_date ? new Date(data.end_date).toISOString() : null,
      link_url: data.link_url || null,
      link_text: data.link_text || null,
      background_color: data.background_color || null,
      text_color: data.text_color || null,
      icon_name: data.icon_name || null,
    };
    const { error } = await supabase
      .from('delivery_banner_messages')
      .update(payload)
      .eq('id', id);

    if (error) {
      toast.error("Failed to update banner message.", { description: error.message });
      return false;
    } else {
      toast.success(`Banner "${data.content}" updated successfully!`);
      fetchBanners();
      return true;
    }
  }, [fetchBanners]);

  const deleteBanner = useCallback(async (id: string): Promise<boolean> => {
    const { error } = await supabase
      .from('delivery_banner_messages')
      .delete()
      .eq('id', id);

    if (error) {
      toast.error("Failed to delete banner message.", { description: error.message });
      return false;
    } else {
      toast.info(`Banner message deleted.`);
      fetchBanners();
      return true;
    }
  }, [fetchBanners]);

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  return {
    banners,
    isLoadingBanners,
    fetchBanners,
    addBanner,
    updateBanner,
    deleteBanner,
  };
};
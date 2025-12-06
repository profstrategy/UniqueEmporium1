"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DeliveryBannerMessage } from '@/pages/admin/DeliveryBannerManagement'; // Import the interface

export const useDeliveryBannerMessages = () => {
  const [activeMessages, setActiveMessages] = useState<DeliveryBannerMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchActiveMessages = useCallback(async () => {
    setIsLoading(true);
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from('delivery_banner_messages')
      .select('*')
      .eq('is_active', true)
      .or(`start_date.is.null,start_date.lte.${now}`)
      .or(`end_date.is.null,end_date.gte.${now}`)
      .order('priority', { ascending: false }) // Higher priority first
      .order('created_at', { ascending: false }); // Newest first for same priority

    if (error) {
      console.error("Error fetching active banner messages:", error);
      toast.error("Failed to load banner messages.");
      setActiveMessages([]);
    } else {
      setActiveMessages(data as DeliveryBannerMessage[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchActiveMessages();
  }, [fetchActiveMessages]);

  return { activeMessages, isLoading, refetchActiveMessages: fetchActiveMessages };
};
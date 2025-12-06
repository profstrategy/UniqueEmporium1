"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, Megaphone, Gift, AlertTriangle, Info, Shirt, CalendarDays } from 'lucide-react'; // Import various icons
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons for dynamic rendering
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';

// Define the BannerMessage interface based on your database structure
interface BannerMessage {
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
}

// Type guard to check if a string is a valid Lucide icon key
const isLucideIconKey = (key: string): keyof typeof LucideIcons => {
  if (key && key in LucideIcons) {
    return key as keyof typeof LucideIcons;
  }
  return "Megaphone"; // Default fallback icon
};

const DeliveryBanner: React.FC = () => {
  const [activeBanners, setActiveBanners] = useState<BannerMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, dragFree: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const fetchActiveBanners = useCallback(async () => {
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
      toast.error("Failed to load banner messages.", { description: error.message });
      setActiveBanners([]);
    } else {
      setActiveBanners(data as BannerMessage[]);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchActiveBanners();
    // Optionally, refetch periodically if banners change frequently
    // const interval = setInterval(fetchActiveBanners, 60000); // Every minute
    // return () => clearInterval(interval);
  }, [fetchActiveBanners]);

  if (isLoading) {
    return null; // Or a skeleton loader if preferred
  }

  if (activeBanners.length === 0) {
    return null; // Don't render the banner if no active messages
  }

  // Animation variants for continuous horizontal slide
  const slide = {
    animate: {
      x: ["-100%", "100%"],
      transition: {
        x: {
          duration: 70, // 70 seconds for extremely slow speed
          ease: "linear",
          repeat: Infinity,
        },
      },
    },
  };

  return (
    <div
      className={cn(
        "fixed top-16 z-50 w-full overflow-hidden h-10 flex items-center",
        activeBanners.length > 1 ? "bg-background" : "" // Only show background if multiple banners for carousel effect
      )}
    >
      {activeBanners.length === 1 ? (
        // Single banner, static display
        <div
          className={cn(
            "h-10 w-full flex items-center justify-center px-4",
            activeBanners[0].background_color || "bg-primary",
            activeBanners[0].text_color || "text-primary-foreground"
          )}
        >
          <div className="flex items-center font-semibold text-sm md:text-base">
            {React.createElement(LucideIcons[isLucideIconKey(activeBanners[0].icon_name)], { className: "h-4 w-4 mr-3" })}
            {activeBanners[0].content}
            {activeBanners[0].link_url && (
              <Link to={activeBanners[0].link_url} className="ml-3 underline hover:opacity-80">
                {activeBanners[0].link_text || "Learn More"}
              </Link>
            )}
          </div>
        </div>
      ) : (
        // Multiple banners, carousel display
        <div className="embla h-full w-full" ref={emblaRef}>
          <div className="embla__container flex h-full">
            {activeBanners.map((banner, index) => {
              const IconComponent = LucideIcons[isLucideIconKey(banner.icon_name)];
              return (
                <div key={banner.id} className="embla__slide flex-none w-full h-full">
                  <div
                    className={cn(
                      "h-10 flex items-center justify-center px-4",
                      banner.background_color || "bg-primary",
                      banner.text_color || "text-primary-foreground"
                    )}
                  >
                    <div className="flex items-center font-semibold text-sm md:text-base">
                      {IconComponent && <IconComponent className="h-4 w-4 mr-3" />}
                      {banner.content}
                      {banner.link_url && (
                        <Link to={banner.link_url} className="ml-3 underline hover:opacity-80">
                          {banner.link_text || "Learn More"}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryBanner;
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, Easing } from 'framer-motion'; // Import Easing
import { Truck, Megaphone, Gift, AlertTriangle, Info, Shirt, CalendarDays } from 'lucide-react'; // Import various icons
import * as LucideIcons from 'lucide-react'; // Import all Lucide icons for dynamic rendering
import { Badge } from '@/components/ui/badge';
import { cn, getLucideIconComponent } from '@/lib/utils'; // NEW: Import getLucideIconComponent
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
// Removed: import useEmblaCarousel from 'embla-carousel-react'; // No longer needed for continuous scroll
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

const DeliveryBanner: React.FC = () => {
  const [activeBanners, setActiveBanners] = useState<BannerMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Removed: emblaRef, emblaApi, selectedIndex, onSelect are no longer needed for continuous scroll

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
  const slideVariants = {
    animate: {
      x: ["0%", "-100%"], // Animate from 0 to -100% of its own width
      transition: {
        x: {
          duration: 70, // 70 seconds for extremely slow speed
          ease: "linear" as Easing, // Explicitly cast to Easing
          repeat: Infinity,
        },
      },
    },
  };

  // Duplicate banners to create a seamless loop for continuous scroll
  const duplicatedBanners = activeBanners.length > 1 ? [...activeBanners, ...activeBanners] : activeBanners;

  return (
    <div
      className={cn(
        "sticky top-16 z-20 w-full overflow-hidden h-10 flex items-center rounded-xl",
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
            {React.createElement(getLucideIconComponent(activeBanners[0].icon_name), { className: "h-4 w-4 mr-3 flex-shrink-0" })}
            {activeBanners[0].content}
            {activeBanners[0].link_url && (
              <Link to={activeBanners[0].link_url} className="ml-3 underline hover:opacity-80">
                {activeBanners[0].link_text || "Learn More"}
              </Link>
            )}
          </div>
        </div>
      ) : (
        // Multiple banners, continuous scrolling display using framer-motion
        <motion.div
          className="flex h-full items-center whitespace-nowrap"
          variants={slideVariants}
          initial="animate" // Start animation immediately
          animate="animate"
        >
          {duplicatedBanners.map((banner, index) => {
            const IconComponent = getLucideIconComponent(banner.icon_name);
            return (
              <div
                key={`${banner.id}-${index}`} // Use a unique key for duplicated items
                className={cn(
                  "h-full flex items-center justify-center min-w-[400px] rounded-xl mr-4 px-4", // Added px-4 for padding
                  banner.background_color || "bg-gradient-to-r from-red-600 to-pink-600", // Default gradient
                  banner.text_color || "text-white", // Default text color
                  "flex-shrink-0" // Prevent items from shrinking
                )}
              >
                <div className="flex items-center font-semibold text-sm md:text-base">
                  {IconComponent && React.createElement(IconComponent, { className: "h-4 w-4 mr-3 flex-shrink-0" })}
                  {banner.content}
                  {banner.link_url && (
                    <Link to={banner.link_url} className="ml-3 underline hover:opacity-80">
                      {banner.link_text || "Learn More"}
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
};

export default DeliveryBanner;
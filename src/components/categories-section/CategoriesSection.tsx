"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, Easing } from "framer-motion";
import { Link } from "react-router-dom";
import { Shirt, Baby, Gem, ShoppingBag, LucideIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils"; // Import cn for conditional classNames
import ImageWithFallback from "@/components/common/ImageWithFallback.tsx"; // Import ImageWithFallback
import { fetchActiveCategories, PublicCategory } from "@/integrations/supabase/categories"; // Import Supabase fetcher
import { Loader2 } from "lucide-react"; // Import Loader2

interface Category {
  name: string;
  icon: LucideIcon;
  description: string;
  link: string;
  image: string | undefined;
}

// Map category names to appropriate Lucide icons (used as fallback if no image is set)
const categoryIconMap: { [key: string]: LucideIcon } = {
  "Kids": Baby,
  "Kids Patpat": Baby,
  "Children Jeans": Baby,
  "Children Shirts": Baby,
  "Men Vintage Shirts": Shirt,
  "Amazon Ladies": ShoppingBag,
  "SHEIN Gowns": Shirt,
  "Others": Gem,
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07, // Adjusted stagger for individual cards
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as Easing } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const CategoriesSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const isMobile = useIsMobile();
  const scrollSpeed = 1;
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  const loadCategories = useCallback(async () => {
    setLoading(true);
    const fetchedCategories = await fetchActiveCategories();

    const mappedCategories: Category[] = fetchedCategories.map(cat => ({
      name: cat.name,
      icon: categoryIconMap[cat.name] || Gem,
      description: `Wholesale ${cat.name}`,
      link: `/products?category=${encodeURIComponent(cat.name)}`,
      image: cat.image_url || undefined,
    }));

    setCategories(mappedCategories);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Conditionally create the list of categories to display
  const categoriesToDisplay = isMobile ? [...categories, ...categories] : categories;

  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement || !isMobile || loading) {
      return;
    }

    let animationFrameId: number;
    let lastTimestamp: DOMHighResTimeStamp;

    const scroll = (timestamp: DOMHighResTimeStamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const elapsed = timestamp - lastTimestamp;

      if (elapsed > 16 && !isPaused) {
        scrollElement.scrollLeft += scrollSpeed;
        
        const singleSetWidth = scrollElement.scrollWidth / 2; 

        if (scrollElement.scrollLeft >= singleSetWidth) {
          scrollElement.scrollLeft = 0;
        }
        lastTimestamp = timestamp;
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused, isMobile, scrollSpeed, loading]);

  return (
    <section className="relative py-[0.4rem] bg-primary/10">
      <motion.div
        className={cn(
          "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center",
          "pt-6 pb-4 rounded-3xl bg-primary/20"
        )}
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* Existing introductory text - DO NOT REMOVE OR EDIT */}
        <motion.h2
          className="font-poppins font-bold text-xl md:text-4xl text-foreground"
          variants={fadeInUp}
        >
          Explore Our Collections
        </motion.h2>
        <motion.p
          className="text-sm text-muted-foreground mt-2 mb-8 md:mb-12"
          variants={fadeInUp}
        >
          Find the perfect style to express your uniqueness
        </motion.p>

        {/* Category Cards Container */}
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-muted-foreground py-8">No active categories found.</div>
        ) : (
          <motion.div
            className="flex overflow-x-auto whitespace-nowrap gap-2 pb-4 md:grid md:grid-cols-4 lg:grid-cols-6 md:gap-4 no-scrollbar"
            ref={scrollRef}
            onMouseEnter={() => isMobile && setIsPaused(true)}
            onMouseLeave={() => isMobile && setIsPaused(false)}
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {categoriesToDisplay.map((category, index) => (
              <motion.div
                key={`${category.name}-${index}`}
                variants={itemVariants}
                className="flex flex-col items-center cursor-pointer min-w-[120px] md:min-w-0"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={category.link} className="flex flex-col items-center">
                  {/* Image Container */}
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden shadow-md mb-3 bg-white flex items-center justify-center">
                    {category.image ? (
                      <ImageWithFallback
                        src={category.image}
                        alt={category.name}
                        containerClassName="w-full h-full"
                      />
                    ) : (
                      <category.icon className="h-10 w-10 text-primary opacity-50" />
                    )}
                  </div>
                  {/* Category Name */}
                  <p className="text-[10px] md:text-sm lg:text-sm font-bold text-gray-900 text-center mt-2 leading-tight">
                    {category.name.split(' ').map((word, i) => (
                      <React.Fragment key={i}>
                        {word}
                        {i < category.name.split(' ').length - 1 && <br />}
                      </React.Fragment>
                    ))}
                  </p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default CategoriesSection;
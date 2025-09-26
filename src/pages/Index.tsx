"use client";

import HeroCarousel from "@/components/hero-carousel/HeroCarousel.tsx";
import HeroIntroBanner from "@/components/hero-intro-banner/HeroIntroBanner.tsx";
import CategoriesSection from "@/components/categories-section/CategoriesSection.tsx";
import ProductCard from "@/components/products/ProductCard.tsx"; // Added .tsx extension
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, Easing } from "framer-motion";

// Placeholder product data
const featuredProducts = [
  {
    id: "fp1",
    name: "ZenBook Pro 14 OLED",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 1899.00,
    rating: 4.8,
    reviews: 150,
    tag: "Best Seller",
    tagVariant: "destructive",
  },
  {
    id: "fp2",
    name: "SoundWave Max Headphones",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 349.99,
    rating: 4.5,
    reviews: 230,
    tag: "New Arrival",
    tagVariant: "default",
  },
  {
    id: "fp3",
    name: "UltraView 32-inch Monitor",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 799.00,
    rating: 4.7,
    reviews: 95,
  },
  {
    id: "fp4",
    name: "ErgoGrip Wireless Mouse",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 59.99,
    rating: 4.6,
    reviews: 310,
    tag: "Top Rated",
    tagVariant: "secondary",
  },
  {
    id: "fp5",
    name: "SmartHome Hub Pro",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 129.00,
    rating: 4.2,
    reviews: 80,
  },
  {
    id: "fp6",
    name: "PowerCharge 100W GaN Charger",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 49.99,
    rating: 4.9,
    reviews: 450,
    tag: "Limited Stock",
    tagVariant: "destructive",
  },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const Index = () => {
  return (
    <div className="relative min-h-screen w-full">
      <HeroCarousel />
      <HeroIntroBanner />
      <CategoriesSection />

      {/* Featured Products Section */}
      <section id="featured-products-section" className="py-16 bg-muted/30">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <motion.h2
            className="font-poppins font-bold text-xl md:text-4xl text-foreground"
            variants={fadeInUp}
          >
            Featured Electronics
          </motion.h2>
          <motion.p
            className="text-sm text-muted-foreground mt-2 mb-8 md:mb-12"
            variants={fadeInUp}
          >
            Discover our most popular laptops, gadgets, and accessories
          </motion.p>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} disableEntryAnimation={true} />
            ))}
          </div>

          <motion.div variants={fadeInUp} className="mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link to="/products">Browse All Electronics</Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    </div>
  );
};

export default Index;
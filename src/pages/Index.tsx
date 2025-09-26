"use client";

import HeroCarousel from "@/components/hero-carousel/HeroCarousel.tsx";
import HeroIntroBanner from "@/components/hero-intro-banner/HeroIntroBanner.tsx";
import CategoriesSection from "@/components/categories-section/CategoriesSection.tsx";
import ProductCard, { Product } from "@/components/products/ProductCard.tsx"; // Import Product interface
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion, Easing } from "framer-motion";
import { Cpu, MemoryStick, HardDrive } from "lucide-react"; // Changed Memory to MemoryStick

// Placeholder product data
const featuredProducts: Product[] = [ // Explicitly typed as Product[]
  {
    id: "fp1",
    name: "ZenBook Pro 14 OLED",
    category: "Laptops",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 950000.00,
    originalPrice: 1000000.00,
    discountPercentage: 5, // Added discountPercentage
    rating: 4.8,
    reviews: 150,
    tag: "Best Seller",
    tagVariant: "destructive",
    limitedStock: true,
    specs: [
      { icon: Cpu, label: "Processor", value: "Intel i7" },
      { icon: MemoryStick, label: "RAM", value: "16GB" }, // Changed Memory to MemoryStick
      { icon: HardDrive, label: "Storage", value: "512GB SSD" },
    ],
  },
  {
    id: "fp2",
    name: "SoundWave Max Headphones",
    category: "Audio",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 175000.00,
    rating: 4.5,
    reviews: 230,
    tag: "New Arrival",
    tagVariant: "default",
    specs: [
      { icon: Cpu, label: "Type", value: "Over-ear" },
      { icon: MemoryStick, label: "Connectivity", value: "Bluetooth 5.2" }, // Changed Memory to MemoryStick
      { icon: HardDrive, label: "Battery", value: "30 Hrs" },
    ],
  },
  {
    id: "fp3",
    name: "UltraView 32-inch Monitor",
    category: "Monitors",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 400000.00,
    originalPrice: 425000.00,
    discountPercentage: 6, // Added discountPercentage
    rating: 4.7,
    reviews: 95,
    specs: [
      { icon: Cpu, label: "Resolution", value: "4K UHD" },
      { icon: MemoryStick, label: "Refresh Rate", value: "144Hz" }, // Changed Memory to MemoryStick
      { icon: HardDrive, label: "Panel Type", value: "IPS" },
    ],
  },
  {
    id: "fp4",
    name: "ErgoGrip Wireless Mouse",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 30000.00,
    rating: 4.6,
    reviews: 310,
    tag: "Top Rated",
    tagVariant: "secondary",
    specs: [
      { icon: Cpu, label: "Connectivity", value: "2.4GHz Wireless" },
      { icon: MemoryStick, label: "DPI", value: "16000" }, // Changed Memory to MemoryStick
      { icon: HardDrive, label: "Buttons", value: "8 Programmable" },
    ],
  },
  {
    id: "fp5",
    name: "SmartHome Hub Pro",
    category: "Smart Home",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 65000.00,
    rating: 4.2,
    reviews: 80,
    limitedStock: true,
    specs: [
      { icon: Cpu, label: "Compatibility", value: "Multi-protocol" },
      { icon: MemoryStick, label: "Voice Asst.", value: "Alexa, Google" }, // Changed Memory to MemoryStick
      { icon: HardDrive, label: "Security", value: "AES-128" },
    ],
  },
  {
    id: "fp6",
    name: "PowerCharge 100W GaN Charger",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 25000.00,
    originalPrice: 30000.00,
    discountPercentage: 17, // Added discountPercentage
    rating: 4.9,
    reviews: 450,
    tag: "Limited Stock",
    tagVariant: "destructive",
    specs: [
      { icon: Cpu, label: "Output", value: "100W Max" },
      { icon: MemoryStick, label: "Ports", value: "2x USB-C, 1x USB-A" }, // Changed Memory to MemoryStick
      { icon: HardDrive, label: "Tech", value: "GaN" },
    ],
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
import { Cpu, MemoryStick, HardDrive, Monitor, BatteryCharging, Wifi, Camera, Weight, Ruler, Palette, Speaker, Mic, ShieldCheck, Star } from "lucide-react";
import { Product } from "@/components/products/ProductCard.tsx"; // Assuming Product interface is exported

export interface ProductDetails extends Product {
  fullDescription: string;
  detailedSpecs: {
    group: string;
    items: { label: string; value: string; icon?: React.ElementType }[];
  }[];
  reviews: {
    id: string;
    author: string;
    rating: number;
    date: string;
    title: string;
    comment: string;
  }[];
  relatedProducts: string[]; // Array of product IDs
}

export const mockProducts: ProductDetails[] = [
  {
    id: "zenbook-pro-14-oled",
    name: "ZenBook Pro 14 OLED",
    category: "Laptops",
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    price: 950000.00,
    originalPrice: 1000000.00,
    discountPercentage: 5,
    rating: 4.8,
    reviewCount: 150, // Added reviewCount
    tag: "Best Seller",
    tagVariant: "destructive",
    limitedStock: true,
    fullDescription: `The ZenBook Pro 14 OLED is a powerhouse designed for creative professionals. Featuring a stunning 14-inch 4K OLED display, it delivers vibrant colors and deep blacks, perfect for graphic design, video editing, and immersive entertainment. Powered by the latest Intel Core i7 processor and 16GB of RAM, it handles demanding tasks with ease. Its sleek, lightweight design makes it highly portable, while the long-lasting battery ensures you stay productive on the go. Experience unparalleled performance and visual brilliance.`,
    detailedSpecs: [
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Intel Core i7-12700H", icon: Cpu },
          { label: "RAM", value: "16GB DDR4", icon: MemoryStick },
          { label: "Storage", value: "512GB NVMe SSD", icon: HardDrive },
          { label: "Graphics", value: "NVIDIA GeForce RTX 3050" },
        ],
      },
      {
        group: "Display",
        items: [
          { label: "Size", value: "14-inch", icon: Monitor },
          { label: "Resolution", value: "4K OLED (3840x2400)" },
          { label: "Refresh Rate", value: "90Hz" },
          { label: "Brightness", value: "550 nits peak" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "Wi-Fi", value: "Wi-Fi 6E", icon: Wifi },
          { label: "Bluetooth", value: "Bluetooth 5.2" },
          { label: "Ports", value: "2x Thunderbolt 4, 1x USB 3.2 Gen 2, HDMI 2.1, Audio Jack" },
        ],
      },
      {
        group: "Physical",
        items: [
          { label: "Weight", value: "1.4 kg", icon: Weight },
          { label: "Dimensions", value: "31.12 x 22.11 x 1.79 cm", icon: Ruler },
          { label: "Color", value: "Tech Black", icon: Palette },
          { label: "Battery Life", value: "Up to 15 hours", icon: BatteryCharging },
        ],
      },
    ],
    reviews: [
      {
        id: "rev1",
        author: "Alice J.",
        rating: 5,
        date: "2023-10-26",
        title: "Absolutely stunning!",
        comment: "The OLED screen is breathtaking. Perfect for my design work. Performance is top-notch.",
      },
      {
        id: "rev2",
        author: "Bob K.",
        rating: 4,
        date: "2023-10-20",
        title: "Great laptop, minor quibbles",
        comment: "Fast and powerful. Battery life is good, but could be better under heavy load. Still highly recommend.",
      },
    ],
    relatedProducts: ["soundwave-max-headphones", "ultrawide-monitor-32"],
  },
  {
    id: "soundwave-max-headphones",
    name: "SoundWave Max Headphones",
    category: "Audio",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 175000.00,
    rating: 4.5,
    reviewCount: 230, // Added reviewCount
    tag: "New Arrival",
    tagVariant: "default",
    fullDescription: `Immerse yourself in pure audio bliss with the SoundWave Max Headphones. Featuring advanced active noise cancellation, these headphones block out distractions, allowing you to focus on your music, podcasts, or calls. The ergonomic design ensures supreme comfort for extended listening sessions, while the powerful drivers deliver rich, detailed sound with deep bass. With up to 30 hours of battery life and quick charging, your soundtrack never has to stop.`,
    detailedSpecs: [
      {
        group: "Audio",
        items: [
          { label: "Driver Size", value: "40mm" },
          { label: "Frequency Response", value: "20Hz - 20kHz" },
          { label: "Noise Cancellation", value: "Hybrid Active Noise Cancellation" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "Bluetooth", value: "Bluetooth 5.2" },
          { label: "Codecs", value: "SBC, AAC, aptX" },
          { label: "Wired", value: "3.5mm Audio Jack" },
        ],
      },
      {
        group: "Battery",
        items: [
          { label: "Battery Life", value: "Up to 30 hours (ANC on)", icon: BatteryCharging },
          { label: "Charging Time", value: "2 hours" },
          { label: "Charging Port", value: "USB-C" },
        ],
      },
      {
        group: "Features",
        items: [
          { label: "Microphone", value: "Built-in for calls", icon: Mic },
          { label: "Controls", value: "On-ear buttons" },
          { label: "Weight", value: "250g", icon: Weight },
        ],
      },
    ],
    reviews: [
      {
        id: "rev3",
        author: "Charlie D.",
        rating: 5,
        date: "2023-11-01",
        title: "Best headphones I've owned!",
        comment: "The ANC is incredible, and the sound quality is fantastic. Very comfortable too.",
      },
      {
        id: "rev4",
        author: "Eve F.",
        rating: 4,
        date: "2023-10-28",
        title: "Great value for money",
        comment: "Solid performance, good battery. A bit bulky for my taste, but overall excellent.",
      },
    ],
    relatedProducts: ["zenbook-pro-14-oled", "mechanical-rgb-keyboard"],
  },
  {
    id: "ultrawide-monitor-32",
    name: "UltraView 32-inch Monitor",
    category: "Monitors",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 400000.00,
    originalPrice: 425000.00,
    discountPercentage: 6,
    rating: 4.7,
    reviewCount: 95, // Added reviewCount
    fullDescription: `Elevate your workspace and gaming experience with the UltraView 32-inch Monitor. This stunning 4K UHD display offers incredible clarity and vibrant colors, bringing your content to life. With a fast 144Hz refresh rate and IPS panel, it ensures smooth, tear-free visuals for both productivity and high-action gaming. Its ergonomic stand allows for versatile adjustments, and multiple connectivity options make it a central hub for all your devices.`,
    detailedSpecs: [
      {
        group: "Display",
        items: [
          { label: "Size", value: "32-inch", icon: Monitor },
          { label: "Resolution", value: "4K UHD (3840x2160)" },
          { label: "Panel Type", value: "IPS" },
          { label: "Refresh Rate", value: "144Hz" },
          { label: "Response Time", value: "1ms (GtG)" },
          { label: "Brightness", value: "400 nits" },
          { label: "HDR", value: "DisplayHDR 400" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "HDMI", value: "2x HDMI 2.1" },
          { label: "DisplayPort", value: "1x DisplayPort 1.4" },
          { label: "USB Hub", value: "3x USB 3.0" },
          { label: "Audio", value: "1x Headphone Out" },
        ],
      },
      {
        group: "Ergonomics",
        items: [
          { label: "Adjustments", value: "Height, Tilt, Swivel, Pivot" },
          { label: "VESA Mount", value: "100x100mm" },
        ],
      },
    ],
    reviews: [
      {
        id: "rev5",
        author: "Frank G.",
        rating: 5,
        date: "2023-11-05",
        title: "Amazing 4K monitor!",
        comment: "The clarity and colors are phenomenal. Gaming is super smooth. Highly recommend for both work and play.",
      },
      {
        id: "rev6",
        author: "Grace H.",
        rating: 4,
        date: "2023-11-02",
        title: "Great, but pricey",
        comment: "Excellent monitor, but it's a significant investment. Worth it if you need the best.",
      },
    ],
    relatedProducts: ["zenbook-pro-14-oled", "ergogrip-wireless-mouse"],
  },
  {
    id: "ergogrip-wireless-mouse",
    name: "ErgoGrip Wireless Mouse",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 30000.00,
    rating: 4.6,
    reviewCount: 310, // Added reviewCount
    tag: "Top Rated",
    tagVariant: "secondary",
    fullDescription: `Experience ultimate comfort and precision with the ErgoGrip Wireless Mouse. Designed for extended use, its ergonomic shape fits perfectly in your hand, reducing strain. With a high-precision optical sensor and adjustable DPI up to 16000, you get pixel-perfect tracking for both work and gaming. Eight programmable buttons allow for customization, and its long-lasting battery ensures uninterrupted productivity.`,
    detailedSpecs: [
      {
        group: "Performance",
        items: [
          { label: "Sensor", value: "Optical" },
          { label: "DPI", value: "Up to 16000" },
          { label: "Tracking Speed", value: "400 IPS" },
          { label: "Acceleration", value: "40G" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "Wireless", value: "2.4GHz USB Receiver" },
          { label: "Battery Life", value: "Up to 70 hours", icon: BatteryCharging },
          { label: "Charging Port", value: "USB-C" },
        ],
      },
      {
        group: "Design",
        items: [
          { label: "Buttons", value: "8 Programmable", icon: HardDrive }, // Reusing HardDrive for buttons
          { label: "Weight", value: "100g", icon: Weight },
          { label: "Ergonomics", value: "Right-handed" },
        ],
      },
    ],
    reviews: [
      {
        id: "rev7",
        author: "Henry I.",
        rating: 5,
        date: "2023-10-15",
        title: "Comfortable and precise!",
        comment: "My hand pain is gone! This mouse is a game-changer for long work sessions.",
      },
      {
        id: "rev8",
        author: "Ivy J.",
        rating: 4,
        date: "2023-10-10",
        title: "Good, but software could be better",
        comment: "Hardware is solid, but the customization software is a bit clunky. Still a great mouse.",
      },
    ],
    relatedProducts: ["ultrawide-monitor-32", "mechanical-rgb-keyboard"],
  },
  {
    id: "smarthome-hub-pro",
    name: "SmartHome Hub Pro",
    category: "Smart Home",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 65000.00,
    rating: 4.2,
    reviewCount: 80, // Added reviewCount
    limitedStock: true,
    fullDescription: `The SmartHome Hub Pro is the central brain for your connected home. Seamlessly integrate and control all your smart devices, from lighting and thermostats to security cameras and door locks, all from one intuitive app. Compatible with multiple protocols like Zigbee, Z-Wave, and Wi-Fi, it offers unparalleled flexibility. Enjoy advanced automation, voice assistant integration (Alexa, Google Assistant), and robust security features to keep your home safe and smart.`,
    detailedSpecs: [
      {
        group: "Connectivity",
        items: [
          { label: "Protocols", value: "Wi-Fi, Zigbee, Z-Wave, Bluetooth" },
          { label: "Ethernet", value: "1x Gigabit Ethernet" },
        ],
      },
      {
        group: "Features",
        items: [
          { label: "Voice Assistants", value: "Amazon Alexa, Google Assistant" },
          { label: "Automation", value: "Customizable routines" },
          { label: "Security", value: "AES-128 Encryption", icon: ShieldCheck },
        ],
      },
      {
        group: "Compatibility",
        items: [
          { label: "Devices", value: "Thousands of smart home devices" },
          { label: "App", value: "iOS & Android" },
        ],
      },
    ],
    reviews: [
      {
        id: "rev9",
        author: "Kevin L.",
        rating: 4,
        date: "2023-09-28",
        title: "Solid hub, easy setup",
        comment: "Works well with all my devices. Setup was surprisingly simple. A few minor bugs, but updates are frequent.",
      },
      {
        id: "rev10",
        author: "Mia N.",
        rating: 3,
        date: "2023-09-20",
        title: "Good potential, needs refinement",
        comment: "It's powerful, but the app can be a bit slow sometimes. Hoping for performance improvements.",
      },
    ],
    relatedProducts: ["smart-doorbell-camera"],
  },
  {
    id: "powercharge-100w-gan-charger",
    name: "PowerCharge 100W GaN Charger",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 25000.00,
    originalPrice: 30000.00,
    discountPercentage: 17, // Added discountPercentage
    rating: 4.9,
    reviewCount: 450, // Added reviewCount
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

      {/* Why Choose Us Section */}
      <WhyChooseUsSection />

      {/* Recommended Products Section */}
      <RecommendedProductsSection />
    </div>
  );
};

export default Index;
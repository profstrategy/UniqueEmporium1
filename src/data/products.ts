import { Cpu, MemoryStick, HardDrive, Monitor, BatteryCharging, Wifi, Camera, Weight, Ruler, Palette, Speaker, Mic, ShieldCheck, Star } from "lucide-react";
import { Product } from "@/components/products/ProductCard.tsx"; // Assuming Product interface is exported

export interface ProductDetails extends Product {
  fullDescription: string;
  keyFeatures: string[]; // New field
  applications: string; // New field
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
    isVerifiedBuyer: boolean; // New field
  }[];
  relatedProducts: string[]; // Array of product IDs
  // Removed has3DModel?: boolean;
  // Removed modelPath?: string;
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
    reviewCount: 150,
    tag: "Best Seller",
    tagVariant: "destructive",
    limitedStock: true,
    fullDescription: `The ZenBook Pro 14 OLED is a powerhouse designed for creative professionals. Featuring a stunning 14-inch 4K OLED display, it delivers vibrant colors and deep blacks, perfect for graphic design, video editing, and immersive entertainment. Powered by the latest Intel Core i7 processor and 16GB of RAM, it handles demanding tasks with ease. Its sleek, lightweight design makes it highly portable, while the long-lasting battery ensures you stay productive on the go. Experience unparalleled performance and visual brilliance.`,
    keyFeatures: [
      "Stunning 4K OLED display for vibrant visuals",
      "Powerful Intel Core i7 processor for demanding tasks",
      "Lightweight and portable design",
      "Long-lasting battery for on-the-go productivity",
      "NVIDIA GeForce RTX 3050 graphics for creative work and light gaming",
    ],
    applications: `Ideal for graphic designers, video editors, photographers, and anyone requiring high-performance computing with exceptional visual fidelity. Also suitable for students and professionals who need a powerful yet portable workstation.`,
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
    ],
    reviews: [
      {
        id: "rev1",
        author: "Alice J.",
        rating: 5,
        date: "2023-10-26",
        title: "Absolutely stunning!",
        comment: "The OLED screen is breathtaking. Perfect for my design work. Performance is top-notch.",
        isVerifiedBuyer: true,
      },
      {
        id: "rev2",
        author: "Bob K.",
        rating: 4,
        date: "2023-10-20",
        title: "Great laptop, minor quibbles",
        comment: "Fast and powerful. Battery life is good, but could be better under heavy load. Still highly recommend.",
        isVerifiedBuyer: true,
      },
      {
        id: "rev25",
        author: "Carol S.",
        rating: 5,
        date: "2023-11-01",
        title: "Best laptop for creatives!",
        comment: "I've been using this for a month now, and it handles all my video editing projects without a hitch. The screen is a dream.",
        isVerifiedBuyer: true,
      },
    ],
    relatedProducts: ["soundwave-noise-cancelling-headphones", "ultrawide-monitor-32"],
    // Removed has3DModel?: boolean;
    // Removed modelPath?: string;
  },
  {
    id: "surface-pro-9",
    name: "Surface Pro 9",
    category: "Tablets",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 780000.00,
    originalPrice: 850000.00,
    discountPercentage: 8,
    rating: 4.6,
    reviewCount: 120,
    tag: "Productivity",
    tagVariant: "default",
    limitedStock: false,
    fullDescription: `The Surface Pro 9 is a versatile 2-in-1 device that combines the power of a laptop with the flexibility of a tablet. Featuring a stunning PixelSense display, it's perfect for work, creativity, and entertainment. Powered by the latest Intel Evo platform, it delivers fast performance and all-day battery life.`,
    keyFeatures: [
      "Versatile 2-in-1 design",
      "High-resolution PixelSense display",
      "Powerful Intel Evo platform",
      "All-day battery life",
      "Optional Surface Slim Pen 2 and Keyboard",
    ],
    applications: `Ideal for students, professionals, and artists who need a portable device for note-taking, drawing, presentations, and general computing tasks.`,
    detailedSpecs: [
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Intel Core i5/i7 Evo" },
          { label: "RAM", value: "8GB/16GB LPDDR5" },
          { label: "Storage", value: "256GB/512GB SSD" },
          { label: "Graphics", value: "Intel Iris Xe Graphics" },
        ],
      },
      {
        group: "Display",
        items: [
          { label: "Size", value: "13-inch" },
          { label: "Resolution", value: "2880x1920" },
          { label: "Refresh Rate", value: "120Hz" },
          { label: "Touch", value: "10-point multi-touch" },
        ],
      },
    ],
    reviews: [
      { id: "rev26", author: "David L.", rating: 5, date: "2023-12-01", title: "Amazing versatility!", comment: "Perfect for my hybrid work setup. Love the pen input.", isVerifiedBuyer: true },
      { id: "rev27", author: "Sarah M.", rating: 4, date: "2023-11-25", title: "Great, but accessories are pricey", comment: "The device itself is fantastic, but the keyboard and pen add up.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["ergogrip-wireless-mouse"],
    // Removed has3DModel?: boolean;
    // Removed modelPath?: string;
  },
  {
    id: "echo-dot-5th-gen",
    name: "Echo Dot (5th Gen)",
    category: "Smart Home",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 45000.00,
    rating: 4.7,
    reviewCount: 300,
    tag: "Smart Speaker",
    tagVariant: "secondary",
    limitedStock: false,
    fullDescription: `The Echo Dot (5th Gen) is Amazon's most popular smart speaker with Alexa. Enjoy improved audio for vibrant sound, deeper bass, and clear vocals. Ask Alexa to play music, answer questions, read the news, check the weather, set alarms, control compatible smart home devices, and more.`,
    keyFeatures: [
      "Improved audio with deeper bass",
      "Built-in Alexa voice assistant",
      "Control smart home devices",
      "Compact design",
      "Privacy controls",
    ],
    applications: `Ideal for anyone looking to add smart home capabilities, stream music, get information, or manage daily tasks hands-free.`,
    detailedSpecs: [
      {
        group: "Audio",
        items: [
          { label: "Speaker", value: "1.73-inch front-firing speaker" },
          { label: "Microphones", value: "Multiple microphones" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "Wi-Fi", value: "Dual-band Wi-Fi" },
          { label: "Bluetooth", value: "Bluetooth 5.0" },
        ],
      },
    ],
    reviews: [
      { id: "rev28", author: "Mark T.", rating: 5, date: "2023-12-05", title: "Love my new Echo Dot!", comment: "Sound is surprisingly good for its size. Alexa is super helpful.", isVerifiedBuyer: true },
      { id: "rev29", author: "Jessica R.", rating: 4, date: "2023-11-30", title: "Great, but sometimes mishears me", comment: "Mostly works perfectly, but occasionally struggles with my accent.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["smarthome-hub-pro"],
    // Removed has3DModel?: boolean;
    // Removed modelPath?: string;
  },
  {
    id: "ergofit-wireless-keyboard",
    name: "ErgoFit Wireless Keyboard",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 60000.00,
    rating: 4.5,
    reviewCount: 180,
    tag: "Ergonomic",
    tagVariant: "default",
    limitedStock: false,
    fullDescription: `The ErgoFit Wireless Keyboard is designed for maximum comfort and productivity. Its split, curved layout and integrated palm rest reduce strain on your wrists and forearms, making long typing sessions more comfortable. Enjoy quiet, responsive keys and seamless wireless connectivity.`,
    keyFeatures: [
      "Ergonomic split design",
      "Integrated palm rest",
      "Quiet, responsive keys",
      "2.4GHz wireless connectivity",
      "Long battery life",
    ],
    applications: `Perfect for office workers, writers, and anyone who spends extended periods typing and wants to improve comfort and reduce the risk of repetitive strain injuries.`,
    detailedSpecs: [
      {
        group: "Design",
        items: [
          { label: "Layout", value: "Split ergonomic" },
          { label: "Palm Rest", value: "Integrated" },
          { label: "Key Type", value: "Membrane" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "Wireless", value: "2.4GHz USB Receiver" },
          { label: "Battery", value: "2x AAA (included)" },
        ],
      },
    ],
    reviews: [
      { id: "rev30", author: "Chris P.", rating: 5, date: "2023-12-10", title: "My wrists thank me!", comment: "Huge improvement in comfort. Took a day to get used to, but now I love it.", isVerifiedBuyer: true },
      { id: "rev31", author: "Laura K.", rating: 4, date: "2023-12-05", title: "Good, but a bit bulky", comment: "Works great, but it's quite large on my desk.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["ergogrip-wireless-mouse"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/ergofit_wireless_keyboard.glb",
  },
  {
    id: "prodisplay-xdr",
    name: "ProDisplay XDR",
    category: "Monitors",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 2500000.00,
    rating: 4.9,
    reviewCount: 90,
    tag: "Professional",
    tagVariant: "destructive",
    limitedStock: true,
    fullDescription: `The ProDisplay XDR is a groundbreaking 32-inch Retina 6K display designed for professional workflows. With extreme dynamic range (XDR), stunning brightness, and incredible contrast, it delivers an unparalleled viewing experience for color-critical work.`,
    keyFeatures: [
      "32-inch Retina 6K display",
      "Extreme Dynamic Range (XDR)",
      "1,000,000:1 contrast ratio",
      "P3 wide color gamut",
      "Thunderbolt 3 connectivity",
    ],
    applications: `Essential for video editors, graphic designers, photographers, and developers who require the highest color accuracy and resolution for their professional work.`,
    detailedSpecs: [
      {
        group: "Display",
        items: [
          { label: "Size", value: "32-inch" },
          { label: "Resolution", value: "6016x3384 (6K)" },
          { label: "Brightness", value: "1000 nits sustained, 1600 nits peak" },
          { label: "Color Gamut", value: "P3 wide color" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "Thunderbolt", value: "1x Thunderbolt 3" },
          { label: "USB-C", value: "3x USB-C" },
        ],
      },
    ],
    reviews: [
      { id: "rev32", author: "Alex G.", rating: 5, date: "2023-12-15", title: "The best display I've ever used!", comment: "Unbelievable color accuracy and brightness. A game-changer for my studio.", isVerifiedBuyer: true },
      { id: "rev33", author: "Sophie H.", rating: 4, date: "2023-12-10", title: "Expensive, but worth it for pros", comment: "The price is steep, but the quality is unmatched for professional work.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["zenbook-pro-14-oled"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/prodisplay_xdr.glb",
  },
  {
    id: "gaming-beast-desktop-pc",
    name: "Gaming Beast Desktop PC",
    category: "Laptops", // Assuming 'Laptops' is a broad category for high-performance computing
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 1800000.00,
    originalPrice: 2000000.00,
    discountPercentage: 10,
    rating: 4.9,
    reviewCount: 250,
    tag: "Gaming",
    tagVariant: "destructive",
    limitedStock: false,
    fullDescription: `Unleash the ultimate gaming experience with the Gaming Beast Desktop PC. Equipped with a powerful Intel i9 processor and NVIDIA GeForce RTX 4090 graphics, it delivers unparalleled performance for the most demanding games and creative applications. Liquid-cooled and housed in a sleek, RGB-lit chassis, this PC is built for extreme performance and aesthetics.`,
    keyFeatures: [
      "Intel Core i9-14900K Processor",
      "NVIDIA GeForce RTX 4090 Graphics Card",
      "32GB DDR5 RAM",
      "2TB NVMe SSD Storage",
      "Advanced Liquid Cooling System",
    ],
    applications: `Designed for hardcore gamers, esports enthusiasts, streamers, and professionals who require top-tier performance for gaming, 3D rendering, video editing, and other resource-intensive tasks.`,
    detailedSpecs: [
      {
        group: "Performance",
        items: [
          { icon: Cpu, label: "CPU", value: "Intel Core i9-14900K" },
          { icon: MemoryStick, label: "RAM", value: "32GB DDR5-6000" },
          { icon: HardDrive, label: "Storage", value: "2TB NVMe SSD" },
          { label: "Graphics", value: "NVIDIA GeForce RTX 4090" },
        ],
      },
      {
        group: "Cooling",
        items: [
          { label: "CPU Cooler", value: "360mm AIO Liquid Cooler" },
          { label: "Case Fans", value: "6x RGB Fans" },
        ],
      },
    ],
    reviews: [
      { id: "rev34", author: "GamerPro", rating: 5, date: "2023-12-20", title: "Absolute powerhouse!", comment: "Runs every game at max settings without breaking a sweat. Worth every penny!", isVerifiedBuyer: true },
      { id: "rev35", author: "TechGuru", rating: 5, date: "2023-12-18", title: "Stunning performance and looks", comment: "Not just powerful, but also looks incredible with the RGB lighting.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["prodisplay-xdr", "gaming-pro-wireless-mouse"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/gaming_beast_desktop_pc.glb",
  },
  {
    id: "soundwave-noise-cancelling-headphones",
    name: "SoundWave Noise-Cancelling Headphones",
    category: "Audio",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 175000.00,
    rating: 4.5,
    reviewCount: 230,
    tag: "New Arrival",
    tagVariant: "default",
    limitedStock: false,
    fullDescription: `Immerse yourself in pure audio bliss with the SoundWave Noise-Cancelling Headphones. Featuring advanced active noise cancellation, these headphones block out distractions, allowing you to focus on your music, podcasts, or calls. The ergonomic design ensures supreme comfort for extended listening sessions, while the powerful drivers deliver rich, detailed sound with deep bass. With up to 30 hours of battery life and quick charging, your soundtrack never has to stop.`,
    keyFeatures: [
      "Advanced Hybrid Active Noise Cancellation",
      "Ergonomic design for supreme comfort",
      "Rich, detailed sound with deep bass",
      "Up to 30 hours of battery life",
      "Quick charging capabilities",
    ],
    applications: `Perfect for audiophiles, commuters, students, and anyone seeking an immersive listening experience without distractions. Great for travel, work, or simply relaxing with your favorite tunes.`,
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
    ],
    reviews: [
      {
        id: "rev3",
        author: "Charlie D.",
        rating: 5,
        date: "2023-11-01",
        title: "Best headphones I've owned!",
        comment: "The ANC is incredible, and the sound quality is fantastic. Very comfortable too.",
        isVerifiedBuyer: true,
      },
      {
        id: "rev4",
        author: "Eve F.",
        rating: 4,
        date: "2023-10-28",
        title: "Great value for money",
        comment: "Solid performance, good battery. A bit bulky for my taste, but overall excellent.",
        isVerifiedBuyer: false,
      },
    ],
    relatedProducts: ["zenbook-pro-14-oled", "ergofit-wireless-keyboard"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/soundwave_headphones.glb",
  },
  {
    id: "ultrafast-1tb-external-ssd",
    name: "UltraFast 1TB External SSD",
    category: "Accessories", // Changed category from Storage to Accessories
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 150000.00,
    originalPrice: 165000.00,
    discountPercentage: 9,
    rating: 4.7,
    reviewCount: 130,
    tag: "Storage",
    tagVariant: "destructive",
    limitedStock: false,
    fullDescription: `Carry your data with confidence and speed using the UltraFast 1TB External SSD. This ultra-fast external solid-state drive offers massive storage capacity in a pocket-sized design. With USB 3.2 Gen2 connectivity, achieve blazing-fast read/write speeds of up to 1000MB/s, perfect for large files, 4K videos, and gaming libraries. Its durable, shock-resistant build ensures your data is safe on the go.`,
    keyFeatures: [
      "Ultra-fast external solid-state drive",
      "Massive 1TB storage capacity in a pocket-sized design",
      "USB 3.2 Gen2 connectivity for blazing-fast read/write speeds",
      "Perfect for large files, 4K videos, and gaming libraries",
      "Durable, shock-resistant build for data safety on the go",
    ],
    applications: `Essential for professionals, content creators, and gamers who need to quickly transfer and store large amounts of data. Ideal for expanding laptop storage, backing up important files, or running games directly from the drive.`,
    detailedSpecs: [
      {
        group: "Storage",
        items: [
          { icon: HardDrive, label: "Capacity", value: "1TB" },
          { label: "Type", value: "External SSD" },
        ],
      },
      {
        group: "Performance",
        items: [
          { label: "Interface", value: "USB 3.2 Gen2 (10Gbps)" },
          { label: "Read Speed", value: "Up to 1050MB/s" },
          { label: "Write Speed", value: "Up to 1000MB/s" },
        ],
      },
    ],
    reviews: [
      {
        id: "rev23",
        author: "Jack K.",
        rating: 5,
        date: "2023-11-09",
        title: "Blazing fast and tiny!",
        comment: "Transfers huge files in seconds. Fits in my pocket. Essential for my work.",
        isVerifiedBuyer: true,
      },
      {
        id: "rev24",
        author: "Laura M.",
        rating: 4,
        date: "2023-11-06",
        title: "Great, but runs warm",
        comment: "Performance is excellent, but it gets noticeably warm during sustained transfers. Not a dealbreaker.",
        isVerifiedBuyer: false,
      },
    ],
    relatedProducts: ["zenbook-pro-14-oled"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/ultrafast_1tb_external_ssd.glb",
  },
  {
    id: "smarthome-hub-pro",
    name: "SmartHome Hub Pro",
    category: "Smart Home",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 65000.00,
    rating: 4.2,
    reviewCount: 80,
    tag: undefined,
    tagVariant: undefined,
    limitedStock: true,
    fullDescription: `The SmartHome Hub Pro is the central brain for your connected home. Seamlessly integrate and control all your smart devices, from lighting and thermostats to security cameras and door locks, all from one intuitive app. Compatible with multiple protocols like Zigbee, Z-Wave, and Wi-Fi, it offers unparalleled flexibility. Enjoy advanced automation, voice assistant integration (Alexa, Google Assistant), and robust security features to keep your home safe and smart.`,
    keyFeatures: [
      "Centralized control for all smart devices",
      "Multi-protocol compatibility (Zigbee, Z-Wave, Wi-Fi)",
      "Advanced automation and customizable routines",
      "Voice assistant integration (Alexa, Google Assistant)",
      "Robust security features with AES-128 encryption",
    ],
    applications: `Essential for building a comprehensive smart home ecosystem. Ideal for homeowners looking to automate lighting, climate, security, and entertainment systems, enhancing convenience, energy efficiency, and peace of mind.`,
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
    ],
    reviews: [
      {
        id: "rev9",
        author: "Kevin L.",
        rating: 4,
        date: "2023-09-28",
        title: "Solid hub, easy setup",
        comment: "Works well with all my devices. Setup was surprisingly simple. A few minor bugs, but updates are frequent.",
        isVerifiedBuyer: true,
      },
      {
        id: "rev10",
        author: "Mia N.",
        rating: 3,
        date: "2023-09-20",
        title: "Good potential, needs refinement",
        comment: "It's powerful, but the app can be a bit slow sometimes. Hoping for performance improvements.",
        isVerifiedBuyer: false,
      },
    ],
    relatedProducts: ["echo-dot-5th-gen"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/smarthome_hub_pro.glb",
  },
  {
    id: "powercharge-100w-gan-charger",
    name: "PowerCharge 100W GaN Charger",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 25000.00,
    originalPrice: 30000.00,
    discountPercentage: 17,
    rating: 4.9,
    reviewCount: 450,
    tag: "Limited Stock",
    tagVariant: "destructive",
    limitedStock: true,
    fullDescription: `Revolutionize your charging experience with the PowerCharge 100W GaN Charger. Utilizing advanced Gallium Nitride (GaN) technology, this compact charger delivers a massive 100W of power, capable of fast-charging laptops, tablets, and smartphones simultaneously. With two USB-C ports and one USB-A port, it's the only charger you'll need for all your devices. Its intelligent power distribution ensures optimal charging speeds for each connected device.`,
    keyFeatures: [
      "Advanced Gallium Nitride (GaN) technology for compact size",
      "Massive 100W power output for fast charging",
      "Simultaneous charging for laptops, tablets, and smartphones",
      "Two USB-C ports and one USB-A port for versatile compatibility",
      "Intelligent power distribution for optimal charging speeds",
    ],
    applications: `An essential accessory for travelers, remote workers, and anyone with multiple devices needing fast and efficient charging. Perfect for decluttering your charging setup and ensuring all your gadgets are powered up quickly.`,
    detailedSpecs: [
      {
        group: "Power Output",
        items: [
          { label: "Total Output", value: "100W Max" },
          { label: "USB-C1/C2", value: "PD 100W Max" },
          { label: "USB-A", value: "QC 18W Max" },
        ],
      },
      {
        group: "Ports",
        items: [
          { label: "USB-C", value: "2" },
          { label: "USB-A", value: "1" },
        ],
      },
    ],
    reviews: [
      {
        id: "rev11",
        author: "Oscar P.",
        rating: 5,
        date: "2023-11-10",
        title: "Incredible charger!",
        comment: "Charges my laptop and phone super fast. So compact for travel. A must-have!",
        isVerifiedBuyer: true,
      },
      {
        id: "rev12",
        author: "Quinn R.",
        rating: 5,
        date: "2023-11-08",
        title: "Replaced all my other chargers",
        comment: "Finally, one charger for everything. No more bulky power bricks. Works perfectly.",
        isVerifiedBuyer: true,
      },
    ],
    relatedProducts: ["ergofit-wireless-keyboard"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/powercharge_100w_gan_charger.glb",
  },
  {
    id: "visionpro-4k-webcam",
    name: "VisionPro 4K Webcam",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 80000.00,
    rating: 4.6,
    reviewCount: 110,
    tag: "Streaming",
    tagVariant: "default",
    limitedStock: false,
    fullDescription: `Elevate your video calls and streaming with the VisionPro 4K Webcam. Featuring stunning 4K Ultra HD resolution, autofocus, and a wide 90-degree field of view, it delivers crystal-clear video quality. Built-in dual microphones ensure your voice is heard clearly, even in noisy environments.`,
    keyFeatures: [
      "4K Ultra HD resolution",
      "Autofocus and auto light correction",
      "Wide 90-degree field of view",
      "Dual noise-cancelling microphones",
      "Privacy shutter",
    ],
    applications: `Perfect for remote work, online meetings, content creation, and live streaming, providing superior video and audio quality.`,
    detailedSpecs: [
      {
        group: "Camera",
        items: [
          { label: "Resolution", value: "4K UHD (3840x2160)" },
          { label: "Frame Rate", value: "30fps (4K), 60fps (1080p)" },
          { label: "Field of View", value: "90 degrees" },
          { label: "Focus", value: "Autofocus" },
        ],
      },
      {
        group: "Audio",
        items: [
          { label: "Microphones", value: "Dual omni-directional" },
          { label: "Noise Cancellation", value: "Yes" },
        ],
      },
    ],
    reviews: [
      { id: "rev36", author: "VideoCreator", rating: 5, date: "2023-12-25", title: "Amazing clarity!", comment: "My streams look so much more professional now. The autofocus is spot on.", isVerifiedBuyer: true },
      { id: "rev37", author: "RemoteWorker", rating: 4, date: "2023-12-20", title: "Great for meetings", comment: "Much better than my laptop camera. Good value for 4K.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["gaming-beast-desktop-pc"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/visionpro_4k_webcam.glb",
  },
  {
    id: "swiftbook-air-13",
    name: "SwiftBook Air 13",
    category: "Laptops",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 680000.00,
    originalPrice: 720000.00,
    discountPercentage: 5,
    rating: 4.7,
    reviewCount: 190,
    tag: "Lightweight",
    tagVariant: "default",
    limitedStock: false,
    fullDescription: `The SwiftBook Air 13 is an ultra-portable laptop designed for on-the-go productivity. Weighing just 1.2kg, it features a vibrant 13.3-inch Full HD display, a powerful Intel Core i5 processor, and up to 12 hours of battery life. Perfect for students and professionals who need a reliable and lightweight companion.`,
    keyFeatures: [
      "Ultra-portable and lightweight design (1.2kg)",
      "Vibrant 13.3-inch Full HD display",
      "Intel Core i5 processor",
      "Up to 12 hours of battery life",
      "Fast SSD storage",
    ],
    applications: `Ideal for students, business travelers, and anyone needing a highly portable and efficient laptop for everyday tasks, web browsing, and light productivity.`,
    detailedSpecs: [
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Intel Core i5-1235U" },
          { label: "RAM", value: "8GB LPDDR4X" },
          { label: "Storage", value: "256GB NVMe SSD" },
          { label: "Graphics", value: "Intel Iris Xe Graphics" },
        ],
      },
      {
        group: "Display",
        items: [
          { label: "Size", value: "13.3-inch" },
          { label: "Resolution", value: "Full HD (1920x1080)" },
        ],
      },
    ],
    reviews: [
      { id: "rev38", author: "StudentLife", rating: 5, date: "2024-01-05", title: "Perfect for university!", comment: "Lightweight, fast, and the battery lasts all day. Couldn't ask for more.", isVerifiedBuyer: true },
      { id: "rev39", author: "Traveler", rating: 4, date: "2024-01-01", title: "Great travel companion", comment: "Fits easily in my bag. Screen is good, but wish it was brighter outdoors.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["ultrafast-1tb-external-ssd"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/swiftbook_air_13.glb",
  },
  {
    id: "galaxy-tab-s9-ultra",
    name: "Galaxy Tab S9 Ultra",
    category: "Tablets",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 1100000.00,
    rating: 4.8,
    reviewCount: 160,
    tag: "Premium",
    tagVariant: "destructive",
    limitedStock: true,
    fullDescription: `The Galaxy Tab S9 Ultra is Samsung's most powerful and largest tablet, featuring a stunning 14.6-inch Dynamic AMOLED 2X display. Powered by the Snapdragon 8 Gen 2 for Galaxy, it delivers unparalleled performance for gaming, multitasking, and creative work. Includes the S Pen for precision input.`,
    keyFeatures: [
      "Massive 14.6-inch Dynamic AMOLED 2X display",
      "Snapdragon 8 Gen 2 for Galaxy processor",
      "Included S Pen",
      "IP68 water and dust resistance",
      "Long-lasting battery",
    ],
    applications: `Ideal for professionals, artists, and power users who need a large, high-performance tablet for drawing, video editing, extensive multitasking, and immersive entertainment.`,
    detailedSpecs: [
      {
        group: "Display",
        items: [
          { label: "Size", value: "14.6-inch" },
          { label: "Panel Type", value: "Dynamic AMOLED 2X" },
          { label: "Refresh Rate", value: "120Hz" },
          { label: "Resolution", value: "2960x1848" },
        ],
      },
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Snapdragon 8 Gen 2 for Galaxy" },
          { label: "RAM", value: "12GB/16GB" },
          { label: "Storage", value: "256GB/512GB/1TB" },
        ],
      },
    ],
    reviews: [
      { id: "rev40", author: "DigitalArtist", rating: 5, date: "2024-01-10", title: "Incredible screen for art!", comment: "The display is gorgeous and the S Pen is super responsive. My new favorite drawing tablet.", isVerifiedBuyer: true },
      { id: "rev41", author: "Multitasker", rating: 4, date: "2024-01-08", title: "A bit too big, but powerful", comment: "Amazing for productivity, but it's definitely a two-hand device.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["surface-pro-9"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/galaxy_tab_s9_ultra.glb",
  },
  {
    id: "officemaster-all-in-one-pc",
    name: "OfficeMaster All-in-One PC",
    category: "Laptops", // Broad category for computing devices
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 700000.00,
    originalPrice: 750000.00,
    discountPercentage: 6,
    rating: 4.4,
    reviewCount: 90,
    tag: "Office",
    tagVariant: "secondary",
    limitedStock: false,
    fullDescription: `The OfficeMaster All-in-One PC offers a sleek, space-saving design with powerful performance for all your business and home office needs. Featuring a vibrant 24-inch Full HD display, Intel Core i7 processor, and ample storage, it's ready for multitasking, video conferencing, and everyday computing.`,
    keyFeatures: [
      "Sleek, space-saving all-in-one design",
      "Vibrant 24-inch Full HD display",
      "Intel Core i7 processor",
      "Integrated webcam and speakers",
      "Wireless keyboard and mouse included",
    ],
    applications: `Perfect for home offices, small businesses, and families needing a reliable and efficient computer for productivity, online learning, and entertainment.`,
    detailedSpecs: [
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Intel Core i7-12700" },
          { label: "RAM", value: "16GB DDR4" },
          { label: "Storage", value: "512GB SSD + 1TB HDD" },
        ],
      },
      {
        group: "Display",
        items: [
          { label: "Size", value: "24-inch" },
          { label: "Resolution", value: "Full HD (1920x1080)" },
          { label: "Touchscreen", value: "Optional" },
        ],
      },
    ],
    reviews: [
      { id: "rev42", author: "OfficePro", rating: 5, date: "2024-01-15", title: "Great for my home office!", comment: "Clean setup, fast performance, and the screen is perfect for my work.", isVerifiedBuyer: true },
      { id: "rev43", author: "FamilyUser", rating: 4, date: "2024-01-12", title: "Solid family computer", comment: "Handles all our needs, but the speakers could be better.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["prodisplay-xdr"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/officemaster_all_in_one_pc.glb",
  },
  {
    id: "gaming-pro-wireless-mouse",
    name: "Gaming Pro Wireless Mouse",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 45000.00,
    originalPrice: 50000.00,
    discountPercentage: 10,
    rating: 4.7,
    reviewCount: 280,
    tag: "Gaming",
    tagVariant: "destructive",
    limitedStock: false,
    fullDescription: `Dominate the competition with the Gaming Pro Wireless Mouse. Featuring an ultra-fast optical sensor with up to 26,000 DPI, lightning-fast wireless connectivity, and a lightweight ergonomic design, it's built for precision and speed. Customizable RGB lighting and programmable buttons complete your gaming setup.`,
    keyFeatures: [
      "Ultra-fast optical sensor (up to 26,000 DPI)",
      "Lightning-fast wireless connectivity",
      "Lightweight ergonomic design",
      "Customizable RGB lighting",
      "Programmable buttons",
    ],
    applications: `Essential for competitive gamers and esports enthusiasts who demand extreme precision, speed, and comfort for peak performance.`,
    detailedSpecs: [
      {
        group: "Performance",
        items: [
          { label: "Sensor", value: "Optical (26,000 DPI)" },
          { label: "Tracking Speed", value: "650 IPS" },
          { label: "Acceleration", value: "50G" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "Wireless", value: "2.4GHz USB Receiver" },
          { label: "Battery Life", value: "Up to 100 hours" },
        ],
      },
    ],
    reviews: [
      { id: "rev44", author: "EsportsChamp", rating: 5, date: "2024-01-20", title: "Best gaming mouse ever!", comment: "Super precise, no lag, and incredibly comfortable for long sessions.", isVerifiedBuyer: true },
      { id: "rev45", author: "CasualGamer", rating: 4, date: "2024-01-18", title: "Great, but a bit pricey", comment: "Fantastic performance, but it's a premium price for a mouse.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["gaming-beast-desktop-pc"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/gaming_pro_wireless_mouse.glb",
  },
  {
    id: "smartwatch-xtreme",
    name: "SmartWatch Xtreme",
    category: "Accessories", // Changed category from Smart Home to Accessories
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 120000.00,
    originalPrice: 135000.00,
    discountPercentage: 11,
    rating: 4.5,
    reviewCount: 210,
    tag: "Fitness",
    tagVariant: "default",
    limitedStock: true,
    fullDescription: `The SmartWatch Xtreme is your ultimate companion for fitness and connectivity. Featuring a vibrant AMOLED display, advanced health tracking (heart rate, SpO2, sleep), GPS, and long battery life, it keeps you informed and motivated. Make calls, receive notifications, and control music directly from your wrist.`,
    keyFeatures: [
      "Vibrant AMOLED display",
      "Advanced health tracking (HR, SpO2, Sleep)",
      "Built-in GPS",
      "Long battery life",
      "Water resistant",
    ],
    applications: `Ideal for fitness enthusiasts, athletes, and anyone who wants to monitor their health, track workouts, and stay connected on the go.`,
    detailedSpecs: [
      {
        group: "Display",
        items: [
          { label: "Type", value: "AMOLED" },
          { label: "Size", value: "1.4-inch" },
          { label: "Resolution", value: "454x454" },
        ],
      },
      {
        group: "Health Sensors",
        items: [
          { label: "Heart Rate", value: "Optical" },
          { label: "SpO2", value: "Yes" },
          { label: "Sleep Tracking", value: "Yes" },
        ],
      },
    ],
    reviews: [
      { id: "rev46", author: "FitnessFan", rating: 5, date: "2024-01-25", title: "Love this watch!", comment: "Tracks everything perfectly, and the battery lasts for days. Great for my runs.", isVerifiedBuyer: true },
      { id: "rev47", author: "TechWearer", rating: 4, date: "2024-01-22", title: "Stylish and functional", comment: "Looks great and has all the features I need. Notifications are a bit small.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["soundwave-noise-cancelling-headphones"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/smartwatch_xtreme.glb",
  },
  {
    id: "portable-projector-mini",
    name: "Portable Projector Mini",
    category: "Accessories", // Changed category from Smart Home to Accessories
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 95000.00,
    rating: 4.3,
    reviewCount: 70,
    tag: "Entertainment",
    tagVariant: "secondary",
    limitedStock: false,
    fullDescription: `Transform any space into a home theater with the Portable Projector Mini. This compact projector delivers a bright, clear image up to 100 inches, with built-in speakers and versatile connectivity options. Perfect for movie nights, presentations, or gaming on the go.`,
    keyFeatures: [
      "Compact and portable design",
      "Projects up to 100-inch image",
      "Built-in stereo speakers",
      "HDMI, USB, and Wi-Fi connectivity",
      "Long-lasting LED lamp",
    ],
    applications: `Ideal for home entertainment, outdoor movie nights, business presentations, and casual gaming, offering a large-screen experience anywhere.`,
    detailedSpecs: [
      {
        group: "Display",
        items: [
          { label: "Resolution", value: "1080p (Native)" },
          { label: "Brightness", value: "300 ANSI Lumens" },
          { label: "Projection Size", value: "30-100 inches" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "HDMI", value: "1x" },
          { label: "USB", value: "1x" },
          { label: "Wi-Fi", value: "Yes" },
        ],
      },
    ],
    reviews: [
      { id: "rev48", author: "MovieBuff", rating: 5, date: "2024-01-30", title: "Great for outdoor movies!", comment: "Surprisingly bright and clear. Easy to set up. Kids love it.", isVerifiedBuyer: true },
      { id: "rev49", author: "Presenter", rating: 4, date: "2024-01-28", title: "Handy for presentations", comment: "Works well for quick meetings, but the fan can be a bit loud.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["smarthome-hub-pro"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/portable_projector_mini.glb",
  },
  {
    id: "cyberbook-pro-16",
    name: "CyberBook Pro 16",
    category: "Laptops",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 1500000.00,
    originalPrice: 1600000.00,
    discountPercentage: 6,
    rating: 4.9,
    reviewCount: 170,
    tag: "Creator",
    tagVariant: "destructive",
    limitedStock: false,
    fullDescription: `The CyberBook Pro 16 is a high-performance laptop built for creative professionals and power users. Featuring a stunning 16-inch Mini-LED display, Intel Core i9 processor, NVIDIA RTX 4070 graphics, and 32GB of RAM, it handles the most demanding tasks with ease. Its robust aluminum chassis and advanced cooling ensure sustained performance.`,
    keyFeatures: [
      "Stunning 16-inch Mini-LED display",
      "Intel Core i9 processor",
      "NVIDIA RTX 4070 graphics",
      "32GB RAM and 1TB SSD",
      "Robust aluminum chassis",
    ],
    applications: `Ideal for video editors, 3D artists, software developers, and gamers who require top-tier performance and a high-quality display for intensive creative and computing tasks.`,
    detailedSpecs: [
      {
        group: "Performance",
        items: [
          { label: "Processor", value: "Intel Core i9-13900H" },
          { label: "RAM", value: "32GB DDR5" },
          { label: "Storage", value: "1TB NVMe SSD" },
          { label: "Graphics", value: "NVIDIA GeForce RTX 4070" },
        ],
      },
      {
        group: "Display",
        items: [
          { label: "Size", value: "16-inch" },
          { label: "Panel Type", value: "Mini-LED" },
          { label: "Resolution", value: "2560x1600" },
          { label: "Refresh Rate", value: "120Hz" },
        ],
      },
    ],
    reviews: [
      { id: "rev50", author: "ProEditor", rating: 5, date: "2024-02-05", title: "Unmatched performance for editing!", comment: "Handles 8K footage like a dream. The screen is incredible.", isVerifiedBuyer: true },
      { id: "rev51", author: "DeveloperX", rating: 5, date: "2024-02-01", title: "Powerful workstation", comment: "Compiles code super fast. Great for virtual machines and heavy development.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["zenbook-pro-14-oled"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/cyberbook_pro_16.glb",
  },
  {
    id: "homeserver-nas-4-bay",
    name: "HomeServer NAS 4-Bay",
    category: "Smart Home", // Changed category from Storage to Smart Home
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 350000.00,
    originalPrice: 380000.00,
    discountPercentage: 8,
    rating: 4.6,
    reviewCount: 60,
    tag: "Storage",
    tagVariant: "default",
    limitedStock: false,
    fullDescription: `The HomeServer NAS 4-Bay is a powerful network-attached storage solution for your home or small office. Easily store, share, and back up all your digital files, photos, and videos. Supports up to 4 hard drives for massive capacity and data redundancy. Stream media to all your devices.`,
    keyFeatures: [
      "4-bay network-attached storage (NAS)",
      "Centralized data storage and backup",
      "Media streaming capabilities",
      "Data redundancy (RAID support)",
      "Easy setup and management",
    ],
    applications: `Ideal for families, content creators, and small businesses needing a reliable and scalable solution for storing large amounts of data, media streaming, and secure backups.`,
    detailedSpecs: [
      {
        group: "Storage",
        items: [
          { label: "Drive Bays", value: "4x 3.5-inch/2.5-inch SATA" },
          { label: "Max Capacity", value: "Up to 80TB (20TB per drive)" },
          { label: "RAID Support", value: "RAID 0, 1, 5, 6, 10" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "Ethernet", value: "2x Gigabit Ethernet" },
          { label: "USB", value: "2x USB 3.0" },
        ],
      },
    ],
    reviews: [
      { id: "rev52", author: "DataHoarder", rating: 5, date: "2024-02-10", title: "Excellent home server!", comment: "Easy to set up, fast transfers, and I feel much safer with my data backed up.", isVerifiedBuyer: true },
      { id: "rev53", author: "MediaStreamer", rating: 4, date: "2024-02-08", title: "Great for Plex", comment: "Streams all my movies without a hitch. The interface could be a bit more modern.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["ultrafast-1tb-external-ssd"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/homeserver_nas_4_bay.glb",
  },
  {
    id: "smartdesk-standing-desk",
    name: "SmartDesk Standing Desk",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 280000.00,
    originalPrice: 300000.00,
    discountPercentage: 7,
    rating: 4.7,
    reviewCount: 100,
    tag: "Ergonomic",
    tagVariant: "default",
    limitedStock: false,
    fullDescription: `Improve your posture and productivity with the SmartDesk Standing Desk. This electric height-adjustable desk allows you to seamlessly switch between sitting and standing positions throughout your workday. Features a sturdy frame, quiet motors, and programmable memory presets for your preferred heights.`,
    keyFeatures: [
      "Electric height adjustment",
      "Sturdy steel frame",
      "Quiet dual motors",
      "Programmable memory presets",
      "Spacious desktop",
    ],
    applications: `Ideal for remote workers, office professionals, and students who want to incorporate more movement into their workday, reduce sedentary time, and improve overall well-being.`,
    detailedSpecs: [
      {
        group: "Mechanism",
        items: [
          { label: "Type", value: "Electric" },
          { label: "Motors", value: "Dual Motors" },
          { label: "Height Range", value: "70cm - 120cm" },
          { label: "Lift Speed", value: "38mm/s" },
        ],
      },
      {
        group: "Design",
        items: [
          { label: "Frame Material", value: "Steel" },
          { label: "Desktop Size", value: "120cm x 60cm (Customizable)" },
        ],
      },
    ],
    reviews: [
      { id: "rev54", author: "WorkFromHome", rating: 5, date: "2024-02-15", title: "Game-changer for my home office!", comment: "Easy to assemble, super stable, and I feel so much better standing throughout the day.", isVerifiedBuyer: true },
      { id: "rev55", author: "ProductivityHack", rating: 4, date: "2024-02-12", title: "Great desk, minor wobble at max height", comment: "Mostly solid, but there's a slight wobble when fully extended. Still highly recommend.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["ergofit-wireless-keyboard"],
    // Removed has3DModel?: boolean;
    // Removed modelPath: "/models/smartdesk_standing_desk.glb",
  },
];

export const getProductById = (id: string): ProductDetails | undefined => {
  return mockProducts.find(product => product.id === id);
};

export const getProductsByIds = (ids: string[]): ProductDetails[] => {
  return ids.map(id => getProductById(id)).filter((product): product is ProductDetails => product !== undefined);
};

// Helper to get a few random products for recommendations
export const getRandomProducts = (count: number, excludeId?: string): Product[] => {
  const filteredProducts = excludeId ? mockProducts.filter(p => p.id !== excludeId) : mockProducts;
  const shuffled = [...filteredProducts].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count).map(p => ({
    id: p.id,
    name: p.name,
    category: p.category,
    images: p.images,
    price: p.price,
    originalPrice: p.originalPrice,
    discountPercentage: p.discountPercentage,
    rating: p.rating,
    reviewCount: p.reviewCount,
    tag: p.tag,
    tagVariant: p.tagVariant,
    limitedStock: p.limitedStock,
    specs: p.specs,
  }));
};

// Helper to get products for "Recently Viewed" (now uses actual IDs)
export const getRecentlyViewedProducts = (recentlyViewedIds: string[], currentProductId?: string): Product[] => {
  // Filter out the current product from the list of IDs if it's there
  const filteredIds = recentlyViewedIds.filter(id => id !== currentProductId);
  // Get the actual product objects based on these IDs
  const products = getProductsByIds(filteredIds);
  return products;
};
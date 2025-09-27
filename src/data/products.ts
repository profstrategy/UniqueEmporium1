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
  has3DModel?: boolean; // New property for 3D viewer
  modelPath?: string; // Optional path to the 3D model file
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
    has3DModel: true, // Example: This product has a 3D model
    modelPath: "/models/laptop.glb", // Placeholder path for a GLB model
  },
  {
    id: "soundwave-max-headphones",
    name: "SoundWave Max Headphones",
    category: "Audio",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 175000.00,
    rating: 4.5,
    reviewCount: 230,
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
    has3DModel: true,
    modelPath: "/models/headphones.glb", // Placeholder path
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
    reviewCount: 95,
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
    reviewCount: 310,
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
    has3DModel: true,
    modelPath: "/models/mouse.glb", // Placeholder path
  },
  {
    id: "smarthome-hub-pro",
    name: "SmartHome Hub Pro",
    category: "Smart Home",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 65000.00,
    rating: 4.2,
    reviewCount: 80,
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
    discountPercentage: 17,
    rating: 4.9,
    reviewCount: 450,
    tag: "Limited Stock",
    tagVariant: "destructive",
    fullDescription: `Revolutionize your charging experience with the PowerCharge 100W GaN Charger. Utilizing advanced Gallium Nitride (GaN) technology, this compact charger delivers a massive 100W of power, capable of fast-charging laptops, tablets, and smartphones simultaneously. With two USB-C ports and one USB-A port, it's the only charger you'll need for all your devices. Its intelligent power distribution ensures optimal charging speeds for each connected device.`,
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
      {
        group: "Technology",
        items: [
          { label: "Chipset", value: "GaN (Gallium Nitride)" },
          { label: "Fast Charging", value: "Power Delivery 3.0, Quick Charge 3.0" },
        ],
      },
      {
        group: "Physical",
        items: [
          { label: "Dimensions", value: "6.5 x 6.5 x 3 cm", icon: Ruler },
          { label: "Weight", value: "180g", icon: Weight },
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
      },
      {
        id: "rev12",
        author: "Quinn R.",
        rating: 5,
        date: "2023-11-08",
        title: "Replaced all my other chargers",
        comment: "Finally, one charger for everything. No more bulky power bricks. Works perfectly.",
      },
    ],
    relatedProducts: ["ergogrip-wireless-mouse"],
  },
  {
    id: "gaming-beast-laptop",
    name: "Gaming Beast Laptop",
    category: "Laptops",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 1200000.00,
    originalPrice: 1300000.00,
    discountPercentage: 8,
    rating: 4.9,
    reviewCount: 200,
    tag: "Gaming",
    tagVariant: "destructive",
    limitedStock: false,
    fullDescription: `Unleash the ultimate gaming experience with the Gaming Beast Laptop. Equipped with a powerful Intel i9 processor and NVIDIA GeForce RTX 4080 graphics, it delivers unparalleled performance for the most demanding games and creative applications. The 17-inch QHD 165Hz display ensures buttery-smooth visuals, while advanced cooling keeps temperatures in check during intense sessions. Dominate the competition with this portable powerhouse.`,
    detailedSpecs: [
      {
        group: "Performance",
        items: [
          { icon: Cpu, label: "CPU", value: "Intel Core i9-13900HX" },
          { icon: MemoryStick, label: "RAM", value: "32GB DDR5" },
          { icon: HardDrive, label: "Storage", value: "1TB NVMe SSD" },
          { label: "Graphics", value: "NVIDIA GeForce RTX 4080" },
        ],
      },
      {
        group: "Display",
        items: [
          { icon: Monitor, label: "Size", value: "17-inch" },
          { label: "Resolution", value: "QHD (2560x1440)" },
          { label: "Refresh Rate", value: "165Hz" },
          { label: "Response Time", value: "3ms" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { icon: Wifi, label: "Wi-Fi", value: "Wi-Fi 6E" },
          { label: "Bluetooth", value: "Bluetooth 5.3" },
          { label: "Ports", value: "2x USB-C (Thunderbolt 4), 2x USB-A 3.2, HDMI 2.1, Ethernet" },
        ],
      },
      {
        group: "Physical",
        items: [
          { icon: Weight, label: "Weight", value: "2.8 kg" },
          { icon: BatteryCharging, label: "Battery", value: "90Wh (Up to 8 hours)" },
        ],
      },
    ],
    reviews: [
      {
        id: "rev13",
        author: "Sam T.",
        rating: 5,
        date: "2023-11-15",
        title: "Absolute monster!",
        comment: "This laptop handles everything I throw at it. Games run flawlessly at max settings. Best gaming laptop I've ever owned.",
      },
      {
        id: "rev14",
        author: "Uma V.",
        rating: 5,
        date: "2023-11-12",
        title: "Worth every penny",
        comment: "Incredible performance, stunning display, and surprisingly good thermals. Highly recommended for serious gamers.",
      },
    ],
    relatedProducts: ["ultrawide-monitor-32", "mechanical-rgb-keyboard"],
  },
  {
    id: "noise-cancelling-earbuds",
    name: "Noise Cancelling Earbuds",
    category: "Audio",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 85000.00,
    rating: 4.7,
    reviewCount: 180,
    tag: "New",
    tagVariant: "default",
    fullDescription: `Experience crystal-clear audio and serene silence with our Noise Cancelling Earbuds. Perfect for commutes, workouts, or just finding your focus, these earbuds feature advanced hybrid active noise cancellation. Enjoy rich, balanced sound with deep bass and crisp highs. With a comfortable, secure fit and up to 24 hours of combined battery life (with charging case), they're your perfect audio companion.`,
    detailedSpecs: [
      {
        group: "Audio",
        items: [
          { label: "Driver Size", value: "10mm" },
          { label: "Noise Cancellation", value: "Hybrid ANC" },
          { label: "Transparency Mode", value: "Yes" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "Bluetooth", value: "Bluetooth 5.3" },
          { label: "Codecs", value: "SBC, AAC" },
        ],
      },
      {
        group: "Battery",
        items: [
          { label: "Earbud Battery", value: "6 hours (ANC on)" },
          { label: "Total Battery (with case)", value: "24 hours", icon: BatteryCharging },
          { label: "Charging Port", value: "USB-C" },
        ],
      },
      {
        group: "Features",
        items: [
          { label: "Microphone", value: "Dual-mic for calls", icon: Mic },
          { label: "Water Resistance", value: "IPX4" },
          { label: "Controls", value: "Touch controls" },
        ],
      },
    ],
    reviews: [
      {
        id: "rev15",
        author: "Walter X.",
        rating: 4,
        date: "2023-11-01",
        title: "Great sound, good ANC",
        comment: "For the price, these are fantastic. ANC works well, and the sound is clear. Comfortable for long periods.",
      },
      {
        id: "rev16",
        author: "Yara Z.",
        rating: 5,
        date: "2023-10-29",
        title: "Perfect for my daily commute",
        comment: "Blocks out all the train noise. Battery lasts all day. Very happy with this purchase.",
      },
    ],
    relatedProducts: ["soundwave-max-headphones"],
  },
  {
    id: "curved-ultrawide-monitor",
    name: "Curved Ultrawide Monitor",
    category: "Monitors",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 550000.00,
    originalPrice: 600000.00,
    discountPercentage: 9,
    rating: 4.8,
    reviewCount: 110,
    fullDescription: `Dive into an expansive visual experience with the Curved Ultrawide Monitor. Its immersive 1800R curvature and UWQHD resolution provide a panoramic view, perfect for multitasking, content creation, and cinematic gaming. The 120Hz refresh rate ensures smooth motion, while the vibrant display brings every detail to life. Enhance your productivity and entertainment with this stunning ultrawide display.`,
    detailedSpecs: [
      {
        group: "Display",
        items: [
          { icon: Monitor, label: "Size", value: "34-inch" },
          { label: "Resolution", value: "UWQHD (3440x1440)" },
          { label: "Curvature", value: "1800R" },
          { label: "Panel Type", value: "VA" },
          { label: "Refresh Rate", value: "120Hz" },
          { label: "Response Time", value: "4ms (GtG)" },
        ],
      },
      {
        group: "Connectivity",
        items: [
          { label: "HDMI", value: "2x HDMI 2.0" },
          { label: "DisplayPort", value: "1x DisplayPort 1.4" },
          { label: "USB Hub", value: "2x USB 3.0" },
        ],
      },
      {
        group: "Features",
        items: [
          { label: "FreeSync", value: "AMD FreeSync Premium" },
          { label: "Picture-by-Picture", value: "Yes" },
        ],
      },
    ],
    reviews: [
      {
        id: "rev17",
        author: "Adam B.",
        rating: 5,
        date: "2023-11-07",
        title: "Incredible immersion!",
        comment: "The ultrawide aspect ratio and curve are amazing for gaming and productivity. No going back!",
      },
      {
        id: "rev18",
        author: "Brenda C.",
        rating: 4,
        date: "2023-11-04",
        title: "Great for work, decent for gaming",
        comment: "Perfect for my coding setup. Gaming is good, but not as fast as a dedicated gaming monitor.",
      },
    ],
    relatedProducts: ["gaming-beast-laptop", "ergogrip-wireless-mouse"],
  },
  {
    id: "mechanical-rgb-keyboard",
    name: "Mechanical RGB Keyboard",
    category: "Accessories",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 70000.00,
    rating: 4.6,
    reviewCount: 250,
    tag: "Popular",
    tagVariant: "secondary",
    fullDescription: `Elevate your typing and gaming with the Mechanical RGB Keyboard. Featuring tactile brown switches, it provides a satisfying keystroke with excellent responsiveness. The per-key RGB backlighting is fully customizable, allowing you to create stunning light shows or highlight important keys. Its durable aluminum frame and full-size layout make it a robust and versatile choice for any setup.`,
    detailedSpecs: [
      {
        group: "Keys",
        items: [
          { label: "Switch Type", value: "Brown Mechanical" },
          { label: "Key Rollover", value: "N-Key Rollover" },
          { label: "Keycaps", value: "Double-shot ABS" },
        ],
      },
      {
        group: "Lighting",
        items: [
          { label: "Backlight", value: "Per-key RGB" },
          { label: "Customization", value: "Software controlled" },
        ],
      },
      {
        group: "Design",
        items: [
          { label: "Layout", value: "Full-size (104 keys)" },
          { label: "Frame Material", value: "Aluminum" },
          { label: "Connectivity", value: "USB-A (Braided Cable)" },
        ],
      },
    ],
    reviews: [
      {
        id: "rev19",
        author: "Daniel E.",
        rating: 5,
        date: "2023-10-25",
        title: "Fantastic keyboard!",
        comment: "The brown switches feel great, and the RGB is vibrant. Very sturdy build quality.",
      },
      {
        id: "rev20",
        author: "Fiona G.",
        rating: 4,
        date: "2023-10-20",
        title: "A bit loud, but excellent performance",
        comment: "Love the feel and responsiveness, but it's definitely clicky. My colleagues can hear me type!",
      },
    ],
    relatedProducts: ["ergogrip-wireless-mouse", "gaming-beast-laptop"],
  },
  {
    id: "smart-doorbell-camera",
    name: "Smart Doorbell Camera",
    category: "Smart Home",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 110000.00,
    rating: 4.5,
    reviewCount: 90,
    limitedStock: true,
    fullDescription: `Enhance your home security with the Smart Doorbell Camera. See, hear, and speak to visitors from anywhere using your smartphone. Featuring 1080p HD video, a wide 160° field of view, and advanced motion detection, you'll never miss a moment. Two-way audio allows for clear communication, and cloud/local storage options keep your recordings safe. Easy to install and integrate with existing smart home systems.`,
    detailedSpecs: [
      {
        group: "Camera",
        items: [
          { icon: Camera, label: "Resolution", value: "1080p HD" },
          { label: "Field of View", value: "160°" },
          { label: "Night Vision", value: "Infrared" },
        ],
      },
      {
        group: "Audio",
        items: [
          { label: "Two-Way Audio", value: "Yes", icon: Mic },
          { label: "Noise Cancellation", value: "Yes" },
        ],
      },
      {
        group: "Features",
        items: [
          { label: "Motion Detection", value: "Customizable zones" },
          { label: "Storage", value: "Cloud (subscription) / Local (microSD)" },
          { label: "Connectivity", value: "Wi-Fi 2.4GHz", icon: Wifi },
        ],
      },
      {
        group: "Power",
        items: [
          { label: "Power Source", value: "Wired (existing doorbell wiring) / Battery" },
          { label: "Battery Life", value: "Up to 6 months (battery model)", icon: BatteryCharging },
        ],
      },
    ],
    reviews: [
      {
        id: "rev21",
        author: "George H.",
        rating: 5,
        date: "2023-11-03",
        title: "Excellent security addition!",
        comment: "Clear video, reliable motion alerts, and easy to talk to visitors. Feel much safer.",
      },
      {
        id: "rev22",
        author: "Hannah I.",
        rating: 4,
        date: "2023-10-30",
        title: "Good, but battery drains fast with high activity",
        comment: "Works as advertised. Battery life is shorter than expected in a busy area, but still good.",
      },
    ],
    relatedProducts: ["smarthome-hub-pro"],
  },
  {
    id: "portable-ssd-2tb",
    name: "Portable SSD 2TB",
    category: "Storage",
    images: ["/placeholder.svg", "/placeholder.svg"],
    price: 150000.00,
    originalPrice: 165000.00,
    discountPercentage: 9,
    rating: 4.7,
    reviewCount: 130,
    tag: "Sale",
    tagVariant: "destructive",
    fullDescription: `Carry your data with confidence and speed using the Portable SSD 2TB. This ultra-fast external solid-state drive offers massive storage capacity in a pocket-sized design. With USB 3.2 Gen2 connectivity, achieve blazing-fast read/write speeds of up to 1000MB/s, perfect for large files, 4K videos, and gaming libraries. Its durable, shock-resistant build ensures your data is safe on the go.`,
    detailedSpecs: [
      {
        group: "Storage",
        items: [
          { icon: HardDrive, label: "Capacity", value: "2TB" },
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
      {
        group: "Physical",
        items: [
          { label: "Dimensions", value: "85 x 57 x 8 mm", icon: Ruler },
          { label: "Weight", value: "58g", icon: Weight },
          { label: "Durability", value: "Shock-resistant" },
        ],
      },
      {
        group: "Compatibility",
        items: [
          { label: "OS", value: "Windows, macOS, Android, Linux, Gaming Consoles" },
          { label: "Connector", value: "USB-C" },
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
      },
      {
        id: "rev24",
        author: "Laura M.",
        rating: 4,
        date: "2023-11-06",
        title: "Great, but runs warm",
        comment: "Performance is excellent, but it gets noticeably warm during sustained transfers. Not a dealbreaker.",
      },
    ],
    relatedProducts: ["zenbook-pro-14-oled"],
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

// Helper to get products for "Recently Viewed" (mocked for now)
export const getRecentlyViewedProducts = (count: number, currentProductId?: string): Product[] => {
  // In a real app, this would come from user history.
  // For now, let's just pick some random ones, excluding the current product.
  const allOtherProducts = mockProducts.filter(p => p.id !== currentProductId);
  const shuffled = [...allOtherProducts].sort(() => 0.5 - Math.random());
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
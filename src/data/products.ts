import { Shirt, Baby, Gem, Ruler, Palette, Tag, ShieldCheck, Star, Heart, ShoppingBag, Sun, Watch, Glasses } from "lucide-react"; // Updated icons for fashion
import { Product } from "@/components/products/ProductCard.tsx";

export interface ProductDetails extends Product {
  fullDescription: string;
  keyFeatures: string[];
  styleNotes: string; // New field for fashion styling tips
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
    isVerifiedBuyer: boolean;
  }[];
  relatedProducts: string[];
  modelPath?: string;
}

export const mockProducts: ProductDetails[] = [
  {
    id: "shein-floral-maxi-gown",
    name: "SHEIN Elegant Floral Maxi Gown",
    category: "SHEIN Gowns",
    images: [
      "https://images.unsplash.com/photo-1581044777550-4cfa607037dc?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1590488181343-771891291110?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1590488181343-771891291110?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    price: 35000.00,
    originalPrice: 40000.00,
    discountPercentage: 12,
    rating: 4.7,
    reviewCount: 180,
    tag: "New Arrival",
    tagVariant: "default",
    limitedStock: true,
    fullDescription: `Step out in style with this elegant SHEIN floral maxi gown. Crafted from lightweight, breathable fabric, it features a flattering silhouette and vibrant floral print, perfect for any occasion. Its comfortable fit and chic design make it a must-have for your wardrobe.`,
    keyFeatures: [
      "Flowy, breathable fabric for ultimate comfort",
      "Vibrant and elegant floral print",
      "Flattering maxi length silhouette",
      "Perfect for casual outings or special events",
      "Adjustable waist tie for a custom fit",
    ],
    styleNotes: `Pair with sandals for a relaxed daytime look or dress it up with heels and statement jewelry for an evening event. A wide-brimmed hat completes the perfect summer ensemble.`,
    detailedSpecs: [
      {
        group: "Fabric & Care",
        items: [
          { label: "Material", value: "100% Polyester", icon: Shirt },
          { label: "Care Instructions", value: "Machine wash cold, tumble dry low" },
          { label: "Stretch", value: "Non-stretch" },
        ],
      },
      {
        group: "Fit & Sizing",
        items: [
          { label: "Fit Type", value: "Regular Fit", icon: Ruler },
          { label: "Neckline", value: "V-Neck" },
          { label: "Sleeve Length", value: "Short Sleeve" },
          { label: "Hem Length", value: "Maxi" },
        ],
      },
    ],
    specs: [
      { icon: Shirt, label: "Material", value: "Polyester" },
      { icon: Ruler, label: "Fit", value: "Regular" },
      { icon: Palette, label: "Color", value: "Floral" },
      { icon: Tag, label: "Brand", value: "SHEIN" },
    ],
    reviews: [
      { id: "rev1", author: "Aisha O.", rating: 5, date: "2024-07-20", title: "Absolutely beautiful!", comment: "The gown is even prettier in person. So comfortable and perfect for Nigerian weather.", isVerifiedBuyer: true },
      { id: "rev2", author: "Funke A.", rating: 4, date: "2024-07-15", title: "Great value", comment: "Love the print and the fit. A bit long for me, but easily altered.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["shein-ruffle-mini-dress", "ladies-fashion-bundle-casual"],
    modelPath: "/models/shein_floral_maxi_gown.glb", // Placeholder 3D model
  },
  {
    id: "vintage-graphic-tee-90s",
    name: "Vintage 90s Graphic T-Shirt",
    category: "Vintage Shirts",
    images: [
      "https://images.unsplash.com/photo-1576566588028-cdfd73055d8b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1576566588028-cdfd73055d8b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1576566588028-cdfd73055d8b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    price: 12000.00,
    originalPrice: 15000.00,
    discountPercentage: 20,
    rating: 4.5,
    reviewCount: 120,
    tag: "Thrift Find",
    tagVariant: "secondary",
    limitedStock: false,
    fullDescription: `Relive the 90s with this authentic vintage graphic t-shirt. Each piece is hand-picked for its unique design and excellent condition, offering a sustainable and stylish addition to your wardrobe. Soft, worn-in cotton ensures maximum comfort.`,
    keyFeatures: [
      "Authentic 90s vintage design",
      "Soft, pre-loved cotton for comfort",
      "Unique graphic print, one-of-a-kind",
      "Excellent condition, carefully curated",
      "Sustainable fashion choice",
    ],
    styleNotes: `Pair with distressed jeans and sneakers for a classic retro look, or layer under a blazer for a modern streetwear vibe. Perfect for adding a touch of nostalgia to your outfit.`,
    detailedSpecs: [
      {
        group: "Fabric & Care",
        items: [
          { label: "Material", value: "100% Cotton", icon: Shirt },
          { label: "Condition", value: "Used - Excellent" },
          { label: "Care Instructions", value: "Machine wash cold, hang dry" },
        ],
      },
      {
        group: "Fit & Sizing",
        items: [
          { label: "Fit Type", value: "Relaxed Fit", icon: Ruler },
          { label: "Size", value: "Varies (S-XL available)" },
          { label: "Neckline", value: "Crew Neck" },
        ],
      },
    ],
    specs: [
      { icon: Shirt, label: "Material", value: "Cotton" },
      { icon: Ruler, label: "Fit", value: "Relaxed" },
      { icon: Tag, label: "Era", value: "90s Vintage" },
      { icon: Gem, label: "Condition", value: "Excellent" },
    ],
    reviews: [
      { id: "rev3", author: "Chinedu E.", rating: 5, date: "2024-07-18", title: "Love my new vintage tee!", comment: "The graphic is amazing, and it feels so soft. Exactly as described.", isVerifiedBuyer: true },
      { id: "rev4", author: "Ngozi I.", rating: 4, date: "2024-07-10", title: "Great find", comment: "Unique design, good quality. A little faded, but that's part of the charm!", isVerifiedBuyer: false },
    ],
    relatedProducts: ["vintage-denim-jacket", "mens-fashion-bundle-streetwear"],
    modelPath: "/models/vintage_graphic_tee.glb", // Placeholder 3D model
  },
  {
    id: "kids-distressed-denim-jeans",
    name: "Kids' Stylish Distressed Denim Jeans",
    category: "Kids' Jeans",
    images: [
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
    price: 18000.00,
    originalPrice: 22000.00,
    discountPercentage: 18,
    rating: 4.8,
    reviewCount: 95,
    tag: "Kids' Fashion",
    tagVariant: "destructive",
    limitedStock: true,
    fullDescription: `Durable and stylish distressed denim jeans for kids. Made from soft, flexible denim, these jeans are perfect for active children, offering both comfort and a trendy look. Features an adjustable waistband for a perfect fit.`,
    keyFeatures: [
      "Soft and flexible denim for active kids",
      "Trendy distressed details",
      "Adjustable waistband for growing children",
      "Durable construction for long-lasting wear",
      "Easy to mix and match with various tops",
    ],
    styleNotes: `Pair with a graphic tee and sneakers for a cool, casual look. Can be dressed up with a button-down shirt for semi-formal occasions.`,
    detailedSpecs: [
      {
        group: "Fabric & Care",
        items: [
          { label: "Material", value: "98% Cotton, 2% Spandex", icon: Baby },
          { label: "Care Instructions", value: "Machine wash warm, inside out" },
          { label: "Stretch", value: "Slight Stretch" },
        ],
      },
      {
        group: "Fit & Sizing",
        items: [
          { label: "Fit Type", value: "Slim Fit", icon: Ruler },
          { label: "Sizes Available", value: "2T, 3T, 4T, 5, 6, 7, 8" },
          { label: "Waist", value: "Adjustable Elastic" },
        ],
      },
    ],
    specs: [
      { icon: Baby, label: "Material", value: "Cotton Blend" },
      { icon: Ruler, label: "Fit", value: "Slim" },
      { icon: Palette, label: "Color", value: "Blue Denim" },
      { icon: Tag, label: "Style", value: "Distressed" },
    ],
    reviews: [
      { id: "rev5", author: "Blessing N.", rating: 5, date: "2024-07-22", title: "My son loves them!", comment: "Great quality and super stylish. They fit perfectly and he can move around easily.", isVerifiedBuyer: true },
      { id: "rev6", author: "Tunde O.", rating: 4, date: "2024-07-19", title: "Good, but a bit pricey", comment: "Nice jeans, but I wish they were a bit more affordable. Still, happy with the purchase.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["kids-graphic-hoodie", "kids-fashion-bundle-playtime"],
    modelPath: "/models/kids_distressed_jeans.glb", // Placeholder 3D model
  },
  {
    id: "ladies-fashion-bundle-casual",
    name: "Ladies' Casual Chic Fashion Bundle",
    category: "Fashion Bundles",
    images: [
      "https://images.unsplash.com/photo-1523381294911-8d3cead13f7c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13f7c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13f7c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 65000.00,
    originalPrice: 80000.00,
    discountPercentage: 18,
    rating: 4.6,
    reviewCount: 75,
    tag: "Best Seller",
    tagVariant: "destructive",
    limitedStock: false,
    fullDescription: `Elevate your everyday style with our Ladies' Casual Chic Fashion Bundle. This curated collection includes a stylish top, comfortable jeans, and a versatile accessory, all designed to create effortless and fashionable outfits. Perfect for the modern Nigerian woman.`,
    keyFeatures: [
      "Curated 3-piece outfit for effortless styling",
      "High-quality, comfortable fabrics",
      "Versatile pieces for various occasions",
      "Trendy designs for a chic look",
      "Great value for a complete ensemble",
    ],
    styleNotes: `Mix and match the pieces with your existing wardrobe for endless outfit possibilities. Add a pair of heels for a night out or sneakers for a casual day.`,
    detailedSpecs: [
      {
        group: "Bundle Contents",
        items: [
          { label: "Item 1", value: "Floral Blouse", icon: Shirt },
          { label: "Item 2", value: "High-Waist Jeans", icon: Ruler },
          { label: "Item 3", value: "Statement Necklace", icon: Gem },
        ],
      },
      {
        group: "General",
        items: [
          { label: "Sizes Available", value: "S, M, L, XL" },
          { label: "Colors", value: "Assorted" },
          { label: "Condition", value: "New" },
        ],
      },
    ],
    specs: [
      { icon: ShoppingBag, label: "Items", value: "3-Piece" },
      { icon: Ruler, label: "Sizes", value: "S-XL" },
      { icon: Palette, label: "Style", value: "Casual Chic" },
      { icon: Tag, label: "Value", value: "Bundle Deal" },
    ],
    reviews: [
      { id: "rev7", author: "Amaka J.", rating: 5, date: "2024-07-25", title: "Love this bundle!", comment: "All the pieces are beautiful and fit well. Such a great deal for the price.", isVerifiedBuyer: true },
      { id: "rev8", author: "Chioma K.", rating: 4, date: "2024-07-20", title: "Good quality", comment: "Happy with the purchase, though the necklace was a bit different than expected.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["shein-floral-maxi-gown", "luxury-thrift-silk-scarf"],
    modelPath: "/models/ladies_fashion_bundle.glb", // Placeholder 3D model
  },
  {
    id: "luxury-thrift-silk-scarf",
    name: "Luxury Thrift Silk Scarf (Designer)",
    category: "Luxury Thrift",
    images: [
      "https://images.unsplash.com/photo-1588891237197-f7171102282a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1588891237197-f7171102282a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1588891237197-f7171102282a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 28000.00,
    originalPrice: 35000.00,
    discountPercentage: 20,
    rating: 4.9,
    reviewCount: 50,
    tag: "Premium Thrift",
    tagVariant: "destructive",
    limitedStock: true,
    fullDescription: `Discover a touch of luxury with this exquisite pre-loved silk scarf from a renowned designer. Each scarf is carefully inspected to ensure excellent condition, offering a sustainable way to own high-end fashion. Perfect for adding a sophisticated flair to any outfit.`,
    keyFeatures: [
      "Authentic designer silk scarf",
      "Luxurious 100% silk material",
      "Unique patterns and vibrant colors",
      "Excellent pre-loved condition",
      "Versatile styling accessory",
    ],
    styleNotes: `Wear it around your neck, tie it to your handbag, or use it as a headscarf for a chic and elegant look. A timeless piece that elevates any ensemble.`,
    detailedSpecs: [
      {
        group: "Material & Origin",
        items: [
          { label: "Material", value: "100% Silk", icon: Gem },
          { label: "Condition", value: "Used - Excellent" },
          { label: "Brand", value: "Assorted Designer" },
        ],
      },
      {
        group: "Dimensions",
        items: [
          { label: "Size", value: "90cm x 90cm (approx)", icon: Ruler },
          { label: "Shape", value: "Square" },
        ],
      },
    ],
    specs: [
      { icon: Gem, label: "Material", value: "100% Silk" },
      { icon: Tag, label: "Brand", value: "Designer" },
      { icon: Ruler, label: "Size", value: "90x90cm" },
      { icon: ShieldCheck, label: "Condition", value: "Excellent" },
    ],
    reviews: [
      { id: "rev9", author: "Fatima G.", rating: 5, date: "2024-07-28", title: "Stunning quality!", comment: "The scarf is absolutely gorgeous and feels so luxurious. Looks brand new!", isVerifiedBuyer: true },
      { id: "rev10", author: "Kemi L.", rating: 5, date: "2024-07-26", title: "My new favorite accessory", comment: "Adds so much elegance to my outfits. Very happy with this thrift find.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["shein-floral-maxi-gown", "ladies-fashion-bundle-casual"],
    modelPath: "/models/silk_scarf.glb", // Placeholder 3D model
  },
  {
    id: "shein-ruffle-mini-dress",
    name: "SHEIN Ruffle Hem Mini Dress",
    category: "SHEIN Gowns",
    images: [
      "https://images.unsplash.com/photo-1590488181343-771891291110?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1590488181343-771891291110?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1590488181343-771891291110?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 28000.00,
    originalPrice: 32000.00,
    discountPercentage: 12,
    rating: 4.4,
    reviewCount: 110,
    tag: "Trendy",
    tagVariant: "default",
    limitedStock: false,
    fullDescription: `A playful and chic SHEIN mini dress featuring a delicate ruffle hem. Made from a comfortable, slightly stretchy fabric, this dress is perfect for a casual day out or a fun evening with friends. Its vibrant color and flattering cut will make you stand out.`,
    keyFeatures: [
      "Stylish ruffle hem design",
      "Comfortable and slightly stretchy fabric",
      "Vibrant color options",
      "Versatile for day or night wear",
      "Easy to care for and maintain",
    ],
    styleNotes: `Pair with white sneakers for a cute daytime look, or elevate with block heels and a clutch for a night out. Add a denim jacket for a casual layer.`,
    detailedSpecs: [
      {
        group: "Fabric & Care",
        items: [
          { label: "Material", value: "95% Polyester, 5% Spandex", icon: Shirt },
          { label: "Care Instructions", value: "Hand wash cold, do not bleach" },
          { label: "Stretch", value: "Slight Stretch" },
        ],
      },
      {
        group: "Fit & Sizing",
        items: [
          { label: "Fit Type", value: "Slim Fit", icon: Ruler },
          { label: "Neckline", value: "Round Neck" },
          { label: "Sleeve Length", value: "Sleeveless" },
          { label: "Hem Length", value: "Mini" },
        ],
      },
    ],
    specs: [
      { icon: Shirt, label: "Material", value: "Poly/Spandex" },
      { icon: Ruler, label: "Fit", value: "Slim" },
      { icon: Palette, label: "Color", value: "Assorted" },
      { icon: Tag, label: "Brand", value: "SHEIN" },
    ],
    reviews: [
      { id: "rev11", author: "Adaobi C.", rating: 4, date: "2024-07-10", title: "Cute and comfy!", comment: "Love this dress, it's perfect for summer. The ruffles are a nice touch.", isVerifiedBuyer: true },
      { id: "rev12", author: "Gloria M.", rating: 5, date: "2024-07-05", title: "My new favorite!", comment: "Fits perfectly and the fabric is soft. Received many compliments!", isVerifiedBuyer: true },
    ],
    relatedProducts: ["shein-floral-maxi-gown", "ladies-fashion-bundle-casual"],
    modelPath: "/models/shein_ruffle_mini_dress.glb", // Placeholder 3D model
  },
  {
    id: "vintage-denim-jacket",
    name: "Classic Vintage Denim Jacket",
    category: "Vintage Shirts", // Broad category for vintage apparel
    images: [
      "https://images.unsplash.com/photo-1543076447-2159f93a34ee?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1543076447-2159f93a34ee?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1543076447-2159f93a34ee?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 45000.00,
    originalPrice: 55000.00,
    discountPercentage: 18,
    rating: 4.8,
    reviewCount: 60,
    tag: "Timeless",
    tagVariant: "secondary",
    limitedStock: true,
    fullDescription: `A timeless classic, this vintage denim jacket is a wardrobe essential. Each piece is hand-selected for its quality and authentic vintage appeal, offering a unique and durable outer layer. Perfect for all seasons and effortlessly stylish.`,
    keyFeatures: [
      "Authentic vintage denim, unique wash",
      "Durable and high-quality construction",
      "Versatile for layering in any season",
      "Classic fit, never goes out of style",
      "Sustainable fashion choice",
    ],
    styleNotes: `Layer over a hoodie for a casual look, or pair with a dress for an edgy contrast. Can be worn buttoned up or open.`,
    detailedSpecs: [
      {
        group: "Material & Condition",
        items: [
          { label: "Material", value: "100% Cotton Denim", icon: Shirt },
          { label: "Condition", value: "Used - Excellent" },
          { label: "Wash", value: "Medium Blue" },
        ],
      },
      {
        group: "Fit & Sizing",
        items: [
          { label: "Fit Type", value: "Regular Fit", icon: Ruler },
          { label: "Sizes Available", value: "S, M, L" },
          { label: "Closure", value: "Button-Front" },
        ],
      },
    ],
    specs: [
      { icon: Shirt, label: "Material", value: "Denim" },
      { icon: Ruler, label: "Fit", value: "Regular" },
      { icon: Palette, label: "Color", value: "Blue" },
      { icon: Gem, label: "Condition", value: "Excellent" },
    ],
    reviews: [
      { id: "rev13", author: "David O.", rating: 5, date: "2024-07-29", title: "Perfect vintage jacket!", comment: "The wash is exactly what I wanted, and it fits great. So happy with this purchase.", isVerifiedBuyer: true },
      { id: "rev14", author: "Sarah U.", rating: 4, date: "2024-07-25", title: "Good quality, a bit stiff", comment: "Solid jacket, but it's a bit stiff initially. I'm sure it will soften with wear.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["vintage-graphic-tee-90s", "mens-fashion-bundle-streetwear"],
    modelPath: "/models/vintage_denim_jacket.glb", // Placeholder 3D model
  },
  {
    id: "kids-graphic-hoodie",
    name: "Kids' Fun Graphic Hoodie",
    category: "Kids' Jeans", // Broad category for kids' apparel
    images: [
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 15000.00,
    originalPrice: 18000.00,
    discountPercentage: 16,
    rating: 4.7,
    reviewCount: 80,
    tag: "Cozy",
    tagVariant: "secondary",
    limitedStock: false,
    fullDescription: `Keep your little ones warm and stylish with this fun graphic hoodie. Made from soft, fleece-lined cotton, it's perfect for cooler days and playful adventures. Features a vibrant graphic print and a comfortable fit.`,
    keyFeatures: [
      "Soft, fleece-lined cotton for warmth",
      "Vibrant and playful graphic print",
      "Comfortable hood and kangaroo pocket",
      "Durable for everyday wear and play",
      "Easy to layer over t-shirts",
    ],
    styleNotes: `Pair with jeans or joggers for a comfortable and casual outfit. Great for school, playdates, or just lounging at home.`,
    detailedSpecs: [
      {
        group: "Fabric & Care",
        items: [
          { label: "Material", value: "80% Cotton, 20% Polyester", icon: Baby },
          { label: "Care Instructions", value: "Machine wash cold, inside out" },
          { label: "Season", value: "All-season" },
        ],
      },
      {
        group: "Fit & Sizing",
        items: [
          { label: "Fit Type", value: "Regular Fit", icon: Ruler },
          { label: "Sizes Available", value: "2T, 3T, 4T, 5, 6, 7, 8" },
          { label: "Sleeve Length", value: "Long Sleeve" },
        ],
      },
    ],
    specs: [
      { icon: Baby, label: "Material", value: "Cotton Blend" },
      { icon: Ruler, label: "Fit", value: "Regular" },
      { icon: Palette, label: "Color", value: "Assorted" },
      { icon: Tag, label: "Style", value: "Graphic" },
    ],
    reviews: [
      { id: "rev15", author: "Nkechi P.", rating: 5, date: "2024-07-27", title: "My daughter loves it!", comment: "The print is so cute, and it's very soft. She wears it all the time.", isVerifiedBuyer: true },
      { id: "rev16", author: "Segun R.", rating: 4, date: "2024-07-23", title: "Good hoodie", comment: "Warm and comfortable. The sizing was accurate.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["kids-distressed-denim-jeans", "kids-fashion-bundle-playtime"],
    modelPath: "/models/kids_graphic_hoodie.glb", // Placeholder 3D model
  },
  {
    id: "mens-fashion-bundle-streetwear",
    name: "Men's Urban Streetwear Fashion Bundle",
    category: "Fashion Bundles",
    images: [
      "https://images.unsplash.com/photo-1523381294911-8d3cead13f7c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13f7c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1523381294911-8d3cead13f7c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 75000.00,
    originalPrice: 90000.00,
    discountPercentage: 16,
    rating: 4.7,
    reviewCount: 65,
    tag: "Trending",
    tagVariant: "destructive",
    limitedStock: false,
    fullDescription: `Curated for the modern man, our Urban Streetwear Fashion Bundle offers a complete look with a stylish tee, comfortable joggers, and a trendy cap. All pieces are selected for their quality, comfort, and contemporary design, perfect for making a statement.`,
    keyFeatures: [
      "Complete 3-piece streetwear outfit",
      "Premium quality fabrics for comfort and durability",
      "Modern, urban designs",
      "Versatile pieces for casual and semi-casual wear",
      "Excellent value for a coordinated look",
    ],
    styleNotes: `Wear the full set for an instant streetwear vibe, or mix and match with other items in your wardrobe. Add chunky sneakers to complete the look.`,
    detailedSpecs: [
      {
        group: "Bundle Contents",
        items: [
          { label: "Item 1", value: "Graphic T-Shirt", icon: Shirt },
          { label: "Item 2", value: "Cargo Joggers", icon: Ruler },
          { label: "Item 3", value: "Baseball Cap", icon: Tag },
        ],
      },
      {
        group: "General",
        items: [
          { label: "Sizes Available", value: "M, L, XL, XXL" },
          { label: "Colors", value: "Assorted" },
          { label: "Condition", value: "New" },
        ],
      },
    ],
    specs: [
      { icon: ShoppingBag, label: "Items", value: "3-Piece" },
      { icon: Ruler, label: "Sizes", value: "M-XXL" },
      { icon: Palette, label: "Style", value: "Streetwear" },
      { icon: Tag, label: "Value", value: "Bundle Deal" },
    ],
    reviews: [
      { id: "rev17", author: "Kunle S.", rating: 5, date: "2024-07-30", title: "Fresh look!", comment: "This bundle is fire! Everything fits well and looks great together. Highly recommend.", isVerifiedBuyer: true },
      { id: "rev18", author: "Emeka T.", rating: 4, date: "2024-07-26", title: "Good quality for the price", comment: "The materials are good, and the style is on point. Happy with my purchase.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["vintage-graphic-tee-90s", "vintage-denim-jacket"],
    modelPath: "/models/mens_fashion_bundle.glb", // Placeholder 3D model
  },
  {
    id: "kids-fashion-bundle-playtime",
    name: "Kids' Playtime Essentials Fashion Bundle",
    category: "Fashion Bundles",
    images: [
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 40000.00,
    originalPrice: 50000.00,
    discountPercentage: 20,
    rating: 4.5,
    reviewCount: 70,
    tag: "Kids' Value",
    tagVariant: "secondary",
    limitedStock: false,
    fullDescription: `Our Kids' Playtime Essentials Fashion Bundle is perfect for active little ones. This bundle includes durable t-shirts, comfortable shorts/leggings, and a fun accessory, all designed for maximum comfort and freedom of movement during play.`,
    keyFeatures: [
      "3-piece bundle for everyday play",
      "Durable and comfortable fabrics",
      "Bright and fun designs",
      "Easy to wash and maintain",
      "Great value for growing kids",
    ],
    styleNotes: `Mix and match these pieces for various casual outfits. Perfect for school, park visits, or just playing at home.`,
    detailedSpecs: [
      {
        group: "Bundle Contents",
        items: [
          { label: "Item 1", value: "2x Cotton T-Shirts", icon: Baby },
          { label: "Item 2", value: "1x Denim Shorts/Leggings", icon: Ruler },
          { label: "Item 3", value: "1x Fun Cap", icon: Tag },
        ],
      },
      {
        group: "General",
        items: [
          { label: "Sizes Available", value: "2T, 3T, 4T, 5, 6" },
          { label: "Colors", value: "Assorted" },
          { label: "Condition", value: "New" },
        ],
      },
    ],
    specs: [
      { icon: ShoppingBag, label: "Items", value: "3-Piece" },
      { icon: Ruler, label: "Sizes", value: "2T-6" },
      { icon: Palette, label: "Style", value: "Playtime" },
      { icon: Tag, label: "Value", value: "Bundle Deal" },
    ],
    reviews: [
      { id: "rev19", author: "Gloria E.", rating: 5, date: "2024-07-28", title: "Perfect for my twins!", comment: "The clothes are durable and cute. They hold up well to all the playing.", isVerifiedBuyer: true },
      { id: "rev20", author: "Femi A.", rating: 4, date: "2024-07-24", title: "Good everyday wear", comment: "Solid basics for kids. Nothing fancy, but good for the price.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["kids-distressed-denim-jeans", "kids-graphic-hoodie"],
    modelPath: "/models/kids_fashion_bundle.glb", // Placeholder 3D model
  },
  // --- New Products Added Below ---
  {
    id: "shein-summer-midi-dress",
    name: "SHEIN Flowy Summer Midi Dress",
    category: "SHEIN Gowns",
    images: [
      "https://images.unsplash.com/photo-1590488181343-771891291110?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1590488181343-771891291110?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1590488181343-771891291110?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 30000.00,
    originalPrice: 38000.00,
    discountPercentage: 21,
    rating: 4.6,
    reviewCount: 150,
    tag: "Summer Essential",
    tagVariant: "default",
    limitedStock: false,
    fullDescription: `Embrace the sunshine with this light and airy SHEIN midi dress. Featuring a flattering A-line cut and breathable fabric, it's perfect for warm weather. The vibrant print adds a touch of playful elegance to your summer wardrobe.`,
    keyFeatures: [
      "Lightweight and breathable fabric",
      "Flattering A-line midi silhouette",
      "Vibrant summer-ready print",
      "Comfortable for all-day wear",
      "Easy to dress up or down",
    ],
    styleNotes: `Pair with espadrille sandals and a straw bag for a perfect beach or brunch look. Add delicate gold jewelry for an elevated touch.`,
    detailedSpecs: [
      {
        group: "Fabric & Care",
        items: [
          { label: "Material", value: "100% Rayon", icon: Shirt },
          { label: "Care Instructions", value: "Hand wash cold, line dry" },
          { label: "Stretch", value: "Non-stretch" },
        ],
      },
      {
        group: "Fit & Sizing",
        items: [
          { label: "Fit Type", value: "A-Line", icon: Ruler },
          { label: "Neckline", value: "Square Neck" },
          { label: "Sleeve Length", value: "Sleeveless" },
          { label: "Hem Length", value: "Midi" },
        ],
      },
    ],
    specs: [
      { icon: Shirt, label: "Material", value: "Rayon" },
      { icon: Ruler, label: "Fit", value: "A-Line" },
      { icon: Palette, label: "Color", value: "Floral Print" },
      { icon: Tag, label: "Brand", value: "SHEIN" },
    ],
    reviews: [
      { id: "rev21", author: "Ngozi P.", rating: 5, date: "2024-08-01", title: "Perfect summer dress!", comment: "So comfortable and stylish. I love the print and how it flows.", isVerifiedBuyer: true },
      { id: "rev22", author: "Chika A.", rating: 4, date: "2024-07-29", title: "Great for holidays", comment: "Wore this on my trip, got many compliments. Fabric is a bit thin but good for heat.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["shein-floral-maxi-gown", "ladies-fashion-bundle-casual"],
    modelPath: "/models/shein_summer_midi_dress.glb",
  },
  {
    id: "vintage-leather-crossbody-bag",
    name: "Vintage Leather Crossbody Bag",
    category: "Luxury Thrift",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de8476d9968c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1584917865442-de8476d9968c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1584917865442-de8476d9968c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 55000.00,
    originalPrice: 70000.00,
    discountPercentage: 21,
    rating: 4.8,
    reviewCount: 40,
    tag: "Timeless Accessory",
    tagVariant: "destructive",
    limitedStock: true,
    fullDescription: `A beautifully preserved vintage leather crossbody bag, perfect for adding a touch of classic elegance to any outfit. Crafted from genuine leather, this bag features a durable construction and a timeless design that never goes out of style.`,
    keyFeatures: [
      "Genuine vintage leather material",
      "Durable and long-lasting construction",
      "Adjustable crossbody strap",
      "Multiple compartments for organization",
      "Unique, pre-loved character",
    ],
    styleNotes: `Ideal for everyday use, this bag pairs well with both casual and semi-formal attire. Its classic design makes it a versatile addition to any wardrobe.`,
    detailedSpecs: [
      {
        group: "Material & Condition",
        items: [
          { label: "Material", value: "Genuine Leather", icon: Gem },
          { label: "Condition", value: "Used - Very Good" },
          { label: "Color", value: "Brown" },
        ],
      },
      {
        group: "Dimensions",
        items: [
          { label: "Size", value: "Medium (25x20x8 cm)", icon: Ruler },
          { label: "Strap Length", value: "Adjustable (100-120 cm)" },
        ],
      },
    ],
    specs: [
      { icon: Gem, label: "Material", value: "Leather" },
      { icon: Tag, label: "Style", value: "Crossbody" },
      { icon: Palette, label: "Color", value: "Brown" },
      { icon: ShieldCheck, label: "Condition", value: "Very Good" },
    ],
    reviews: [
      { id: "rev23", author: "Uche M.", rating: 5, date: "2024-08-03", title: "Stunning bag!", comment: "The leather is beautiful and it's in fantastic condition for a vintage piece. Very happy!", isVerifiedBuyer: true },
      { id: "rev24", author: "Bisi O.", rating: 4, date: "2024-07-31", title: "Great quality", comment: "A bit smaller than I expected, but the quality is undeniable. Love the vintage feel.", isVerifiedBuyer: false },
    ],
    relatedProducts: ["luxury-thrift-silk-scarf", "vintage-denim-jacket"],
    modelPath: "/models/vintage_leather_bag.glb",
  },
  {
    id: "kids-graphic-tshirt-pack",
    name: "Kids' 3-Pack Graphic T-Shirts",
    category: "Kids' Jeans", // Broad category for kids' apparel
    images: [
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 20000.00,
    originalPrice: 25000.00,
    discountPercentage: 20,
    rating: 4.7,
    reviewCount: 110,
    tag: "Value Pack",
    tagVariant: "secondary",
    limitedStock: false,
    fullDescription: `A fantastic value pack of three graphic t-shirts for kids. Made from soft, durable cotton, these shirts feature fun and colorful prints, perfect for everyday wear and play. An essential addition to any child's wardrobe.`,
    keyFeatures: [
      "Pack of 3 unique graphic t-shirts",
      "Soft and breathable 100% cotton",
      "Vibrant, kid-friendly designs",
      "Durable for frequent washing and wear",
      "Great for mixing and matching",
    ],
    styleNotes: `Pair with jeans, shorts, or skirts for easy, comfortable outfits. Ideal for school, playdates, or casual family outings.`,
    detailedSpecs: [
      {
        group: "Fabric & Care",
        items: [
          { label: "Material", value: "100% Cotton", icon: Baby },
          { label: "Care Instructions", value: "Machine wash warm, tumble dry low" },
          { label: "Stretch", value: "Slight Stretch" },
        ],
      },
      {
        group: "Fit & Sizing",
        items: [
          { label: "Fit Type", value: "Regular Fit", icon: Ruler },
          { label: "Sizes Available", value: "2T, 3T, 4T, 5, 6, 7, 8" },
          { label: "Sleeve Length", value: "Short Sleeve" },
        ],
      },
    ],
    specs: [
      { icon: Baby, label: "Material", value: "Cotton" },
      { icon: Tag, label: "Items", value: "3-Pack" },
      { icon: Palette, label: "Color", value: "Assorted Graphics" },
      { icon: ShieldCheck, label: "Durability", value: "High" },
    ],
    reviews: [
      { id: "rev25", author: "Funmi S.", rating: 5, date: "2024-08-05", title: "Excellent value!", comment: "My kids love these shirts. They're soft, the prints are fun, and they hold up well.", isVerifiedBuyer: true },
      { id: "rev26", author: "Kola T.", rating: 4, date: "2024-08-02", title: "Good everyday shirts", comment: "Solid quality for the price. Perfect for school.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["kids-distressed-denim-jeans", "kids-graphic-hoodie"],
    modelPath: "/models/kids_tshirt_pack.glb",
  },
  {
    id: "mens-casual-linen-shirt",
    name: "Men's Casual Linen Blend Shirt",
    category: "Vintage Shirts", // Can fit here for casual/men's tops
    images: [
      "https://images.unsplash.com/photo-1607345366928-199ea26756c7?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1607345366928-199ea26756c7?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1607345366928-199ea26756c7?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 25000.00,
    originalPrice: 30000.00,
    discountPercentage: 17,
    rating: 4.5,
    reviewCount: 70,
    tag: "Breathable",
    tagVariant: "default",
    limitedStock: false,
    fullDescription: `Stay cool and stylish with this men's casual linen blend shirt. Perfect for warm Nigerian weather, its breathable fabric and relaxed fit offer ultimate comfort. Ideal for both casual outings and semi-formal events.`,
    keyFeatures: [
      "Lightweight and breathable linen blend",
      "Relaxed fit for maximum comfort",
      "Versatile for various occasions",
      "Classic button-down design",
      "Easy to care for and maintain",
    ],
    styleNotes: `Pair with chinos or tailored shorts for a smart-casual look. Can be worn untucked for a relaxed vibe or tucked in for a more polished appearance.`,
    detailedSpecs: [
      {
        group: "Fabric & Care",
        items: [
          { label: "Material", value: "70% Linen, 30% Cotton", icon: Shirt },
          { label: "Care Instructions", value: "Machine wash cold, hang dry" },
          { label: "Season", value: "Summer, All-season" },
        ],
      },
      {
        group: "Fit & Sizing",
        items: [
          { label: "Fit Type", value: "Relaxed Fit", icon: Ruler },
          { label: "Sizes Available", value: "M, L, XL, XXL" },
          { label: "Sleeve Length", value: "Long Sleeve (roll-up tabs)" },
        ],
      },
    ],
    specs: [
      { icon: Shirt, label: "Material", value: "Linen Blend" },
      { icon: Ruler, label: "Fit", value: "Relaxed" },
      { icon: Palette, label: "Color", value: "White" },
      { icon: Tag, label: "Style", value: "Casual" },
    ],
    reviews: [
      { id: "rev27", author: "Ahmed D.", rating: 5, date: "2024-08-07", title: "Perfect for the heat!", comment: "This shirt is so comfortable and keeps me cool. Looks great too.", isVerifiedBuyer: true },
      { id: "rev28", author: "Chidi N.", rating: 4, date: "2024-08-04", title: "Good quality", comment: "Nice shirt, a bit prone to wrinkles but that's linen for you. Happy with it.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["vintage-graphic-tee-90s", "mens-fashion-bundle-streetwear"],
    modelPath: "/models/mens_linen_shirt.glb",
  },
  {
    id: "luxury-thrift-designer-sunglasses",
    name: "Luxury Thrift Designer Sunglasses",
    category: "Luxury Thrift",
    images: [
      "https://images.unsplash.com/photo-1508349937151-22b68f72d38c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1508349937151-22b68f72d38c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1508349937151-22b68f72d38c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D"
    ],
    price: 60000.00,
    originalPrice: 85000.00,
    discountPercentage: 29,
    rating: 4.9,
    reviewCount: 30,
    tag: "Exclusive",
    tagVariant: "destructive",
    limitedStock: true,
    fullDescription: `Elevate your style with these pre-loved designer sunglasses. Each pair is authenticated and carefully inspected to ensure excellent condition, offering a sustainable way to own high-end eyewear. Protect your eyes in style.`,
    keyFeatures: [
      "Authentic designer eyewear",
      "High-quality lenses with UV protection",
      "Excellent pre-loved condition",
      "Unique frame styles",
      "Comes with original case (if available)",
    ],
    styleNotes: `A perfect accessory to complete any look, from casual to sophisticated. Adds an instant touch of glamour and mystery.`,
    detailedSpecs: [
      {
        group: "Details",
        items: [
          { label: "Brand", value: "Assorted Designer", icon: Tag },
          { label: "Condition", value: "Used - Excellent" },
          { label: "Lens Type", value: "UV Protected" },
        ],
      },
      {
        group: "Frame",
        items: [
          { label: "Frame Material", value: "Acetate/Metal", icon: Glasses },
          { label: "Frame Color", value: "Black/Tortoise" },
          { label: "Style", value: "Cat-Eye/Aviator/Wayfarer" },
        ],
      },
    ],
    specs: [
      { icon: Glasses, label: "Type", value: "Sunglasses" },
      { icon: Tag, label: "Brand", value: "Designer" },
      { icon: Gem, label: "Condition", value: "Excellent" },
      { icon: Sun, label: "Protection", value: "UV400" },
    ],
    reviews: [
      { id: "rev29", author: "Zainab H.", rating: 5, date: "2024-08-09", title: "Love my new shades!", comment: "They look brand new and are exactly what I wanted. Great deal for designer sunglasses.", isVerifiedBuyer: true },
      { id: "rev30", author: "Obi K.", rating: 5, date: "2024-08-06", title: "Fantastic find", comment: "The quality is superb, and they fit perfectly. Very stylish.", isVerifiedBuyer: true },
    ],
    relatedProducts: ["luxury-thrift-silk-scarf", "vintage-leather-crossbody-bag"],
    modelPath: "/models/designer_sunglasses.glb",
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
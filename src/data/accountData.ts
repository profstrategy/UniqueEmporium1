import { Product } from "@/components/products/ProductCard.tsx"; // Assuming Product interface is available
import { getProductById } from "./products.ts"; // Import getProductById to safely reference new IDs

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  imageUrl: string;
}

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export interface Order {
  id: string;
  orderDate: string; // YYYY-MM-DD
  totalAmount: number;
  status: OrderStatus;
  items: OrderItem[];
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
  };
  deliveryMethod: string;
}

export interface PaymentReceipt {
  id: string;
  transactionId: string;
  date: string; // YYYY-MM-DD
  amount: number;
  status: "pending" | "confirmed" | "declined"; // Changed from 'failed'
  receiptImageUrl: string; // Placeholder for actual image URL
}

// Helper to get the new ID for an old product name
const getNewIdByName = (name: string) => {
  // Find the product by name in mockProducts and return its new ID
  const product = getProductById(name);
  if (product) return product.id;
  
  // Fallback logic to search by name if ID lookup fails (since getProductById expects ID)
  // We need to import mockProducts here to search by name if the ID map logic failed in products.ts
  // Since we can't import mockProducts directly here without circular dependency issues, 
  // we rely on the fact that the names are unique and the IDs are generated in products.ts.
  
  // To avoid circular dependency, we'll assume the names are unique and use a placeholder if not found.
  return "unknown-id";
};


// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "UE-20240725-001",
    orderDate: "2024-07-25",
    totalAmount: 70000.00,
    status: "completed",
    items: [
      { productId: getNewIdByName("SHEIN Elegant Floral Maxi Gown"), productName: "SHEIN Elegant Floral Maxi Gown", quantity: 10, unitPrice: 3500, imageUrl: getProductById(getNewIdByName("SHEIN Elegant Floral Maxi Gown"))?.images[0] || "" },
      { productId: getNewIdByName("Luxury Thrift Silk Scarf (Designer)"), productName: "Luxury Thrift Silk Scarf (Designer)", quantity: 10, unitPrice: 2800, imageUrl: getProductById(getNewIdByName("Luxury Thrift Silk Scarf (Designer)"))?.images[0] || "" },
    ],
    shippingAddress: {
      name: "Aisha O.",
      address: "123 Fashion Street",
      city: "Ilorin",
      state: "Kwara",
    },
    deliveryMethod: "Pick-up",
  },
  {
    id: "UE-20240720-002",
    orderDate: "2024-07-20",
    totalAmount: 120000.00,
    status: "processing",
    items: [
      { productId: getNewIdByName("Men's Urban Streetwear Fashion Bundle"), productName: "Men's Urban Streetwear Fashion Bundle", quantity: 5, unitPrice: 15000, imageUrl: getProductById(getNewIdByName("Men's Urban Streetwear Fashion Bundle"))?.images[0] || "" },
      { productId: getNewIdByName("Kids' Stylish Distressed Denim Jeans"), productName: "Kids' Stylish Distressed Denim Jeans", quantity: 10, unitPrice: 1800, imageUrl: getProductById(getNewIdByName("Kids' Stylish Distressed Denim Jeans"))?.images[0] || "" },
    ],
    shippingAddress: {
      name: "Chinedu E.",
      address: "456 Market Road",
      city: "Lagos",
      state: "Lagos",
    },
    deliveryMethod: "Dispatch Rider",
  },
  {
    id: "UE-20240715-003",
    orderDate: "2024-07-15",
    totalAmount: 40000.00,
    status: "pending",
    items: [
      { productId: getNewIdByName("Vintage 90s Graphic T-Shirt"), productName: "Vintage 90s Graphic T-Shirt", quantity: 10, unitPrice: 1200, imageUrl: getProductById(getNewIdByName("Vintage 90s Graphic T-Shirt"))?.images[0] || "" },
    ],
    shippingAddress: {
      name: "Blessing N.",
      address: "789 Central Avenue",
      city: "Abuja",
      state: "FCT",
    },
    deliveryMethod: "Park Delivery",
  },
  {
    id: "UE-20240710-004",
    orderDate: "2024-07-10",
    totalAmount: 95000.00,
    status: "completed",
    items: [
      { productId: getNewIdByName("SHEIN Flowy Summer Midi Dress"), productName: "SHEIN Flowy Summer Midi Dress", quantity: 10, unitPrice: 3000, imageUrl: getProductById(getNewIdByName("SHEIN Flowy Summer Midi Dress"))?.images[0] || "" },
      { productId: getNewIdByName("Vintage Leather Crossbody Bag"), productName: "Vintage Leather Crossbody Bag", quantity: 10, unitPrice: 5500, imageUrl: getProductById(getNewIdByName("Vintage Leather Crossbody Bag"))?.images[0] || "" },
    ],
    shippingAddress: {
      name: "Amaka J.",
      address: "101 Palm Grove",
      city: "Port Harcourt",
      state: "Rivers",
    },
    deliveryMethod: "Dispatch Rider",
  },
];

// Mock Payment Receipts
export const mockReceipts: PaymentReceipt[] = [
  {
    id: "PR-20240725-001",
    transactionId: "TXN-789012345",
    date: "2024-07-25",
    amount: 70000.00,
    status: "confirmed",
    receiptImageUrl: "https://via.placeholder.com/400x600/D8C4A6/000000?text=Receipt+UE-001",
  },
  {
    id: "PR-20240720-002",
    transactionId: "TXN-345678901",
    date: "2024-07-20",
    amount: 120000.00,
    status: "pending",
    receiptImageUrl: "https://via.placeholder.com/400x600/D8C4A6/000000?text=Receipt+UE-002",
  },
  {
    id: "PR-20240715-003",
    transactionId: "TXN-901234567",
    date: "2024-07-15",
    amount: 40000.00,
    status: "confirmed",
    receiptImageUrl: "https://via.placeholder.com/400x600/D8C4A6/000000?text=Receipt+UE-003",
  },
  {
    id: "PR-20240710-004",
    transactionId: "TXN-567890123",
    date: "2024-07-10",
    amount: 95000.00,
    status: "declined", // Changed from 'failed'
    receiptImageUrl: "https://via.placeholder.com/400x600/D8C4A6/000000?text=Receipt+UE-004",
  },
];
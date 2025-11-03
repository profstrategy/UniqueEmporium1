import { Product } from "@/components/products/ProductCard.tsx"; // Assuming Product interface is available

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
  status: "pending" | "confirmed" | "failed";
  receiptImageUrl: string; // Placeholder for actual image URL
}

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "UE-20240725-001",
    orderDate: "2024-07-25",
    totalAmount: 70000.00,
    status: "completed",
    items: [
      { productId: "shein-floral-maxi-gown", productName: "SHEIN Elegant Floral Maxi Gown", quantity: 10, unitPrice: 3500, imageUrl: "https://images.unsplash.com/photo-1581044777550-4cfa607037dc?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
      { productId: "luxury-thrift-silk-scarf", productName: "Luxury Thrift Silk Scarf (Designer)", quantity: 10, unitPrice: 2800, imageUrl: "https://images.unsplash.com/photo-1588891237197-f7171102282a?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D" },
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
      { productId: "mens-fashion-bundle-streetwear", productName: "Men's Urban Streetwear Fashion Bundle", quantity: 5, unitPrice: 15000, imageUrl: "https://images.unsplash.com/photo-1523381294911-8d3cead13f7c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D" },
      { productId: "kids-distressed-denim-jeans", productName: "Kids' Stylish Distressed Denim Jeans", quantity: 10, unitPrice: 1800, imageUrl: "https://images.unsplash.com/photo-1602293589930-45729955217f?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D" },
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
      { productId: "vintage-graphic-tee-90s", productName: "Vintage 90s Graphic T-Shirt", quantity: 10, unitPrice: 1200, imageUrl: "https://images.unsplash.com/photo-1576566588028-cdfd73055d8b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
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
      { productId: "shein-summer-midi-dress", productName: "SHEIN Flowy Summer Midi Dress", quantity: 10, unitPrice: 3000, imageUrl: "https://images.unsplash.com/photo-1590488181343-771891291110?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D" },
      { productId: "vintage-leather-crossbody-bag", productName: "Vintage Leather Crossbody Bag", quantity: 10, unitPrice: 5500, imageUrl: "https://images.unsplash.com/photo-1584917865442-de8476d9968c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D" },
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
    status: "failed",
    receiptImageUrl: "https://via.placeholder.com/400x600/D8C4A6/000000?text=Receipt+UE-004",
  },
];
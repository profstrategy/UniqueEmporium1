import { Product } from "@/components/products/ProductCard.tsx";
import { mockProducts } from "./products.ts";
import { Order, OrderStatus, PaymentReceipt } from "./accountData.ts";

// --- Admin Dashboard Overview Stats ---
export interface AdminStats {
  totalOrders: number;
  pendingPayments: number;
  completedOrders: number;
  activeUsers: number;
  totalRevenue: number;
  newProductsLastMonth: number;
}

export const mockAdminStats: AdminStats = {
  totalOrders: 1250,
  pendingPayments: 45,
  completedOrders: 1180,
  activeUsers: 320,
  totalRevenue: 58000000, // Example in NGN
  newProductsLastMonth: 12,
};

// --- Admin Orders Data (Extended from existing mockOrders) ---
export interface AdminOrder extends Order {
  customerName: string;
  customerEmail: string;
  paymentStatus: "pending" | "verified" | "failed";
  paymentReceiptId?: string; // Link to a mock receipt
}

export const mockAdminOrders: AdminOrder[] = [
  {
    id: "ADM-20240801-001",
    orderDate: "2024-08-01",
    totalAmount: 70000.00,
    status: "pending",
    customerName: "Aisha O.",
    customerEmail: "aisha.o@example.com",
    paymentStatus: "pending",
    paymentReceiptId: "PR-20240725-001",
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
    id: "ADM-20240730-002",
    orderDate: "2024-07-30",
    totalAmount: 120000.00,
    status: "processing",
    customerName: "Chinedu E.",
    customerEmail: "chinedu.e@example.com",
    paymentStatus: "verified",
    paymentReceiptId: "PR-20240720-002",
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
    id: "ADM-20240728-003",
    orderDate: "2024-07-28",
    totalAmount: 40000.00,
    status: "completed",
    customerName: "Blessing N.",
    customerEmail: "blessing.n@example.com",
    paymentStatus: "verified",
    paymentReceiptId: "PR-20240715-003",
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
    id: "ADM-20240725-004",
    orderDate: "2024-07-25",
    totalAmount: 95000.00,
    status: "cancelled",
    customerName: "Amaka J.",
    customerEmail: "amaka.j@example.com",
    paymentStatus: "failed",
    paymentReceiptId: "PR-20240710-004",
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
  {
    id: "ADM-20240720-005",
    orderDate: "2024-07-20",
    totalAmount: 60000.00,
    status: "processing",
    customerName: "Fatima G.",
    customerEmail: "fatima.g@example.com",
    paymentStatus: "pending",
    items: [
      { productId: "luxury-thrift-designer-sunglasses", productName: "Luxury Thrift Designer Sunglasses", quantity: 10, unitPrice: 6000, imageUrl: "https://images.unsplash.com/photo-1508349937151-22b68f72d38c?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB3MHxwaG90by1wYWdlfHx8fGVufDBfHx8fA%3D%3D" },
    ],
    shippingAddress: {
      name: "Fatima G.",
      address: "222 Sunshine Blvd",
      city: "Kano",
      state: "Kano",
    },
    deliveryMethod: "Pick-up",
  },
];

// --- Admin Products Data (Using existing mockProducts) ---
export const mockAdminProducts = mockProducts;

// --- Admin Categories Data ---
export interface AdminCategory {
  id: string;
  name: string;
  productCount: number;
  status: "active" | "inactive";
}

export const mockAdminCategories: AdminCategory[] = [
  { id: "cat-1", name: "SHEIN Gowns", productCount: 2, status: "active" },
  { id: "cat-2", name: "Men Vintage Shirts", productCount: 3, status: "active" },
  { id: "cat-3", name: "Children Jeans", productCount: 1, status: "active" },
  { id: "cat-4", name: "Amazon Ladies", productCount: 1, status: "active" },
  { id: "cat-5", name: "Others", productCount: 3, status: "active" },
  { id: "cat-6", name: "Kids Patpat", productCount: 0, status: "inactive" },
  { id: "cat-7", name: "Children Shirts", productCount: 2, status: "active" },
];

// --- Admin Users Data ---
export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "customer";
  status: "active" | "inactive";
  lastLogin: string; // YYYY-MM-DD
  totalOrders: number;
}

export const mockAdminUsers: AdminUser[] = [
  { id: "user-1", name: "Aisha O.", email: "aisha.o@example.com", role: "customer", status: "active", lastLogin: "2024-08-01", totalOrders: 5 },
  { id: "user-2", name: "Chinedu E.", email: "chinedu.e@example.com", role: "customer", status: "active", lastLogin: "2024-07-30", totalOrders: 8 },
  { id: "user-3", name: "Blessing N.", email: "blessing.n@example.com", role: "customer", status: "active", lastLogin: "2024-07-28", totalOrders: 3 },
  { id: "user-4", name: "Admin User", email: "admin@unique.com", role: "admin", status: "active", lastLogin: "2024-08-02", totalOrders: 0 },
  { id: "user-5", name: "Inactive User", email: "inactive@example.com", role: "customer", status: "inactive", lastLogin: "2024-06-15", totalOrders: 1 },
];

// --- Admin Analytics Data (Placeholder) ---
export interface SalesDataPoint {
  date: string; // YYYY-MM-DD
  sales: number;
  orders: number;
}

export const mockSalesData: SalesDataPoint[] = [
  { date: "2024-07-01", sales: 120000, orders: 15 },
  { date: "2024-07-08", sales: 150000, orders: 20 },
  { date: "2024-07-15", sales: 130000, orders: 18 },
  { date: "2024-07-22", sales: 180000, orders: 25 },
  { date: "2024-07-29", sales: 160000, orders: 22 },
  { date: "2024-08-05", sales: 200000, orders: 30 },
];

export interface CategorySalesData {
  name: string;
  sales: number;
}

export const mockCategorySales: CategorySalesData[] = [
  { name: "SHEIN Gowns", sales: 3000000 },
  { name: "Men Vintage Shirts", sales: 2500000 },
  { name: "Children Jeans", sales: 1800000 },
  { name: "Amazon Ladies", sales: 2200000 },
  { name: "Others", sales: 1500000 },
];
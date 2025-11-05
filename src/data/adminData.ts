import { Product } from "@/components/products/ProductCard.tsx";
import { mockProducts, getProductById } from "./products.ts"; // Import getProductById and mockProducts
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

// Helper to get the new ID for an old product name
const getNewIdByName = (name: string) => mockProducts.find(p => p.name === name)?.id || "unknown-id";

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
    id: "ADM-20240730-002",
    orderDate: "2024-07-30",
    totalAmount: 120000.00,
    status: "processing",
    customerName: "Chinedu E.",
    customerEmail: "chinedu.e@example.com",
    paymentStatus: "verified",
    paymentReceiptId: "PR-20240720-002",
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
    id: "ADM-20240728-003",
    orderDate: "2024-07-28",
    totalAmount: 40000.00,
    status: "completed",
    customerName: "Blessing N.",
    customerEmail: "blessing.n@example.com",
    paymentStatus: "verified",
    paymentReceiptId: "PR-20240715-003",
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
    id: "ADM-20240725-004",
    orderDate: "2024-07-25",
    totalAmount: 95000.00,
    status: "cancelled",
    customerName: "Amaka J.",
    customerEmail: "amaka.j@example.com",
    paymentStatus: "failed",
    paymentReceiptId: "PR-20240710-004",
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
  {
    id: "ADM-20240720-005",
    orderDate: "2024-07-20",
    totalAmount: 60000.00,
    status: "processing",
    customerName: "Fatima G.",
    customerEmail: "fatima.g@example.com",
    paymentStatus: "pending",
    items: [
      { productId: getNewIdByName("Luxury Thrift Designer Sunglasses"), productName: "Luxury Thrift Designer Sunglasses", quantity: 10, unitPrice: 6000, imageUrl: getProductById(getNewIdByName("Luxury Thrift Designer Sunglasses"))?.images[0] || "" },
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
// Ensure mockProducts from products.ts now includes the 'status' field
export const mockAdminProducts = mockProducts.map(product => ({
  ...product,
  status: product.status || "active" // Ensure status is set, default to active
}));

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
  phone: string; // Added phone number
  role: "admin" | "customer";
  status: "active" | "inactive";
  lastLogin: string; // YYYY-MM-DD
  totalOrders: number;
}

export const mockAdminUsers: AdminUser[] = [
  { id: "user-1", name: "Aisha O.", email: "aisha.o@example.com", phone: "+2348012345678", role: "customer", status: "active", lastLogin: "2024-08-01", totalOrders: 5 },
  { id: "user-2", name: "Chinedu E.", email: "chinedu.e@example.com", phone: "+2347012345678", role: "customer", status: "active", lastLogin: "2024-07-30", totalOrders: 8 },
  { id: "user-3", name: "Blessing N.", email: "blessing.n@example.com", phone: "+2349012345678", role: "customer", status: "active", lastLogin: "2024-07-28", totalOrders: 3 },
  { id: "user-4", name: "Admin User", email: "admin@unique.com", phone: "+2348098765432", role: "admin", status: "active", lastLogin: "2024-08-02", totalOrders: 0 },
  { id: "user-5", name: "Inactive User", email: "inactive@example.com", phone: "+2348112345678", role: "customer", status: "inactive", lastLogin: "2024-06-15", totalOrders: 1 },
  { id: "user-6", name: "Olu Ade", email: "olu.ade@example.com", phone: "+2347034567890", role: "customer", status: "active", lastLogin: "2024-07-29", totalOrders: 2 },
  { id: "user-7", name: "Tobi Bello", email: "tobi.bello@example.com", phone: "+2348056789012", role: "customer", status: "active", lastLogin: "2024-08-03", totalOrders: 4 },
  { id: "user-8", name: "Mama Grace", email: "mama.grace@example.com", phone: "+2349078901234", role: "customer", status: "inactive", lastLogin: "2024-07-10", totalOrders: 1 },
];

// --- Admin Analytics Data ---
export interface SalesDataPoint {
  date: string; // YYYY-MM-DD
  sales: number;
  orders: number;
}

export const mockSalesData: SalesDataPoint[] = [
  { date: "Jan", sales: 1200000, orders: 150 },
  { date: "Feb", sales: 1500000, orders: 180 },
  { date: "Mar", sales: 1300000, orders: 160 },
  { date: "Apr", sales: 1800000, orders: 220 },
  { date: "May", sales: 1600000, orders: 190 },
  { date: "Jun", sales: 2000000, orders: 250 },
  { date: "Jul", sales: 2100000, orders: 240 },
  { date: "Aug", sales: 2300000, orders: 280 },
  { date: "Sep", sales: 1900000, orders: 210 },
  { date: "Oct", sales: 2400000, orders: 300 },
  { date: "Nov", sales: 2700000, orders: 330 },
  { date: "Dec", sales: 3000000, orders: 380 },
];

export interface CategorySalesData {
  name: string;
  sales: number;
  orders: number;
}

export const mockCategorySales: CategorySalesData[] = [
  { name: "SHEIN Gowns", sales: 3000000, orders: 350 },
  { name: "Men Vintage Shirts", sales: 2500000, orders: 280 },
  { name: "Children Jeans", sales: 1800000, orders: 200 },
  { name: "Amazon Ladies", sales: 2200000, orders: 260 },
  { name: "Kids Patpat", sales: 1000000, orders: 120 },
  { name: "Children Shirts", sales: 1500000, orders: 170 },
  { name: "Others", sales: 1500000, orders: 180 },
];

export interface PaymentMethodData {
  name: string;
  value: number;
}

export const mockPaymentMethods: PaymentMethodData[] = [
  { name: "Bank Transfer", value: 100 }, // For now, only Bank Transfer
  // { name: "Card Payment", value: 300 },
  // { name: "Mobile Money", value: 200 },
];

export interface RecentActivity {
  id: string;
  type: "order" | "payment" | "user" | "product";
  description: string;
  timestamp: string; // ISO string
  status?: "new" | "verified" | "updated" | "deleted";
}

export const mockRecentActivities: RecentActivity[] = [
  { id: "act-1", type: "order", description: "Olu Ade placed a new order (ADM-20240805-006)", timestamp: "2024-08-05T14:30:00Z", status: "new" },
  { id: "act-2", type: "payment", description: "Rep verified payment from Tobi Bello (ADM-20240803-007)", timestamp: "2024-08-05T10:15:00Z", status: "verified" },
  { id: "act-3", type: "user", description: "New user registered: Mama Grace", timestamp: "2024-08-04T18:00:00Z", status: "new" },
  { id: "act-4", type: "product", description: "Product 'SHEIN Flowy Summer Midi Dress' updated", timestamp: "2024-08-04T09:00:00Z", status: "updated" },
  { id: "act-5", type: "order", description: "Order ADM-20240730-002 status changed to 'Completed'", timestamp: "2024-08-03T16:45:00Z", status: "updated" },
  { id: "act-6", type: "payment", description: "Payment for ADM-20240801-001 is still pending", timestamp: "2024-08-02T11:00:00Z", status: "new" },
];
import React, { useState, Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header.tsx";
import Footer from "./components/layout/Footer.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { FavoritesProvider } from "./context/FavoritesContext.tsx";
import ScrollToTop from "./components/common/ScrollToTop.tsx";
import LoadingPage from "./components/common/LoadingPage.tsx"; // Import the new LoadingPage
import FloatingWhatsApp from "./components/layout/FloatingWhatsApp.tsx"; // Import FloatingWhatsApp

// Lazily load page components for code splitting
const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Favorites = lazy(() => import("./pages/Favorites.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Products = lazy(() => import("./pages/Products.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Shipping = lazy(() => import("./pages/Shipping.tsx"));
const Returns = lazy(() => import("./pages/Returns.tsx"));
const Warranty = lazy(() => import("./pages/Warranty.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.tsx"));

// Account Dashboard Pages
const Account = lazy(() => import("./pages/Account.tsx"));
const DashboardHome = lazy(() => import("./pages/account/DashboardHome.tsx"));
const ProfilePage = lazy(() => import("./pages/account/ProfilePage.tsx"));
const OrderHistoryPage = lazy(() => import("./pages/account/OrderHistoryPage.tsx"));
const PaymentReceiptsPage = lazy(() => import("./pages/account/PaymentReceiptsPage.tsx"));

// Admin Dashboard Pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout.tsx"));
const AdminDashboardOverview = lazy(() => import("./pages/admin/DashboardOverview.tsx"));
const AdminOrdersManagement = lazy(() => import("./pages/admin/OrdersManagement.tsx")); // New import


const queryClient = new QueryClient();

const App = () => {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <CartProvider onOpenCartDrawer={() => setIsCartDrawerOpen(true)}>
            <FavoritesProvider>
                <Header
                  isCartDrawerOpen={isCartDrawerOpen}
                  setIsCartDrawerOpen={setIsCartDrawerOpen}
                />
                <Suspense fallback={<LoadingPage />}> {/* Wrap Routes with Suspense */}
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:productId" element={<ProductDetails />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/faq" element={<FAQ />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/returns" element={<Returns />} />
                    <Route path="/warranty" element={<Warranty />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/checkout" element={<Checkout />} />
                    {/* Account Dashboard Routes */}
                    <Route path="/account" element={<Account />}>
                      <Route index element={<DashboardHome />} /> {/* Default route for /account */}
                      <Route path="profile" element={<ProfilePage />} />
                      <Route path="orders" element={<OrderHistoryPage />} />
                      <Route path="receipts" element={<PaymentReceiptsPage />} />
                    </Route>
                    {/* Admin Dashboard Routes */}
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboardOverview />} /> {/* Default route for /admin */}
                      <Route path="orders" element={<AdminOrdersManagement />} /> {/* New Admin Orders Route */}
                      {/* Add other admin routes here as they are created */}
                      {/* <Route path="products" element={<AdminProductsManagement />} /> */}
                      {/* <Route path="categories" element={<AdminCategoriesManagement />} /> */}
                      {/* <Route path="users" element={<AdminUsersManagement />} /> */}
                      {/* <Route path="analytics" element={<AdminAnalyticsDashboard />} /> */}
                    </Route>
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
                <FloatingWhatsApp /> {/* Add the FloatingWhatsApp component here */}
                <Footer />
            </FavoritesProvider>
          </CartProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
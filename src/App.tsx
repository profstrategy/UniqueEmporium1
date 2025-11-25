import React, { useState, Suspense, lazy, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/layout/Header.tsx";
import Footer from "./components/layout/Footer.tsx";
import { CartProvider } from "./context/CartContext.tsx";
import { FavoritesProvider } from "./context/FavoritesContext.tsx";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import CheckAuth from "./components/auth/CheckAuth.tsx";
import ScrollToTop from "./components/common/ScrollToTop.tsx";
import LoadingPage from "./components/common/LoadingPage.tsx";
import FloatingWhatsApp from "./components/layout/FloatingWhatsApp.tsx";
import { toast } from "sonner";

// Lazily load page components for code splitting
const Index = lazy(() => import("./pages/Index.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const ErrorPage = lazy(() => import("./pages/ErrorPage.tsx"));
const Favorites = lazy(() => import("./pages/Favorites.tsx"));
const Cart = lazy(() => import("./pages/Cart.tsx"));
const Products = lazy(() => import("./pages/Products.tsx"));
const ProductDetails = lazy(() => import("./pages/ProductDetails.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Shipping = lazy(() => import("./pages/Shipping.tsx"));
const Returns = lazy(() => import("./pages/Returns.tsx"));
const Warranty = lazy(() => import("./pages/Warranty.tsx"));
const Privacy = lazy(() => import("./pages/Privacy.tsx"));
const Terms = lazy(() => import("./pages/Terms.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));

// Account Dashboard Pages
const Account = lazy(() => import("./pages/Account.tsx"));
const DashboardHome = lazy(() => import("./pages/account/DashboardHome.tsx"));
const ProfilePage = lazy(() => import("./pages/account/ProfilePage.tsx"));
const OrderHistoryPage = lazy(() => import("./pages/account/OrderHistoryPage.tsx"));
const PaymentReceiptsPage = lazy(() => import("./pages/account/PaymentReceiptsPage.tsx"));
const OrderDetailsPage = lazy(() => import("./pages/account/OrderDetailsPage.tsx")); // New import

// Admin Dashboard Pages
const AdminLayout = lazy(() => import("./components/admin/AdminLayout.tsx"));
const AdminDashboardOverview = lazy(() => import("./pages/admin/DashboardOverview.tsx"));
const AdminOrdersManagement = lazy(() => import("./pages/admin/OrdersManagement.tsx"));
const AdminProductsManagement = lazy(() => import("./pages/admin/ProductsManagement.tsx"));
const AdminCategoriesManagement = lazy(() => import("./pages/admin/CategoriesManagement.tsx"));
const AdminUsersManagement = lazy(() => import("./pages/admin/UsersManagement.tsx"));
const AdminAnalyticsDashboard = lazy(() => import("./pages/admin/AnalyticsDashboard.tsx"));
const AdminReviewsManagement = lazy(() => import("./pages/admin/ReviewsManagement.tsx")); // New import

const queryClient = new QueryClient();

// Private Route Wrapper
const PrivateRoute = ({ element }: { element: React.ReactNode }) => {
  const { user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    navigate("/auth", { replace: true });
    return null;
  }

  // If user is admin, redirect them away from /account paths
  if (isAdmin && location.pathname.startsWith("/account")) {
    navigate("/admin", { replace: true });
    toast.info("Redirecting to Admin Dashboard.", { description: "Admin users access their dedicated panel." });
    return null;
  }

  return <>{element}</>;
};

// Admin Route Wrapper
const AdminRoute = ({ element }: { element: React.ReactNode }) => {
  const { isAdmin, isLoading, user } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!user) {
    navigate("/auth", { replace: true });
    return null;
  }

  if (!isAdmin) {
    navigate("/", { replace: true });
    toast.error("Unauthorized Access", { description: "You do not have permission to view the Admin Dashboard." });
    return null;
  }

  return <>{element}</>;
};


// Component that wraps the main application logic and handles conditional rendering
const MainAppContent = () => {
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const location = useLocation();
  const { isLoading } = useAuth();
  
  // Determine if the current route is an auth page.
  const isAuthPage = location.pathname === "/auth";
  
  // Hide header/footer/floating elements only on the Auth page
  const showLayout = !isAuthPage;

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <CartProvider onOpenCartDrawer={() => setIsCartDrawerOpen(true)}>
      <FavoritesProvider>
        {showLayout && (
          <Header
            isCartDrawerOpen={isCartDrawerOpen}
            setIsCartDrawerOpen={setIsCartDrawerOpen}
          />
        )}
        <Suspense fallback={<LoadingPage />}>
          <Routes>
            <Route path="/" element={<Index />} />
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
            <Route path="/auth" element={<Auth />} />
            <Route path="/error" element={<ErrorPage />} />
            
            {/* Protected Routes */}
            <Route path="/favorites" element={<PrivateRoute element={<Favorites />} />} />
            <Route path="/cart" element={<PrivateRoute element={<Cart />} />} />
            <Route path="/checkout" element={<PrivateRoute element={<Checkout />} />} />

            {/* Account Dashboard Routes (Protected) */}
            <Route path="/account" element={<PrivateRoute element={<Account />} />}>
              <Route index element={<DashboardHome />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="orders" element={<OrderHistoryPage />} />
              <Route path="orders/:orderId" element={<OrderDetailsPage />} /> {/* New route for order details */}
              <Route path="receipts" element={<PaymentReceiptsPage />} />
            </Route>
            
            {/* Admin Dashboard Routes (Protected by AdminRoute) */}
            <Route path="/admin" element={<AdminRoute element={<AdminLayout />} />}>
              <Route index element={<AdminDashboardOverview />} />
              <Route path="orders" element={<AdminOrdersManagement />} />
              <Route path="products" element={<AdminProductsManagement />} />
              <Route path="reviews" element={<AdminReviewsManagement />} /> {/* New route */}
              <Route path="categories" element={<AdminCategoriesManagement />} />
              <Route path="users" element={<AdminUsersManagement />} />
              <Route path="analytics" element={<AdminAnalyticsDashboard />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        {showLayout && <FloatingWhatsApp />}
        {showLayout && <Footer />}
      </FavoritesProvider>
    </CartProvider>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <CheckAuth>
              <MainAppContent />
            </CheckAuth>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
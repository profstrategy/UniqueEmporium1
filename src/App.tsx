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
import { AuthProvider } from "./context/AuthContext.tsx"; // Import AuthProvider
import ScrollToTop from "./components/common/ScrollToTop.tsx";
import LoadingPage from "./components/common/LoadingPage.tsx";

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

// Auth Pages
const LoginPage = lazy(() => import("./pages/auth/LoginPage.tsx"));
const SignupPage = lazy(() => import("./pages/auth/SignupPage.tsx"));
const ForgotPasswordPage = lazy(() => import("./pages/auth/ForgotPasswordPage.tsx"));
const ResetPasswordPage = lazy(() => import("./pages/auth/ResetPasswordPage.tsx"));

// Account Dashboard Page
const AccountDashboard = lazy(() => import("./pages/account/AccountDashboard.tsx"));

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
          <AuthProvider> {/* Wrap with AuthProvider */}
            <CartProvider onOpenCartDrawer={() => setIsCartDrawerOpen(true)}>
              <FavoritesProvider>
                  <Header
                    isCartDrawerOpen={isCartDrawerOpen}
                    setIsCartDrawerOpen={setIsCartDrawerOpen}
                  />
                  <Suspense fallback={<LoadingPage />}>
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

                      {/* Auth Routes */}
                      <Route path="/auth/login" element={<LoginPage />} />
                      <Route path="/auth/signup" element={<SignupPage />} />
                      <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                      <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

                      {/* Account Dashboard Route */}
                      <Route path="/account" element={<AccountDashboard />} />

                      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                  <Footer />
              </FavoritesProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
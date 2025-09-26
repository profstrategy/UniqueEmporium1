import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.tsx"; // Added .tsx extension
import NotFound from "./pages/NotFound.tsx"; // Added .tsx extension
import Header from "./components/layout/Header.tsx"; // Added .tsx extension
import Favorites from "./pages/Favorites.tsx"; // Added .tsx extension
import Compare from "./pages/Compare.tsx"; // Added .tsx extension
import Cart from "./pages/Cart.tsx"; // Added .tsx extension
import Products from "./pages/Products.tsx"; // Added .tsx extension
import About from "./pages/About.tsx"; // Added .tsx extension
import Contact from "./pages/Contact.tsx"; // Added .tsx extension


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, NavLink } from "react-router-dom";
import { motion, AnimatePresence, Easing, useInView, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  ChevronDown,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ArrowUp,
  Loader2,
  CheckCircle2,
  Laptop,
  Tablet,
  Headphones,
  Home as HomeIcon, // Renamed to avoid conflict with Home page
  LayoutGrid,
  Info,
} from "lucide-react";

const categories = [
  { name: "Laptops", icon: Laptop, link: "/products?category=laptops" },
  { name: "Tablets", icon: Tablet, link: "/products?category=tablets" },
  { name: "Audio", icon: Headphones, link: "/products?category=audio" },
  { name: "Monitors", icon: LayoutGrid, link: "/products?category=monitors" },
  { name: "Accessories", icon: LayoutGrid, link: "/products?category=accessories" },
  { name: "Smart Home", icon: HomeIcon, link: "/products?category=smart-home" },
];

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const categoryListVariants = {
  hidden: { height: 0, opacity: 0, transition: { duration: 0.2 } },
  visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
};

const Footer = () => {
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, amount: 0.1 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const handleScroll = useCallback(() => {
    if (window.scrollY > 300) {
      setShowScrollToTop(true);
    } else {
      setShowScrollToTop(false);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSubmitted(true);
    setEmail(""); // Clear email after submission
    setTimeout(() => setIsSubmitted(false), 3000); // Hide success message after 3 seconds
  };

  return (
    <footer className="relative overflow-hidden bg-primary py-12 text-primary-foreground md:py-16">
      {/* Background Wave Effect */}
      <div className="footer-wave-effect absolute inset-x-0 bottom-0 h-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          ref={footerRef}
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-4"
          variants={staggerContainer}
          initial="hidden"
          animate={controls}
        >
          {/* Column 1: Company Info */}
          <motion.div variants={fadeInUp}>
            <Link to="/" className="mb-4 flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-foreground text-primary font-bold text-sm">
                EP
              </div>
              <span className="font-poppins text-xl font-bold">ElectroPro</span>
            </Link>
            <p className="mb-4 text-sm text-primary-foreground/80">
              Your ultimate destination for cutting-edge electronics and unparalleled service.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p className="flex items-center">
                <Mail className="mr-2 h-4 w-4" /> support@electropro.com
              </p>
              <p className="flex items-center">
                <Phone className="mr-2 h-4 w-4" /> +1 (555) 123-4567
              </p>
              <p className="flex items-center">
                <MapPin className="mr-2 h-4 w-4" /> 123 Tech Ave, Innovation City, TX
              </p>
            </div>
          </motion.div>

          {/* Column 2: Quick Links */}
          <motion.div variants={fadeInUp}>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink
                  to="/"
                  className="hover:text-primary-foreground/60 transition-colors"
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className="hover:text-primary-foreground/60 transition-colors"
                >
                  Electronics
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className="hover:text-primary-foreground/60 transition-colors"
                >
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className="hover:text-primary-foreground/60 transition-colors"
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <DropdownMenu onOpenChange={setIsCategoriesOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex w-full justify-between p-0 text-sm text-primary-foreground hover:bg-transparent hover:text-primary-foreground/60"
                    >
                      Categories
                      <motion.div
                        animate={{ rotate: isCategoriesOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2 grid grid-cols-2 gap-2 bg-primary border-primary-foreground/20 text-primary-foreground">
                    <AnimatePresence>
                      {isCategoriesOpen && (
                        <motion.ul
                          variants={categoryListVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          className="col-span-2 grid grid-cols-2 gap-2"
                        >
                          {categories.map((category) => (
                            <DropdownMenuItem key={category.name} asChild>
                              <Link
                                to={category.link}
                                className="flex items-center gap-2 cursor-pointer rounded-md p-2 text-primary-foreground hover:bg-primary-foreground/10"
                              >
                                <category.icon className="h-4 w-4" />
                                {category.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </DropdownMenuContent>
                </DropdownMenu>
              </li>
            </ul>
          </motion.div>

          {/* Column 3: Customer Support */}
          <motion.div variants={fadeInUp}>
            <h3 className="mb-4 text-lg font-semibold">Customer Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/faq"
                  className="hover:text-primary-foreground/60 transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:text-primary-foreground/60 transition-colors"
                >
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link
                  to="/returns"
                  className="hover:text-primary-foreground/60 transition-colors"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:text-primary-foreground/60 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="hover:text-primary-foreground/60 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Column 4: Stay Connected */}
          <motion.div variants={fadeInUp}>
            <h3 className="mb-4 text-lg font-semibold">Stay Connected</h3>
            <p className="mb-4 text-sm text-primary-foreground/80">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mb-6 flex gap-2">
              <Input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-primary-foreground/10 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-primary-foreground/50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button type="submit" variant="secondary" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 flex items-center text-sm text-green-400"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Subscribed successfully!
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Youtube className="h-6 w-6" />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60 md:flex-row">
          <p>&copy; {new Date().getFullYear()} ElectroPro. All rights reserved.</p>
          <p>
            <a
              href="https://www.dyad.sh/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-foreground transition-colors"
            >
              Made with Dyad
            </a>
          </p>
        </div>
      </div>

      {/* Scroll-to-Top Button */}
      <AnimatePresence>
        {showScrollToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 rounded-full bg-accent p-3 shadow-lg text-accent-foreground hover:bg-accent/90"
            aria-label="Scroll to top"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

export default Footer;
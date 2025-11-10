"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, Easing } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { FaTiktok, FaTelegram, FaWhatsapp } from "react-icons/fa"; // Import FaWhatsapp
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";

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
  hidden: { opacity: 0, y: 50, x: -50 },
  visible: { opacity: 1, y: 0, x: 0, transition: { duration: 0.6, ease: "easeOut" as Easing } },
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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

  // URL-encoded address for Google Maps search
  const mapAddress = encodeURIComponent("No 4 crescent Street opposite Ace supermarket unity, Ilorin, Kwara State, Nigeria");
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapAddress}`;

  return (
    <footer className="relative overflow-hidden bg-primary py-12 text-primary-foreground md:py-16">
      {/* Background Wave Effect */}
      <div className="footer-wave-effect absolute inset-x-0 bottom-0 h-40" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10">
        <motion.div
          className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {/* Column 1: Company Info */}
          <motion.div variants={fadeInUp}>
            <Link to="/" className="mb-4 flex items-center">
              <UniqueEmporiumLogo className="h-[110px]" />
            </Link>
            <p className="mb-4 text-sm text-primary-foreground/80">
              Your ultimate destination for luxury thrift, fashion bundles, and unique wears.
            </p>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <a 
                href="mailto:support@uniqueemporium.com" 
                className="flex items-center hover:text-primary-foreground/60 transition-colors"
              >
                <Mail className="mr-2 h-4 w-4" /> support@uniqueemporium.com
              </a>
              <a 
                href="tel:+2349065545572" 
                className="flex items-center hover:text-primary-foreground/60 transition-colors"
              >
                <Phone className="mr-2 h-4 w-4" /> +234 (906) 554-5572
              </a>
              <a 
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center hover:text-primary-foreground/60 transition-colors"
              >
                <MapPin className="mr-2 h-11 w-11" /> No 4 crescent Street opposite Ace supermarket unity, Ilorin, Kwara State, Nigeria
              </a>
            </div>
          </motion.div>

          {/* Column 2: Customer Support */}
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
                  to="/warranty"
                  className="hover:text-primary-foreground/60 transition-colors"
                >
                  Warranty Information
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

          {/* Column 3: Stay Connected */}
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
                href="https://whatsapp.com/channel/0029VbBJEWBL7UVVHCMcjT0a"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaWhatsapp className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://www.facebook.com/profile.php?id=100083121582522&mibextid=ZbWKwL"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@uniquethriftwears001"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTiktok className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/unique_emporium1/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram className="h-6 w-6" />
              </motion.a>
              <motion.a
                href="https://t.me/+hmN1ID2WHJdjZGRk"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaTelegram className="h-6 w-6" />
              </motion.a>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60 md:flex-row">
          <p>&copy; 2019-2025 Unique Emporium. All rights reserved.</p>
          <p>
            <a
              href="https://www.web-aura.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary-foreground transition-colors"
            >
              Built with ❤️ by Web-Aura
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "react-hot-toast";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";

const newsletterSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

const Footer = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof newsletterSchema>>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: z.infer<typeof newsletterSchema>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Newsletter subscription:", data);
    toast.success("Thanks for subscribing to our newsletter!");
    reset();
  };

  return (
    <footer className="bg-card text-card-foreground border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center space-x-2">
              <UniqueEmporiumLogo className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold">Unique Emporium</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your one-stop shop for unique and high-quality products.
            </p>
            <div className="flex space-x-4">
              {/* Social Media Icons */}
              {/* Placeholder for social media icons */}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-muted-foreground hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/shipping" className="text-muted-foreground hover:text-primary transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe to our newsletter for exclusive offers and updates.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                {...register("email")}
                className="flex-grow"
              />
              <Button type="submit" variant="secondary" className="rounded-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
            {errors.email && (
              <p className="text-red-500 text-sm mt-2">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="border-t pt-8 mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Unique Emporium. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
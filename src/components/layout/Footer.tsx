"use client";

import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Shop",
      links: [
        { name: "All Products", href: "/products" },
        { name: "New Arrivals", href: "/products?sort=newest" },
        { name: "Best Sellers", href: "/products?sort=popular" },
        { name: "Sale", href: "/products?sale=true" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Contact Us", href: "/contact" },
        { name: "Careers", href: "/careers" },
        { name: "Blog", href: "/blog" },
      ],
    },
    {
      title: "Support",
      links: [
        { name: "FAQ", href: "/faq" },
        { name: "Shipping & Returns", href: "/shipping" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
  ];

  return (
    <footer className="relative overflow-hidden bg-secondary py-12 text-secondary-foreground md:py-16">
      {/* Background Wave Effect (If needed, ensure it contrasts with secondary) */}
      {/* <div className="footer-wave-effect absolute inset-x-0 bottom-0 h-40" /> */}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Column 1: Logo and Contact Info */}
          <div className="col-span-2 md:col-span-2">
            <Link to="/" className="inline-block">
              <UniqueEmporiumLogo className="h-[100px] w-auto" color="white" />
            </Link>
            <p className="mt-4 text-sm">
              Your destination for unique, high-quality wholesale fashion.
            </p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center">
                <Mail className="mr-3 h-4 w-4" />
                <a href="mailto:info@uniqueemporium.com" className="hover:text-primary transition-colors">
                  info@uniqueemporium.com
                </a>
              </div>
              <div className="flex items-center">
                <Phone className="mr-3 h-4 w-4" />
                <a href="tel:+1234567890" className="hover:text-primary transition-colors">
                  +1 (234) 567-890
                </a>
              </div>
              <div className="flex items-start">
                <MapPin className="mr-3 h-4 w-4 flex-shrink-0 mt-1" />
                <span>
                  123 Wholesale Lane, Fashion City, FC 90210
                </span>
              </div>
            </div>
          </div>

          {/* Columns 2, 3, 4: Navigation Links */}
          {footerLinks.map((section) => (
            <div key={section.title} className="col-span-1">
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Separator */}
        <div className="mt-12 border-t border-secondary-foreground/20 pt-8 md:flex md:items-center md:justify-between">
          {/* Social Media Icons */}
          <div className="flex space-x-6 justify-center md:justify-start">
            <a href="#" className="hover:text-primary transition-colors">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              <Twitter className="h-6 w-6" />
            </a>
          </div>

          {/* Copyright */}
          <p className="mt-8 text-center text-sm md:mt-0 md:text-right">
            &copy; {currentYear} Unique Emporium. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
"use client";

import React from "react";
import { Button } from "../ui/button";
import { ArrowDown } from "lucide-react";

interface HeroSectionProps {
  onScrollToFeatured: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToFeatured }) => {
  return (
    <section className="relative h-[80vh] md:h-[90vh] flex items-center justify-center overflow-hidden bg-background">
      {/* Background elements (e.g., subtle wave effect or gradient) */}
      <div className="absolute inset-0 footer-wave-effect opacity-50"></div>

      <div className="relative z-10 text-center px-4 max-w-4xl">
        <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 text-foreground">
          Discover the Future of Digital Art
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore unique, high-quality digital assets and join a thriving community of creators and collectors.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Button
            variant="secondary" // Use secondary variant for the purple color
            onClick={onScrollToFeatured}
            className="px-4 py-1.5 text-sm md:px-8 md:py-3 md:text-lg w-full sm:w-auto"
          >
            Explore Featured Items
          </Button>
          <Button
            variant="outline"
            className="px-4 py-1.5 text-sm md:px-8 md:py-3 md:text-lg w-full sm:w-auto"
          >
            Start Creating
          </Button>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={onScrollToFeatured}
          aria-label="Scroll down to featured items"
          className="p-2 rounded-full bg-secondary text-secondary-foreground shadow-lg hover:bg-secondary/90 transition-colors animate-bounce"
        >
          <ArrowDown className="w-6 h-6" />
        </button>
      </div>
    </section>
  );
};

export default HeroSection;
"use client";

import React from "react";
import FaqHero from "@/components/faq-page/FaqHero";
import FaqContent from "@/components/faq-page/FaqContent";

const FAQ = () => {
  return (
    <div className="min-h-screen w-full">
      <FaqHero />
      <FaqContent />
    </div>
  );
};

export default FAQ;
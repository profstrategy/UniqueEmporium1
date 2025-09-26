"use client";

import React from "react";
import TermsHero from "@/components/terms-page/TermsHero";
import TermsContent from "@/components/terms-page/TermsContent";
import TermsCTA from "@/components/terms-page/TermsCTA";

const Terms = () => {
  return (
    <div className="min-h-screen w-full">
      <TermsHero />
      <TermsContent />
      <TermsCTA />
    </div>
  );
};

export default Terms;
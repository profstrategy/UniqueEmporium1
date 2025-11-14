"use client";

import React from 'react';
import { Gem } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UniqueEmporiumLogoProps {
  className?: string;
  color?: string; // Added color prop
}

const UniqueEmporiumLogo: React.FC<UniqueEmporiumLogoProps> = ({ className, color }) => {
  // Determine text color based on the 'color' prop or default to Tailwind text-foreground
  const textColorClass = color ? '' : 'text-foreground';
  const style = color ? { color: color } : {};

  return (
    <div className={cn("flex items-center font-serif font-extrabold tracking-tight", className, textColorClass)} style={style}>
      <Gem className="h-6 w-6 mr-1" style={style} />
      Unique Emporium
    </div>
  );
};

export default UniqueEmporiumLogo;
"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import UniqueEmporiumLogo from "@/components/logo/UniqueEmporiumLogo.tsx";

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string | undefined;
  alt: string;
  containerClassName?: string; // Class for the wrapper div
  fallbackLogoClassName?: string; // Class for the fallback logo itself
}

const ImageWithFallback = ({
  src,
  alt,
  className,
  containerClassName,
  fallbackLogoClassName,
  ...props
}: ImageWithFallbackProps) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'failed'>(
    src ? 'loading' : 'failed'
  );

  const handleImageLoad = useCallback(() => {
    setImageStatus('loaded');
  }, []);

  const handleImageError = useCallback(() => {
    setImageStatus('failed');
  }, []);

  return (
    <div className={cn("relative flex items-center justify-center overflow-hidden", containerClassName)}>
      {imageStatus === 'loading' && (
        <Skeleton className="absolute inset-0 h-full w-full" />
      )}
      {imageStatus === 'failed' || !src ? (
        <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-muted">
          <UniqueEmporiumLogo className={cn("h-[140px] w-[140px] object-contain opacity-20", fallbackLogoClassName)} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          className={cn("w-full h-full object-cover transition-opacity duration-300", className)}
          style={{ opacity: imageStatus === 'loaded' ? 1 : 0 }}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...props}
        />
      )}
    </div>
  );
};

export default ImageWithFallback;
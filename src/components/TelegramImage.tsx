"use client";

import React, { useState, useEffect } from "react";
import { getDisplayImageUrl } from "@/lib/imageUrl";
import { Image as ImageIcon } from "lucide-react";

interface TelegramImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function TelegramImage({ src, alt, className = "", priority = false }: TelegramImageProps) {
  const displayUrl = getDisplayImageUrl(src);
  const [imageSrc, setImageSrc] = useState<string>(displayUrl);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    const nextUrl = getDisplayImageUrl(src);
    setImageSrc(nextUrl);
    setLoading(true);
    setHasError(false);
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading Skeleton */}
      {loading && !hasError && (
        <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800/80 animate-pulse flex items-center justify-center">
          <ImageIcon className="w-6 h-6 text-slate-400 dark:text-slate-600 opacity-40" />
        </div>
      )}

      {/* Actual Image */}
      {!hasError ? (
        <img
          src={imageSrc}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setLoading(false)}
          onError={() => {
            setLoading(false);
            setHasError(true);
          }}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            loading ? "opacity-0" : "opacity-100"
          }`}
        />
      ) : (
        /* Fallback on error */
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 p-4 text-center">
          <img
            src="/images/cars9-logo.png"
            alt="Cars9 Studio"
            className="w-16 h-auto opacity-40 grayscale object-contain mb-1"
          />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest truncate max-w-full px-2">
            {alt}
          </span>
        </div>
      )}
    </div>
  );
}

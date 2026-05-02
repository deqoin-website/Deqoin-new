"use client";

import { useState } from "react";

import CloudinaryImage from "@/components/CloudinaryImage";
import { cn } from "@/lib/utils";

type MaterialProductGalleryProps = {
  images: string[];
  title: string;
};

export default function MaterialProductGallery({ images, title }: MaterialProductGalleryProps) {
  const [activeImage, setActiveImage] = useState(images[0]);

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03]">
        <div className="relative aspect-[4/5] w-full">
          <CloudinaryImage src={activeImage} alt={title} className="h-full w-full object-cover" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {images.map((image) => {
          const isActive = image === activeImage;
          return (
            <button
              key={image}
              type="button"
              onClick={() => setActiveImage(image)}
              className={cn(
                "overflow-hidden rounded-2xl border transition-all",
                isActive ? "border-white/30 ring-1 ring-white/20" : "border-white/10 opacity-70 hover:opacity-100",
              )}
            >
              <div className="relative aspect-square">
                <CloudinaryImage src={image} alt={`${title} küçük görsel`} className="h-full w-full object-cover" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

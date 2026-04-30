"use client";

import type { CSSProperties, ImgHTMLAttributes } from "react";

function isCloudinarySource(src: string) {
  return src.includes("res.cloudinary.com") || src.includes("cloudinary.com/image/upload");
}

type CloudinaryImageProps = {
  alt: string;
  className?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
  priority?: boolean;
  sizes?: string;
  src: string;
  style?: CSSProperties;
};

export default function CloudinaryImage({
  alt,
  className,
  loading = "lazy",
  priority = false,
  sizes = "100vw",
  src,
  style,
}: CloudinaryImageProps) {
  if (!src) return null;

  const fetchPriority = priority ? "high" : "auto";
  const decoding = priority ? "sync" : "async";

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={className}
      style={style}
      fetchPriority={fetchPriority}
      decoding={decoding}
      sizes={sizes}
      data-cloudinary-source={isCloudinarySource(src) ? "true" : "false"}
    />
  );
}

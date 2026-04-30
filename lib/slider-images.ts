export const SLIDER_IMAGE_URLS = {
  mimari: "https://res.cloudinary.com/dq6sqm4uk/image/upload/v1777537719/deqoin/hero-slides/mimari-slide.jpg",
  material: "https://res.cloudinary.com/dq6sqm4uk/image/upload/v1777537720/deqoin/hero-slides/tasarim-slide.jpg",
  execution: "https://res.cloudinary.com/dq6sqm4uk/image/upload/v1777537721/deqoin/hero-slides/uygulama-slide.jpg",
} as const;

export const SLIDER_IMAGE_LIST = [
  SLIDER_IMAGE_URLS.mimari,
  SLIDER_IMAGE_URLS.material,
  SLIDER_IMAGE_URLS.execution,
] as const;

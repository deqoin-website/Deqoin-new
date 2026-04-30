import { resolveStudioCardImage } from "@/lib/image-resolvers";

export type HomeServiceCard = {
  href: string;
  title: string;
  subTitle: string;
  sideLabel: string;
  image: string;
  studioType: "design" | "material" | "execution";
  blur: number;
  overlay: number;
};

export const DEFAULT_HOME_SERVICE_CARDS: HomeServiceCard[] = [
  {
    href: "/mimari",
    title: "Design Studio",
    subTitle: "Mimari Tasarım",
    sideLabel: "Structural Integrity",
    image: "/images/workflow/design-studio-home.png",
    studioType: "design",
    blur: 0,
    overlay: 30,
  },
  {
    href: "/materyal-studyo",
    title: "Material Studio",
    subTitle: "Ürün ve Malzeme",
    sideLabel: "Aesthetic Soul",
    image: "/images/workflow/material-studio-home.png",
    studioType: "material",
    blur: 0,
    overlay: 30,
  },
  {
    href: "/uygulama",
    title: "Execution Studio",
    subTitle: "Uygulama Hizmetleri",
    sideLabel: "Precision Craft",
    image: "/images/workflow/execution-studio-home.png",
    studioType: "execution",
    blur: 0,
    overlay: 30,
  },
];

export function normalizeHomeServiceCards(input: any[]): HomeServiceCard[] {
  const cards = Array.isArray(input) ? input : [];
  const mappedByType = new Map<string, HomeServiceCard>();

  cards.forEach((card: any) => {
    const studioType = card?.studioType as HomeServiceCard["studioType"] | undefined;
    if (!studioType) return;

    mappedByType.set(studioType, {
      href:
        studioType === "design"
          ? "/mimari"
          : studioType === "material"
            ? "/materyal-studyo"
            : "/uygulama",
      title: typeof card.title === "string" && card.title.trim() ? card.title.trim() : "",
      subTitle: typeof card.description === "string" && card.description.trim() ? card.description.trim() : "",
      sideLabel:
        studioType === "design"
          ? "Structural Integrity"
          : studioType === "material"
            ? "Aesthetic Soul"
            : "Precision Craft",
      image: resolveStudioCardImage(card.image, studioType) || DEFAULT_HOME_SERVICE_CARDS.find((fallback) => fallback.studioType === studioType)?.image || "",
      studioType,
      blur: Number.isFinite(Number(card.blur)) ? Number(card.blur) : 0,
      overlay: Number.isFinite(Number(card.overlay)) ? Number(card.overlay) : 30,
    });
  });

  return DEFAULT_HOME_SERVICE_CARDS.map((fallback) => mappedByType.get(fallback.studioType) || fallback);
}

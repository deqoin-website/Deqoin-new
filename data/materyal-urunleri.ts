import { SLIDER_IMAGE_URLS } from "@/lib/slider-images";
import { materyalKategorileri } from "./materyal-studyo";
import { materialProducts as generatedMaterialProducts } from "./materyal-urunleri.generated";

export { materyalKategorileri };

export type MaterialProductFilterKey = "renk-tonu" | "yuzey-tipi" | "kullanim-alani";

export type MaterialProductFilterGroup = {
  key: MaterialProductFilterKey;
  title: string;
  description?: string;
  options: { label: string; value: string }[];
};

export type MaterialFeature = {
  label: string;
  value: string;
};

export type MaterialCrop = {
  x: number;
  y: number;
  zoom: number;
};

export type MaterialProduct = {
  slug: string;
  categorySlug: string;
  title: string;
  brandName?: string;
  heroImage: string;
  heroCrop?: MaterialCrop;
  gallery: string[];
  galleryCrops?: MaterialCrop[];
  shortInfo: string;
  sku: string;
  description: string;
  details: MaterialFeature[];
  filterValues: Record<MaterialProductFilterKey, string[]>;
  technicalDetails: MaterialFeature[];
  applicationAreas: string[];
  stockStatus?: "available" | "limited" | "made-to-order";
  stockLabel?: string;
  techTags?: string[];
  ctaVariant?: "request-sample" | "get-info" | "request-quote";
  ctaLabel?: string;
};

const defaultGallery = [
  SLIDER_IMAGE_URLS.material,
  "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2000&auto=format&fit=crop",
];

const legacyMaterialProducts: MaterialProduct[] = [
  {
    slug: "siena-dokulu-panel",
    categorySlug: "mobilya",
    title: "Siena Dokulu Panel",
    heroImage: defaultGallery[0],
    gallery: defaultGallery,
    shortInfo: "Mat yüzey",
    sku: "MOB-001",
    description:
      "İç mekan mobilya yüzeylerinde kullanılan, düşük parlaklıklı ve sakin dokulu panel çözümüdür.",
    details: [
      { label: "Ebat", value: "240 x 120 cm" },
      { label: "Kalınlık", value: "18 mm" },
      { label: "Menşei", value: "İtalya" },
      { label: "Yüzey", value: "Mat dokulu" },
    ],
    filterValues: {
      "renk-tonu": ["açık ton", "nötr"],
      "yuzey-tipi": ["mat"],
      "kullanim-alani": ["iç mekan", "mobilya"],
    },
    technicalDetails: [
      { label: "Taşıyıcı", value: "MDF bazlı sistem" },
      { label: "Kenarlık", value: "Düz kesim" },
      { label: "Bakım", value: "Nemli bezle temizlenebilir" },
    ],
    applicationAreas: ["Vestiyer", "Dolap kapağı", "TV ünitesi"],
    stockStatus: "available",
    stockLabel: "Stokta",
    techTags: ["MDF", "Mat", "İç mekan"],
    ctaVariant: "request-sample",
    ctaLabel: "Numune İste",
  },
  {
    slug: "traverten-zen",
    categorySlug: "tugla-ve-tas",
    title: "Traverten Zen",
    heroImage: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1523413453493-0b0f0a1d7b39?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Doğal taş",
    sku: "TAS-014",
    description:
      "Duvar ve zemin uygulamalarında kullanılan, doğal damar yapısını koruyan traverten seçkisidir.",
    details: [
      { label: "Ebat", value: "60 x 90 cm" },
      { label: "Kalınlık", value: "20 mm" },
      { label: "Menşei", value: "Türkiye" },
      { label: "Yüzey", value: "Honlu" },
    ],
    filterValues: {
      "renk-tonu": ["sıcak ton", "bej"],
      "yuzey-tipi": ["doğal taş", "honlu"],
      "kullanim-alani": ["duvar", "zemin"],
    },
    technicalDetails: [
      { label: "Dayanım", value: "Yüksek yoğunluklu" },
      { label: "Derz", value: "2-3 mm önerilir" },
      { label: "Bakım", value: "Taş koruyucu ile periyodik bakım" },
    ],
    applicationAreas: ["Salon duvarı", "Antre zemin", "Islak hacim duvarı"],
    stockStatus: "limited",
    stockLabel: "Sınırlı stok",
    techTags: ["Traverten", "Honlu", "Doğal taş"],
    ctaVariant: "get-info",
    ctaLabel: "Bilgi Al",
  },
  {
    slug: "cotta-oksit",
    categorySlug: "italyan-sivalar",
    title: "Cotta Oksit",
    heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Dokulu yüzey",
    sku: "SIVA-021",
    description:
      "İtalyan sıva karakterini taşıyan, hafif parlaklık ve derinlik veren dekoratif yüzey çözümüdür.",
    details: [
      { label: "Uygulama", value: "İç duvar" },
      { label: "Katman", value: "2 kat sistem" },
      { label: "Menşei", value: "İtalya" },
      { label: "Yüzey", value: "Oksit efektli" },
    ],
    filterValues: {
      "renk-tonu": ["koyu ton", "toprak ton"],
      "yuzey-tipi": ["dokulu", "mineral"],
      "kullanim-alani": ["duvar", "dekoratif"],
    },
    technicalDetails: [
      { label: "Kuruma", value: "Katlar arası 6-8 saat" },
      { label: "Son kat", value: "Koruyucu cila uygulanır" },
      { label: "Bakım", value: "Kuru ve hafif nemli bez" },
    ],
    applicationAreas: ["Oturma odası", "Lobi", "Özel nişler"],
    stockStatus: "available",
    stockLabel: "Stokta",
    techTags: ["İtalyan sıva", "Oksit", "Dokulu"],
    ctaVariant: "request-quote",
    ctaLabel: "Teklif Al",
  },
  {
    slug: "velato-mat",
    categorySlug: "dekoratif-boyalar",
    title: "Velato Mat",
    heroImage: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534655615591-6c7d0c8d1f5c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Saten mat",
    sku: "BOY-009",
    description:
      "Düz, yumuşak ve homojen yüzey isteyen iç mekanlar için hazırlanmış dekoratif boya sistemidir.",
    details: [
      { label: "Uygulama", value: "İç duvar" },
      { label: "Kaplama", value: "2 kat" },
      { label: "Menşei", value: "İtalya" },
      { label: "Yüzey", value: "Saten mat" },
    ],
    filterValues: {
      "renk-tonu": ["açık ton", "nötr"],
      "yuzey-tipi": ["mat", "dokulu"],
      "kullanim-alani": ["duvar", "dekoratif"],
    },
    technicalDetails: [
      { label: "Kuruma", value: "4-6 saat" },
      { label: "Örtücülük", value: "Yüksek" },
      { label: "Bakım", value: "Nemli bez ile" },
    ],
    applicationAreas: ["Salon", "Yatak odası", "Koridor"],
    stockStatus: "available",
    stockLabel: "Stokta",
    techTags: ["Boya", "Saten mat", "İç duvar"],
    ctaVariant: "get-info",
    ctaLabel: "Bilgi Al",
  },
  {
    slug: "cemento-battuto",
    categorySlug: "mikro-cimento",
    title: "Cemento Battuto",
    heroImage: SLIDER_IMAGE_URLS.execution,
    gallery: [
      SLIDER_IMAGE_URLS.execution,
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Derzsiz sistem",
    sku: "MCI-008",
    description:
      "Zemin ve duvar yüzeylerinde kullanılan, ek yeri görünmeyen mikro çimento sistemidir.",
    details: [
      { label: "Uygulama kalınlığı", value: "2-3 mm" },
      { label: "Menşei", value: "Avrupa" },
      { label: "Yüzey", value: "Mat / pürüzsüz" },
      { label: "Renk", value: "Gri tonlar" },
    ],
    filterValues: {
      "renk-tonu": ["gri", "nötr"],
      "yuzey-tipi": ["derzsiz", "mat"],
      "kullanim-alani": ["duvar", "zemin", "ıslak hacim"],
    },
    technicalDetails: [
      { label: "Performans", value: "Yüksek aşınma direnci" },
      { label: "Altlık", value: "Hazırlanmış mineral yüzey" },
      { label: "Bakım", value: "Nötr temizleyici ile" },
    ],
    applicationAreas: ["Banyo", "Mutfak", "Ticari alan"],
    stockStatus: "made-to-order",
    stockLabel: "Siparişe özel",
    techTags: ["Mikro çimento", "Derzsiz", "Mat"],
    ctaVariant: "request-sample",
    ctaLabel: "Numune İste",
  },
  {
    slug: "lumi-grid",
    categorySlug: "aydinlatma",
    title: "Lumi Grid",
    brandName: "hokasu",
    heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517999349371-c43520457b23?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Lineer çözüm",
    sku: "AYD-117",
    description:
      "Lineer formuyla mimari düzleme entegre olan teknik aydınlatma ürünüdür.",
    details: [
      { label: "Uzunluk", value: "120 cm" },
      { label: "Güç", value: "18 W" },
      { label: "Menşei", value: "Almanya" },
      { label: "Işık", value: "3000K" },
    ],
    filterValues: {
      "renk-tonu": ["sıcak beyaz", "soğuk beyaz"],
      "yuzey-tipi": ["lineer", "mimari"],
      "kullanim-alani": ["koridor", "mutfak", "galeri"],
    },
    technicalDetails: [
      { label: "CRI", value: "90+" },
      { label: "Kontrol", value: "Dim edilebilir" },
      { label: "Montaj", value: "Gömme / yüzeye" },
    ],
    applicationAreas: ["Koridor", "Mutfak", "Galeri duvarı"],
    stockStatus: "limited",
    stockLabel: "Sınırlı stok",
    techTags: ["Lineer", "3000K", "Dim"],
    ctaVariant: "request-quote",
    ctaLabel: "Teklif Al",
  },
  {
    slug: "aura-panel",
    categorySlug: "mobilya",
    title: "Aura Panel",
    heroImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Ahşap dokulu",
    sku: "MOB-014",
    description: "Dikey yüzeylerde sakin bir ritim oluşturan açık tonlu panel çözümüdür.",
    details: [
      { label: "Ebat", value: "280 x 120 cm" },
      { label: "Kalınlık", value: "18 mm" },
      { label: "Menşei", value: "İtalya" },
      { label: "Yüzey", value: "Doğal dokulu" },
    ],
    filterValues: {
      "renk-tonu": ["açık ton", "nötr"],
      "yuzey-tipi": ["dokulu", "mat"],
      "kullanim-alani": ["mobilya", "duvar"],
    },
    technicalDetails: [
      { label: "Taşıyıcı", value: "MDF bazlı sistem" },
      { label: "Bakım", value: "Nemli bezle temizlenebilir" },
    ],
    applicationAreas: ["Vestiyer", "Dolap kapağı", "Panel duvar"],
    stockStatus: "available",
    stockLabel: "Stokta",
    techTags: ["Ahşap", "Dokulu", "İç mekan"],
    ctaVariant: "request-sample",
    ctaLabel: "Numune İste",
  },
  {
    slug: "hokasu-halo",
    categorySlug: "aydinlatma",
    title: "Hokasu Halo",
    brandName: "hokasu",
    heroImage: "https://images.unsplash.com/photo-1517999349371-c43520457b23?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1517999349371-c43520457b23?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Halo form",
    sku: "AYD-118",
    description: "Yumuşak halka formu ile odaklı ve dekoratif ışık veren teknik armatürdür.",
    details: [
      { label: "Çap", value: "42 cm" },
      { label: "Güç", value: "24 W" },
      { label: "Menşei", value: "Japonya" },
      { label: "Işık", value: "2700K" },
    ],
    filterValues: {
      "renk-tonu": ["sıcak beyaz", "nötr beyaz"],
      "yuzey-tipi": ["halo"],
      "kullanim-alani": ["lobi", "yemek alanı", "giriş holü"],
    },
    technicalDetails: [
      { label: "CRI", value: "95" },
      { label: "Kontrol", value: "Dim edilebilir" },
    ],
    applicationAreas: ["Lobi", "Yemek alanı", "Giriş holleri"],
    stockStatus: "limited",
    stockLabel: "Sınırlı stok",
    techTags: ["Hokasu", "Halo", "Dim"],
    ctaVariant: "request-quote",
    ctaLabel: "Teklif Al",
  },
  {
    slug: "aureo-mica",
    categorySlug: "italyan-sivalar",
    title: "Aureo Mica",
    heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Mika dokulu",
    sku: "SIVA-022",
    description: "Işık altında hafif parlayan, derinlikli ve sıcak bir sıva yüzeyidir.",
    details: [
      { label: "Uygulama", value: "İç duvar" },
      { label: "Katman", value: "3 kat sistem" },
      { label: "Menşei", value: "İtalya" },
      { label: "Yüzey", value: "Mika efektli" },
    ],
    filterValues: {
      "renk-tonu": ["sıcak ton", "koyu ton"],
      "yuzey-tipi": ["dokulu", "mineral"],
      "kullanim-alani": ["duvar", "dekoratif"],
    },
    technicalDetails: [
      { label: "Kuruma", value: "Katlar arası 6 saat" },
      { label: "Bakım", value: "Kuru bez ile" },
    ],
    applicationAreas: ["Salon duvarı", "Otel lobisi", "Nişler"],
    stockStatus: "available",
    stockLabel: "Stokta",
    techTags: ["Mika", "Dokulu", "Dekoratif"],
    ctaVariant: "get-info",
    ctaLabel: "Bilgi Al",
  },
  {
    slug: "astro-satin",
    categorySlug: "dekoratif-boyalar",
    title: "Astro Saten",
    heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Saten yüzey",
    sku: "BOY-010",
    description: "Işığı yumuşak dağıtan, sakin ve temiz bir iç cephe boya sistemidir.",
    details: [
      { label: "Uygulama", value: "İç duvar" },
      { label: "Kat", value: "2 kat" },
      { label: "Menşei", value: "İtalya" },
      { label: "Yüzey", value: "Saten" },
    ],
    filterValues: {
      "renk-tonu": ["açık ton", "nötr"],
      "yuzey-tipi": ["mat", "saten"],
      "kullanim-alani": ["duvar", "mekan"],
    },
    technicalDetails: [
      { label: "Kuruma", value: "4-6 saat" },
      { label: "Örtücülük", value: "Yüksek" },
    ],
    applicationAreas: ["Salon", "Koridor", "Çalışma odası"],
    stockStatus: "available",
    stockLabel: "Stokta",
    techTags: ["Saten", "İç cephe", "Yumuşak ton"],
    ctaVariant: "get-info",
    ctaLabel: "Bilgi Al",
  },
  {
    slug: "cobble-raw",
    categorySlug: "tugla-ve-tas",
    title: "Cobble Raw",
    heroImage: "https://images.unsplash.com/photo-1524312015024-aa7f24097402?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1524312015024-aa7f24097402?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Kaba taş",
    sku: "TAS-015",
    description: "Cephe ve iç mekanlarda güçlü bir doku etkisi yaratan doğal taş seçkisidir.",
    details: [
      { label: "Ebat", value: "80 x 80 cm" },
      { label: "Kalınlık", value: "24 mm" },
      { label: "Menşei", value: "Türkiye" },
      { label: "Yüzey", value: "Ham yüzey" },
    ],
    filterValues: {
      "renk-tonu": ["koyu ton", "toprak ton"],
      "yuzey-tipi": ["doğal taş", "dokulu"],
      "kullanim-alani": ["duvar", "zemin"],
    },
    technicalDetails: [
      { label: "Dayanım", value: "Dış ortam uyumlu" },
      { label: "Bakım", value: "Taş koruyucu ile" },
    ],
    applicationAreas: ["Dış cephe", "Bahçe duvarı", "Lobi"],
    stockStatus: "limited",
    stockLabel: "Sınırlı stok",
    techTags: ["Taş", "Dokulu", "Ham yüzey"],
    ctaVariant: "request-quote",
    ctaLabel: "Teklif Al",
  },
  {
    slug: "noir-cerakote",
    categorySlug: "mikro-cimento",
    title: "Noir Cerakote",
    heroImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80",
    ],
    shortInfo: "Koyu mat",
    sku: "MCI-009",
    description: "Derzsiz yüzeyi koyu tonlarda daha dramatik bir mimari etkiyle sunar.",
    details: [
      { label: "Uygulama kalınlığı", value: "2-3 mm" },
      { label: "Menşei", value: "Avrupa" },
      { label: "Yüzey", value: "Mat" },
      { label: "Renk", value: "Antrasit" },
    ],
    filterValues: {
      "renk-tonu": ["koyu ton", "gri"],
      "yuzey-tipi": ["derzsiz", "mat"],
      "kullanim-alani": ["duvar", "zemin"],
    },
    technicalDetails: [
      { label: "Performans", value: "Yüksek aşınma direnci" },
      { label: "Bakım", value: "Nötr temizleyici ile" },
    ],
    applicationAreas: ["Banyo", "Mutfak", "Ticari alan"],
    stockStatus: "made-to-order",
    stockLabel: "Siparişe özel",
    techTags: ["Mikro çimento", "Koyu ton", "Mat"],
    ctaVariant: "request-sample",
    ctaLabel: "Numune İste",
  },
  {
    slug: "rolyef-29",
    categorySlug: "sanatsal-calismalar",
    title: "Rölyef 29",
    heroImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2000&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop",
    ],
    shortInfo: "Duvar rölyefi",
    sku: "SAN-003",
    description: "Projeye özel renk ve yüzey diliyle tasarlanan duvar rölyef çalışmasıdır.",
    details: [
      { label: "Ölçü", value: "Özel üretim" },
      { label: "Malzeme", value: "Karışık teknik" },
      { label: "Menşei", value: "Türkiye" },
      { label: "Yüzey", value: "Katmanlı" },
    ],
    filterValues: {
      "renk-tonu": ["nötr", "koyu ton"],
      "yuzey-tipi": ["dokulu", "sanatsal"],
      "kullanim-alani": ["duvar", "dekoratif"],
    },
    technicalDetails: [
      { label: "Üretim", value: "Siparişe özel" },
      { label: "Montaj", value: "Proje bazlı" },
    ],
    applicationAreas: ["Lobi", "Özel duvar", "Koleksiyon alanı"],
    stockStatus: "made-to-order",
    stockLabel: "Siparişe özel",
    techTags: ["Sanat", "Rölyef", "Özel üretim"],
    ctaVariant: "request-quote",
    ctaLabel: "Teklif Al",
  },
];

export const materialProducts: MaterialProduct[] = [
  ...legacyMaterialProducts,
  ...generatedMaterialProducts,
];

export const materialFilterGroups: MaterialProductFilterGroup[] = [
  {
    key: "renk-tonu",
    title: "Renk Tonu",
    description: "Önce genel ton, sonra alt aile seçin.",
    options: [
      { label: "Açık Ton", value: "açık ton" },
      { label: "Sıcak Ton", value: "sıcak ton" },
      { label: "Koyu Ton", value: "koyu ton" },
      { label: "Gri", value: "gri" },
      { label: "Nötr", value: "nötr" },
    ],
  },
  {
    key: "yuzey-tipi",
    title: "Yüzey Tipi",
    description: "Temel doku ve bitiş dili.",
    options: [
      { label: "Mat", value: "mat" },
      { label: "Dokulu", value: "dokulu" },
      { label: "Doğal Taş", value: "doğal taş" },
      { label: "Derzsiz", value: "derzsiz" },
      { label: "Metal", value: "metal" },
    ],
  },
  {
    key: "kullanim-alani",
    title: "Kullanım Alanı",
    description: "İlk etapta hedeflenen uygulama.",
    options: [
      { label: "Duvar", value: "duvar" },
      { label: "Zemin", value: "zemin" },
      { label: "Mobilya", value: "mobilya" },
      { label: "Islak Hacim", value: "ıslak hacim" },
      { label: "Dekoratif", value: "dekoratif" },
    ],
  },
];

const materialFilterGroupsByCategory: Record<string, MaterialProductFilterGroup[]> = {
  aydinlatma: [
    {
      key: "renk-tonu",
      title: "Işık Tonu",
      description: "Aydınlatmanın renk sıcaklığına göre filtreleyin.",
      options: [
        { label: "Sıcak Beyaz", value: "sıcak beyaz" },
        { label: "Nötr Beyaz", value: "nötr beyaz" },
        { label: "Soğuk Beyaz", value: "soğuk beyaz" },
      ],
    },
    {
      key: "yuzey-tipi",
      title: "Armatür Formu",
      description: "Aydınlatma ürününün form diline göre filtreleyin.",
      options: [
        { label: "Lineer", value: "lineer" },
        { label: "Halo", value: "halo" },
        { label: "Sarkıt", value: "sarkıt" },
        { label: "Panel", value: "panel" },
        { label: "Spot", value: "spot" },
      ],
    },
    {
      key: "kullanim-alani",
      title: "Kullanım Alanı",
      description: "Aydınlatmanın yerleşeceği mimari alanı seçin.",
      options: [
        { label: "Koridor", value: "koridor" },
        { label: "Mutfak", value: "mutfak" },
        { label: "Lobi", value: "lobi" },
        { label: "Giriş Holü", value: "giriş holü" },
        { label: "Galeri", value: "galeri" },
      ],
    },
  ],
  mobilya: [
    {
      key: "renk-tonu",
      title: "Renk Tonu",
      description: "Mobilya yüzeyinin ana tonuna göre filtreleyin.",
      options: [
        { label: "Açık Ton", value: "açık ton" },
        { label: "Sıcak Ton", value: "sıcak ton" },
        { label: "Koyu Ton", value: "koyu ton" },
        { label: "Gri", value: "gri" },
        { label: "Nötr", value: "nötr" },
      ],
    },
    {
      key: "yuzey-tipi",
      title: "Yüzey Tipi",
      description: "Malzemenin bitiş ve doku diline göre filtreleyin.",
      options: [
        { label: "Mat", value: "mat" },
        { label: "Dokulu", value: "dokulu" },
        { label: "Doğal Dokulu", value: "doğal dokulu" },
        { label: "Ahşap Dokulu", value: "ahşap dokulu" },
        { label: "Metal", value: "metal" },
      ],
    },
    {
      key: "kullanim-alani",
      title: "Kullanım Alanı",
      description: "Mobilyanın yerleşeceği projeye göre filtreleyin.",
      options: [
        { label: "Mobilya", value: "mobilya" },
        { label: "Duvar", value: "duvar" },
        { label: "İç Mekan", value: "iç mekan" },
        { label: "Dekoratif", value: "dekoratif" },
        { label: "Panel", value: "panel" },
      ],
    },
  ],
  "italyan-sivalar": [
    {
      key: "renk-tonu",
      title: "Renk Etkisi",
      description: "Sıva tonunu ve renk karakterini filtreleyin.",
      options: [
        { label: "Açık Ton", value: "açık ton" },
        { label: "Sıcak Ton", value: "sıcak ton" },
        { label: "Koyu Ton", value: "koyu ton" },
        { label: "Toprak Ton", value: "toprak ton" },
        { label: "Nötr", value: "nötr" },
      ],
    },
    {
      key: "yuzey-tipi",
      title: "Doku Tipi",
      description: "Yüzeyin bitiş karakterine göre filtreleyin.",
      options: [
        { label: "Dokulu", value: "dokulu" },
        { label: "Mineral", value: "mineral" },
        { label: "Metalik", value: "metalik" },
        { label: "Traverten", value: "traverten" },
        { label: "Pas / Oksit", value: "pas-oksit" },
      ],
    },
    {
      key: "kullanim-alani",
      title: "Uygulama Yüzeyi",
      description: "Sıvanın uygulanacağı alanı seçin.",
      options: [
        { label: "Duvar", value: "duvar" },
        { label: "Dekoratif", value: "dekoratif" },
        { label: "İç Mekan", value: "iç mekan" },
        { label: "Lobi", value: "lobi" },
        { label: "Niş", value: "niş" },
      ],
    },
  ],
  "dekoratif-boyalar": [
    {
      key: "renk-tonu",
      title: "Renk Paleti",
      description: "Boya renginin duygu tonuna göre filtreleyin.",
      options: [
        { label: "Açık Ton", value: "açık ton" },
        { label: "Sıcak Ton", value: "sıcak ton" },
        { label: "Koyu Ton", value: "koyu ton" },
        { label: "Nötr", value: "nötr" },
        { label: "Gri", value: "gri" },
      ],
    },
    {
      key: "yuzey-tipi",
      title: "Bitiş Tipi",
      description: "Boya yüzeyinin bitiş hissine göre filtreleyin.",
      options: [
        { label: "Mat", value: "mat" },
        { label: "Saten", value: "saten" },
        { label: "Dokulu", value: "dokulu" },
        { label: "Mineral", value: "mineral" },
        { label: "Kireç Esaslı", value: "kilic" },
      ],
    },
    {
      key: "kullanim-alani",
      title: "Uygulama Alanı",
      description: "Boya sisteminin kullanılacağı yüzeyi seçin.",
      options: [
        { label: "Duvar", value: "duvar" },
        { label: "Mekan", value: "mekan" },
        { label: "Dekoratif", value: "dekoratif" },
        { label: "Salon", value: "salon" },
        { label: "Koridor", value: "koridor" },
      ],
    },
  ],
  "mikro-cimento": [
    {
      key: "renk-tonu",
      title: "Renk Tonu",
      description: "Mikro çimento rengini ve ton karakterini filtreleyin.",
      options: [
        { label: "Gri", value: "gri" },
        { label: "Nötr", value: "nötr" },
        { label: "Koyu Ton", value: "koyu ton" },
        { label: "Açık Ton", value: "açık ton" },
      ],
    },
    {
      key: "yuzey-tipi",
      title: "Yüzey Tipi",
      description: "Derzsiz ve bitiş hissine göre filtreleyin.",
      options: [
        { label: "Derzsiz", value: "derzsiz" },
        { label: "Mat", value: "mat" },
        { label: "Pürüzsüz", value: "pürüzsüz" },
        { label: "Koyu Mat", value: "koyu mat" },
      ],
    },
    {
      key: "kullanim-alani",
      title: "Kullanım Alanı",
      description: "Mikro çimento uygulamasının yerleşeceği yüzeyi seçin.",
      options: [
        { label: "Duvar", value: "duvar" },
        { label: "Zemin", value: "zemin" },
        { label: "Islak Hacim", value: "ıslak hacim" },
        { label: "Banyo", value: "banyo" },
        { label: "Mutfak", value: "mutfak" },
      ],
    },
  ],
  "tugla-ve-tas": [
    {
      key: "renk-tonu",
      title: "Doğal Ton",
      description: "Taş ve tuğla yüzeyin ton ailesine göre filtreleyin.",
      options: [
        { label: "Koyu Ton", value: "koyu ton" },
        { label: "Sıcak Ton", value: "sıcak ton" },
        { label: "Toprak Ton", value: "toprak ton" },
        { label: "Bej", value: "bej" },
      ],
    },
    {
      key: "yuzey-tipi",
      title: "Malzeme Tipi",
      description: "Yüzeyin ham karakterine göre filtreleyin.",
      options: [
        { label: "Doğal Taş", value: "doğal taş" },
        { label: "Dokulu", value: "dokulu" },
        { label: "Honlu", value: "honlu" },
        { label: "Ham Yüzey", value: "ham yüzey" },
        { label: "Kaba Taş", value: "kaba taş" },
      ],
    },
    {
      key: "kullanim-alani",
      title: "Kullanım Alanı",
      description: "Taş ve tuğlanın kullanılacağı mimari alanı seçin.",
      options: [
        { label: "Duvar", value: "duvar" },
        { label: "Zemin", value: "zemin" },
        { label: "Dış Cephe", value: "dış cephe" },
        { label: "Bahçe", value: "bahçe" },
        { label: "Lobi", value: "lobi" },
      ],
    },
  ],
  "sanatsal-calismalar": [
    {
      key: "renk-tonu",
      title: "Ton Karakteri",
      description: "Sanatsal çalışmanın ton yoğunluğunu seçin.",
      options: [
        { label: "Nötr", value: "nötr" },
        { label: "Koyu Ton", value: "koyu ton" },
        { label: "Açık Ton", value: "açık ton" },
      ],
    },
    {
      key: "yuzey-tipi",
      title: "Doku Tipi",
      description: "Yüzeyin sanatsal ve dokusal karakterini filtreleyin.",
      options: [
        { label: "Dokulu", value: "dokulu" },
        { label: "Sanatsal", value: "sanatsal" },
        { label: "Rölyef", value: "rölyef" },
        { label: "Katmanlı", value: "katmanlı" },
      ],
    },
    {
      key: "kullanim-alani",
      title: "Kullanım Alanı",
      description: "Sanatsal çalışmanın yerleşeceği alanı seçin.",
      options: [
        { label: "Duvar", value: "duvar" },
        { label: "Dekoratif", value: "dekoratif" },
        { label: "Lobi", value: "lobi" },
        { label: "Koleksiyon", value: "koleksiyon" },
      ],
    },
  ],
};

export function getMaterialFilterGroups(categorySlug: string) {
  const resolvedSlug = resolveMaterialCategorySlug(categorySlug);
  return materialFilterGroupsByCategory[resolvedSlug] ?? materialFilterGroups;
}

const categoryAliases: Record<string, string> = {
  "italyan-boya": "dekoratif-boyalar",
  "italyan-boyalar": "dekoratif-boyalar",
  "italyan-siva": "italyan-sivalar",
  "italyan-sivalar": "italyan-sivalar",
  "mikro-cimento": "mikro-cimento",
  "mimaride-tas": "tugla-ve-tas",
};

export function resolveMaterialCategorySlug(slug: string) {
  return categoryAliases[slug] ?? slug;
}

export function getMaterialCategory(slug: string) {
  const resolvedSlug = resolveMaterialCategorySlug(slug);
  return materyalKategorileri.find((category) => category.slug === resolvedSlug) ?? null;
}

export function getMaterialProductsByCategory(categorySlug: string) {
  const resolvedSlug = resolveMaterialCategorySlug(categorySlug);
  return materialProducts.filter((product) => product.categorySlug === resolvedSlug);
}

export function getMaterialProduct(categorySlug: string, productSlug: string) {
  const resolvedSlug = resolveMaterialCategorySlug(categorySlug);
  return materialProducts.find(
    (product) => product.categorySlug === resolvedSlug && product.slug === productSlug,
  ) ?? null;
}

export function getRelatedMaterialProducts(categorySlug: string, productSlug: string, limit = 4) {
  const resolvedSlug = resolveMaterialCategorySlug(categorySlug);
  return materialProducts
    .filter((product) => product.categorySlug === resolvedSlug && product.slug !== productSlug)
    .slice(0, limit);
}

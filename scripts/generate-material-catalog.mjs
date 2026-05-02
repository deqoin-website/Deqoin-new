#!/usr/bin/env node

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const outputFile = path.join(root, "data/materyal-urunleri.generated.ts");
const assetRoot = path.join(root, "public/images/material-studio/generated");

const stockStatuses = ["available", "limited", "made-to-order"];
const ctaVariants = ["request-sample", "get-info", "request-quote"];

const categoryConfigs = {
  mobilya: {
    brandName: "deqoin",
    palette: ["#e6d7c3", "#b79f85", "#6a5541", "#201915"],
    titles: [
      "Siena Modül",
      "Siena Kanat",
      "Aura Edge",
      "Aura Doku",
      "Mira Raf",
      "Mira Slim",
      "Noma Grid",
      "Noma Flow",
    ],
    shortInfos: [
      "Mat yüzey",
      "Ahşap dokulu",
      "Sıcak geçiş",
      "Sessiz doku",
      "İnce profil",
      "Sakin form",
      "Panel yüzey",
      "Yumuşak geçiş",
    ],
    tonePool: ["açık ton", "sıcak ton", "koyu ton", "nötr", "gri"],
    surfacePool: ["mat", "dokulu", "doğal dokulu", "ahşap dokulu", "metal"],
    areaPool: ["mobilya", "duvar", "iç mekan", "dekoratif", "panel"],
    areas: ["Vestiyer", "Dolap kapağı", "TV ünitesi", "Panel duvar", "Niş kapak"],
    techTags: ["MDF", "Mat", "İç mekan", "Panel"],
    description: (title, shortInfo) =>
      `İç mekan mobilya yüzeylerinde kullanılan ${shortInfo.toLowerCase()} çözümüdür.`,
    details: (index, shortInfo) => [
      { label: "Ebat", value: `${220 + index * 8} x 120 cm` },
      { label: "Kalınlık", value: "18 mm" },
      { label: "Menşei", value: "İtalya" },
      { label: "Yüzey", value: shortInfo },
    ],
    technicalDetails: [
      { label: "Taşıyıcı", value: "MDF bazlı sistem" },
      { label: "Kenarlık", value: "Düz kesim" },
      { label: "Bakım", value: "Nemli bezle temizlenebilir" },
    ],
  },
  aydinlatma: {
    brandName: "hokasu",
    palette: ["#fff3d6", "#f0d08c", "#d39f45", "#191716"],
    titles: [
      "Hokasu Arc",
      "Hokasu Beam",
      "Hokasu Prism",
      "Hokasu Ring",
      "Hokasu Rail",
      "Hokasu Dot",
      "Hokasu Veil",
      "Hokasu Pulse",
    ],
    shortInfos: [
      "Kavisli form",
      "Yönlü ışık",
      "Heykelsi çözüm",
      "Çevresel ışık",
      "Raylı sistem",
      "Mini spot",
      "Yumuşak difüzyon",
      "Ritimli ışık",
    ],
    tonePool: ["sıcak beyaz", "nötr beyaz", "soğuk beyaz"],
    surfacePool: ["lineer", "halo", "sarkıt", "panel", "spot"],
    areaPool: ["koridor", "mutfak", "lobi", "giriş holü", "galeri", "yemek alanı"],
    areas: ["Koridor", "Mutfak", "Lobi", "Giriş holü", "Galeri"],
    techTags: ["Hokasu", "Dim", "Lineer", "Mimari"],
    description: (title, shortInfo) =>
      `Mimari düzleme entegre olan ${shortInfo.toLowerCase()} aydınlatma ürünüdür.`,
    details: (index, shortInfo) => [
      { label: index % 2 === 0 ? "Uzunluk" : "Çap", value: index % 2 === 0 ? `${90 + index * 8} cm` : `${24 + index * 2} cm` },
      { label: "Güç", value: `${18 + index * 2} W` },
      { label: "Menşei", value: index % 2 === 0 ? "Almanya" : "Japonya" },
      { label: "Işık", value: index % 3 === 0 ? "3000K" : index % 3 === 1 ? "2700K" : "4000K" },
    ],
    technicalDetails: [
      { label: "CRI", value: "90+" },
      { label: "Kontrol", value: "Dim edilebilir" },
      { label: "Montaj", value: "Gömme / yüzeye" },
    ],
  },
  "italyan-sivalar": {
    brandName: "deqoin",
    palette: ["#f5ede2", "#d0b28c", "#9c7350", "#2a2018"],
    titles: [
      "Marmo Brillio",
      "Calce Vento",
      "Ferro Patina",
      "Sasso Opaco",
      "Terra Lino",
      "Velare Latte",
      "Onda Stucco",
      "Ardesia Riva",
    ],
    shortInfos: [
      "Mika dokulu",
      "Sıcak kireç",
      "Pas efektli",
      "Mat taş",
      "Toprak ton",
      "Yumuşak açık",
      "Dalgalı yüzey",
      "Arduaz etkisi",
    ],
    tonePool: ["açık ton", "sıcak ton", "koyu ton", "toprak ton", "nötr"],
    surfacePool: ["dokulu", "mineral", "metalik", "traverten", "pas-oksit"],
    areaPool: ["duvar", "dekoratif", "iç mekan", "lobi", "niş"],
    areas: ["Oturma odası", "Lobi", "Özel niş", "TV duvarı", "Galeri"],
    techTags: ["İtalyan sıva", "Dokulu", "Mineral", "El işçiligi"],
    description: (title, shortInfo) =>
      `Duvarlarda derinlik oluşturan ${shortInfo.toLowerCase()} İtalyan sıva çözümüdür.`,
    details: (index, shortInfo) => [
      { label: "Uygulama", value: "İç duvar" },
      { label: "Katman", value: `${2 + (index % 2)} kat sistem` },
      { label: "Menşei", value: "İtalya" },
      { label: "Yüzey", value: shortInfo },
    ],
    technicalDetails: [
      { label: "Kuruma", value: "Katlar arası 6-8 saat" },
      { label: "Son kat", value: "Koruyucu cila uygulanır" },
      { label: "Bakım", value: "Kuru ve hafif nemli bez" },
    ],
  },
  "dekoratif-boyalar": {
    brandName: "deqoin",
    palette: ["#f4efe8", "#c8b7a4", "#93796a", "#261f1a"],
    titles: [
      "Nebula Mineral",
      "Vela Soft",
      "Riva Matte",
      "Brio Silk",
      "Haze Wash",
      "Mono Tone",
      "Aura Calm",
      "Luna Coat",
    ],
    shortInfos: [
      "Mineral boya",
      "Yumuşak mat",
      "Saten etki",
      "İnce ipek",
      "Yıkanmış yüzey",
      "Tek ton",
      "Sakin yüzey",
      "Aydınlık kat",
    ],
    tonePool: ["açık ton", "sıcak ton", "koyu ton", "nötr", "gri"],
    surfacePool: ["mat", "saten", "dokulu", "mineral", "kilic"],
    areaPool: ["duvar", "mekan", "dekoratif", "salon", "koridor"],
    areas: ["Salon", "Yatak odası", "Koridor", "Mutfak", "Çalışma odası"],
    techTags: ["Boya", "Saten", "İç cephe", "Mineral"],
    description: (title, shortInfo) =>
      `İç duvarlarda ${shortInfo.toLowerCase()} etki kuran dekoratif boya sistemidir.`,
    details: (index, shortInfo) => [
      { label: "Uygulama", value: "İç duvar" },
      { label: "Kat", value: "2 kat" },
      { label: "Menşei", value: "İtalya" },
      { label: "Yüzey", value: shortInfo },
    ],
    technicalDetails: [
      { label: "Kuruma", value: "4-6 saat" },
      { label: "Örtücülük", value: "Yüksek" },
      { label: "Bakım", value: "Nemli bez ile" },
    ],
  },
  "mikro-cimento": {
    brandName: "deqoin",
    palette: ["#d9d5cf", "#8f887f", "#5b5751", "#1e1d1c"],
    titles: [
      "Riva Seam",
      "Mono Grain",
      "Slate Flow",
      "Urban Skin",
      "Terra Coat",
      "Edge Seam",
      "Mica Layer",
      "Base Dust",
    ],
    shortInfos: [
      "Derzsiz yüzey",
      "Doğal granül",
      "Akışkan doku",
      "Kentsel yüzey",
      "Toprak ton",
      "İnce kenar",
      "Mika katman",
      "Yumuşak toz",
    ],
    tonePool: ["gri", "nötr", "koyu ton", "açık ton"],
    surfacePool: ["derzsiz", "mat", "pürüzsüz", "koyu mat"],
    areaPool: ["duvar", "zemin", "ıslak hacim", "banyo", "mutfak"],
    areas: ["Banyo", "Mutfak", "Ticari alan", "Antre", "Zemin"],
    techTags: ["Mikro çimento", "Derzsiz", "Mat", "Minimal"],
    description: (title, shortInfo) =>
      `Kesintisiz yüzey isteyen alanlar için ${shortInfo.toLowerCase()} mikro çimento sistemidir.`,
    details: (index, shortInfo) => [
      { label: "Uygulama kalınlığı", value: "2-3 mm" },
      { label: "Menşei", value: "Avrupa" },
      { label: "Yüzey", value: shortInfo },
      { label: "Renk", value: index % 2 === 0 ? "Gri tonlar" : "Nötr tonlar" },
    ],
    technicalDetails: [
      { label: "Performans", value: "Yüksek aşınma direnci" },
      { label: "Altlık", value: "Hazırlanmış mineral yüzey" },
      { label: "Bakım", value: "Nötr temizleyici ile" },
    ],
  },
  "sanatsal-calismalar": {
    brandName: "deqoin",
    palette: ["#ede5da", "#baa58d", "#7d6754", "#1e1713"],
    titles: [
      "Form 07",
      "Kütle 04",
      "İz 12",
      "Doku 19",
      "Katman 03",
      "Eşik 06",
      "Yansıma 11",
      "Çizgi 08",
      "Nokta 05",
    ],
    shortInfos: [
      "Geometrik form",
      "Hacim çalışması",
      "İz bırakımı",
      "Yoğun doku",
      "Katman etkisi",
      "Geçiş dili",
      "Yansıyan yüzey",
      "İnce çizgi",
      "Noktasal ritim",
    ],
    tonePool: ["nötr", "koyu ton", "açık ton"],
    surfacePool: ["dokulu", "sanatsal", "rölyef", "katmanlı"],
    areaPool: ["duvar", "dekoratif", "lobi", "koleksiyon"],
    areas: ["Lobi", "Özel duvar", "Koleksiyon alanı", "Giriş", "Niş"],
    techTags: ["Sanat", "Rölyef", "Özel üretim", "Müdahale"],
    description: (title, shortInfo) =>
      `Mekana karakter katan ${shortInfo.toLowerCase()} sanatsal çalışma önerisidir.`,
    details: (index, shortInfo) => [
      { label: "Ölçü", value: "Özel üretim" },
      { label: "Malzeme", value: "Karışık teknik" },
      { label: "Menşei", value: "Türkiye" },
      { label: "Yüzey", value: shortInfo },
    ],
    technicalDetails: [
      { label: "Üretim", value: "Siparişe özel" },
      { label: "Montaj", value: "Proje bazlı" },
    ],
  },
  "tugla-ve-tas": {
    brandName: "deqoin",
    palette: ["#d8c7b2", "#a38b72", "#63513d", "#211911"],
    titles: [
      "Ledge Stone",
      "Basalt Edge",
      "Quarry Block",
      "Brick Calm",
      "Stone Veil",
      "Terra Stack",
      "Mineral Face",
      "Earth Cut",
    ],
    shortInfos: [
      "Keskin taş",
      "Volkanik doku",
      "Blok form",
      "Sakin tuğla",
      "Taş perdesi",
      "Katmanlı yüzey",
      "Mineral yüzey",
      "Toprak kesim",
    ],
    tonePool: ["koyu ton", "sıcak ton", "toprak ton", "bej"],
    surfacePool: ["doğal taş", "dokulu", "honlu", "ham yüzey", "kaba taş"],
    areaPool: ["duvar", "zemin", "dış cephe", "bahçe", "lobi"],
    areas: ["Dış cephe", "Bahçe duvarı", "Lobi", "Antre", "Zemin"],
    techTags: ["Taş", "Dokulu", "Doğal", "Ham yüzey"],
    description: (title, shortInfo) =>
      `Doğal taş ve tuğla karakterini taşıyan ${shortInfo.toLowerCase()} yüzey çözümüdür.`,
    details: (index, shortInfo) => [
      { label: "Ebat", value: "60 x 90 cm" },
      { label: "Kalınlık", value: `${20 + (index % 3) * 2} mm` },
      { label: "Menşei", value: index % 2 === 0 ? "Türkiye" : "İtalya" },
      { label: "Yüzey", value: shortInfo },
    ],
    technicalDetails: [
      { label: "Dayanım", value: "Yüksek yoğunluklu" },
      { label: "Derz", value: "2-3 mm önerilir" },
      { label: "Bakım", value: "Taş koruyucu ile periyodik bakım" },
    ],
  },
};

const generatedCountByCategory = {
  mobilya: 8,
  aydinlatma: 8,
  "italyan-sivalar": 8,
  "dekoratif-boyalar": 8,
  "mikro-cimento": 8,
  "sanatsal-calismalar": 9,
  "tugla-ve-tas": 8,
};

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function hashCode(value) {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

function createRng(seed) {
  return () => {
    seed += 0x6d2b79f5;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(items, index) {
  return items[index % items.length];
}

function makeSvg(seed, palette, variant) {
  const rng = createRng(seed + variant * 7919);
  const [c1, c2, c3, c4] = palette;
  const bg = variant % 2 === 0 ? `url(#bg-${variant})` : `url(#bg-soft-${variant})`;
  const circles = Array.from({ length: 5 }, (_, index) => {
    const x = Math.round(120 + rng() * 960);
    const y = Math.round(160 + rng() * 1280);
    const r = Math.round(110 + rng() * 280);
    const fill = index % 2 === 0 ? c3 : c2;
    const opacity = (0.12 + rng() * 0.22).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${opacity}" filter="url(#blur-${variant})" />`;
  });
  const bars = Array.from({ length: 8 }, (_, index) => {
    const x = Math.round(rng() * 1080);
    const y = Math.round(rng() * 1400);
    const width = Math.round(80 + rng() * 240);
    const height = Math.round(10 + rng() * 42);
    const rotate = Math.round(-35 + rng() * 70);
    const fill = index % 3 === 0 ? c1 : index % 3 === 1 ? c2 : c4;
    const opacity = (0.18 + rng() * 0.2).toFixed(2);
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${height / 2}" fill="${fill}" opacity="${opacity}" transform="rotate(${rotate} ${x + width / 2} ${y + height / 2})" />`;
  });
  const arcs = Array.from({ length: 4 }, (_, index) => {
    const x1 = Math.round(100 + rng() * 1000);
    const y1 = Math.round(100 + rng() * 1200);
    const x2 = Math.round(100 + rng() * 1000);
    const y2 = Math.round(100 + rng() * 1200);
    const cx = Math.round(100 + rng() * 1000);
    const cy = Math.round(100 + rng() * 1200);
    const stroke = index % 2 === 0 ? c4 : c1;
    const opacity = (0.35 + rng() * 0.25).toFixed(2);
    return `<path d="M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}" stroke="${stroke}" stroke-width="${18 + index * 6}" stroke-linecap="round" opacity="${opacity}" fill="none" />`;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="1600" viewBox="0 0 1200 1600" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg-${variant}" x1="0" y1="0" x2="1200" y2="1600" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c1}" />
      <stop offset="0.54" stop-color="${c2}" />
      <stop offset="1" stop-color="${c4}" />
    </linearGradient>
    <linearGradient id="bg-soft-${variant}" x1="1200" y1="0" x2="0" y2="1600" gradientUnits="userSpaceOnUse">
      <stop stop-color="${c2}" />
      <stop offset="0.52" stop-color="${c3}" />
      <stop offset="1" stop-color="${c4}" />
    </linearGradient>
    <filter id="blur-${variant}">
      <feGaussianBlur stdDeviation="${24 + variant * 2}" />
    </filter>
  </defs>
  <rect width="1200" height="1600" fill="${bg}" />
  <rect x="0" y="0" width="1200" height="1600" fill="rgba(255,255,255,0.06)" />
  ${circles.join("\n  ")}
  ${bars.join("\n  ")}
  ${arcs.join("\n  ")}
  <rect x="76" y="78" width="1048" height="1444" rx="72" stroke="rgba(255,255,255,0.12)" stroke-width="2" />
</svg>`;
}

function buildProduct(categorySlug, index, config) {
  const title = config.titles[index];
  const shortInfo = config.shortInfos[index];
  const slug = slugify(title);
  const seed = hashCode(`${categorySlug}:${slug}`);
  const hero = `/images/material-studio/generated/${categorySlug}/${slug}-hero.svg`;
  const gallery = [
    hero,
    `/images/material-studio/generated/${categorySlug}/${slug}-gallery-1.svg`,
    `/images/material-studio/generated/${categorySlug}/${slug}-gallery-2.svg`,
  ];
  const stockStatus = stockStatuses[index % stockStatuses.length];
  const ctaVariant = ctaVariants[index % ctaVariants.length];

  return {
    slug,
    categorySlug,
    title,
    brandName: config.brandName,
    heroImage: hero,
    gallery,
    shortInfo,
    sku: `${categorySlug.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(3, "0")}`,
    description: config.description(title, shortInfo),
    details: config.details(index, shortInfo),
    filterValues: {
      "renk-tonu": [pick(config.tonePool, index)],
      "yuzey-tipi": [pick(config.surfacePool, index)],
      "kullanim-alani": [pick(config.areaPool, index), pick(config.areaPool, index + 1)].filter(Boolean),
    },
    technicalDetails: config.technicalDetails,
    applicationAreas: [
      pick(config.areas, index),
      pick(config.areas, index + 1),
      pick(config.areas, index + 2),
    ],
    stockStatus,
    stockLabel:
      stockStatus === "limited" ? "Sınırlı stok" : stockStatus === "made-to-order" ? "Siparişe özel" : "Stokta",
    techTags: [config.titles[index].split(" ")[0], shortInfo, categorySlug.replace(/-/g, " ")],
    ctaVariant,
    ctaLabel:
      ctaVariant === "request-sample"
        ? "Numune İste"
        : ctaVariant === "request-quote"
          ? "Teklif Al"
          : "Bilgi Al",
  };
}

async function main() {
  await mkdir(assetRoot, { recursive: true });

  const products = [];
  for (const [categorySlug, config] of Object.entries(categoryConfigs)) {
    const targetCount = generatedCountByCategory[categorySlug];
    const categoryDir = path.join(assetRoot, categorySlug);
    await mkdir(categoryDir, { recursive: true });

    for (let index = 0; index < targetCount; index += 1) {
      const product = buildProduct(categorySlug, index, config);
      products.push(product);

      const seed = hashCode(`${categorySlug}:${product.slug}`);
      const heroSvg = makeSvg(seed, config.palette, 0);
      const gallery1Svg = makeSvg(seed, config.palette, 1);
      const gallery2Svg = makeSvg(seed, config.palette, 2);

      await writeFile(path.join(categoryDir, `${product.slug}-hero.svg`), heroSvg, "utf8");
      await writeFile(path.join(categoryDir, `${product.slug}-gallery-1.svg`), gallery1Svg, "utf8");
      await writeFile(path.join(categoryDir, `${product.slug}-gallery-2.svg`), gallery2Svg, "utf8");
    }
  }

  const header = `import type { MaterialProduct } from "./materyal-urunleri";\n\n`;
  const body = `export const materialProducts = ${JSON.stringify(products, null, 2)} satisfies MaterialProduct[];\n`;
  await writeFile(outputFile, header + body, "utf8");
  console.log(`Generated ${products.length} products and SVG assets.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

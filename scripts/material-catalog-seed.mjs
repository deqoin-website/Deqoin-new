const BASE_URL = process.env.MATERIAL_CATALOG_BASE_URL || process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3000";

export const productSeeds = {
  mobilya: [
    {
      slug: "siena-dokulu-panel",
      brandName: "deqoin",
      title: "Siena Dokulu Panel",
      shortInfo: "Mat yüzey",
      sku: "MOB-001",
      description: "İç mekan mobilya yüzeylerinde kullanılan, düşük parlaklıklı ve sakin dokulu panel çözümüdür.",
      heroImage: "/images/projects/gallery_1.png",
      gallery: ["/images/projects/gallery_1.png"],
      details: [
        { label: "Ebat", value: "240 x 120 cm" },
        { label: "Kalınlık", value: "18 mm" },
        { label: "Menşei", value: "İtalya" },
        { label: "Yüzey", value: "Mat dokulu" },
      ],
      technicalDetails: [
        { label: "Taşıyıcı", value: "MDF bazlı sistem" },
        { label: "Kenarlık", value: "Düz kesim" },
        { label: "Bakım", value: "Nemli bezle temizlenebilir" },
      ],
      applicationAreas: ["Vestiyer", "Dolap kapağı", "TV ünitesi"],
      techTags: ["MDF", "Mat", "İç mekan"],
      stockStatus: "available",
      stockLabel: "Stokta",
      ctaVariant: "request-sample",
      ctaLabel: "Numune İste",
      filterValues: {
        "renk-tonu": ["açık ton", "nötr"],
        "yuzey-tipi": ["mat"],
        "kullanim-alani": ["iç mekan", "mobilya"],
      },
    },
    {
      slug: "aura-panel",
      brandName: "deqoin",
      title: "Aura Panel",
      shortInfo: "Ahşap dokulu",
      sku: "MOB-014",
      description: "Dikey yüzeylerde sakin bir ritim oluşturan açık tonlu panel çözümüdür.",
      heroImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80",
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
      ],
      details: [
        { label: "Ebat", value: "280 x 120 cm" },
        { label: "Kalınlık", value: "18 mm" },
        { label: "Menşei", value: "İtalya" },
        { label: "Yüzey", value: "Doğal dokulu" },
      ],
      technicalDetails: [
        { label: "Taşıyıcı", value: "MDF bazlı sistem" },
        { label: "Bakım", value: "Nemli bezle temizlenebilir" },
      ],
      applicationAreas: ["Vestiyer", "Dolap kapağı", "Panel duvar"],
      techTags: ["Ahşap", "Dokulu", "İç mekan"],
      stockStatus: "available",
      stockLabel: "Stokta",
      ctaVariant: "request-sample",
      ctaLabel: "Numune İste",
      filterValues: {
        "renk-tonu": ["açık ton", "nötr"],
        "yuzey-tipi": ["dokulu", "mat"],
        "kullanim-alani": ["mobilya", "duvar"],
      },
    },
  ],
  "tugla-ve-tas": [
    {
      slug: "traverten-zen",
      brandName: "deqoin",
      title: "Traverten Zen",
      shortInfo: "Doğal taş",
      sku: "TAS-014",
      description: "Duvar ve zemin uygulamalarında kullanılan, doğal damar yapısını koruyan traverten seçkisidir.",
      heroImage: "/images/projects/gallery_1.png",
      gallery: ["/images/projects/gallery_1.png"],
      details: [
        { label: "Ebat", value: "60 x 90 cm" },
        { label: "Kalınlık", value: "20 mm" },
        { label: "Menşei", value: "Türkiye" },
        { label: "Yüzey", value: "Honlu" },
      ],
      technicalDetails: [
        { label: "Dayanım", value: "Yüksek yoğunluklu" },
        { label: "Derz", value: "2-3 mm önerilir" },
        { label: "Bakım", value: "Taş koruyucu ile periyodik bakım" },
      ],
      applicationAreas: ["Salon duvarı", "Antre zemin", "Islak hacim duvarı"],
      techTags: ["Traverten", "Honlu", "Doğal taş"],
      stockStatus: "limited",
      stockLabel: "Sınırlı stok",
      ctaVariant: "get-info",
      ctaLabel: "Bilgi Al",
      filterValues: {
        "renk-tonu": ["sıcak ton", "bej"],
        "yuzey-tipi": ["doğal taş", "honlu"],
        "kullanim-alani": ["duvar", "zemin"],
      },
    },
    {
      slug: "cobble-raw",
      brandName: "deqoin",
      title: "Cobble Raw",
      shortInfo: "Kaba taş",
      sku: "TAS-015",
      description: "Cephe ve iç mekanlarda güçlü bir doku etkisi yaratan doğal taş seçkisidir.",
      heroImage: "https://images.unsplash.com/photo-1524312015024-aa7f24097402?q=80&w=2000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1524312015024-aa7f24097402?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2000&auto=format&fit=crop",
      ],
      details: [
        { label: "Ebat", value: "80 x 80 cm" },
        { label: "Kalınlık", value: "24 mm" },
        { label: "Menşei", value: "Türkiye" },
        { label: "Yüzey", value: "Ham yüzey" },
      ],
      technicalDetails: [
        { label: "Dayanım", value: "Dış ortam uyumlu" },
        { label: "Bakım", value: "Taş koruyucu ile" },
      ],
      applicationAreas: ["Dış cephe", "Bahçe duvarı", "Lobi"],
      techTags: ["Taş", "Dokulu", "Ham yüzey"],
      stockStatus: "limited",
      stockLabel: "Sınırlı stok",
      ctaVariant: "request-quote",
      ctaLabel: "Teklif Al",
      filterValues: {
        "renk-tonu": ["koyu ton", "toprak ton"],
        "yuzey-tipi": ["doğal taş", "dokulu"],
        "kullanim-alani": ["duvar", "zemin"],
      },
    },
  ],
  "italyan-sivalar": [
    {
      slug: "cotta-oksit",
      brandName: "deqoin",
      title: "Cotta Oksit",
      shortInfo: "Dokulu yüzey",
      sku: "SIVA-021",
      description: "İtalyan sıva karakterini taşıyan, hafif parlaklık ve derinlik veren dekoratif yüzey çözümüdür.",
      heroImage: "/images/projects/gallery_2.png",
      gallery: ["/images/projects/gallery_2.png"],
      details: [
        { label: "Uygulama", value: "İç duvar" },
        { label: "Katman", value: "2 kat sistem" },
        { label: "Menşei", value: "İtalya" },
        { label: "Yüzey", value: "Oksit efektli" },
      ],
      technicalDetails: [
        { label: "Kuruma", value: "Katlar arası 6-8 saat" },
        { label: "Son kat", value: "Koruyucu cila uygulanır" },
        { label: "Bakım", value: "Kuru ve hafif nemli bez" },
      ],
      applicationAreas: ["Oturma odası", "Lobi", "Özel nişler"],
      techTags: ["İtalyan sıva", "Oksit", "Dokulu"],
      stockStatus: "available",
      stockLabel: "Stokta",
      ctaVariant: "request-quote",
      ctaLabel: "Teklif Al",
      filterValues: {
        "renk-tonu": ["koyu ton", "toprak ton"],
        "yuzey-tipi": ["dokulu", "mineral"],
        "kullanim-alani": ["duvar", "dekoratif"],
      },
    },
    {
      slug: "aureo-mica",
      brandName: "deqoin",
      title: "Aureo Mica",
      shortInfo: "Mika dokulu",
      sku: "SIVA-022",
      description: "Işık altında hafif parlayan, derinlikli ve sıcak bir sıva yüzeyidir.",
      heroImage: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2000&auto=format&fit=crop",
      ],
      details: [
        { label: "Uygulama", value: "İç duvar" },
        { label: "Katman", value: "3 kat sistem" },
        { label: "Menşei", value: "İtalya" },
        { label: "Yüzey", value: "Mika efektli" },
      ],
      technicalDetails: [
        { label: "Kuruma", value: "Katlar arası 6 saat" },
        { label: "Bakım", value: "Kuru bez ile" },
      ],
      applicationAreas: ["Salon duvarı", "Otel lobisi", "Nişler"],
      techTags: ["Mika", "Dokulu", "Dekoratif"],
      stockStatus: "available",
      stockLabel: "Stokta",
      ctaVariant: "get-info",
      ctaLabel: "Bilgi Al",
      filterValues: {
        "renk-tonu": ["sıcak ton", "koyu ton"],
        "yuzey-tipi": ["dokulu", "mineral"],
        "kullanim-alani": ["duvar", "dekoratif"],
      },
    },
  ],
  "dekoratif-boyalar": [
    {
      slug: "velato-mat",
      brandName: "deqoin",
      title: "Velato Mat",
      shortInfo: "Saten mat",
      sku: "BOY-009",
      description: "Düz, yumuşak ve homojen yüzey isteyen iç mekanlar için hazırlanmış dekoratif boya sistemidir.",
      heroImage: "/images/projects/gallery_2.png",
      gallery: ["/images/projects/gallery_2.png"],
      details: [
        { label: "Uygulama", value: "İç duvar" },
        { label: "Kaplama", value: "2 kat" },
        { label: "Menşei", value: "İtalya" },
        { label: "Yüzey", value: "Saten mat" },
      ],
      technicalDetails: [
        { label: "Kuruma", value: "4-6 saat" },
        { label: "Örtücülük", value: "Yüksek" },
        { label: "Bakım", value: "Nemli bez ile" },
      ],
      applicationAreas: ["Salon", "Yatak odası", "Koridor"],
      techTags: ["Boya", "Saten mat", "İç duvar"],
      stockStatus: "available",
      stockLabel: "Stokta",
      ctaVariant: "get-info",
      ctaLabel: "Bilgi Al",
      filterValues: {
        "renk-tonu": ["açık ton", "nötr"],
        "yuzey-tipi": ["mat", "dokulu"],
        "kullanim-alani": ["duvar", "dekoratif"],
      },
    },
    {
      slug: "astro-satin",
      brandName: "deqoin",
      title: "Astro Saten",
      shortInfo: "Saten yüzey",
      sku: "BOY-010",
      description: "Işığı yumuşak dağıtan, sakin ve temiz bir iç cephe boya sistemidir.",
      heroImage: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2000&auto=format&fit=crop",
      ],
      details: [
        { label: "Uygulama", value: "İç duvar" },
        { label: "Kat", value: "2 kat" },
        { label: "Menşei", value: "İtalya" },
        { label: "Yüzey", value: "Saten" },
      ],
      technicalDetails: [
        { label: "Kuruma", value: "4-6 saat" },
        { label: "Örtücülük", value: "Yüksek" },
      ],
      applicationAreas: ["Salon", "Koridor", "Çalışma odası"],
      techTags: ["Saten", "İç cephe", "Yumuşak ton"],
      stockStatus: "available",
      stockLabel: "Stokta",
      ctaVariant: "get-info",
      ctaLabel: "Bilgi Al",
      filterValues: {
        "renk-tonu": ["açık ton", "nötr"],
        "yuzey-tipi": ["mat", "saten"],
        "kullanim-alani": ["duvar", "mekan"],
      },
    },
  ],
  "mikro-cimento": [
    {
      slug: "cemento-battuto",
      brandName: "deqoin",
      title: "Cemento Battuto",
      shortInfo: "Derzsiz sistem",
      sku: "MCI-008",
      description: "Zemin ve duvar yüzeylerinde kullanılan, ek yeri görünmeyen mikro çimento sistemidir.",
      heroImage: "/images/projects/gallery_3.png",
      gallery: ["/images/projects/gallery_3.png"],
      details: [
        { label: "Uygulama kalınlığı", value: "2-3 mm" },
        { label: "Menşei", value: "Avrupa" },
        { label: "Yüzey", value: "Mat / pürüzsüz" },
        { label: "Renk", value: "Gri tonlar" },
      ],
      technicalDetails: [
        { label: "Performans", value: "Yüksek aşınma direnci" },
        { label: "Altlık", value: "Hazırlanmış mineral yüzey" },
        { label: "Bakım", value: "Nötr temizleyici ile" },
      ],
      applicationAreas: ["Banyo", "Mutfak", "Ticari alan"],
      techTags: ["Mikro çimento", "Derzsiz", "Mat"],
      stockStatus: "made-to-order",
      stockLabel: "Siparişe özel",
      ctaVariant: "request-sample",
      ctaLabel: "Numune İste",
      filterValues: {
        "renk-tonu": ["gri", "nötr"],
        "yuzey-tipi": ["derzsiz", "mat"],
        "kullanim-alani": ["duvar", "zemin", "ıslak hacim"],
      },
    },
    {
      slug: "noir-cerakote",
      brandName: "deqoin",
      title: "Noir Cerakote",
      shortInfo: "Koyu mat",
      sku: "MCI-009",
      description: "Derzsiz yüzeyi koyu tonlarda daha dramatik bir mimari etkiyle sunar.",
      heroImage: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80",
      ],
      details: [
        { label: "Uygulama kalınlığı", value: "2-3 mm" },
        { label: "Menşei", value: "Avrupa" },
        { label: "Yüzey", value: "Mat" },
        { label: "Renk", value: "Antrasit" },
      ],
      technicalDetails: [
        { label: "Performans", value: "Yüksek aşınma direnci" },
        { label: "Bakım", value: "Nötr temizleyici ile" },
      ],
      applicationAreas: ["Banyo", "Mutfak", "Ticari alan"],
      techTags: ["Mikro çimento", "Koyu ton", "Mat"],
      stockStatus: "made-to-order",
      stockLabel: "Siparişe özel",
      ctaVariant: "request-sample",
      ctaLabel: "Numune İste",
      filterValues: {
        "renk-tonu": ["koyu ton", "gri"],
        "yuzey-tipi": ["derzsiz", "mat"],
        "kullanim-alani": ["duvar", "zemin"],
      },
    },
  ],
  aydinlatma: [
    {
      slug: "hokasu-lineer",
      brandName: "hokasu",
      title: "Hokasu Lineer",
      shortInfo: "Lineer çözüm",
      sku: "AYD-117",
      description: "Mimari düzleme entegre olan teknik lineer aydınlatma çözümü.",
      heroImage: "/images/projects/gallery_4.png",
      gallery: ["/images/projects/gallery_4.png"],
      details: [
        { label: "Uzunluk", value: "120 cm" },
        { label: "Güç", value: "18 W" },
        { label: "Menşei", value: "Almanya" },
        { label: "Işık", value: "3000K" },
      ],
      technicalDetails: [
        { label: "CRI", value: "90+" },
        { label: "Kontrol", value: "Dim edilebilir" },
        { label: "Montaj", value: "Gömme / yüzeye" },
      ],
      applicationAreas: ["Koridor", "Mutfak", "Galeri duvarı"],
      techTags: ["Lineer", "3000K", "Dim"],
      stockStatus: "limited",
      stockLabel: "Sınırlı stok",
      ctaVariant: "request-quote",
      ctaLabel: "Teklif Al",
      filterValues: {
        "renk-tonu": ["sıcak beyaz", "soğuk beyaz"],
        "yuzey-tipi": ["metal", "mat"],
        "kullanim-alani": ["tavan", "duvar"],
      },
    },
    {
      slug: "hokasu-halo",
      brandName: "hokasu",
      title: "Hokasu Halo",
      shortInfo: "Halo form",
      sku: "AYD-118",
      description: "Yumuşak halka formu ile odaklı ve dekoratif ışık veren teknik armatürdür.",
      heroImage: "https://images.unsplash.com/photo-1517999349371-c43520457b23?q=80&w=2000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1517999349371-c43520457b23?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop",
      ],
      details: [
        { label: "Çap", value: "42 cm" },
        { label: "Güç", value: "24 W" },
        { label: "Menşei", value: "Japonya" },
        { label: "Işık", value: "2700K" },
      ],
      technicalDetails: [
        { label: "CRI", value: "95" },
        { label: "Kontrol", value: "Dim edilebilir" },
      ],
      applicationAreas: ["Lobi", "Yemek alanı", "Giriş holleri"],
      techTags: ["Hokasu", "Halo", "Dim"],
      stockStatus: "limited",
      stockLabel: "Sınırlı stok",
      ctaVariant: "request-quote",
      ctaLabel: "Teklif Al",
      filterValues: {
        "renk-tonu": ["sıcak beyaz", "nötr"],
        "yuzey-tipi": ["metal", "mat"],
        "kullanim-alani": ["tavan", "dekoratif"],
      },
    },
  ],
  "sanatsal-calismalar": [
    {
      slug: "rolyef-29",
      brandName: "deqoin",
      title: "Rölyef 29",
      shortInfo: "Duvar rölyefi",
      sku: "SAN-003",
      description: "Projeye özel renk ve yüzey diliyle tasarlanan duvar rölyef çalışmasıdır.",
      heroImage: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2000&auto=format&fit=crop",
      gallery: [
        "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop",
      ],
      details: [
        { label: "Ölçü", value: "Özel üretim" },
        { label: "Malzeme", value: "Karışık teknik" },
        { label: "Menşei", value: "Türkiye" },
        { label: "Yüzey", value: "Katmanlı" },
      ],
      technicalDetails: [
        { label: "Üretim", value: "Siparişe özel" },
        { label: "Montaj", value: "Proje bazlı" },
      ],
      applicationAreas: ["Lobi", "Özel duvar", "Koleksiyon alanı"],
      techTags: ["Sanat", "Rölyef", "Özel üretim"],
      stockStatus: "made-to-order",
      stockLabel: "Siparişe özel",
      ctaVariant: "request-quote",
      ctaLabel: "Teklif Al",
      filterValues: {
        "renk-tonu": ["nötr", "koyu ton"],
        "yuzey-tipi": ["dokulu", "sanatsal"],
        "kullanim-alani": ["duvar", "dekoratif"],
      },
    },
  ],
};

async function fetchJson(url, options) {
  const response = await fetch(url, options);
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || `Request failed: ${response.status}`);
  }
  return payload;
}

async function upsertCategory(slug, products) {
  const department = await fetchJson(`${BASE_URL}/api/departments/${slug}`);
  const body = {
    ...department,
    products: products.map((product) => ({
      ...product,
      categorySlug: slug,
    })),
  };

  const saved = await fetchJson(`${BASE_URL}/api/admin/departments/${slug}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  console.log(`UPDATED ${slug} ${Array.isArray(saved?.products) ? saved.products.length : products.length}`);
}

async function main() {
  for (const [slug, products] of Object.entries(productSeeds)) {
    await upsertCategory(slug, products);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

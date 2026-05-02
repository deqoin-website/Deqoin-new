export type SiteSeoConfig = {
  title: string;
  description: string;
  keywords: string[];
};

const keywordBase = [
  "deqoin",
  "nevşehir iç mimarlık",
  "kapadokya iç mimarlık",
  "villa projesi",
  "villa tasarımı",
  "villa iç mimarlık",
  "anahtar teslim villa",
  "iç mimarlık",
];

const SEO_MAP: Array<{ match: RegExp; config: SiteSeoConfig }> = [
  {
    match: /^\/$/,
    config: {
      title: "deqoin | Nevşehir İç Mimarlık, Uygulama ve İtalyan Boya",
      description:
        "Nevşehir ve Kapadokya’da iç mimarlık, villa projeleri, uygulama ve İtalyan boya çözümleri. Projeniz için deqoin ile iletişime geçin.",
      keywords: [
        ...keywordBase,
        "nevşehir mimarlık",
        "kapadokya mimarlık",
        "italyan boya",
        "mimari uygulama",
      ],
    },
  },
  {
    match: /^\/hakkimizda$/,
    config: {
      title: "deqoin Hakkında | Nevşehir Mimarlık Stüdyosu",
      description:
        "deqoin, Nevşehir merkezli iç mimarlık, villa projeleri, uygulama ve malzeme seçimi yapan mimarlık stüdyosudur. Ekibimizi inceleyin.",
      keywords: [
        ...keywordBase,
        "nevşehir mimarlık stüdyosu",
        "kapadokya mimarlık ofisi",
      ],
    },
  },
  {
    match: /^\/mimari(\/.*)?$/,
    config: {
      title: "Mimari Tasarım ve Villa Projeleri | deqoin",
      description:
        "Villa projesi, iç mimarlık ve mimari projelendirme için deqoin ile çalışın. Sade, net ve sahaya uygun çözümü şimdi inceleyin.",
      keywords: [
        ...keywordBase,
        "mimari tasarım",
        "mimari proje",
        "villa projesi",
        "projelendirme",
      ],
    },
  },
  {
    match: /^\/uygulama(\/.*)?$/,
    config: {
      title: "Villa ve İnşaat Uygulamaları | deqoin",
      description:
        "Villa, konut ve ticari projelerde saha uygulaması ve ekip yönetimi. Projeniz için doğru ekiple çalışmak istiyorsanız inceleyin.",
      keywords: [
        ...keywordBase,
        "inşaat uygulama",
        "uygulama ekibi",
        "şantiye yönetimi",
        "anahtar teslim uygulama",
      ],
    },
  },
  {
    match: /^\/materyal-studyo(\/.*)?$/,
    config: {
      title: "Materyal Stüdyo | İtalyan Boya ve Villa Malzemeleri",
      description:
        "İtalyan boya, doğal taş, mobilya ve mimari malzemeleri inceleyin. Villa ve iç mekan projeleri için uygun seçenekleri görün.",
      keywords: [
        ...keywordBase,
        "materyal stüdyosu",
        "italyan boya",
        "doğal taş",
        "mimari malzeme",
        "yüzey kaplama",
      ],
    },
  },
  {
    match: /^\/galeri(\/.*)?$/,
    config: {
      title: "Proje Galerisi | Villa ve Mimari Referanslar",
      description:
        "Villa, konut ve mimari proje referanslarını inceleyin. Benzer işleri karşılaştırın ve kendi projeniz için fikir alın.",
      keywords: [
        ...keywordBase,
        "proje galerisi",
        "mimari referans",
        "villa referansları",
      ],
    },
  },
  {
    match: /^\/journal(\/.*)?$/,
    config: {
      title: "deqoin Journal | Mimari ve Villa Projeleri",
      description:
        "Mimari, villa ve uygulama notlarını okuyun. Proje fikri, malzeme seçimi ve saha süreci için pratik içerikleri keşfedin.",
      keywords: [
        ...keywordBase,
        "mimari içerik",
        "villa projeleri",
        "uygulama notları",
      ],
    },
  },
  {
    match: /^\/iletisim$/,
    config: {
      title: "İletişim | deqoin Nevşehir Mimarlık",
      description:
        "Villa projesi, iç mimarlık veya uygulama için deqoin ile iletişime geçin. Nevşehir merkezli ekibimiz kısa sürede dönüş yapar.",
      keywords: [
        ...keywordBase,
        "iletişim",
        "nevşehir mimarlık iletişim",
      ],
    },
  },
  {
    match: /^\/tasarim$/,
    config: {
      title: "İç Mimarlık ve Villa Tasarımı | deqoin",
      description:
        "İç mimarlık ve villa tasarımı için proje, malzeme ve uygulama süreçlerini tek yerde inceleyin. Detayları şimdi görün.",
      keywords: [
        ...keywordBase,
        "iç mimarlık tasarım",
        "villa tasarımı",
        "mekan tasarımı",
      ],
    },
  },
  {
    match: /^\/departman-ekipleri$/,
    config: {
      title: "Uzman Ekipler | Villa ve Mimari Uygulama",
      description:
        "Villa ve mimari projelerde çalışan ekipleri inceleyin. Uygulama, saha yönetimi ve teknik destek için doğru ekibi seçin.",
      keywords: [
        ...keywordBase,
        "ekip yönetimi",
        "uygulama ekibi",
        "teknik ekip",
      ],
    },
  },
];

export function getSiteSeoConfig(pathname: string): SiteSeoConfig {
  const normalized = pathname.trim() || "/";
  const match = SEO_MAP.find((entry) => entry.match.test(normalized));
  if (match) {
    return match.config;
  }

  return {
    title: "deqoin | Nevşehir İç Mimarlık ve Uygulama",
    description:
      "deqoin, Nevşehir ve Kapadokya’da iç mimarlık, uygulama ve mimari malzeme çözümleri sunar.",
    keywords: [...keywordBase, "nevşehir iç mimarlık", "kapadokya mimarlık"],
  };
}

export type AboutStat = {
  label: string;
  value: string;
};

export type AboutSection = {
  title: string;
  content: string;
  image?: string;
};

export type AboutContent = {
  page: "about";
  title: string;
  subtitle: string;
  description: string;
  image: string;
  stats: AboutStat[];
  sections: AboutSection[];
  metadata?: {
    lastUpdatedBy?: string;
    updatedAt?: string;
  };
};

export const normalizeAboutStat = (value: unknown, fallback: AboutStat): AboutStat => {
  if (!value || typeof value !== "object") return { ...fallback };

  const candidate = value as Partial<AboutStat>;
  return {
    label: candidate.label?.toString() || fallback.label,
    value: candidate.value?.toString() || fallback.value,
  };
};

export const normalizeAboutSection = (value: unknown, fallback: AboutSection): AboutSection => {
  if (!value || typeof value !== "object") return { ...fallback };

  const candidate = value as Partial<AboutSection>;
  return {
    title: candidate.title?.toString() || fallback.title,
    content: candidate.content?.toString() || fallback.content,
    image: candidate.image?.toString() || "",
  };
};

export const CURRENT_ABOUT_CONTENT: AboutContent = {
  page: "about",
  title: "Sizin hikayeniz, sizin mekanınız.",
  subtitle: "BİZ KİMİZ",
  description:
    "Biz deqoin'i kurarken tek bir inancımız vardı: Bir ev, sadece dört duvar ve eşyalardan ibaret olamaz. Bu yüzden mimarinin teknik gücünü, sizin kişisel zevklerinizle ve yaşam tarzınızla harmanlıyoruz. Hayatınıza dokunan, içinde kendinizi huzurlu hissedeceğiniz ve yıllara meydan okuyan sıcak yaşam alanları tasarlıyoruz. Kısacası, sizin hikayenizi mekanlara yansıtıyoruz.",
  image: "/images/about_interior.png",
  stats: [
    { label: "DENEYİM", value: "10+ YIL" },
    { label: "TESLİM EDİLEN", value: "+240 PROJE" },
    { label: "UZMAN EKİP", value: "40+ KİŞİ" },
  ],
  sections: [
    {
      title: "KEŞİF VE ANALİZ",
      content: "Projenin ruhunu ve ihtiyaçlarını anlamak için derinlemesine bir analiz süreci yürütüyoruz.",
    },
    {
      title: "KONSEPT TASARIM",
      content: "Analizlerden yola çıkarak, markanıza veya yaşam tarzınıza özel özgün konseptler geliştiriyoruz.",
    },
    {
      title: "MİMARİ GELİŞTİRME",
      content: "Onaylanan konsepti, teknik disiplinler ve estetik detaylarla harmanlayarak projelendiriyoruz.",
    },
    {
      title: "UYGULAMA VE TESLİM",
      content: "Yüksek kalite standartlarında, anahtar teslim uygulama süreci ile hayallerinizi gerçeğe dönüştürüyoruz.",
    },
  ],
};

export const LEGACY_ABOUT_CONTENT: AboutContent = {
  page: "about",
  title: "TASARIMDAN ÖTE:\nBÜTÜNSEL BİR DENEYİM",
  subtitle: "BİZ KİMİZ",
  description:
    "Bizler sadece fiziksel yapılar inşa etmiyor; tüm değerlerinizi ortaya koyan bütünsel bir deneyim kurguluyoruz. Tasarımın sadece estetik bir form değil, yaşam biçimini şekillendiren bir disiplin olduğuna inanıyoruz.",
  image: "/images/workflow/hakkimizda-home.png",
  stats: [
    { label: "DENEYİM", value: "10+ YIL" },
    { label: "TESLİM EDİLEN", value: "+240 PROJE" },
    { label: "UZMAN EKİP", value: "40+ KİŞİ" },
  ],
  sections: [
    {
      title: "KEŞİF VE ANALİZ",
      content: "Projenin ruhunu ve ihtiyaçlarını anlamak için derinlemesine bir analiz süreci yürütüyoruz.",
    },
    {
      title: "KONSEPT TASARIM",
      content: "Analizlerden yola çıkarak, markanıza veya yaşam tarzınıza özel özgün konseptler geliştiriyoruz.",
    },
    {
      title: "MİMARİ GELİŞTİRME",
      content: "Onaylanan konsepti, teknik disiplinler ve estetik detaylarla harmanlayarak projelendiriyoruz.",
    },
    {
      title: "UYGULAMA VE TESLİM",
      content: "Yüksek kalite standartlarında, anahtar teslim uygulama süreci ile hayallerinizi gerçeğe dönüştürüyoruz.",
    },
  ],
};

export const createAboutDefaultContent = (): AboutContent => ({
  ...CURRENT_ABOUT_CONTENT,
  stats: CURRENT_ABOUT_CONTENT.stats.map((item) => ({ ...item })),
  sections: CURRENT_ABOUT_CONTENT.sections.map((item) => ({ ...item })),
  metadata: {
    updatedAt: new Date().toISOString(),
  },
});

export const normalizeAboutContent = (value: unknown): AboutContent => {
  const fallback = createAboutDefaultContent();
  if (!value || typeof value !== "object") return fallback;

  const candidate = value as Partial<AboutContent>;
  const statsSource = Array.isArray(candidate.stats) && candidate.stats.length > 0 ? candidate.stats : fallback.stats;
  const sectionsSource =
    Array.isArray(candidate.sections) && candidate.sections.length > 0 ? candidate.sections : fallback.sections;

  return {
    page: "about",
    title: candidate.title?.toString() || fallback.title,
    subtitle: candidate.subtitle?.toString() || fallback.subtitle,
    description: candidate.description?.toString() || fallback.description,
    image: candidate.image?.toString() || fallback.image,
    stats: statsSource.map((item, index) => normalizeAboutStat(item, fallback.stats[index] || fallback.stats[0])),
    sections: sectionsSource.map((item, index) =>
      normalizeAboutSection(item, fallback.sections[index] || fallback.sections[0]),
    ),
    metadata: candidate.metadata
      ? {
          lastUpdatedBy: candidate.metadata.lastUpdatedBy?.toString(),
          updatedAt: candidate.metadata.updatedAt?.toString(),
        }
      : fallback.metadata,
  };
};

export const isLegacyAboutContent = (value: unknown) => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AboutContent>;
  return (
    candidate.title === LEGACY_ABOUT_CONTENT.title &&
    candidate.subtitle === LEGACY_ABOUT_CONTENT.subtitle &&
    candidate.description === LEGACY_ABOUT_CONTENT.description &&
    candidate.image === LEGACY_ABOUT_CONTENT.image
  );
};

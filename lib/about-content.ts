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

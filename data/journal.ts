import { projectsData } from "./projects";

export type JournalDepartment = "MİMARİ" | "MATERYAL" | "UYGULAMA" | "MÜHENDİSLİK";
export type JournalProjectType =
  | "KONUT"
  | "TİCARİ"
  | "RESTORASYON"
  | "KARMA KULLANIM"
  | "KÜLTÜR"
  | "KURUMSAL";
export type JournalContentType = "İÇGÖRÜLER" | "TEKNİK VERİ" | "GÜNCEL HABERLER" | "PERSPEKTİFLER";

export const JOURNAL_DEPARTMENTS: { label: JournalDepartment; value: JournalDepartment }[] = [
  { label: "MİMARİ", value: "MİMARİ" },
  { label: "MATERYAL", value: "MATERYAL" },
  { label: "UYGULAMA", value: "UYGULAMA" },
  { label: "MÜHENDİSLİK", value: "MÜHENDİSLİK" },
];

export const JOURNAL_PROJECT_TYPES: { label: JournalProjectType; value: JournalProjectType }[] = [
  { label: "KONUT", value: "KONUT" },
  { label: "TİCARİ", value: "TİCARİ" },
  { label: "RESTORASYON", value: "RESTORASYON" },
  { label: "KARMA KULLANIM", value: "KARMA KULLANIM" },
  { label: "KÜLTÜR", value: "KÜLTÜR" },
  { label: "KURUMSAL", value: "KURUMSAL" },
];

export const JOURNAL_CONTENT_TYPES: { label: JournalContentType; value: JournalContentType }[] = [
  { label: "İÇGÖRÜLER", value: "İÇGÖRÜLER" },
  { label: "TEKNİK VERİ", value: "TEKNİK VERİ" },
  { label: "GÜNCEL HABERLER", value: "GÜNCEL HABERLER" },
  { label: "PERSPEKTİFLER", value: "PERSPEKTİFLER" },
];

export type JournalTechnicalDatum = {
  label: string;
  value: string;
};

export type JournalSection =
  | {
      type: "paragraph";
      body: string;
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
    }
  | {
      type: "technical";
      items: JournalTechnicalDatum[];
    }
  | {
      type: "related";
      title: string;
      items: { slug: string; title: string; label: string }[];
    };

export type JournalArticle = {
  slug: string;
  title: string;
  deck: string;
  coverImage: string;
  publishedAt: string;
  readTime: string;
  articleType: JournalContentType;
  departments: JournalDepartment[];
  projectTypes: JournalProjectType[];
  contentTypes: JournalContentType[];
  relatedProjectSlugs: string[];
  intro: string;
  sections: JournalSection[];
};

function getProjectReference(slug: string) {
  const project = projectsData.find((entry) => entry.slug === slug);

  return {
    slug,
    title: project?.title ?? slug.toUpperCase(),
    label: project?.label ?? "PROJE",
  };
}

const skyline = projectsData.find((project) => project.slug === "skyline-residence");
const lumina = projectsData.find((project) => project.slug === "lumina-gallery");
const nexus = projectsData.find((project) => project.slug === "nexus-corporate-center");
const vertex = projectsData.find((project) => project.slug === "vertex-mixed-use");
const obsidian = projectsData.find((project) => project.slug === "obsidian-tower");

export const journalArticles: JournalArticle[] = [
  {
    slug: "sukun-cizgi-skyline-residence",
    title: "SUSKUN ÇİZGİ / SKYLINE RESIDENCE",
    deck: "KONUT ÖLÇEĞİNDE, ŞEHİRLE ARASINA MESAFE KOYAN SESSİZ BİR KÜTLE OKUMASI.",
    coverImage: skyline?.coverImage ?? "/images/projects/gallery_1.png",
    publishedAt: "28 NİSAN 2026",
    readTime: "06 DK",
    articleType: "PERSPEKTİFLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT"],
    contentTypes: ["PERSPEKTİFLER", "İÇGÖRÜLER"],
    relatedProjectSlugs: ["skyline-residence"],
    intro:
      "SKYLINE RESIDENCE, KALABALIĞA KARŞI YÜKSEK SESLE KONUŞMAK YERİNE, BOŞLUKLARI DÜZENLEYEREK KENDİNİ TANIMLAYAN BİR KONUT DİSİPLİNİ ÖNERİR. CEPHE, YALNIZCA BİR YÜZEY DEĞİL; MAHREMİYET, IŞIK VE AĞIRLIK DENGESİNİN KONTROLLÜ BİR RAPORUDUR.",
    sections: [
      {
        type: "paragraph",
        body:
          "BU ÇALIŞMADA AMAÇ, KONUTUN TEMSİL GÜCÜNÜ ARTIRMAK DEĞİL; SÜREKLİLİĞİ OLAN BİR SAKİNLİK KURMAKTIR. KÜTLEDEKİ GERI ÇEKİLME, İÇ MEKANDAKİ AKIŞI GÜÇLENDİRİR VE KAMUSAL GÖRÜNÜRLÜĞÜ BİLİNÇLİ OLARAK AZALTIR.",
      },
      {
        type: "image",
        src: skyline?.gallery?.[0] ?? skyline?.coverImage ?? "/images/projects/gallery_1.png",
        alt: "SKYLINE RESIDENCE KÜTLE VE CEPHE GÖRSELİ",
        caption: "KÜTLELEMEDE GERİ ÇEKİLEN BİR CEPHE DİSİPLİNİ",
      },
      {
        type: "technical",
        items: [
          { label: "CEPHE", value: "FOTOKATALİTİK BETON" },
          { label: "IŞIK", value: "DİFFÜZE GÜN IŞIĞI SENARYOSU" },
          { label: "MAHREMİYET", value: "KATMANLI PERDE KURGUSU" },
          { label: "İKLİM", value: "KONTROLLÜ GÖLGELENME" },
        ],
      },
      {
        type: "related",
        title: "İLGİLİ PROJE BAĞLANTILARI",
        items: [getProjectReference("skyline-residence")],
      },
    ],
  },
  {
    slug: "malzeme-sessizligi-lumina-gallery",
    title: "MALZEME SESSİZLİĞİ / LUMINA GALLERY",
    deck: "MATERYAL KATMANLARININ, SERGİ DENEYİMİNİ NASIL YÖNETTİĞİNE DAİR TEKNİK BİR OKUMA.",
    coverImage: lumina?.coverImage ?? "/images/projects/gallery_2.png",
    publishedAt: "24 NİSAN 2026",
    readTime: "08 DK",
    articleType: "TEKNİK VERİ",
    departments: ["MATERYAL"],
    projectTypes: ["KÜLTÜR"],
    contentTypes: ["TEKNİK VERİ", "İÇGÖRÜLER"],
    relatedProjectSlugs: ["lumina-gallery"],
    intro:
      "LUMINA GALLERY, IŞIĞI BİR SÜS OLARAK DEĞİL, SERGİ KURGUSUNUN BİR PARÇASI OLARAK ELE ALIR. BU YAKLAŞIMDA MATERYAL SEÇİMİ, GÖRSEL DİSİPLİN KADAR AKUSTİK VE DOKUNSAL ALGILAMAYI DA YÖNETİR.",
    sections: [
      {
        type: "paragraph",
        body:
          "MATERYAL STÜDYOSUNUN KATMANLARI, SERGİLENEN İÇERİĞİN ÖNÜNE GEÇMEZ; AKSİNE HER ESERİN KENDİ ÇEVRESİNİ KURMASINA İZİN VERİR. YÜZEYLER ARASINDAKİ TON FARKLARI, ZİYARETÇİNİN ADIM HIZINI YAVAŞLATMAK İÇİN TASARLANMIŞTIR.",
      },
      {
        type: "image",
        src: lumina?.gallery?.[0] ?? lumina?.coverImage ?? "/images/projects/gallery_2.png",
        alt: "LUMINA GALLERY MALZEME KURGUSU",
        caption: "DÜŞÜK KONTRASTLI YÜZEYLER, YÜKSEK ALGIDAN ÇOK SAKİN BİR RİTİM ÜRETİR.",
      },
      {
        type: "technical",
        items: [
          { label: "ZEMİN", value: "DİKİŞSİZ REÇİNE" },
          { label: "DUVAR", value: "DİFÜZ BOYA KATMANI" },
          { label: "IŞIK", value: "UV KORUMALI SENARYO" },
          { label: "SERGİ MODÜLÜ", value: "ESNEK TEKRARLANABİLİR PANELLER" },
        ],
      },
      {
        type: "related",
        title: "İLGİLİ PROJE BAĞLANTILARI",
        items: [getProjectReference("lumina-gallery")],
      },
    ],
  },
  {
    slug: "kurumsal-akis-nexus",
    title: "KURUMSAL AKIŞ / NEXUS CORPORATE",
    deck: "MÜHENDİSLİK KATMANININ, DEPARTMANLAR ARASI TEMAS NOKTALARINI NASIL SESSİZCE YÖNETTİĞİ.",
    coverImage: nexus?.coverImage ?? "/images/projects/gallery_3.png",
    publishedAt: "19 NİSAN 2026",
    readTime: "07 DK",
    articleType: "GÜNCEL HABERLER",
    departments: ["MÜHENDİSLİK"],
    projectTypes: ["KURUMSAL"],
    contentTypes: ["GÜNCEL HABERLER", "TEKNİK VERİ"],
    relatedProjectSlugs: ["nexus-corporate-center"],
    intro:
      "NEXUS CORPORATE, OFİS KULESİNİ TEK BİR BLOK OLARAK DEĞİL, BİRBİRİNE BAĞLI ALT SİSTEMLER OLARAK OKUR. BU YAPI, KAMUSAL AKIŞLAR İLE İÇ OPERASYONLARI AYIRMADAN DÜZENLER.",
    sections: [
      {
        type: "paragraph",
        body:
          "ÇALIŞMA ALANLARININ ÇEVRESİNDEKİ BOŞLUKLAR, YÖNLENDİRMEYİ YAZI OLMADAN İLETEN MİMARİ İŞARETLERE DÖNÜŞÜR. MÜHENDİSLİK KARARLARI GÖRÜNMEZ KALMAK İÇİN DEĞİL, KULLANICIYI YORMAK İÇİN VAR OLUR.",
      },
      {
        type: "technical",
        items: [
          { label: "CEPHE", value: "AKILLI CAM BÖLÜCÜLER" },
          { label: "İKLİM", value: "MERKEZİ STERİLİZASYON KURGUSU" },
          { label: "PEYZAJ", value: "DİKEY BOTANİK ENTEGRASYON" },
          { label: "AKIŞ", value: "DEPARTMANLAR ARASI KONTROLLÜ GEÇİŞ" },
        ],
      },
      {
        type: "image",
        src: nexus?.gallery?.[0] ?? nexus?.coverImage ?? "/images/projects/gallery_3.png",
        alt: "NEXUS CORPORATE KURUMSAL ALAN GÖRSELİ",
        caption: "KURUMSAL KÜTLE, KULLANICI AKIŞININ ETKİSİYLE TANIMLANIR.",
      },
      {
        type: "related",
        title: "İLGİLİ PROJE BAĞLANTILARI",
        items: [getProjectReference("nexus-corporate-center")],
      },
    ],
  },
  {
    slug: "karma-kullanim-vertex",
    title: "KARMA KULLANIM / VERTEX MIXED",
    deck: "KENTSEL HAYATIN ÇATIŞAN KATMANLARINI, POYRAZ GİBİ DÜZENLEYEN BİR ORTAK ZEMİN.",
    coverImage: vertex?.coverImage ?? "/images/projects/gallery_4.png",
    publishedAt: "15 NİSAN 2026",
    readTime: "05 DK",
    articleType: "İÇGÖRÜLER",
    departments: ["MİMARİ", "MÜHENDİSLİK"],
    projectTypes: ["KARMA KULLANIM"],
    contentTypes: ["İÇGÖRÜLER", "PERSPEKTİFLER"],
    relatedProjectSlugs: ["vertex-mixed-use"],
    intro:
      "VERTEX MIXED, KAMUSAL VE ÖZEL ALANI AYRI SESSİZLİKLERLE TANIMLAR. PODYUM VE KULE KURGUSU, YALNIZCA PROGRAM AYRIMI DEĞİL; KENTSEL RİTMİN KONTROLLÜ BİR ÇEVRİMİDİR.",
    sections: [
      {
        type: "paragraph",
        body:
          "KARMA KULLANIMIN DEĞERİ, BİRBİRİNE YAKIN FONKSİYONLARIN ÜRETİĞİ SÜRPRİZLİ TEMASLARDADIR. KAT BAHÇELERİ VE AKUSTİK GEÇİŞLER, BU TEMASI KONTROL ALTINDA TUTAR.",
      },
      {
        type: "image",
        src: vertex?.gallery?.[0] ?? vertex?.coverImage ?? "/images/projects/gallery_4.png",
        alt: "VERTEX MIXED KARMA KULLANIM GÖRSELİ",
        caption: "KATMANLARIN ARASINDAKİ BOŞLUK, KENTSEL SİRKÜLASYONUN ANA ARACIDIR.",
      },
      {
        type: "technical",
        items: [
          { label: "YAPI", value: "ÇELİK KOMPOZİT SİSTEM" },
          { label: "ENERJİ", value: "GREY WATER GERİ KAZANIMI" },
          { label: "CEPHE", value: "RÜZGAR TÜRBİNİ DESTEKLİ KABUK" },
          { label: "KAT GEÇİŞİ", value: "AKUSTİK BARIYERLİ ORTAK ALAN" },
        ],
      },
      {
        type: "related",
        title: "İLGİLİ PROJE BAĞLANTILARI",
        items: [getProjectReference("vertex-mixed-use")],
      },
    ],
  },
  {
    slug: "ticari-cephe-obsidian",
    title: "TİCARİ CEPHE / OBSIDIAN TOWER",
    deck: "BİR TİCARİ KABUĞUN, ŞEHİR ÖLÇEĞİNDEKİ ETKİSİNİ SAKİN VE NET BİR DİLLE OKUMAK.",
    coverImage: obsidian?.coverImage ?? "/images/projects/gallery_5.png",
    publishedAt: "10 NİSAN 2026",
    readTime: "04 DK",
    articleType: "GÜNCEL HABERLER",
    departments: ["UYGULAMA"],
    projectTypes: ["TİCARİ"],
    contentTypes: ["GÜNCEL HABERLER", "İÇGÖRÜLER"],
    relatedProjectSlugs: ["obsidian-tower"],
    intro:
      "OBSIDIAN TOWER, TICARİ YAPIYI SADECE CEPHE GÜCÜYLE DEĞİL, BAKIŞ VE HAREKET DİSİPLİNİYLE DE TAŞIR. CEPHENİN GÖLGELENME KARAKTERİ, KENTSEL BAĞLAMDA TEK BİR SERT HAT GİBİ DAVRANIR.",
    sections: [
      {
        type: "paragraph",
        body:
          "UYGULAMA SÜRECİNDE ÖNEMLİ OLAN, ESTETİK KARARI ORTADA BIRAKMAMAKTIR. SİSTEM, YERLEŞİM VE MONTAJ SIRASI BİRBİRİYLE TUTARLI OLMALIDIR. SESSİZ LÜKS ETKİ, FAZLALIKLARIN AZLIĞINDAN GELİR.",
      },
      {
        type: "technical",
        items: [
          { label: "PANEL", value: "PARAMETRİK GÜNEŞ KIRICI" },
          { label: "CEPHE DAVRANIŞI", value: "MONOLİTİK RİTİM" },
          { label: "TAŞIMA", value: "HIZLANDIRILMIŞ MONTAJ AKIŞI" },
          { label: "KURULUM", value: "KATMANLI UYGULAMA LİSTESİ" },
        ],
      },
      {
        type: "image",
        src: obsidian?.gallery?.[0] ?? obsidian?.coverImage ?? "/images/projects/gallery_5.png",
        alt: "OBSIDIAN TOWER TİCARİ CEPHE GÖRSELİ",
        caption: "TİCARİ KABUK, GÖRSEL GÜRÜLTÜ YERİNE KESKİN BİR RİTİM ÜRETİR.",
      },
      {
        type: "related",
        title: "İLGİLİ PROJE BAĞLANTILARI",
        items: [getProjectReference("obsidian-tower")],
      },
    ],
  },
];

export function getJournalArticleBySlug(slug: string) {
  return journalArticles.find((article) => article.slug === slug) ?? null;
}

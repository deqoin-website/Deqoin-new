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

export type JournalImageAsset = {
  src: string;
  alt: string;
  caption?: string;
};

export type JournalSection =
  | {
      type: "paragraph";
      body: string;
    }
  | {
      type: "heading";
      level: 2 | 3;
      text: string;
    }
  | {
      type: "list";
      items: string[];
    }
  | {
      type: "image";
      src: string;
      alt: string;
      caption?: string;
      gallery?: JournalImageAsset[];
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
  seoMeta?: {
    title?: string;
    description?: string;
    keywords?: string;
    ogImage?: string;
    canonicalPath?: string;
    noIndex?: boolean;
    schemaType?: string;
  };
  sections: JournalSection[];
};

export const journalArticles: JournalArticle[] = [
  {
    slug: "dogru-ic-mimarlik-onemi",
    title: "Evinizi baştan yaratın: Doğru iç mimarlığın önemi",
    deck: "İç mimarlık, mekan tasarımı ve ev dekorasyonu ile dar veya karanlık alanları daha ferah, daha düzenli ve daha kullanışlı hale getirebilirsiniz.",
    coverImage: "/images/about_interior.png",
    publishedAt: "02 MAYIS 2026",
    readTime: "06 DK",
    articleType: "PERSPEKTİFLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT", "KURUMSAL"],
    contentTypes: ["PERSPEKTİFLER", "İÇGÖRÜLER"],
    relatedProjectSlugs: [],
    intro:
      "İyi bir iç mimarlık, evin yalnızca güzel görünmesini sağlamaz. Alanın nasıl kullanıldığını değiştirir, hareketi kolaylaştırır ve gün içinde fark etmeden yaşadığınız birçok küçük sorunu çözer.",
    sections: [
      {
        type: "heading",
        level: 2,
        text: "Doğru iç mimarlık ne kazandırır?",
      },
      {
        type: "paragraph",
        body:
          "İç mimarlık, mekan tasarımını sadece estetik bir karar olarak ele almaz. Ölçü, ışık, mobilya yerleşimi ve malzeme seçimi birlikte düşünülür. Bu sayede dar bir oda olduğundan daha geniş algılanabilir, dağınık görünen bir alan daha düzenli hale gelebilir ve kullanım konforu belirgin şekilde artar.",
      },
      {
        type: "list",
        items: [
          "Alan gerçek ihtiyaca göre planlanır",
          "Gereksiz mobilya kalabalığı azaltılır",
          "Işık daha doğru dağıtılır",
          "Günlük kullanım daha rahat hale gelir",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Işık, mobilya ve malzeme neden önemlidir?",
      },
      {
        type: "paragraph",
        body:
          "Işık, bir mekanın algısını en hızlı değiştiren unsurdur. Doğal ışık azsa doğru aydınlatma planı gerekir. Açık tonlar, aynalı yüzeyler ve katmanlı ışık kullanımı alanı daha ferah gösterir. Mobilya ise yalnızca dekor değil, kullanım senaryosudur. Büyük bir koltuk takımının küçük bir salonu sıkıştırması ya da yanlış yerleşen bir masa grubunun geçişleri kapatması çok sık görülen bir hatadır.",
      },
      {
        type: "heading",
        level: 3,
        text: "Mobilya seçimi",
      },
      {
        type: "paragraph",
        body:
          "Mobilya alırken ölçü kadar işlev de önemlidir. Depolama sunan parçalar, çok amaçlı sehpalar ve alanı bölmeyen formlar küçük evlerde büyük rahatlık sağlar. Ofislerde ise oturma düzeni ile çalışma akışı birlikte düşünülmelidir.",
      },
      {
        type: "heading",
        level: 3,
        text: "Malzeme seçimi",
      },
      {
        type: "paragraph",
        body:
          "Malzeme seçimi sadece görünümü değil, uzun vadeli kullanımı da etkiler. Kolay temizlenen yüzeyler, dayanıklı kaplamalar ve mekana uygun dokular bakım yükünü azaltır. Ev dekorasyonu yapılırken yalnızca ilk görünüm değil, günlük hayatın ritmi de hesaba katılmalıdır.",
      },
      {
        type: "heading",
        level: 2,
        text: "deqoin bu süreci nasıl ele alır?",
      },
      {
        type: "paragraph",
        body:
          "deqoin olarak önce mekanın ölçüsünü, ışık durumunu ve kullanım alışkanlıklarını inceliyoruz. Sonra iç mimarlık kararlarını bu ihtiyaçlara göre kuruyoruz. Böylece ortaya sadece güzel bir alan değil, gerçek hayatı kolaylaştıran bir düzen çıkıyor.",
      },
      {
        type: "list",
        items: [
          "İhtiyaca göre planlama yapıyoruz",
          "Mekan tasarımı ile işlevi birlikte düşünüyoruz",
          "Ev dekorasyonu kararlarını sade ve uygulanabilir tutuyoruz",
          "Her projede ölçü ve kullanım kolaylığını önceliklendiriyoruz",
        ],
      },
    ],
  },
  {
    slug: "nevsehirde-ic-mimarlik-yasam-alanlarini-yenileme",
    title: "Nevşehir'de iç mimarlık: Yaşam alanlarınızı nasıl yeniliyoruz?",
    deck: "Nevşehir ve Kapadokya bölgesindeki ev, ofis ve butik otel projelerinde yapıya, kullanıma ve yerel dokuya uygun çözümler üretiyoruz.",
    coverImage: "/images/projects/gallery_1.png",
    publishedAt: "02 MAYIS 2026",
    readTime: "07 DK",
    articleType: "İÇGÖRÜLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT", "TİCARİ", "KURUMSAL"],
    contentTypes: ["İÇGÖRÜLER", "PERSPEKTİFLER"],
    relatedProjectSlugs: [],
    intro:
      "Nevşehir ve Kapadokya bölgesinde tasarım yaparken sadece görünümü değil, mekanın bulunduğu çevreyi de düşünmek gerekir. Evler, ofisler ve butik oteller farklı ihtiyaçlar taşır. Doğru iç mimarlık, bu farklılıkları tek bir kalıba sokmadan çözer.",
    sections: [
      {
        type: "heading",
        level: 2,
        text: "Nevşehir ve Kapadokya için tasarım neden farklı düşünülmeli?",
      },
      {
        type: "paragraph",
        body:
          "Bölgedeki yapıların bir kısmı geleneksel karakter taşırken, bir kısmı modern kullanım beklentileriyle yenilenir. Bu yüzden Nevşehir iç mimar olarak çalışırken ilk sorumuz her zaman aynı olur: Bu mekan nasıl kullanılacak? Ardından ışık, dolaşım, malzeme ve depolama kararlarını buna göre kurarız.",
      },
      {
        type: "list",
        items: [
          "Işık alma durumunu analiz ediyoruz",
          "Mekanın doğal formunu dikkate alıyoruz",
          "Bölgenin iklimine uygun malzeme seçiyoruz",
          "Temizliği ve bakımı kolay çözümler öneriyoruz",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Ev, ofis ve butik otel projelerinde ne yapıyoruz?",
      },
      {
        type: "paragraph",
        body:
          "Nevşehir ev dekorasyonu projelerinde amaç daha sıcak, daha düzenli ve daha rahat alanlar kurmaktır. Ofislerde iş akışını bozmayan sade bir kurgu önemlidir. Butik otellerde ise misafirin ilk anda hissettiği düzen, rahatlık ve açıklık öne çıkar. Kapadokya iç mimarlık ofisi arayan markalar için tasarımın kalıcı olması kadar hızlı anlaşılır olması da önemlidir.",
      },
      {
        type: "heading",
        level: 3,
        text: "Evlerde",
      },
      {
        type: "paragraph",
        body:
          "Ev projelerinde depolama, oturma düzeni ve ışık dengesi bir arada çözülür. Dar alanlar doğru mobilya ölçüsüyle açılır, fazla eşya yerine işlevli parçalar kullanılır. Böylece aile yaşamı daha rahat hale gelir.",
      },
      {
        type: "heading",
        level: 3,
        text: "Ofislerde",
      },
      {
        type: "paragraph",
        body:
          "Ofis tasarımında amaç sadece şık görünmek değildir. Çalışanların rahat hareket etmesi, toplantı alanlarının net ayrılması ve gün ışığının verimli kullanılması gerekir. deqoin iç mimarlık yaklaşımı burada verimlilik ile düzeni aynı planda buluşturur.",
      },
      {
        type: "heading",
        level: 3,
        text: "Butik otellerde",
      },
      {
        type: "paragraph",
        body:
          "Butik otellerde güçlü bir ilk izlenim yaratmak gerekir, ancak bunu gösterişli detaylarla değil, doğru oranlarla yapmak daha etkilidir. Oda konforu, ortak alan akışı ve malzeme dayanıklılığı bu tür projelerde temel kriterlerdir.",
      },
      {
        type: "heading",
        level: 2,
        text: "deqoin yaklaşımı",
      },
      {
        type: "paragraph",
        body:
          "deqoin olarak her projeyi yerinde değerlendiriyor, mekanın yapısına ve kullanıcı alışkanlıklarına göre planlıyoruz. Böylece Nevşehir iç mimarlık hizmeti, hazır kalıplar yerine gerçek ihtiyaçlara cevap veren bir sürece dönüşüyor.",
      },
      {
        type: "list",
        items: [
          "Yerinde ihtiyaç analizi yapıyoruz",
          "Bölgeye uygun malzeme öneriyoruz",
          "Ev, ofis ve otel için ayrı kurgu geliştiriyoruz",
          "Uygulama aşamasında net ve düzenli ilerliyoruz",
        ],
      },
    ],
  },
  {
    slug: "italyan-boya-nedir-neden-tercih-edilmelidir",
    title: "İtalyan boya nedir? Evinizde neden tercih etmelisiniz?",
    deck: "İtalyan boya uygulaması, duvar dekorasyonu için daha şık, daha dayanıklı ve daha doğal bir yüzey sunar.",
    coverImage: "/images/projects/gallery_2.png",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "TEKNİK VERİ",
    departments: ["MATERYAL", "UYGULAMA"],
    projectTypes: ["KONUT", "TİCARİ"],
    contentTypes: ["TEKNİK VERİ", "İÇGÖRÜLER"],
    relatedProjectSlugs: [],
    intro:
      "Duvar boyası seçerken yalnızca renk değil, yüzeyin nasıl görüneceği ve nasıl kullanılacağı da önemlidir. İtalyan boya, standart boyadan farklı olarak daha karakterli, daha dayanıklı ve daha doğal bir sonuç verir.",
    sections: [
      {
        type: "heading",
        level: 2,
        text: "İtalyan boya nedir?",
      },
      {
        type: "paragraph",
        body:
          "İtalyan boya uygulaması, düz bir renk vermenin ötesine geçer. Yüzeyde hafif doku, yumuşak ışık geçişi ve daha doğal bir görünüm oluşturur. Bu nedenle duvar dekorasyonu içinde daha özel bir sonuç arayanlar için güçlü bir alternatiftir.",
      },
      {
        type: "list",
        items: [
          "Standart boyaya göre daha karakterlidir",
          "Yüzeyde daha doğal bir görünüm oluşturur",
          "Işığı daha yumuşak yansıtır",
          "Uzun süre estetik etkisini koruyabilir",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "Hangi avantajları sağlar?",
      },
      {
        type: "paragraph",
        body:
          "Bu boya türünün en büyük avantajı, yalnızca güzel görünmesi değildir. Temizlenebilir yüzey seçenekleri, dayanıklılık ve zamana karşı daha sağlam duruş sunması da önemli artılardır. Bu yüzden hem evlerde hem de yoğun kullanılan mekanlarda tercih edilebilir.",
      },
      {
        type: "heading",
        level: 3,
        text: "Silinebilir yüzey",
      },
      {
        type: "paragraph",
        body:
          "Günlük kullanımda duvarların kirlenmesi normaldir. Silinebilir yüzeyler bakım işini kolaylaştırır ve duvarın ilk günkü görünümünü daha uzun süre korumasına yardım eder.",
      },
      {
        type: "heading",
        level: 3,
        text: "Uzun ömür",
      },
      {
        type: "paragraph",
        body:
          "Kaliteli uygulandığında İtalyan boya, sık yenileme gerektirmeden uzun süre kullanılabilir. Doğru astar, doğru yüzey hazırlığı ve doğru işçilik burada belirleyici olur.",
      },
      {
        type: "heading",
        level: 3,
        text: "Doğal görünüm",
      },
      {
        type: "paragraph",
        body:
          "Bazı duvarlar fazla parlak ya da yapay görünebilir. İtalyan boya ise daha sakin, daha dengeli ve daha doğal bir etki verir. Bu da mekanı daha özenli ve toplu gösterir.",
      },
      {
        type: "heading",
        level: 2,
        text: "deqoin ile uygulama",
      },
      {
        type: "paragraph",
        body:
          "deqoin, İtalyan boya Nevşehir uygulamalarında önce yüzeyin durumunu kontrol eder, sonra mekanın ışığına ve kullanımına uygun tonu belirler. Amaç, sadece güzel bir duvar değil, uzun ömürlü ve sorunsuz bir sonuç elde etmektir.",
      },
      {
        type: "list",
        items: [
          "Yüzey hazırlığını dikkatle yapıyoruz",
          "Mekana uygun renk ve doku öneriyoruz",
          "Uygulamayı profesyonel şekilde tamamlıyoruz",
          "Bakımı kolay, dayanıklı bir sonuç hedefliyoruz",
        ],
      },
    ],
  },
];

export function getJournalArticleBySlug(slug: string) {
  return journalArticles.find((article) => article.slug === slug) ?? null;
}

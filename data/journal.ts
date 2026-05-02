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
  sections: JournalSection[];
};

export const journalArticles: JournalArticle[] = [
  {
    slug: "dogru-ic-mimarlik-onemi",
    title: "evinizi baştan yaratın: doğru iç mimarlığın önemi",
    deck: "iç mimarlık, mekan tasarımı ve ev dekorasyonu ile dar veya karanlık alanları daha ferah, daha düzenli ve daha kullanışlı hale getirebilirsiniz.",
    coverImage: "/images/about_interior.png",
    publishedAt: "02 MAYIS 2026",
    readTime: "06 DK",
    articleType: "PERSPEKTİFLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT", "KURUMSAL"],
    contentTypes: ["PERSPEKTİFLER", "İÇGÖRÜLER"],
    relatedProjectSlugs: [],
    intro:
      "iyi bir iç mimarlık, evin yalnızca güzel görünmesini sağlamaz. alanın nasıl kullanıldığını değiştirir, hareketi kolaylaştırır ve gün içinde fark etmeden yaşadığınız birçok küçük sorunu çözer.",
    sections: [
      {
        type: "heading",
        level: 2,
        text: "doğru iç mimarlık ne kazandırır?",
      },
      {
        type: "paragraph",
        body:
          "iç mimarlık, mekan tasarımını sadece estetik bir karar olarak ele almaz. ölçü, ışık, mobilya yerleşimi ve malzeme seçimi birlikte düşünülür. bu sayede dar bir oda olduğundan daha geniş algılanabilir, dağınık görünen bir alan daha düzenli hale gelebilir ve kullanım konforu belirgin şekilde artar.",
      },
      {
        type: "list",
        items: [
          "alanın gerçek ihtiyacına göre plan yapılır",
          "gereksiz mobilya kalabalığı azaltılır",
          "ışık daha doğru dağıtılır",
          "günlük kullanım daha rahat hale gelir",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "ışık, mobilya ve malzeme neden önemlidir?",
      },
      {
        type: "paragraph",
        body:
          "ışık, bir mekanın algısını en hızlı değiştiren unsurdur. doğal ışık azsa doğru aydınlatma planı gerekir. açık tonlar, aynalı yüzeyler ve katmanlı ışık kullanımı alanı daha ferah gösterir. mobilya ise yalnızca dekor değil, kullanım senaryosudur. büyük bir koltuk takımının küçük bir salonu sıkıştırması ya da yanlış yerleşen bir masa grubunun geçişleri kapatması çok sık görülen bir hatadır.",
      },
      {
        type: "heading",
        level: 3,
        text: "mobilya seçimi",
      },
      {
        type: "paragraph",
        body:
          "mobilya alırken ölçü kadar işlev de önemlidir. depolama sunan parçalar, çok amaçlı sehpalar ve alanı bölmeyen formlar küçük evlerde büyük rahatlık sağlar. ofislerde ise oturma düzeni ile çalışma akışı birlikte düşünülmelidir.",
      },
      {
        type: "heading",
        level: 3,
        text: "malzeme seçimi",
      },
      {
        type: "paragraph",
        body:
          "malzeme seçimi sadece görünümü değil, uzun vadeli kullanımı da etkiler. kolay temizlenen yüzeyler, dayanıklı kaplamalar ve mekana uygun dokular bakım yükünü azaltır. ev dekorasyonu yapılırken yalnızca ilk görünüm değil, günlük hayatın ritmi de hesaba katılmalıdır.",
      },
      {
        type: "heading",
        level: 2,
        text: "deqoin bu süreci nasıl ele alır?",
      },
      {
        type: "paragraph",
        body:
          "deqoin olarak önce mekanın ölçüsünü, ışık durumunu ve kullanım alışkanlıklarını inceliyoruz. sonra iç mimarlık kararlarını bu ihtiyaçlara göre kuruyoruz. böylece ortaya sadece güzel bir alan değil, gerçek hayatı kolaylaştıran bir düzen çıkıyor.",
      },
      {
        type: "list",
        items: [
          "ihtiyaca göre planlama yapıyoruz",
          "mekan tasarımı ile işlevi birlikte düşünüyoruz",
          "ev dekorasyonu kararlarını sade ve uygulanabilir tutuyoruz",
          "her projede ölçü ve kullanım kolaylığını önceliklendiriyoruz",
        ],
      },
    ],
  },
  {
    slug: "nevsehirde-ic-mimarlik-yasam-alanlarini-yenileme",
    title: "nevşehir'de iç mimarlık: yaşam alanlarınızı nasıl yeniliyoruz?",
    deck: "nevşehir ve kapadokya bölgesindeki ev, ofis ve butik otel projelerinde yapıya, kullanıma ve yerel dokuya uygun çözümler üretiyoruz.",
    coverImage: "/images/projects/gallery_1.png",
    publishedAt: "02 MAYIS 2026",
    readTime: "07 DK",
    articleType: "İÇGÖRÜLER",
    departments: ["MİMARİ"],
    projectTypes: ["KONUT", "TİCARİ", "KURUMSAL"],
    contentTypes: ["İÇGÖRÜLER", "PERSPEKTİFLER"],
    relatedProjectSlugs: [],
    intro:
      "nevşehir ve kapadokya bölgesinde tasarım yaparken sadece görünümü değil, mekanın bulunduğu çevreyi de düşünmek gerekir. evler, ofisler ve butik oteller farklı ihtiyaçlar taşır. doğru iç mimarlık, bu farklılıkları tek bir kalıba sokmadan çözer.",
    sections: [
      {
        type: "heading",
        level: 2,
        text: "nevşehir ve kapadokya için tasarım neden farklı düşünülmeli?",
      },
      {
        type: "paragraph",
        body:
          "bölgedeki yapıların bir kısmı geleneksel karakter taşırken, bir kısmı modern kullanım beklentileriyle yenilenir. bu yüzden nevşehir iç mimar olarak çalışırken ilk sorumuz her zaman aynı olur: bu mekan nasıl kullanılacak? ardından ışık, dolaşım, malzeme ve depolama kararlarını buna göre kurarız.",
      },
      {
        type: "list",
        items: [
          "ışık alma durumunu analiz ediyoruz",
          "mekanın doğal formunu dikkate alıyoruz",
          "bölgenin iklimine uygun malzeme seçiyoruz",
          "temizliği ve bakımı kolay çözümler öneriyoruz",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "ev, ofis ve butik otel projelerinde ne yapıyoruz?",
      },
      {
        type: "paragraph",
        body:
          "nevşehir ev dekorasyonu projelerinde amaç daha sıcak, daha düzenli ve daha rahat alanlar kurmaktır. ofislerde iş akışını bozmayan sade bir kurgu önemlidir. butik otellerde ise misafirin ilk anda hissettiği düzen, rahatlık ve açıklık öne çıkar. kapadokya iç mimarlık ofisi arayan markalar için tasarımın kalıcı olması kadar hızlı anlaşılır olması da önemlidir.",
      },
      {
        type: "heading",
        level: 3,
        text: "evlerde",
      },
      {
        type: "paragraph",
        body:
          "ev projelerinde depolama, oturma düzeni ve ışık dengesi bir arada çözülür. dar alanlar doğru mobilya ölçüsüyle açılır, fazla eşya yerine işlevli parçalar kullanılır. böylece aile yaşamı daha rahat hale gelir.",
      },
      {
        type: "heading",
        level: 3,
        text: "ofislerde",
      },
      {
        type: "paragraph",
        body:
          "ofis tasarımında amaç sadece şık görünmek değildir. çalışanların rahat hareket etmesi, toplantı alanlarının net ayrılması ve gün ışığının verimli kullanılması gerekir. deqoin iç mimarlık yaklaşımı burada verimlilik ile düzeni aynı planda buluşturur.",
      },
      {
        type: "heading",
        level: 3,
        text: "butik otellerde",
      },
      {
        type: "paragraph",
        body:
          "butik otellerde güçlü bir ilk izlenim yaratmak gerekir, ancak bunu gösterişli detaylarla değil, doğru oranlarla yapmak daha etkilidir. oda konforu, ortak alan akışı ve malzeme dayanıklılığı bu tür projelerde temel kriterlerdir.",
      },
      {
        type: "heading",
        level: 2,
        text: "deqoin yaklaşımı",
      },
      {
        type: "paragraph",
        body:
          "deqoin olarak her projeyi yerinde değerlendiriyor, mekanın yapısına ve kullanıcı alışkanlıklarına göre planlıyoruz. böylece nevşehir iç mimarlık hizmeti, hazır kalıplar yerine gerçek ihtiyaçlara cevap veren bir sürece dönüşüyor.",
      },
      {
        type: "list",
        items: [
          "yerinde ihtiyaç analizi yapıyoruz",
          "bölgeye uygun malzeme öneriyoruz",
          "ev, ofis ve otel için ayrı kurgu geliştiriyoruz",
          "uygulama aşamasında net ve düzenli ilerliyoruz",
        ],
      },
    ],
  },
  {
    slug: "italyan-boya-nedir-neden-tercih-edilmelidir",
    title: "italyan boya nedir? evinizde neden tercih etmelisiniz?",
    deck: "italyan boya uygulaması, duvar dekorasyonu için daha şık, daha dayanıklı ve daha doğal bir yüzey sunar.",
    coverImage: "/images/projects/gallery_2.png",
    publishedAt: "02 MAYIS 2026",
    readTime: "05 DK",
    articleType: "TEKNİK VERİ",
    departments: ["MATERYAL", "UYGULAMA"],
    projectTypes: ["KONUT", "TİCARİ"],
    contentTypes: ["TEKNİK VERİ", "İÇGÖRÜLER"],
    relatedProjectSlugs: [],
    intro:
      "duvar boyası seçerken yalnızca renk değil, yüzeyin nasıl görüneceği ve nasıl kullanılacağı da önemlidir. italyan boya, standart boyadan farklı olarak daha karakterli, daha dayanıklı ve daha doğal bir sonuç verir.",
    sections: [
      {
        type: "heading",
        level: 2,
        text: "italyan boya nedir?",
      },
      {
        type: "paragraph",
        body:
          "italyan boya uygulaması, düz bir renk vermenin ötesine geçer. yüzeyde hafif doku, yumuşak ışık geçişi ve daha doğal bir görünüm oluşturur. bu nedenle duvar dekorasyonu içinde daha özel bir sonuç arayanlar için güçlü bir alternatiftir.",
      },
      {
        type: "list",
        items: [
          "standart boyaya göre daha karakterlidir",
          "yüzeyde daha doğal bir görünüm oluşturur",
          "ışığı daha yumuşak yansıtır",
          "uzun süre estetik etkisini koruyabilir",
        ],
      },
      {
        type: "heading",
        level: 2,
        text: "hangi avantajları sağlar?",
      },
      {
        type: "paragraph",
        body:
          "bu boya türünün en büyük avantajı, yalnızca güzel görünmesi değildir. temizlenebilir yüzey seçenekleri, dayanıklılık ve zamana karşı daha sağlam duruş sunması da önemli artılardır. bu yüzden hem evlerde hem de yoğun kullanılan mekanlarda tercih edilebilir.",
      },
      {
        type: "heading",
        level: 3,
        text: "silinebilir yüzey",
      },
      {
        type: "paragraph",
        body:
          "günlük kullanımda duvarların kirlenmesi normaldir. silinebilir yüzeyler bakım işini kolaylaştırır ve duvarın ilk günkü görünümünü daha uzun süre korumasına yardım eder.",
      },
      {
        type: "heading",
        level: 3,
        text: "uzun ömür",
      },
      {
        type: "paragraph",
        body:
          "kaliteli uygulandığında italyan boya, sık yenileme gerektirmeden uzun süre kullanılabilir. doğru astar, doğru yüzey hazırlığı ve doğru işçilik burada belirleyici olur.",
      },
      {
        type: "heading",
        level: 3,
        text: "doğal görünüm",
      },
      {
        type: "paragraph",
        body:
          "bazı duvarlar fazla parlak ya da yapay görünebilir. italyan boya ise daha sakin, daha dengeli ve daha doğal bir etki verir. bu da mekanı daha özenli ve toplu gösterir.",
      },
      {
        type: "heading",
        level: 2,
        text: "deqoin ile uygulama",
      },
      {
        type: "paragraph",
        body:
          "deqoin, italyan boya nevşehir uygulamalarında önce yüzeyin durumunu kontrol eder, sonra mekanın ışığına ve kullanımına uygun tonu belirler. amaç, sadece güzel bir duvar değil, uzun ömürlü ve sorunsuz bir sonuç elde etmektir.",
      },
      {
        type: "list",
        items: [
          "yüzey hazırlığını dikkatle yapıyoruz",
          "mekana uygun renk ve doku öneriyoruz",
          "uygulamayı profesyonel şekilde tamamlıyoruz",
          "bakımı kolay, dayanıklı bir sonuç hedefliyoruz",
        ],
      },
    ],
  },
];

export function getJournalArticleBySlug(slug: string) {
  return journalArticles.find((article) => article.slug === slug) ?? null;
}

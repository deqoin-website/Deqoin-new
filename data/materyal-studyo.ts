export interface MateryalKategori {
  slug: string;
  title: string;
  sideLabel: string;
  image: string;
  sliderImages?: string[];
  categories?: { label: string; value: string }[];
  description: string;
  longDescription?: {
    title: string;
    content: string[];
  };
}

export const materyalKategorileri: MateryalKategori[] = [
  {
    slug: "mobilya",
    title: "Mobilya",
    sideLabel: "Bespoke Furniture",
    image: "/images/workflow/mobilya-custom.png",
    sliderImages: [
      "/images/workflow/mobilya-custom.png",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "SALON GRUBU", value: "salon-grubu" },
      { label: "YATAK ODASI", value: "yatak-odasi" },
      { label: "MUTFAK & YEMEK", value: "mutfak-yemek" },
      { label: "OFİS MOBİLYASI", value: "ofis-mobilyasi" },
      { label: "BANYO DETAY", value: "banyo-detay" },
      { label: "AKSESUAR & DEKOR", value: "aksesuar-dekor" }
    ],
    description: "Tasarlanan mekanın ruhuna uygun, malzeme ve formun kusursuz uyumuyla üretilen özel mobilya koleksiyonumuz.",
    longDescription: {
      title: "Mimari Vizyonla Entegre Mobilya Tasarımları",
      content: [
        "Burası bir mobilya mağazası değil; projelerimizin ruhunu ve işlevselliğini tanımlayan tasarımın merkezidir. Mekandaki yerleşimi, ışığı ve sirkülasyonu en baştan kurguluyoruz. **Burada sergilenen tüm mobilya grupları yalnızca kendi projelerimiz ve özel tasarımlarımız için entegre edilmektedir; perakende satışımız yoktur.**",
        "Belki de henüz farkında olmadığınız ergonomik ve estetik ihtiyaçları en başından öngörüyor, mimari vizyonla birebir örtüşen premium mobilyaları doğrudan o eşsiz yaşam alanına entegre ediyoruz. Form ve işlevin bu kusursuz birlikteliği, her bir parçayı projenin teknik ve estetik omurgasının bir parçası haline getiriyor.",
        "Özgün tasarımlarımızı ve mimari hassasiyetimizi kendi projenize taşımak, ihtiyaçlarınızı bizim vizyonumuzla birleştirmek için profesyonel ekibimizle görüşebilirsiniz. Eksiksiz bir yaşam kurgusu kurguluyoruz."
      ]
    }
  },
  {
    slug: "aydinlatma",
    title: "Aydınlatma",
    sideLabel: "Light Atmosphere",
    image: "/images/workflow/aydinlatma-custom.png",
    sliderImages: [
      "/images/workflow/aydinlatma-custom.png",
      "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "DEKORATİF AYDINLATMA", value: "dekoratif" },
      { label: "TEKNİK AYDINLATMA", value: "teknik" },
      { label: "MİMARİ AYDINLATMA", value: "mimari-isik" },
      { label: "DIŞ MEKAN & PEYZAJ", value: "dis-mekan" },
      { label: "HEYKELSİ TASARIMLAR", value: "heykel-isik" },
      { label: "OTOMASYON & KONTROL", value: "otomasyon" }
    ],
    description: "Mekanın hiyerarşisini ve derinliğini yöneten, atmosferik ve heykelsi aydınlatma tasarımları.",
    longDescription: {
      title: "Mekanı Şekillendiren Aydınlatma Tasarımları",
      content: [
        "Işık, bir mekanın sadece görülmesini sağlamaz; o mekanın karakterini ve ruhunu belirler. Projelerimizde aydınlatmayı, mimari formun ayrılmaz bir parçası olarak kurguluyoruz.",
        "Mekanın hiyerarşisini ve derinliğini yöneten, atmosferik ve heykelsi aydınlatma tasarımlarımızla her köşeye kimlik kazandırıyoruz. İşlevselliği estetik bir dille birleştirerek, yaşam alanlarını ışıkla yeniden tanımlıyoruz.",
        "Aydınlatma tasarımlarımız sadece bir armatür seçimi değil, mekanın hikayesini anlatan bir enstalasyondur. Sizin için kusursuz ışık kurgularını hayata geçiriyoruz."
      ]
    }
  },
  {
    slug: "italyan-sivalar",
    title: "İtalyan Sıvalar",
    sideLabel: "High-End Texture",
    image: "/images/workflow/italyan-siva-custom.png",
    sliderImages: [
      "/images/workflow/italyan-siva-custom.png",
      "https://images.unsplash.com/photo-1518193005634-9343360b37cd?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1581417478175-a9ef18f210c1?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "BETON DOKULU", value: "beton" },
      { label: "METALİK YÜZEYLER", value: "metalik" },
      { label: "KLASİK STUCCO", value: "stucco" },
      { label: "TRAVERTEN & DOKU", value: "traverten" },
      { label: "PAS & OKSİT", value: "pas-oksit" }
    ],
    description: "Duvarları birer sanat eserine dönüştüren, dokulu ve derinlikli İtalyan sıva uygulamaları.",
    longDescription: {
      title: "Yüzeylerin Derinliği: İtalyan Sıvalar",
      content: [
        "Duvarlar bir mekanın en geniş tuvalidir. Geleneksel bitişlerin ötesine geçerek, dokulu ve derinlikli İtalyan sıva uygulamalarıyla yüzeylere ruh katıyoruz.",
        "Malzemenin ham gücünü ve ustalıklı el işçiliğini birleştirerek, her bir duvarı birer sanat eserine dönüştürüyoruz.",
        "Dokuların uyumu ve renklerin derinliğiyle, yaşam alanlarınıza zamansız bir estetik kazandırıyoruz."
      ]
    }
  },
  {
    slug: "dekoratif-boyalar",
    title: "Dekoratif Boyalar",
    sideLabel: "Paint & Mood",
    image: "/images/workflow/dekoratif-boya-custom.png",
    sliderImages: [
      "/images/workflow/dekoratif-boya-custom.png",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1534655615591-6c7d0c8d1f5c?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "MATTE FINISH", value: "matte" },
      { label: "SATEN DOKU", value: "satin" },
      { label: "MİNERAL BOYA", value: "mineral" },
      { label: "KİREÇ ESASLI", value: "kilic" },
      { label: "RENK PALETİ", value: "palette" }
    ],
    description: "Mekanın karakterini belirleyen, derin tonlu ve yüksek kaliteli dekoratif boya sistemleri.",
    longDescription: {
      title: "Mekana Atmosfer Katan Dekoratif Boyalar",
      content: [
        "Renk, mekanın duygusal dilidir. Dekoratif boya sistemleriyle bir yüzeyi sadece boyamıyor, ona karakter ve atmosfer kazandırıyoruz.",
        "Mat, saten, mineral ve kireç esaslı çözümlerle ışığı farklı biçimlerde kıran, sofistike yüzeyler oluşturuyoruz.",
        "Her proje için seçtiğimiz renk paleti, mekandaki malzeme ve ışık dengesiyle bütünleşerek rafine bir sonuç üretir."
      ]
    }
  },
  {
    slug: "mikro-cimento",
    title: "Mikro Çimento",
    sideLabel: "Seamless Surface",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2000&auto=format&fit=crop",
    sliderImages: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2000&q=80",
      "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "DUŞ ALANI", value: "dus" },
      { label: "ZEMİN", value: "zemin" },
      { label: "DUVAR", value: "duvar" },
      { label: "TEZGAH", value: "tezgah" }
    ],
    description: "Derzsiz, modern ve dayanıklı yüzeylerle kesintisiz mekan deneyimi sunan mikro çimento çözümleri.",
    longDescription: {
      title: "Kesintisiz Yüzeyler: Mikro Çimento",
      content: [
        "Mikro çimento, hem çağdaş hem de zamansız bir yüzey dili kurar. Derzsiz yapısıyla mekanda bütünsel bir akış sağlar.",
        "Islak hacimlerden yaşam alanlarına kadar farklı ölçeklerde uygulanabilen bu yüzey, dayanıklılık ve estetiği bir araya getirir.",
        "Minimal mimari dilini destekleyen kusursuz yüzeyler oluşturuyoruz."
      ]
    }
  },
  {
    slug: "sanatsal-calismalar",
    title: "Sanatsal Çalışmalar",
    sideLabel: "Creative Soul",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2000&auto=format&fit=crop",
    sliderImages: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549490349-8643362247b5?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "RESİM & TUVAL", value: "resim" },
      { label: "HEYKEL & FORM", value: "heykel" },
      { label: "RÖLYEF", value: "rolyef" },
      { label: "ENSTALASYON", value: "enstalasyon" },
      { label: "DİJİTAL SANAT", value: "dijital" }
    ],
    description: "Projelerimize özel olarak kurgulanan resim, heykel ve enstalasyon gibi sanatsal dokunuşlar.",
    longDescription: {
      title: "Mekana Ruh Katan Sanatsal Dokunuşlar",
      content: [
        "Sanat, mekanın teknik doğrularıyla buluştuğunda o yer gerçek bir karaktere bürünür. Projelerimiz için özel olarak kurgulanan sanatsal çalışmalarla her detaya ruh katıyoruz.",
        "Resimden heykele, enstalasyondan özel tasarım objelere kadar her bir sanatsal müdahale, projenin temasıyla bütünleşik bir dille tasarlanır.",
        "Sanatı mekanın içine sızdırıyor, her bir projeyi birer sergi alanına dönüştürüyoruz."
      ]
    }
  },
  {
    slug: "tugla-ve-tas",
    title: "Tuğla ve Taş",
    sideLabel: "Timeless Earth",
    image: "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=2000&auto=format&fit=crop",
    sliderImages: [
      "https://images.unsplash.com/photo-1534723328310-e82dad3ee43f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1524312015024-aa7f24097402?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1615529328331-f8917597711f?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "DOĞAL TAŞ", value: "dogal-tas" },
      { label: "ANTİK TUĞLA", value: "antik-tugla" },
      { label: "KÜLTÜR TAŞI", value: "kultur-tasi" },
      { label: "MERMER & GRANİT", value: "mermer" },
      { label: "KAYRAK TAŞI", value: "kayrak" }
    ],
    description: "Doğanın ham gücünü modern mimarlığa entegre eden, karakter sahibi tuğla ve doğal taş seçkilerimiz.",
    longDescription: {
      title: "Doğanın Ham Gücü: Tuğla ve Taş",
      content: [
        "Doğal malzemelerin zamansızlığı, modern mimariyle buluştuğunda kalıcı bir değer yaratır. Seçkin tuğla ve doğal taş seçkilerimizle mekanlara ham bir güç ve karakter kazandırıyoruz.",
        "Her bir taşın dokusu, her bir tuğlanın rengi, projenin bütünüyle uyum içerisinde seçilir ve uygulanır.",
        "Doğallığı ve modernizmi aynı düzlemde buluşturuyor, mekana toprak kokusu ve taşın gücünü getiriyoruz."
      ]
    }
  }
];

export interface MateryalKategori {
  slug: string;
  title: string;
  sideLabel: string;
  image: string;
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
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU",
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
    image: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2000&auto=format&fit=crop",
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
    title: "İtalyan Sıvalar ve Dekoratif Boyalar",
    sideLabel: "High-End Texture",
    image: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?q=80&w=2000&auto=format&fit=crop",
    description: "Duvarları birer sanat eserine dönüştüren, dokulu ve derinlikli İtalyan sıva uygulamaları.",
    longDescription: {
      title: "Yüzeylerin Derinliği: İtalyan Sıvalar",
      content: [
        "Duvarlar bir mekanın en geniş tuvalidir. Geleneksel bitişlerin ötesine geçerek, dokulu ve derinlikli İtalyan sıva uygulamalarıyla yüzeylere ruh katıyoruz.",
        "Malzemenin ham gücünü ve ustalıklı el işçiliğini birleştirerek, her bir duvarı birer sanat eserine dönüştürüyoruz. Projelerimizde yüzey kalitesini en üst seviyeye taşıyan dekoratif boya kurguları gerçekleştiriyoruz.",
        "Dokuların uyumu ve renklerin derinliğiyle, yaşam alanlarınıza zamansız bir estetik kazandırıyoruz."
      ]
    }
  },
  {
    slug: "sanatsal-calismalar",
    title: "Sanatsal Çalışmalar",
    sideLabel: "Creative Soul",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2000&auto=format&fit=crop",
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

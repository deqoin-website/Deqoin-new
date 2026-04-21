export interface UygulamaBirimi {
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

export const uygulamaBirimleri: UygulamaBirimi[] = [
  {
    slug: "insaat-ekipleri",
    title: "İnşaat",
    sideLabel: "Structural Integrity",
    image: "/images/workflow/insaat-custom.png",
    sliderImages: [
      "/images/workflow/insaat-custom.png",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1503387762-592dee58c460?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "KABA YAPI", value: "kaba-yapi" },
      { label: "İNCE İŞLER", value: "ince-isler" },
      { label: "ŞANTİYE YÖNETİMİ", value: "santiye-yonetimi" },
      { label: "ALT YAPI & DRENAJ", value: "alt-yapi" }
    ],
    description: "Projenin kaba inşaatından ince detaylarına kadar tüm yapısal süreçleri, milimetrik hassasiyet ve mühendislik disipliniyle yönetiyoruz.",
    longDescription: {
      title: "Tasarımın Şekil Aldığı Sağlam Temel",
      content: [
        "DEQOIN’de inşaat, dışarıdan kiralanan bir hizmet değil; projenin en başından itibaren bizimle yürüyen teknik bir disiplindir. Müşterilerimizin dışarıda usta veya ekip aramasına gerek kalmadan, tüm yapısal kaba ve ince inşaat süreçlerini kendi bünyemizde, tek çatı altında çözüyoruz. Tasarımların ve değerlerin gerçeğe dönüştüğü o sağlam temeli biz inşa ediyoruz.",
        "Belki de henüz farkında olmadığınız şantiye ve uygulama risklerini en başından öngörüyor, kusursuz bir şantiye yönetimiyle mimari vizyonu milimetrik olarak hayata geçiriyoruz. Her kolon, her duvar ve her bağlantı noktası, başlangıçtaki estetik hedeflerden milim sapmadan, DEQOIN standartlarında yükseliyor.",
        "İnşaat sürecinin tüm teknik ve estetik sorumluluğunu tek noktadan yöneterek, projenizi riske atmadan gerçeğe kurguluyoruz. Bu güvenli ve profesyonel uygulama yolculuğuna başlamak için profesyonel ekibimizle randevu planlayabilirsiniz."
      ]
    }
  },
  {
    slug: "siva-ve-alci-ekipleri",
    title: "Sıva ve Alçı",
    sideLabel: "Surface Structuring",
    image: "/images/workflow/siva-alci-custom.png",
    sliderImages: [
      "/images/workflow/siva-alci-custom.png",
      "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1525909002160-d49880e719b0?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "MACUN & ASTAR", value: "macun-astar" },
      { label: "ALÇIPAN & BÖLME", value: "alcipan" },
      { label: "DEKORATİF ÇITALAMA", value: "citalama" },
      { label: "PÜRÜZSÜZ BİTİŞ", value: "puruzsuz-bitis" }
    ],
    description: "Duvar, tavan ve geçiş yüzeylerini, kusursuz altyapı ve net geometri ile uygulamaya hazır hale getiriyoruz.",
    longDescription: {
      title: "Yüzeyin Strüktürünü Kusursuzlaştıran Ekip",
      content: [
        "Sıva ve alçı uygulamalarını yalnızca bir hazırlık aşaması olarak değil, mekanın tüm görsel disiplinini belirleyen teknik bir eşik olarak ele alıyoruz. Yüzeyin düzgünlüğü, köşe netliği ve ışık kırılımı burada başlar.",
        "Uzman ekiplerimizle duvar ve tavanları, sonraki tüm dekoratif uygulamalara hazır hale getiriyor; çatlak, sehim ve dalgalanma risklerini daha iş başlamadan ortadan kaldırıyoruz.",
        "Mimari dilin temiz ve rafine görünmesi için gereken yüzey altyapısını kontrollü, hızlı ve yüksek hassasiyetle inşa ediyoruz."
      ]
    }
  },
  {
    slug: "boya-ekipleri",
    title: "Boya",
    sideLabel: "Chromatic Finish",
    image: "/images/workflow/boya-custom.png",
    sliderImages: [
      "/images/workflow/boya-custom.png",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "RENK GEÇİŞLERİ", value: "renk-gecisleri" },
      { label: "DEKORATİF BOYA", value: "dekoratif-boya" },
      { label: "MAT & SATEN", value: "mat-saten" },
      { label: "KORUYUCU KAPLAMA", value: "koruyucu-kaplama" }
    ],
    description: "Mekanın atmosferini belirleyen son katmanları, kontrollü tonlama ve rafine yüzey kalitesiyle uyguluyoruz.",
    longDescription: {
      title: "Renk ve Doku Dengesini Kurarız",
      content: [
        "Boya uygulamasını yalnızca renklendirme değil, mekanın ışıkla kurduğu ilişkiyi yöneten son mimari katman olarak görüyoruz. Ton, yansıma ve yüzey kalitesi birlikte değerlendirilir.",
        "Ekiplerimiz, projeye özel renk senaryolarını duvar, tavan ve detay birleşimlerinde tutarlı bir standarda taşıyarak mekandaki bütünlük hissini güçlendirir.",
        "Fırça izi, ton farkı ve uygulama yorgunluğu oluşturmadan, yüzeylerde sakin, dengeli ve premium bir sonuç elde ediyoruz."
      ]
    }
  },
  {
    slug: "duvar-sanatcilari",
    title: "Duvar",
    sideLabel: "Artistic Walls",
    image: "/images/workflow/duvar-custom.png",
    sliderImages: [
      "/images/workflow/duvar-custom.png",
      "https://images.unsplash.com/photo-1518193005634-9343360b37cd?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "DOKU ÇALIŞMALARI", value: "doku" },
      { label: "KATMANLI DERİNLİK", value: "katmanli" },
      { label: "ÖZEL EFEKTLER", value: "efektler" },
      { label: "DOĞAL BİTİŞLER", value: "dogal-bitis" }
    ],
    description: "Duvarları statik birer düzlem olmaktan çıkarıp, özgün dokular ve sanatsal müdahalelerle yaşayan yüzeylere dönüştürüyoruz.",
    longDescription: {
      title: "Duvarların Ötesinde: Sanatsal Yüzeyler",
      content: [
        "Duvarları statik birer düzlem olmaktan çıkarıp, özgün dokular ve sanatsal müdahalelerle yaşayan yüzeylere dönüştürüyoruz. Her bir duvar projesi, mekanın ruhunu yansıtan birer enstalasyon olarak kurgulanır.",
        "Katmanlı dokular, özel teknikler ve sanatsal bir bakış açısıyla yüzeyleri yeniden tanımlıyoruz. Mekanın karakterini belirleyen bu sanatsal müdahalelerle yaşam alanlarına derinlik katıyoruz.",
        "Sanat ve zanaatı aynı yüzeyde buluşturarak, benzersiz dokular inşa ediyoruz."
      ]
    }
  },
  {
    slug: "ressamlar",
    title: "Resim",
    sideLabel: "Visual Narrative",
    image: "/images/workflow/resim-custom.png",
    sliderImages: [
      "/images/workflow/resim-custom.png",
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "DUVAR RESMİ", value: "duvar-resmi" },
      { label: "KANVAS UYGULAMA", value: "kanvas" },
      { label: "RENK TEORİSİ", value: "renk-teorisi" },
      { label: "RESTORASYON", value: "restorasyon" }
    ],
    description: "İç ve dış mekanlarda, projenin temasına uygun özel resim çalışmaları ve renk kurguları gerçekleştiriyoruz.",
    longDescription: {
      title: "Görsel Hikayeler: Özel Resim Çalışmaları",
      content: [
        "Mekanın hikayesini renkler ve formlarla anlatıyoruz. Ressam kadromuzla, iç ve dış mekanlarda projenin temasına uygun özel resim çalışmaları kurguluyoruz.",
        "Sadece bir görselleştirme değil, mekanı derinleştiren ve ona ruh katan sanatsal anlatılar oluşturuyoruz. Her bir fırça darbesi, mimari vizyonun bir tamamlayıcısı olarak hayata geçer.",
        "Renk kurguları ve özel resim teknikleriyle, mekanlara özgün bir kimlik kazandırıyoruz."
      ]
    }
  },
  {
    slug: "heykeltiraslar",
    title: "Heykel",
    sideLabel: "3D Artistry",
    image: "/images/workflow/heykel-custom.png",
    sliderImages: [
      "/images/workflow/heykel-custom.png",
      "https://images.unsplash.com/photo-1621360841013-c7683c659ec6?q=80&w=2000&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1518349619113-03114f06ac3a?q=80&w=2000&auto=format&fit=crop"
    ],
    categories: [
      { label: "3D FORMLAR", value: "3d-form" },
      { label: "RÖLYEF", value: "rolyef" },
      { label: "ÖZEL ÜRETİM DETAYLAR", value: "ozel-uretim" },
      { label: "MALZEME DENEYLERİ", value: "malzeme" }
    ],
    description: "Mekana heykelsi bir derinlik katan özel üretim formlar ve sanatsal objelerle, uygulama sürecini bir sanat eylemine dönüştürüyoruz.",
    longDescription: {
      title: "Heykelsi Formlar, Üç Boyutlu Deneyim",
      content: [
        "Mekana heykelsi bir derinlik katan özel üretim formlar ve sanatsal objelerle, uygulama sürecini bir sanat eylemine dönüştürüyoruz. Formun üç boyutlu gücünü, mimari boşlukları tanımlamak için kullanıyoruz.",
        "Kullanılan malzemelerin plastik değerlerini çıkararak, mekana özel heykelsi tasarımlar kurguluyoruz. Tasarımın sınırlarını zorlayan bu üç boyutlu müdahalelerle yaşam alanlarını eşsizleştiriyoruz.",
        "Hacim, form ve mekan arasındaki dengeyi sanatsal bir disiplinle yeniden kuruyoruz."
      ]
    }
  }
];

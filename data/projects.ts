export type Category = 
  | "luks-konut" 
  | "ticari-yapi" 
  | "karma-kullanim" 
  | "kurumsal-alan" 
  | "butik-otel" 
  | "kultur-yapisi"
  | "mimarlik" 
  | "ic-mimarlik" 
  | "restorasyon" 
  | "peyzaj";

export type ProjectDetail = {
  slug: string;
  title: string;
  label: string;
  category: Category;
  coverImage: string;
  client: string;
  year: string;
  area: string;
  studio?: string;
  leadArchitects?: string;
  sustainability?: string;
  location?: string;
  description: string;
  vision: string;      // The "tok" architectural vision
  techDetails: string; // Engineering and material specs
  story: string;       // Context and spatial requirements
  gallery: string[];
  materials?: string[];
  executionUnits?: string[];
};

export const projectsData: ProjectDetail[] = [
  {
    slug: "zind-naaba-hotel",
    title: "ZIND NAABA HOTEL",
    label: "BUTİK OTEL",
    category: "butik-otel",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ33Fr_mp_94UQUZyYOcRBRBK4SsC3hdWkie-fw6V2__i_B1h6AdSqBrcIxAAgXdz-v3B0bxiTC-ksADc_Szblsz7rQvFfbm-HT7bZ1XL4bsM_asUURcwntMziJsDYv2IG_IZ29E-x6Q-o8X94qQUEmwhhDhnCvzR73u_lPOfR2qgqCLbkcFE__mn9WB-1VfwW7H_DqV9DkwKYK7M0io-43LvxYatvgMsrwap-p4wEffe-ljtcBwrQlBdN4PP7Q0JGnYBjixX0YQ0",
    client: "Zind Naaba Group",
    year: "2024",
    area: "4,500 m²",
    description: "Kurumsal lüksü bireysel çalışma ergonomisiyle birleştiren benzersiz bir tasarım deneyimi.",
    vision: "Mekan, henüz farkında olmadığınız konfor ihtiyaçlarınızı karşılayan rasyonel bir çözüm kümesidir. Estetik, işlevin doğal bir sonucudur.",
    techDetails: "Akustik ahşap paneller, atmosfere duyarlı akıllı aydınlatma senaryoları ve heykelsi brüt beton yüzeyler.",
    story: "Küresel ölçekteki iş insanları için hem bir ofis disiplini hem de bir ev sıcaklığı sunan hibrit bir mekan kurgusu hedeflendi.",
    gallery: ["/images/projects/gallery_1.png", "/images/projects/gallery_2.png"],
    materials: ["mobilya", "aydinlatma"],
    executionUnits: ["insaat-ekipleri", "siva-ve-alci-ekipleri", "boya-ekipleri"]
  },
  {
    slug: "skyline-residence",
    title: "SKYLINE RESIDENCE",
    label: "LÜKS KONUT",
    category: "luks-konut",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY",
    client: "Skyline Developments",
    year: "2023",
    area: "12,000 m²",
    description: "Geometrik formların vahşi beton dokusuyla uyum içerisinde yükselmesi.",
    vision: "Şehirle diyalog kuran, mahremiyet ve saydamlık dengesini en modern hatlarla sunan bir konut manifestosu.",
    techDetails: "Kendi kendini temizleyen fotokatalitik beton cephe, panoramik ısı cam cephe sistemleri.",
    story: "Modern insanın şehir yaşamındaki kaosunu dindiren, sığınak hissi veren ama gökyüzüyle bütünleşen bir yaşam alanı kurgusu.",
    gallery: ["/images/projects/gallery_1.png", "/images/projects/gallery_2.png"],
    materials: ["tugla-ve-tas", "italyan-sivalar"],
    executionUnits: ["insaat-ekipleri", "siva-ve-alci-ekipleri", "boya-ekipleri", "duvar-sanatcilari"]
  },
  {
    slug: "lumina-gallery",
    title: "LUMINA GALLERY",
    label: "KÜLTÜR YAPISI",
    category: "kultur-yapisi",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6ch6quj8NI1itL20E5PhIg-48fajZE_vr98u3teQ-X7iSPzBfAvJnkTJ3RuJVxc2gjJk51KmYZk9sWDTwAjNMVHOwiJPfJh3i0VYt8Cfzsf6cPXv8SRUsh66wCIyRnDgQLMJg2_1yHEHCnFIbIJoBzDcFEntZjDdLiFO8q1WvslXUxTqhQNEyc8D_USmsB4iizRnCFmQqpbt_btAIebK4vy_8mB0LYZXdZk9Mtj6xqQ8e91yqi86iYoLhuoh8fXoG0Gcgep-wrSw",
    client: "Lumina Arts",
    year: "2023",
    area: "2,200 m²",
    description: "Sanatın sınırlarını mimarinin somut kurallarıyla çerçeveleyen geniş sergi alanı.",
    vision: "Sergilenen her eserin kendi ışığını bulabileceği, minimal ama etkileyici bir mimari sahne tasarımı.",
    techDetails: "UV korumalı diffüze aydınlatma sistemleri, esnek sergileme modülleri, dikişsiz reçine zemin uygulaması.",
    story: "Geleneksel galeri algısını kırarak, ziyaretçinin mekanın kendisini de bir sanat objesi gibi deneyimlemesini sağlayan bir boşluk kurgusu.",
    gallery: ["/images/projects/gallery_1.png", "/images/projects/gallery_2.png"],
    materials: ["aydinlatma", "sanatsal-calismalar"],
    executionUnits: ["boya-ekipleri", "ressamlar", "heykeltiraslar"]
  },
  {
    slug: "nexus-corporate-center",
    title: "NEXUS CORPORATE",
    label: "KURUMSAL ALAN",
    category: "kurumsal-alan",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ33Fr_mp_94UQUZyYOcRBRBK4SsC3hdWkie-fw6V2__i_B1h6AdSqBrcIxAAgXdz-v3B0bxiTC-ksADc_Szblsz7rQvFfbm-HT7bZ1XL4bsM_asUURcwntMziJsDYv2IG_IZ29E-x6Q-o8X94qQUEmwhhDhnCvzR73u_lPOfR2qgqCLbkcFE__mn9WB-1VfwW7H_DqV9DkwKYK7M0io-43LvxYatvgMsrwap-p4wEffe-ljtcBwrQlBdN4PP7Q0JGnYBjixX0YQ0",
    client: "Nexus Global",
    year: "2024",
    area: "8,500 m²",
    description: "Yeni nesil çalışma kültürünü hiyerarşiden arınmış şeffaf bir mimariyle tanımlayan genel merkez projesi.",
    vision: "Kurumsal kimlik, mekanın disiplininden değil; çalışanların etkileşiminden doğar. Şeffaflık ana temamız.",
    techDetails: "Akıllı cam bölücü sistemler, merkezi ozon sterilizasyon altyapısı, dikey botanik bahçe entegrasyonu.",
    story: "Geleneksel ofis bloklarını yıkarak, departmanlar arası organik geçişleri sağlayan ve yaratıcılığı tetikleyen bir 'kampüs' mantığı kurgulandı.",
    gallery: ["/images/projects/gallery_1.png", "/images/projects/gallery_2.png"]
  },
  {
    slug: "vertex-mixed-use",
    title: "VERTEX MIXED",
    label: "KARMA KULLANIM",
    category: "karma-kullanim",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY",
    client: "Vertex Group",
    year: "2024",
    area: "45,000 m²",
    description: "Kamusal alan ile özel yaşamı podyum ve kule kurgusuyla ayıran, şehir içinde bir mikro-şehir denemesi.",
    vision: "Şehrin karmaşasını kontrollü bir sosyal enerjiye dönüştüren, her katında farklı bir kentsel deneyim sunan yapı.",
    techDetails: "Yüksek dayanımlı çelik kompozit yapı, gri su geri kazanım sistemleri, rüzgar türbini destekli enerji altyapısı.",
    story: "Ticari podyumun canlılığı ile konut bloklarının sessizliğini, kat bahçeleri ve akustik bariyerlerle kesintisizce ayırdık.",
    gallery: ["/images/projects/gallery_1.png", "/images/projects/gallery_2.png"]
  },
  {
    slug: "obsidian-tower",
    title: "OBSIDIAN TOWER",
    label: "TİCARİ YAPI",
    category: "ticari-yapi",
    coverImage: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU",
    client: "Obsidian Holdings",
    year: "2023",
    area: "32,000 m²",
    description: "Dinamik cephe hareketleriyle şehre yön veren, teknoloji odaklı bir ticaret merkezi.",
    vision: "Yapı, bulunduğu bölgenin ekonomik potansiyelini fiziksel bir güce dönüştürmeli. Güçlü ve monolitik bir duruş.",
    techDetails: "Parametrik tasarım ile kurgulanmış güneş kırıcı panel sistemleri, hızlı asansör teknolojileri.",
    story: "Ziyaretçi trafiğini zemin katlarda geniş bir meydanla karşılayan, üst katlarda ise panoramik şehir manzarasını ofislere cömertçe sunan bir hacim çalışması.",
    gallery: ["/images/projects/gallery_1.png", "/images/projects/gallery_2.png"]
  }
];

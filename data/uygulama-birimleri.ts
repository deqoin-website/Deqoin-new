export interface UygulamaBirimi {
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

export const uygulamaBirimleri: UygulamaBirimi[] = [
  {
    slug: "insaat-ekipleri",
    title: "İnşaat Ekipleri",
    sideLabel: "Structural Integrity",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY",
    description: "Projenin kaba inşaatından ince detaylarına kadar tüm yapısal süreçleri, milimetrik hassasiyet ve mühendislik disipliniyle yönetiyoruz.",
    longDescription: {
      title: "Tasarımın Şekil Aldığı Sağlam Temel",
      content: [
        "DEQOIN’de inşaat, dışarıdan kiralanan bir hizmet değil; projenin en başından itibaren bizimle yürüyen teknik bir disiplindir. Müşterilerimizin dışarıda usta veya ekip aramasına gerek kalmadan, tüm yapısal kaba ve ince inşaat süreçlerini kendi bünyemizde, tek çatı altında çözüyoruz. Tasarımların ve değerlerin gerçeğe dönüştüğü o sağlam temeli biz inşa ediyoruz.",
        "Belki de henüz farkında olmadığınız şantiye ve uygulama risklerini en başından öngörüyor, kusursuz bir şantiye yönetimiyle mimari vizyonu milimetrik olarak hayata geçiriyoruz. Her kolon, her duvar ve her bağlantı noktası, başlangıçtaki estetik hedeflerden milim sapmadan, DEQOIN standartlarında yükseliyor.",
        "İnşaat sürecinin tüm teknik ve estetik sorumluluğunu tek noktadan yöneterek, projenizi riske atmadan gerçeğe kurguluyoruz. Bu güvenli ve profesyonel uygulama yolculuğuna başlamak için profesyonel ekibimizle iletişime geçebilirsiniz."
      ]
    }
  },
  {
    slug: "siva-alci-boya",
    title: "Sıva, Alçı ve Boya Ekipleri",
    sideLabel: "Surface Mastery",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ33Fr_mp_94UQUZyYOcRBRBK4SsC3hdWkie-fw6V2__i_B1h6AdSqBrcIxAAgXdz-v3B0bxiTC-ksADc_Szblsz7rQvFfbm-HT7bZ1XL4bsM_asUURcwntMziJsDYv2IG_IZ29E-x6Q-o8X94qQUEmwhhDhnCvzR73u_lPOfR2qgqCLbkcFE__mn9WB-1VfwW7H_DqV9DkwKYK7M0io-43LvxYatvgMsrwap-p4wEffe-ljtcBwrQlBdN4PP7Q0JGnYBjixX0YQ0",
    description: "Yüzeylerin kusursuzluğu, nihai tasarımın kalitesini belirler. Uzman ekiplerimizle pürüzsüz ve karakter sahibi bitişler inşa ediyoruz.",
    longDescription: {
      title: "Kusursuz Yüzeyler, Karakterli Bitişler",
      content: [
        "Yüzey kalitesi, tasarımın başarısını doğrudan etkileyen en kritik unsurdur. Alçı, sıva ve boya süreçlerini sadece bir 'kapatma' işlemi olarak değil, mekanın ışığını ve dokusunu yöneten bir sanat olarak görüyoruz.",
        "Uzman ekiplerimizle pürüzsüz ve karakter sahibi bitişler inşa ediyoruz. Her detayda görsel mükemmelliği hedefleyerek, tasarımın öngördüğü atmosferi yüzeylere taşıyoruz.",
        "Belki de henüz farkında olmadığınız uygulama inceliklerini en başından planlıyor, yüzeylerde zamansız bir kalite kurguluyoruz."
      ]
    }
  },
  {
    slug: "duvar-sanatcilari",
    title: "Duvar Sanatçıları",
    sideLabel: "Artistic Walls",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU",
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
    title: "Ressamlar",
    sideLabel: "Visual Narrative",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA6ch6quj8NI1itL20E5PhIg-48fajZE_vr98u3teQ-X7iSPzBfAvJnkTJ3RuJVxc2gjJk51KmYZk9sWDTwAjNMVHOwiJPfJh3i0VYt8Cfzsf6cPXv8SRUsh66wCIyRnDgQLMJg2_1yHEHCnFIbIJoBzDcFEntZjDdLiFO8q1WvslXUxTqhQNEyc8D_USmsB4iizRnCFmQqpbt_btAIebK4vy_8mB0LYZXdZk9Mtj6xqQ8e91yqi86iYoLhuoh8fXoG0Gcgep-wrSw",
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
    title: "Heykeltıraşlar",
    sideLabel: "3D Artistry",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDb8oJUAbKO838Rur4GmMdhoZA52T9apeuU9wT1MD8aED3l4BUvMiWzCyCUvgmQ_hUnxgOfF8IiulBiI2jOUD_rMvhMhY5q4XF5oN3Orkq525thVCe6a7Qn84IkmcCKdp7RVHGwlMXKCQZWlSwoQRYqNQ54bsoQ6pAqtTv5QeYJjApl9fwBFVCYyWIR0fqefLofCqY7cPmi_F1xk7yjOVIZsTO7FKo0OjDyPcryEMVFbFFRsn19bmHoDjlgz-s838-TizdClIfaG6s",
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

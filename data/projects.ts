export type Category = 
  | "konut" 
  | "ticari" 
  | "mimarlik" 
  | "ic-mimarlik" 
  | "restorasyon" 
  | "peyzaj" 
  | "insaat-muhendisligi" 
  | "elektrik-elektronik-muhendisligi" 
  | "plan-proje";

export type ProjectDetail = {
  slug: string;
  title: string;
  label: string;
  category: Category;
  coverImage: string;
  client: string;
  year: string;
  area: string;
  description: string;
  gallery: string[];
  materials?: string[]; // New field for material-based filtering
};

export const projectsData: ProjectDetail[] = [
  {
    slug: "zind-naaba-hotel",
    title: "ZIND NAABA HOTEL",
    label: "RESIDENT STUDY ROOM",
    category: "ticari",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ33Fr_mp_94UQUZyYOcRBRBK4SsC3hdWkie-fw6V2__i_B1h6AdSqBrcIxAAgXdz-v3B0bxiTC-ksADc_Szblsz7rQvFfbm-HT7bZ1XL4bsM_asUURcwntMziJsDYv2IG_IZ29E-x6Q-o8X94qQUEmwhhDhnCvzR73u_lPOfR2qgqCLbkcFE__mn9WB-1VfwW7H_DqV9DkwKYK7M0io-43LvxYatvgMsrwap-p4wEffe-ljtcBwrQlBdN4PP7Q0JGnYBjixX0YQ0",
    client: "Zind Naaba Group",
    year: "2024",
    area: "4,500 m²",
    description: "Bu proje, kurumsal lüksü bireysel çalışma ergonomisiyle birleştiren benzersiz bir tasarım deneyimidir. Modernizmin soğuk hatları, ahşap tekstürlerin ve sıcak atmosferik ışıklandırmaların yarattığı heykelsi estetikle yeniden yorumlanmıştır.",
    gallery: ["/images/projects/gallery_1.png", "/images/projects/gallery_2.png"],
    materials: ["mobilya", "aydinlatma"]
  },
  {
    slug: "skyline-residence",
    title: "SKYLINE RESIDENCE",
    label: "EXTERIOR FACADE",
    category: "konut",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY",
    client: "Skyline Developments",
    year: "2023",
    area: "12,000 m²",
    description: "Skyline Residence, bulunduğu şehrin silüetine ikonik bir imza atarken, geometrik formların vahşi beton dokusuyla bir uyum içerisinde yükselmesini temsil eder. Cephe detaylarında rasyonel formlar ve ışığın mimari gücü öne çıkarıldı.",
    gallery: ["/images/projects/gallery_1.png", "/images/projects/gallery_2.png"],
    materials: ["tugla-ve-tas", "italyan-sivalar"]
  },
  {
    slug: "lumina-gallery",
    title: "LUMINA GALLERY",
    label: "EXHIBITION SPACE",
    category: "ic-mimarlik",
    coverImage:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6ch6quj8NI1itL20E5PhIg-48fajZE_vr98u3teQ-X7iSPzBfAvJnkTJ3RuJVxc2gjJk51KmYZk9sWDTwAjNMVHOwiJPfJh3i0VYt8Cfzsf6cPXv8SRUsh66wCIyRnDgQLMJg2_1yHEHCnFIbIJoBzDcFEntZjDdLiFO8q1WvslXUxTqhQNEyc8D_USmsB4iizRnCFmQqpbt_btAIebK4vy_8mB0LYZXdZk9Mtj6xqQ8e91yqi86iYoLhuoh8fXoG0Gcgep-wrSw",
    client: "Lumina Arts",
    year: "2023",
    area: "2,200 m²",
    description: "Sanatın sınırlarını mimarinin somut kurallarıyla çerçeveleyen geniş sergi alanı. Her bir tavan detayı ve aydınlatma armatürü, sergilenen sanat eserlerinin atmosferik etkileşimini artıracak şekilde minimal bir yaklaşımla tasarlandı.",
    gallery: ["/images/projects/gallery_1.png", "/images/projects/gallery_2.png"],
    materials: ["aydinlatma", "sanatsal-calismalar"]
  },
];

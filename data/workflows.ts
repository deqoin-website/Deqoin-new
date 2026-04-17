import { WorkflowStep } from "../components/StudioWorkflow";

export const MIMARI_WORKFLOW = (onRandevuClick: () => void): WorkflowStep[] => [
  { 
    id: "01", 
    icon: "event_note", 
    title: "Randevu & Tanışma", 
    detail: "Vizyonunuzu dinlemek için ilk buluşma.", 
    href: "#", 
    action: onRandevuClick 
  },
  { 
    id: "02", 
    icon: "manage_search", 
    title: "Keşif & Teknik Analiz", 
    detail: "Mekanın potansiyelini yerinde inceliyoruz.", 
    href: "/kesif" 
  },
  { 
    id: "03", 
    icon: "draw", 
    title: "Konsept Tasarım", 
    detail: "Hayalleri mimari bir dile tercüme ediyoruz.", 
    href: "#" 
  },
  { 
    id: "04", 
    icon: "architecture", 
    title: "Teknik Detaylandırma", 
    detail: "Uygulama öncesi tüm detayları netleştiriyoruz.", 
    href: "#" 
  },
  { 
    id: "05", 
    icon: "verified", 
    title: "Sunum & Onay", 
    detail: "Kusursuz proje dosyasını teslim ediyoruz.", 
    href: "#" 
  },
];

export const MATERIAL_WORKFLOW = (onRandevuClick: () => void): WorkflowStep[] => [
  { 
    id: "01", 
    icon: "event_note", 
    title: "Stil Danışmanlığı", 
    detail: "Mekanınızın ruhunu belirleyecek ilk görüşme.", 
    href: "#", 
    action: onRandevuClick 
  },
  { 
    id: "02", 
    icon: "palette", 
    title: "Materyal Kürasyonu", 
    detail: "Dünya standartlarında seçkin bir koleksiyon.", 
    href: "#" 
  },
  { 
    id: "03", 
    icon: "rebase_edit", 
    title: "Özel Üretim Kararları", 
    detail: "Size özel mobilya ve doku kurguları.", 
    href: "#" 
  },
  { 
    id: "04", 
    icon: "texture", 
    title: "Numune & Doku Onayı", 
    detail: "Dokunarak hissederek karar verme süreci.", 
    href: "#" 
  },
  { 
    id: "05", 
    icon: "inventory_2", 
    title: "Tedarik & Yönetim", 
    detail: "Sorunsuz lojistik ve hassas kurulum.", 
    href: "#" 
  },
];

export const UYGULAMA_WORKFLOW = (onRandevuClick: () => void): WorkflowStep[] => [
  { 
    id: "01", 
    icon: "event_note", 
    title: "Proje & Saha Analizi", 
    detail: "Mevcut durumun teknik röntgenini çekiyoruz.", 
    href: "#", 
    action: onRandevuClick 
  },
  { 
    id: "02", 
    icon: "construction", 
    title: "Saha Organizasyonu", 
    detail: "Tüm disiplinleri tek çatı altında kurguluyoruz.", 
    href: "#" 
  },
  { 
    id: "03", 
    icon: "handyman", 
    title: "Teknik Uygulama", 
    detail: "Usta ellerle projenin sahada yükselişi.", 
    href: "#" 
  },
  { 
    id: "04", 
    icon: "visibility", 
    title: "Hassas Denetim", 
    detail: "Her fırça darbesi kontrolümüz altında.", 
    href: "#" 
  },
  { 
    id: "05", 
    icon: "key", 
    title: "Anahtar Teslim", 
    detail: "Hayalin gerçeğe dönüştüğü o an.", 
    href: "#" 
  },
];

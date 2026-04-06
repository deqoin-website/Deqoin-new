export const teamFilters = [
  { key: "all", title: "HEPSİ" },
  { key: "mimarlik", title: "Mimarlık" },
  { key: "ic-mimarlik", title: "İç Mimarlık" },
  { key: "restorasyon", title: "Restorasyon Mimarlığı" },
  { key: "peyzaj", title: "Peyzaj Mimarlığı" },
  { key: "insaat-muhendisligi", title: "İnşaat Mühendisliği" },
  { key: "elektrik-elektronik-muhendisligi", title: "Elektrik ve Elektronik Mühendisliği" },
  { key: "plan-proje", title: "Plan ve Proje" },
  { key: "uygulama", title: "Uygulama Departmanı" },
  { key: "malzeme", title: "Malzeme Departmanı" },
] as const;

export const teamMembers = [
  { id: 1, name: "Alp Yılmaz", role: "Kurucu Mimar", category: "mimarlik", image: "/images/team/kurucu.png" },
  { id: 2, name: "Selin Arıkan", role: "Baş İç Mimar", category: "ic-mimarlik", image: "/images/team/ic_mimar.png" },
  { id: 3, name: "Can Demir", role: "Proje Yöneticisi", category: "uygulama", image: "/images/team/proje.png" },
  { id: 5, name: "Aslı Şen", role: "Malzeme Uzmanı", category: "malzeme", image: "/images/team/medya.png" },
];

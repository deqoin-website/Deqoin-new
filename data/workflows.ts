import { WorkflowStep } from "../components/WorkflowMarquee";

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "Kusursuz sürecin ilk adımı.",
    image: "/images/workflow/randevu.svg?v=3",
    backText:
      "İlk görüşmede ihtiyaçlar, beklentiler ve proje kapsamı netleştirilir. Bu aşama, sonraki tüm kararların temelini oluşturur.",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "Mekanın potansiyelini, ışığını ve ritmini okuruz.",
    image: "/images/workflow/kesif.svg?v=3",
    backText:
      "Mekanın ölçüsü, ışık yönü, mevcut durum ve kullanım potansiyeli analiz edilir. Tasarımın teknik zemini burada kurulur.",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Lüks, işlev ve oranı aynı dilde birleştiririz.",
    image: "/images/workflow/tasarim.svg?v=3",
    backText:
      "Konsept, malzeme dili ve mekansal kurgu tek bir çizgide birleşir. Projenin karakteri, burada görsel ve işlevsel olarak şekillenir.",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve dayanıklılık ekseninde seçim yaparız.",
    image: "/images/workflow/malzeme.svg?v=3",
    backText:
      "Yüzey, renk ve doku seçimleri mekanın algısını belirler. Lüks hissi taşıyan, uzun ömürlü ve dengeli materyaller seçilir.",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Detayı kontrol eder, tasarımı gerçeğe dönüştürürüz.",
    image: "/images/workflow/uygulama.svg?v=3",
    backText:
      "Planlama, saha koordinasyonu ve ince işçilik aynı anda yönetilir. Tasarım, kusursuz teslimle gerçek bir deneyime dönüşür.",
  },
];

export const MIMARI_WORKFLOW = WORKFLOW_STEPS;
export const MATERIAL_WORKFLOW = WORKFLOW_STEPS;
export const UYGULAMA_WORKFLOW = WORKFLOW_STEPS;

import { WorkflowStep } from "../components/WorkflowMarquee";

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "Kusursuz sürecin ilk adımı.",
    image: "/images/workflow/randevu-v4.png",
    backText:
      "İlk görüşmede ihtiyaçlar, beklentiler ve proje kapsamı netleştirilir. Bu aşama, sonraki tüm kararların temelini oluşturur.",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "Mekanın potansiyelini, ışığını ve ritmini okuruz.",
    image: "/images/workflow/kesif-v4.png",
    backText:
      "Mekanın ölçüsü, ışık yönü, mevcut durum ve kullanım potansiyeli analiz edilir. Tasarımın teknik zemini burada kurulur.",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Lüks, işlev ve oranı aynı dilde birleştiririz.",
    image: "/images/workflow/tasarim-v4.png",
    backText:
      "Konsept, malzeme dili ve mekansal kurgu tek bir çizgide birleşir. Projenin karakteri, burada görsel ve işlevsel olarak şekillenir.",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve dayanıklılık ekseninde seçim yaparız.",
    image: "/images/workflow/malzeme-v4.png",
    backText:
      "Yüzey, renk ve doku seçimleri mekanın algısını belirler. Lüks hissi taşıyan, uzun ömürlü ve dengeli materyaller seçilir.",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Detayı kontrol eder, tasarımı gerçeğe dönüştürürüz.",
    image: "/images/workflow/uygulama-v4.png",
    backText:
      "Planlama, saha koordinasyonu ve ince işçilik aynı anda yönetilir. Tasarım, kusursuz teslimle gerçek bir deneyime dönüşür.",
  },
];

export const MIMARI_WORKFLOW = WORKFLOW_STEPS;
export const MATERIAL_WORKFLOW = WORKFLOW_STEPS;
export const UYGULAMA_WORKFLOW = WORKFLOW_STEPS;

import { WorkflowStep } from "../components/WorkflowMarquee";

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "Kusursuz sürecin ilk adımı.",
    image: "/images/workflow/randevu.svg?v=2",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "Mekanın potansiyelini, ışığını ve ritmini okuruz.",
    image: "/images/workflow/kesif.svg?v=2",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Lüks, işlev ve oranı aynı dilde birleştiririz.",
    image: "/images/workflow/tasarim.svg?v=2",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve dayanıklılık ekseninde seçim yaparız.",
    image: "/images/workflow/malzeme.svg?v=2",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Detayı kontrol eder, tasarımı gerçeğe dönüştürürüz.",
    image: "/images/workflow/uygulama.svg?v=2",
  },
];

export const MIMARI_WORKFLOW = WORKFLOW_STEPS;
export const MATERIAL_WORKFLOW = WORKFLOW_STEPS;
export const UYGULAMA_WORKFLOW = WORKFLOW_STEPS;

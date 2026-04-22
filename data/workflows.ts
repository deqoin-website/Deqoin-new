import { WorkflowStep } from "../components/WorkflowMarquee";

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "İhtiyaçları netleştiririz.",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "Mekanı yerinde analiz ederiz.",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Konsept ve çözüm dili oluştururuz.",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doğru yüzey ve materyali seçeriz.",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Sahada kontrollü biçimde uygularız.",
  },
];

export const MIMARI_WORKFLOW = WORKFLOW_STEPS;
export const MATERIAL_WORKFLOW = WORKFLOW_STEPS;
export const UYGULAMA_WORKFLOW = WORKFLOW_STEPS;

import { WorkflowStep } from "../components/WorkflowMarquee";

const svgDataUri = (title: string, accent: string, bg: string, accent2: string) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${bg}" />
          <stop offset="100%" stop-color="#050505" />
        </linearGradient>
        <radialGradient id="r" cx="50%" cy="35%" r="65%">
          <stop offset="0%" stop-color="${accent}" stop-opacity="0.42" />
          <stop offset="100%" stop-color="${accent2}" stop-opacity="0" />
        </radialGradient>
      </defs>
      <rect width="1200" height="1600" fill="url(#g)" />
      <circle cx="320" cy="460" r="340" fill="url(#r)" />
      <circle cx="920" cy="1120" r="420" fill="url(#r)" opacity="0.7" />
      <path d="M140 1270C360 920 540 860 860 540" fill="none" stroke="${accent}" stroke-width="18" stroke-linecap="round" opacity="0.55"/>
      <path d="M220 1320C420 1020 640 960 1040 640" fill="none" stroke="${accent2}" stroke-width="9" stroke-linecap="round" opacity="0.4"/>
      <text x="84" y="1380" fill="#fff" font-size="92" font-family="Arial, sans-serif" font-weight="300" letter-spacing="18">${title}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "Kusursuz sürecin ilk adımı.",
    image: svgDataUri("01", "#b58b62", "#101010", "#5f4a37"),
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "Mekanın potansiyelini, ışığını ve ritmini okuruz.",
    image: svgDataUri("02", "#7d6a5a", "#0f1114", "#b58b62"),
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Lüks, işlev ve oranı aynı dilde birleştiririz.",
    image: svgDataUri("03", "#c7a57f", "#111111", "#8a6b4c"),
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve dayanıklılık ekseninde seçim yaparız.",
    image: svgDataUri("04", "#93745d", "#0d0d0d", "#d8c2aa"),
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Detayı kontrol eder, tasarımı gerçeğe dönüştürürüz.",
    image: svgDataUri("05", "#d1b08a", "#121212", "#6f5a45"),
  },
];

export const MIMARI_WORKFLOW = WORKFLOW_STEPS;
export const MATERIAL_WORKFLOW = WORKFLOW_STEPS;
export const UYGULAMA_WORKFLOW = WORKFLOW_STEPS;

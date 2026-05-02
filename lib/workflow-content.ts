import type { LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { CalendarDays, Compass, Hammer, Layers, PenTool } from "lucide-react";

import type { WorkflowStep as MarqueeWorkflowStep } from "@/components/WorkflowMarquee";
import type { WorkflowStep as SectionWorkflowStep } from "@/components/WorkflowSection";
import { getWorkflowPageAncestors, getWorkflowPageNode, normalizeWorkflowScope } from "@/lib/workflow-pages";

export type WorkflowProcessItem = {
  title: string;
  description: string;
  icon: string;
};

export type WorkflowContentDraft = {
  title: string;
  steps: WorkflowProcessItem[];
};

export const cloneWorkflowDraft = (value: WorkflowContentDraft): WorkflowContentDraft => ({
  title: value.title,
  steps: value.steps.map((step) => ({ ...step })),
});

export type WorkflowScopeKind = "home" | "page" | "department";

export type WorkflowContentRecord = {
  scope?: string;
  kind?: WorkflowScopeKind;
  title?: string;
  steps?: unknown;
  source?: "workflow" | "legacy" | "default";
};

export const DEFAULT_WORKFLOW_TITLE = "İŞ AKIŞI";

export const DEFAULT_WORKFLOW_STEPS: WorkflowProcessItem[] = [
  {
    title: "Randevu",
    description: "Temas, zamanlama ve beklenti tek eksende toplanır.",
    icon: "CalendarDays",
  },
  {
    title: "Keşif",
    description: "Alan, ihtiyaç ve teknik sınırlar sakin bir analizle netleştirilir.",
    icon: "Compass",
  },
  {
    title: "Tasarım",
    description: "Kavramsal fikir, tipografik disiplin ve mekansal kurgu aynı hatta birleşir.",
    icon: "PenTool",
  },
  {
    title: "Malzeme",
    description: "Doku, yüzey ve detaylar teknik bir seçkiyle rafine edilir.",
    icon: "Layers",
  },
  {
    title: "Uygulama",
    description: "Sahadaki üretim, kontrol ve teslim ritmi ölçülü biçimde hayata geçirilir.",
    icon: "Hammer",
  },
];

const makePresetSteps = (steps: WorkflowProcessItem[]) => steps.map((step) => ({ ...step }));

const PAGE_WORKFLOW_PRESETS: Record<string, WorkflowContentDraft> = {
  "/hakkimizda": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Tanışma", description: "Kısa bir görüşme ile neye ihtiyacınız olduğunu öğreniriz.", icon: "CalendarDays" },
      { title: "Bilgi Toplama", description: "Ölçü, alan ve beklentileri netleştiririz.", icon: "Compass" },
      { title: "Plan", description: "İlk yol haritasını ve sıra düzenini çıkarırız.", icon: "PenTool" },
      { title: "Uygulama", description: "İşi sahada adım adım ilerletiriz.", icon: "Hammer" },
      { title: "Teslim", description: "Son kontrolü yapar ve işi kapatırız.", icon: "ShieldCheck" },
    ]),
  },
  "/kesif": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Talep", description: "Kısa bilgi alır ve ihtiyacı anlarız.", icon: "ClipboardList" },
      { title: "Randevu", description: "Uygun zamanı belirleriz.", icon: "CalendarDays" },
      { title: "Yerinde Bakış", description: "Alanı sahada görür ve not alırız.", icon: "MapPinned" },
      { title: "Plan", description: "İlk adımları sade bir şekilde çıkarırız.", icon: "Compass" },
      { title: "Başla", description: "Tasarım sürecine geçeriz.", icon: "Route" },
    ]),
  },
  "/mimari": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "İhtiyaç", description: "Ne istediğinizi netleştiririz.", icon: "ClipboardList" },
      { title: "Alan", description: "Mekanı ve sınırları inceleriz.", icon: "MapPinned" },
      { title: "Plan", description: "İlk çözüm yolunu çıkarırız.", icon: "Compass" },
      { title: "Çizim", description: "Detayları sade bir taslakta toplarız.", icon: "PenTool" },
      { title: "Uygulama", description: "İşi sahaya taşırız.", icon: "Hammer" },
    ]),
  },
  "/uygulama": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Ekip", description: "Doğru ekibi seçeriz.", icon: "Layers" },
      { title: "Kapsam", description: "Yapılacak işi netleştiririz.", icon: "ClipboardList" },
      { title: "Plan", description: "Sıra ve zamanı belirleriz.", icon: "Compass" },
      { title: "Uygulama", description: "İşi sahada yürütürüz.", icon: "Hammer" },
      { title: "Takip", description: "Son durumu kontrol ederiz.", icon: "ShieldCheck" },
    ]),
  },
  "/galeri": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Filtrele", description: "Kategori ve departmanı seç.", icon: "ClipboardList" },
      { title: "İncele", description: "Projeyi görsellerle aç.", icon: "Compass" },
      { title: "Karşılaştır", description: "Benzer işleri yan yana düşün.", icon: "Layers" },
      { title: "Detay", description: "Proje bilgisini oku.", icon: "PenTool" },
      { title: "İletişim", description: "Beğendiğin iş için bize ulaş.", icon: "CalendarDays" },
    ]),
  },
  "/galeri/[slug]": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Gör", description: "Ana görseli aç.", icon: "Compass" },
      { title: "Bilgi Oku", description: "Proje detaylarını incele.", icon: "PenTool" },
      { title: "Görseller", description: "Diğer görselleri sırayla bak.", icon: "Layers" },
      { title: "Benzer İşler", description: "Yakın projeleri karşılaştır.", icon: "Route" },
      { title: "Dön", description: "Galeri sayfasına geri git.", icon: "ArrowLeft" },
    ]),
  },
  "/journal": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Ara", description: "Konuyu ya da etiketi bul.", icon: "ClipboardList" },
      { title: "Seç", description: "İlgini çeken yazıyı aç.", icon: "Compass" },
      { title: "Oku", description: "Kısa ve net notları incele.", icon: "PenTool" },
      { title: "Kaydet", description: "Sonra bakmak için ayır.", icon: "Layers" },
      { title: "Paylaş", description: "İstersen başkalarıyla paylaş.", icon: "Workflow" },
    ]),
  },
  "/journal/[slug]": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Başlık", description: "Yazının konusunu hızlı gör.", icon: "Compass" },
      { title: "Oku", description: "Metni baştan sona takip et.", icon: "PenTool" },
      { title: "Not Al", description: "İşine yarayan kısmı ayır.", icon: "ClipboardList" },
      { title: "İlgili Yazılar", description: "Benzer içeriklere geç.", icon: "Route" },
      { title: "Dön", description: "Journal ana sayfasına geri dön.", icon: "ArrowLeft" },
    ]),
  },
  "/iletisim": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Konu Seç", description: "Ne için yazdığını belirle.", icon: "ClipboardList" },
      { title: "Bilgi Gir", description: "Kısa mesajını yaz.", icon: "PenTool" },
      { title: "Konum Bak", description: "Adres ve haritayı kontrol et.", icon: "MapPinned" },
      { title: "Gönder", description: "Formu ilet.", icon: "Send" },
      { title: "Dönüş Bekle", description: "Sana geri dönüş yapalım.", icon: "ShieldCheck" },
    ]),
  },
  "/departman-ekipleri": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Filtrele", description: "İlgili ekibi seç.", icon: "ClipboardList" },
      { title: "İncele", description: "Uzmanlığı ve rolü gör.", icon: "Compass" },
      { title: "Karşılaştır", description: "Ekipleri yan yana değerlendir.", icon: "Layers" },
      { title: "Detay", description: "Çalışma alanını oku.", icon: "PenTool" },
      { title: "İletişim", description: "Uygun ekiple bağlantı kur.", icon: "CalendarDays" },
    ]),
  },
  "/tasarim": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "İhtiyaç", description: "Kısa bilgi al.", icon: "ClipboardList" },
      { title: "Plan", description: "İşin yolunu çıkar.", icon: "Compass" },
      { title: "Ekip", description: "Uygun uzmanlığı seç.", icon: "Layers" },
      { title: "Uygulama", description: "Süreci başlat.", icon: "Hammer" },
      { title: "Takip", description: "İlerlemesini kontrol et.", icon: "ShieldCheck" },
    ]),
  },
  "/materyal-studyo/[slug]": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Filtrele", description: "İstediğin yüzeyi daralt.", icon: "ClipboardList" },
      { title: "İncele", description: "Ürünleri tek tek aç.", icon: "Compass" },
      { title: "Karşılaştır", description: "Farkları gör.", icon: "Layers" },
      { title: "Detay", description: "Teknik bilgiyi oku.", icon: "PenTool" },
      { title: "Seç", description: "İşine uygun olanı belirle.", icon: "Hammer" },
    ]),
  },
  "/materyal-studyo/[slug]/[urun-slug]": {
    title: DEFAULT_WORKFLOW_TITLE,
    steps: makePresetSteps([
      { title: "Gör", description: "Ürünün görsellerine bak.", icon: "Compass" },
      { title: "Oku", description: "Teknik bilgileri incele.", icon: "PenTool" },
      { title: "Karşılaştır", description: "İhtiyacınla eşleştir.", icon: "Layers" },
      { title: "Benzerler", description: "Yakın ürünleri aç.", icon: "Route" },
      { title: "İletişim", description: "Son sorular için ulaş.", icon: "CalendarDays" },
    ]),
  },
};

const LEGACY_WORKFLOW_SCORES = new Set(["/", "/materyal-studyo", "/faaliyet-alanlarimiz"]);

const cloneWorkflowPreset = (preset: WorkflowContentDraft) => cloneWorkflowDraft(preset);

export const getWorkflowPresetForScope = (scope?: string | null): WorkflowContentDraft | null => {
  const normalized = normalizeWorkflowScope(scope || "/");

  if (LEGACY_WORKFLOW_SCORES.has(normalized)) {
    return null;
  }

  const candidates = [
    getWorkflowPageNode(normalized).route,
    ...getWorkflowPageAncestors(normalized).map((item) => item.route),
    normalized,
  ];

  for (const candidate of candidates) {
    const preset = PAGE_WORKFLOW_PRESETS[candidate];
    if (preset) {
      return cloneWorkflowPreset(preset);
    }
  }

  return null;
};

export const isLegacyWorkflowDraft = (steps: unknown) => {
  const normalized = normalizeWorkflowSteps(steps, DEFAULT_WORKFLOW_STEPS);
  if (normalized.length !== DEFAULT_WORKFLOW_STEPS.length) {
    return false;
  }

  return normalized.every((step, index) => {
    const fallback = DEFAULT_WORKFLOW_STEPS[index];
    return (
      step.title === fallback.title &&
      step.description === fallback.description &&
      step.icon === fallback.icon
    );
  });
};

export const getWorkflowFallbackDraftForScope = (scope?: string | null): WorkflowContentDraft => {
  const normalized = normalizeWorkflowScope(scope || "/");

  if (LEGACY_WORKFLOW_SCORES.has(normalized)) {
    return cloneWorkflowPreset({
      title: DEFAULT_WORKFLOW_TITLE,
      steps: DEFAULT_WORKFLOW_STEPS,
    });
  }

  const preset = getWorkflowPresetForScope(normalized);
  if (preset) {
    return preset;
  }

  return cloneWorkflowPreset({
    title: DEFAULT_WORKFLOW_TITLE,
    steps: DEFAULT_WORKFLOW_STEPS,
  });
};

type WorkflowIconOption = {
  key: string;
  label: string;
  description: string;
  icon: LucideIcon;
};

export const WORKFLOW_ICON_OPTIONS: WorkflowIconOption[] = [
  { key: "CalendarDays", label: "Randevu", description: "Takvim ve planlama", icon: CalendarDays },
  { key: "Compass", label: "Keşif", description: "Yön bulma ve analiz", icon: Compass },
  { key: "PenTool", label: "Tasarım", description: "Çizim ve konsept", icon: PenTool },
  { key: "Layers", label: "Katmanlar", description: "Doku ve katman", icon: Layers },
  { key: "Hammer", label: "Uygulama", description: "Saha ve üretim", icon: Hammer },
  { key: "Sparkles", label: "Yaratıcı", description: "Öne çıkan vurgu", icon: LucideIcons.Sparkles },
  { key: "ClipboardList", label: "Liste", description: "Kontrol ve plan", icon: LucideIcons.ClipboardList },
  { key: "DraftingCompass", label: "Teknik", description: "Mekansal teknik çizim", icon: LucideIcons.DraftingCompass },
  { key: "Route", label: "Rota", description: "Aşamalı ilerleyiş", icon: LucideIcons.Route },
  { key: "MapPinned", label: "Konum", description: "Yerinde keşif", icon: LucideIcons.MapPinned },
  { key: "ShieldCheck", label: "Onay", description: "Kalite ve doğrulama", icon: LucideIcons.ShieldCheck },
  { key: "Wrench", label: "Teknik", description: "Mekanik çözüm", icon: LucideIcons.Wrench },
  { key: "Box", label: "Üretim", description: "Malzeme ve teslim", icon: LucideIcons.Box },
  { key: "Send", label: "Gönder", description: "Form ve iletişim", icon: LucideIcons.Send },
  { key: "ArrowLeft", label: "Geri", description: "Önceki sayfaya dönüş", icon: LucideIcons.ArrowLeft },
  { key: "Workflow", label: "Akış", description: "İş akışı göstergesi", icon: LucideIcons.Workflow },
];

const WORKFLOW_ICONS: LucideIcon[] = DEFAULT_WORKFLOW_STEPS.map((step) => {
  const option = WORKFLOW_ICON_OPTIONS.find((item) => item.key === step.icon);
  return option?.icon || Hammer;
});

const LUCIDE_ICON_LOOKUP = LucideIcons as unknown as Record<string, LucideIcon>;

const resolveWorkflowIconKey = (value: unknown, fallback: string): string => {
  const candidate = typeof value === "string" ? value.trim() : "";
  if (candidate && LUCIDE_ICON_LOOKUP[candidate]) {
    return candidate;
  }
  return fallback;
};

export const resolveWorkflowIconComponent = (value: unknown, index = 0): LucideIcon => {
  const fallbackKey = DEFAULT_WORKFLOW_STEPS[index % DEFAULT_WORKFLOW_STEPS.length]?.icon || DEFAULT_WORKFLOW_STEPS[0].icon;
  const iconKey = resolveWorkflowIconKey(value, fallbackKey);
  return LUCIDE_ICON_LOOKUP[iconKey] || WORKFLOW_ICONS[index % WORKFLOW_ICONS.length] || Hammer;
};

const normalizeWorkflowItem = (
  value: unknown,
  fallback: WorkflowProcessItem,
  index = 0,
): WorkflowProcessItem => {
  if (!value || typeof value !== "object") return { ...fallback };

  const candidate = value as Partial<WorkflowProcessItem> & { desc?: string };
  return {
    title: candidate.title?.toString() || fallback.title,
    description: candidate.description?.toString() || candidate.desc?.toString() || fallback.description,
    icon: resolveWorkflowIconKey(candidate.icon, fallback.icon || DEFAULT_WORKFLOW_STEPS[index % DEFAULT_WORKFLOW_STEPS.length]?.icon || DEFAULT_WORKFLOW_STEPS[0].icon),
  };
};

export const normalizeWorkflowSteps = (
  value: unknown,
  fallback: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): WorkflowProcessItem[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return fallback.map((item) => ({ ...item }));
  }

  const normalized = value
    .slice(0, fallback.length)
    .map((item, index) => normalizeWorkflowItem(item, fallback[index] || fallback[0], index));

  if (normalized.length < fallback.length) {
    for (let index = normalized.length; index < fallback.length; index += 1) {
      normalized.push({ ...fallback[index] });
    }
  }

  return normalized;
};

export const workflowDraftFromProcess = (
  value: unknown,
  fallbackTitle: string = DEFAULT_WORKFLOW_TITLE,
  fallbackSteps: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): WorkflowContentDraft => ({
  title: fallbackTitle,
  steps: normalizeWorkflowSteps(value, fallbackSteps),
});

export const workflowDraftFromRecord = (
  value: WorkflowContentRecord | null | undefined,
  fallbackTitle: string = DEFAULT_WORKFLOW_TITLE,
  fallbackSteps: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): WorkflowContentDraft => {
  if (!value) {
    return {
      title: fallbackTitle,
      steps: normalizeWorkflowSteps(undefined, fallbackSteps),
    };
  }

  return {
    title: value.title?.toString() || fallbackTitle,
    steps: normalizeWorkflowSteps(value.steps, fallbackSteps),
  };
};

export const workflowScopeKindFromKey = (scope: string): WorkflowScopeKind => {
  if (scope === "home") return "home";
  if (scope.startsWith("department:")) return "department";
  return "page";
};

export const workflowDraftFromPageContent = (
  value: any,
  fallbackTitle: string = DEFAULT_WORKFLOW_TITLE,
  fallbackSteps: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): WorkflowContentDraft => {
  const sections = Array.isArray(value?.sections) ? value.sections : [];
  const workflowSection =
    sections.find((section: any) => section?.id === "workflow" || section?.type === "workflow") || null;

  const title =
    workflowSection?.title?.toString() ||
    value?.title?.toString() ||
    fallbackTitle;

  return {
    title,
    steps: normalizeWorkflowSteps(
      workflowSection?.process || workflowSection?.content?.steps || workflowSection?.steps || value?.process,
      fallbackSteps,
    ),
  };
};

export const workflowStepsForSection = (
  value: unknown,
  fallback: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): SectionWorkflowStep[] =>
  normalizeWorkflowSteps(value, fallback).map((step, index) => ({
    id: String(index + 1).padStart(2, "0"),
    title: step.title,
    description: step.description,
    icon: resolveWorkflowIconComponent(step.icon, index),
  }));

export const workflowStepsForMarquee = (
  value: unknown,
  fallback: WorkflowProcessItem[] = DEFAULT_WORKFLOW_STEPS,
): MarqueeWorkflowStep[] =>
  normalizeWorkflowSteps(value, fallback).map((step, index) => ({
    id: String(index + 1).padStart(2, "0"),
    title: step.title,
    description: step.description,
  }));

export const departmentProcessFromWorkflow = (workflow: WorkflowContentDraft) =>
  workflow.steps.map((step) => ({
    title: step.title,
    desc: step.description,
    icon: step.icon,
  }));

export const pageWorkflowSectionFromDraft = (workflow: WorkflowContentDraft) => ({
  id: "workflow",
  type: "workflow",
  title: workflow.title,
  process: departmentProcessFromWorkflow(workflow),
});

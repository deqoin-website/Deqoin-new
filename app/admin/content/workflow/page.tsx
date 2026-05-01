"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Copy,
  FileText,
  Layers3,
  Loader2,
  Plus,
  RefreshCcw,
  Save,
  Search,
  Settings2,
  Trash2,
  Workflow,
} from "lucide-react";

import { useNotification } from "@/components/admin/AdminNotificationProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { mimariServices } from "@/data/mimari-hizmetler";
import { materyalKategorileri } from "@/data/materyal-studyo";
import { uygulamaBirimleri } from "@/data/uygulama-birimleri";
import {
  DEFAULT_WORKFLOW_STEPS,
  DEFAULT_WORKFLOW_TITLE,
  WORKFLOW_ICON_OPTIONS,
  WorkflowContentDraft,
  WorkflowProcessItem,
  workflowDraftFromRecord,
  normalizeWorkflowSteps,
  resolveWorkflowIconComponent,
} from "@/lib/workflow-content";
import { cn } from "@/lib/utils";

type WorkflowScope = {
  key: string;
  kind: "page" | "department";
  label: string;
  description: string;
  route: string;
  group: string;
};

const PAGE_SCOPES: WorkflowScope[] = [
  {
    key: "home",
    kind: "page",
    label: "Anasayfa",
    description: "Ana sayfa workflow bloğu.",
    route: "/",
    group: "Ana Sayfa Akışları",
  },
  {
    key: "page:kesif",
    kind: "page",
    label: "Keşif",
    description: "Keşif ve analiz sayfasının workflow bloğu.",
    route: "/kesif",
    group: "Ana Sayfa Akışları",
  },
  {
    key: "page:mimari",
    kind: "page",
    label: "Mimari",
    description: "Mimari ana sayfasındaki workflow bloğu.",
    route: "/mimari",
    group: "Ana Sayfa Akışları",
  },
  {
    key: "page:material",
    kind: "page",
    label: "Materyal",
    description: "Materyal ana sayfasındaki workflow bloğu.",
    route: "/materyal-studyo",
    group: "Ana Sayfa Akışları",
  },
  {
    key: "page:execution",
    kind: "page",
    label: "Uygulama",
    description: "Uygulama ana sayfasındaki workflow bloğu.",
    route: "/uygulama",
    group: "Ana Sayfa Akışları",
  },
];

const mapDepartments = (
  items: Array<{ slug: string; title: string; sideLabel?: string }>,
  group: string,
  routePrefix: string,
): WorkflowScope[] =>
  items.map((item) => ({
    key: `department:${item.slug}`,
    kind: "department",
    label: item.title,
    description: item.sideLabel ? `${item.sideLabel} workflow'u.` : `${item.title} detay workflow'u.`,
    route: `${routePrefix}/${item.slug}`,
    group,
  }));

const DEPARTMENT_SCOPES: WorkflowScope[] = [
  ...mapDepartments(mimariServices as Array<{ slug: string; title: string; sideLabel?: string }>, "Mimari Detaylar", "/mimari"),
  ...mapDepartments(materyalKategorileri as Array<{ slug: string; title: string; sideLabel?: string }>, "Materyal Detaylar", "/materyal-studyo"),
  ...mapDepartments(uygulamaBirimleri as Array<{ slug: string; title: string; sideLabel?: string }>, "Uygulama Detaylar", "/uygulama"),
];

const ALL_SCOPES = [...PAGE_SCOPES, ...DEPARTMENT_SCOPES];
const PAGE_SCOPE_KEYS = new Set(PAGE_SCOPES.map((scope) => scope.key));

type ScopeMode = "page" | "department";

const getScopeMode = (scopeKey: string): ScopeMode => (PAGE_SCOPE_KEYS.has(scopeKey) ? "page" : "department");

const cloneDraft = (value: WorkflowContentDraft): WorkflowContentDraft => ({
  title: value.title,
  steps: value.steps.map((step) => ({ ...step })),
});

const defaultWorkflowTitleForScope = (scope: WorkflowScope) =>
  scope.key === "home" ? DEFAULT_WORKFLOW_TITLE : `${scope.label.toUpperCase()} AKIŞI`;

const createDefaultDraft = (scope: WorkflowScope): WorkflowContentDraft => {
  return {
    title: defaultWorkflowTitleForScope(scope),
    steps: DEFAULT_WORKFLOW_STEPS.map((step) => ({ ...step })),
  };
};

export default function WorkflowAdminPage() {
  const { showToast } = useNotification();
  const searchParams = useSearchParams();
  const initialScopeKey = useMemo(() => {
    const candidate = searchParams.get("scope");
    return candidate && ALL_SCOPES.some((scope) => scope.key === candidate) ? candidate : PAGE_SCOPES[0].key;
  }, [searchParams]);
  const initialScopeMode = getScopeMode(initialScopeKey);
  const [selectedScopeKey, setSelectedScopeKey] = useState(initialScopeKey);
  const [activeScopeMode, setActiveScopeMode] = useState<ScopeMode>(initialScopeMode);
  const [workflow, setWorkflow] = useState<WorkflowContentDraft>(createDefaultDraft(ALL_SCOPES.find((scope) => scope.key === initialScopeKey) || PAGE_SCOPES[0]));
  const [isLoading, setIsLoading] = useState(true);
  const [isScopeLoading, setIsScopeLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [apiError, setApiError] = useState<string | null>(null);
  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(0);

  const selectedScope = useMemo(
    () => ALL_SCOPES.find((scope) => scope.key === selectedScopeKey) || PAGE_SCOPES[0],
    [selectedScopeKey],
  );

  useEffect(() => {
    const nextScopeKey = searchParams.get("scope");
    if (!nextScopeKey) return;
    if (ALL_SCOPES.some((scope) => scope.key === nextScopeKey) && nextScopeKey !== selectedScopeKey) {
      setSelectedScopeKey(nextScopeKey);
      setActiveScopeMode(getScopeMode(nextScopeKey));
    }
  }, [searchParams, selectedScopeKey]);

  const groupedScopes = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    const matches = (scope: WorkflowScope) =>
      !term ||
      `${scope.label} ${scope.description} ${scope.route}`.toLowerCase().includes(term);

    const byGroup = new Map<string, WorkflowScope[]>();
    const visibleScopes = activeScopeMode === "page" ? PAGE_SCOPES : DEPARTMENT_SCOPES;

    visibleScopes.forEach((scope) => {
      if (!matches(scope)) return;
      const current = byGroup.get(scope.group) || [];
      current.push(scope);
      byGroup.set(scope.group, current);
    });

    return Array.from(byGroup.entries()).map(([title, scopes]) => ({ title, scopes }));
  }, [searchQuery, activeScopeMode]);

  const switchScopeMode = (mode: ScopeMode) => {
    const pool = mode === "page" ? PAGE_SCOPES : DEPARTMENT_SCOPES;
    const nextScope = pool[0];

    setSearchQuery("");
    setActiveScopeMode(mode);

    if (nextScope && nextScope.key !== selectedScopeKey) {
      setSelectedScopeKey(nextScope.key);
    }
  };

  const loadScope = async (scope: WorkflowScope) => {
    setIsScopeLoading(true);
    setApiError(null);

    try {
      const res = await fetch(`/api/workflow?scope=${encodeURIComponent(scope.key)}`, { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`GET /api/workflow?scope=${scope.key} failed with ${res.status}`);
      }

      const data = await res.json();
      const draft = workflowDraftFromRecord(
        data,
        defaultWorkflowTitleForScope(scope),
        DEFAULT_WORKFLOW_STEPS,
      );

      setWorkflow(cloneDraft(draft));
      setExpandedStepIndex(0);

      setIsDirty(false);
    } catch (error) {
      console.error("Workflow load error:", error);
      const fallback = createDefaultDraft(scope);
      setWorkflow(cloneDraft(fallback));
      setExpandedStepIndex(0);
      setApiError("Seçili workflow içeriği yüklenemedi. Varsayılan veriler gösteriliyor.");
      showToast("Workflow içeriği yüklenemedi.", "error");
    } finally {
      setIsLoading(false);
      setIsScopeLoading(false);
    }
  };

  useEffect(() => {
    void loadScope(selectedScope);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedScope.key]);

  const updateTitle = (value: string) => {
    setWorkflow((current) => ({ ...current, title: value }));
    setIsDirty(true);
  };

  const updateStep = (index: number, field: keyof WorkflowProcessItem, value: string) => {
    setWorkflow((current) => {
      const steps = [...current.steps];
      steps[index] = {
        ...steps[index],
        [field]: value,
      };
      return { ...current, steps };
    });
    setIsDirty(true);
  };

  const addStep = () => {
    const nextIndex = workflow.steps.length;
    setWorkflow((current) => ({
      ...current,
      steps: [...current.steps, { title: "Yeni Adım", description: "Adım açıklaması", icon: "Sparkles" }],
    }));
    setExpandedStepIndex(nextIndex);
    setIsDirty(true);
  };

  const removeStep = (index: number) => {
    setWorkflow((current) => ({
      ...current,
      steps: current.steps.filter((_, itemIndex) => itemIndex !== index),
    }));
    setIsDirty(true);
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    setWorkflow((current) => {
      const steps = [...current.steps];
      const target = direction === "up" ? index - 1 : index + 1;

      if (target < 0 || target >= steps.length) return current;

      [steps[index], steps[target]] = [steps[target], steps[index]];
      return { ...current, steps };
    });
    setIsDirty(true);
  };

  const resetToDefault = () => {
    const fallback = createDefaultDraft(selectedScope);
    setWorkflow(fallback);
    setExpandedStepIndex(0);
    setIsDirty(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setApiError(null);

    try {
      const res = await fetch("/api/workflow", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scope: selectedScope.key,
          title: workflow.title,
          steps: workflow.steps,
        }),
      });

      if (!res.ok) {
        throw new Error(`PUT /api/workflow failed with ${res.status}`);
      }

      const data = await res.json();
      const draft = workflowDraftFromRecord(
        data,
        defaultWorkflowTitleForScope(selectedScope),
        DEFAULT_WORKFLOW_STEPS,
      );

      setWorkflow(cloneDraft(draft));

      setIsDirty(false);
      showToast("Workflow başarıyla güncellendi.", "success");
    } catch (error) {
      console.error("Workflow save error:", error);
      setApiError("Kaydetme sırasında bir API hatası oluştu.");
      showToast("Workflow kaydedilemedi.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const saveDisabled = isLoading || isScopeLoading || isSaving || !isDirty;

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-[color:var(--text-muted)]">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm">
          <Loader2 className="h-4 w-4 animate-spin text-[color:var(--accent)]" />
          Workflow içerikleri yükleniyor
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(166,137,102,0.14),_transparent_25%),radial-gradient(circle_at_top_right,_rgba(255,255,255,0.06),_transparent_28%),linear-gradient(180deg,_rgba(8,8,10,0.98),_rgba(11,12,16,0.96))]" />
      <div className="absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_center,_rgba(166,137,102,0.12),_transparent_60%)] blur-3xl" />

      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-8">
        <Card className="border-white/10 bg-white/[0.04]">
          <CardHeader className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge>İş Akışları</Badge>
              <Badge variant={isDirty ? "default" : "secondary"}>{isDirty ? "Kaydedilmemiş değişiklik" : "Senkronize"}</Badge>
              <Badge variant={apiError ? "outline" : "secondary"}>{apiError ? "API uyarısı" : "API bağlantısı aktif"}</Badge>
            </div>

            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] lg:items-end">
              <div className="space-y-3">
                <CardTitle className="text-3xl tracking-[0.08em] text-zinc-50 md:text-5xl">
                  Workflow editörü
                </CardTitle>
                <CardDescription className="max-w-3xl text-base text-zinc-400">
                  Ana sayfa akışları ile departman akışlarını ayrı modlarda yönetin.
                  Aynı ekranda karışmadan, yalnızca seçtiğiniz kümedeki akışları düzenleyin.
                </CardDescription>
              </div>

              <div className="grid gap-3 rounded-3xl border border-white/10 bg-black/20 p-4 text-xs uppercase tracking-[0.22em] text-zinc-400">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono">{selectedScope.kind === "page" ? "PAGE" : "DEPARTMENT"} / {selectedScope.route}</span>
                  <FileText className="h-4 w-4 text-[color:var(--accent)]" />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono">{selectedScope.label}</span>
                  <Workflow className="h-4 w-4 text-emerald-400" />
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono">{activeScopeMode === "page" ? "ANA SAYFA" : "DEPARTMAN"}</span>
                  <span className="text-[0.62rem] tracking-[0.28em] text-zinc-500">
                    {activeScopeMode === "page" ? `${PAGE_SCOPES.length} akış` : `${DEPARTMENT_SCOPES.length} akış`}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {apiError && (
          <Card className="border-amber-400/20 bg-amber-400/5">
            <CardContent className="flex items-start gap-3 p-5">
              <div className="mt-0.5 rounded-full border border-amber-400/20 bg-amber-400/10 p-2 text-amber-300">
                <Layers3 className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-zinc-100">API uyarısı</p>
                <p className="text-sm text-zinc-400">{apiError}</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(280px,0.72fr)_minmax(0,1.28fr)]">
          <Card className="border-white/10 bg-white/[0.04] xl:sticky xl:top-6 xl:h-fit">
            <CardHeader className="space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl tracking-[0.06em]">Akış seçici</CardTitle>
                  <CardDescription>Sadece seçili modun akışlarını görün.</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => void loadScope(selectedScope)}
                  className="border-white/10 bg-white/[0.03]"
                >
                  <RefreshCcw className={cn("h-4 w-4", isScopeLoading && "animate-spin")} />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/20 p-2">
                <Button
                  type="button"
                  variant={activeScopeMode === "page" ? "default" : "ghost"}
                  onClick={() => switchScopeMode("page")}
                  className={cn(
                    "h-11 justify-center",
                    activeScopeMode === "page"
                      ? "bg-[color:var(--accent)] text-black hover:bg-[color:var(--accent)]/90"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50",
                  )}
                >
                  Ana Sayfa
                </Button>
                <Button
                  type="button"
                  variant={activeScopeMode === "department" ? "default" : "ghost"}
                  onClick={() => switchScopeMode("department")}
                  className={cn(
                    "h-11 justify-center",
                    activeScopeMode === "department"
                      ? "bg-[color:var(--accent)] text-black hover:bg-[color:var(--accent)]/90"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-50",
                  )}
                >
                  Departmanlar
                </Button>
              </div>

              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={activeScopeMode === "page" ? "Ana sayfa akışı ara..." : "Departman akışı ara..."}
                  className="h-12 border-white/10 bg-black/20 pl-9 text-zinc-100 placeholder:text-zinc-500"
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-5">
              {groupedScopes.map((group) => (
                <div key={group.title} className="space-y-3">
                  <div className="flex items-center gap-2 text-[0.68rem] uppercase tracking-[0.32em] text-[color:var(--accent)]">
                    <span>{group.title}</span>
                    <Separator className="flex-1 bg-white/10" />
                  </div>

                  <div className="space-y-2">
                    {group.scopes.map((scope) => {
                      const active = scope.key === selectedScope.key;

                      return (
                        <button
                          key={scope.key}
                          type="button"
                          onClick={() => setSelectedScopeKey(scope.key)}
                          className={cn(
                            "flex w-full flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition-all",
                            active
                              ? "border-[color:var(--accent)] bg-[color:rgba(166,137,102,0.12)] text-zinc-50"
                              : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.05]",
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-semibold tracking-[0.06em]">{scope.label}</span>
                            <Badge variant={scope.kind === "page" ? "secondary" : "outline"}>
                              {scope.kind === "page" ? "PAGE" : "DETAIL"}
                            </Badge>
                          </div>
                          <p className="text-xs leading-5 text-zinc-500">{scope.description}</p>
                          <span className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                            {scope.route}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {groupedScopes.length === 0 && (
                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-8 text-center text-sm text-zinc-500">
                  Bu modda eşleşen akış bulunamadı.
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.04]">
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-2xl tracking-[0.06em]">{selectedScope.label}</CardTitle>
                    <CardDescription className="max-w-2xl">{selectedScope.description}</CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={resetToDefault} variant="outline" className="border-white/10 bg-white/[0.03]">
                      <Copy className="mr-2 h-4 w-4" />
                      Varsayılanı Yükle
                    </Button>
                    <Button
                      onClick={() => setWorkflow((current) => cloneDraft({ ...current, steps: normalizeWorkflowSteps(current.steps) }))}
                      variant="outline"
                      className="border-white/10 bg-white/[0.03]"
                    >
                      <RefreshCcw className="mr-2 h-4 w-4" />
                      Temizle
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={saveDisabled}
                      className="bg-[color:var(--accent)] text-black hover:bg-[color:var(--accent)]/90"
                    >
                      {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                      Kaydet
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                    Workflow başlığı
                  </label>
                  <Input
                    value={workflow.title}
                    onChange={(event) => updateTitle(event.target.value)}
                    placeholder="İŞ AKIŞI"
                    className="border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>

                <div className="flex items-center justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-500">Adım listesi</p>
                    <p className="text-sm text-zinc-400">
                      Her adımı tek tek açarak düzenleyin, geri kalanını kompakt özet halinde bırakın.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setExpandedStepIndex(null)}
                      className="border-white/10 bg-white/[0.03]"
                    >
                      Tümünü daralt
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setExpandedStepIndex(0)}
                      className="border-white/10 bg-white/[0.03]"
                    >
                      İlkini aç
                    </Button>
                    <Button
                      onClick={addStep}
                      className="bg-[color:var(--accent)] text-black hover:bg-[color:var(--accent)]/90"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Adım ekle
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <AnimatePresence initial={false}>
                    {workflow.steps.map((step, index) => {
                      const StepIcon = resolveWorkflowIconComponent(step.icon, index);
                      const isKnownIcon = WORKFLOW_ICON_OPTIONS.some((option) => option.key === step.icon);
                      const isExpanded = expandedStepIndex === index;

                      return (
                        <motion.div
                          key={`${step.title}-${index}`}
                          layout
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          className={cn(
                            "rounded-3xl border p-4 transition-all",
                            isExpanded
                              ? "border-[color:var(--accent)] bg-[color:rgba(166,137,102,0.08)]"
                              : "border-white/10 bg-black/20 hover:border-white/20",
                          )}
                        >
                          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Adım {String(index + 1).padStart(2, "0")}</Badge>
                              <Badge variant="outline">{step.icon || "CalendarDays"}</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => setExpandedStepIndex(isExpanded ? null : index)}
                                className="h-8 border-white/10 bg-white/[0.03] px-3 text-xs"
                              >
                                {isExpanded ? "Daralt" : "Düzenle"}
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                disabled={index === 0}
                                onClick={() => moveStep(index, "up")}
                                className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                              >
                                <ArrowUp className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                disabled={index === workflow.steps.length - 1}
                                onClick={() => moveStep(index, "down")}
                                className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                              >
                                <ArrowDown className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() => removeStep(index)}
                                className="h-8 px-3 text-zinc-400 hover:bg-white/5 hover:text-red-300"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Sil
                                </Button>
                              </div>
                            </div>

                          {!isExpanded ? (
                            <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[minmax(0,1fr)_240px]">
                              <div className="min-w-0 space-y-2">
                                <h4 className="text-base font-semibold tracking-[0.06em] text-zinc-50">
                                  {step.title || "Başlıksız adım"}
                                </h4>
                                <p className="line-clamp-2 text-sm leading-6 text-zinc-400">
                                  {step.description || "Açıklama girilmedi."}
                                </p>
                              </div>

                              <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[color:var(--accent)]">
                                    <StepIcon className="h-5 w-5" />
                                  </div>
                                  <div className="space-y-1">
                                    <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">İkon</p>
                                    <p className="text-sm text-zinc-200">{step.icon || "CalendarDays"}</p>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  onClick={() => setExpandedStepIndex(index)}
                                  className="h-8 px-3 text-zinc-300 hover:bg-white/5 hover:text-zinc-50"
                                >
                                  Aç
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
                              <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                  <label className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                                    Başlık
                                  </label>
                                  <Input
                                    value={step.title}
                                    onChange={(event) => updateStep(index, "title", event.target.value)}
                                    placeholder="Randevu"
                                    className="border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                                    Açıklama
                                  </label>
                                  <Textarea
                                    value={step.description}
                                    onChange={(event) => updateStep(index, "description", event.target.value)}
                                    placeholder="Kısa açıklama..."
                                    className="min-h-[120px] border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                                  />
                                </div>
                              </div>

                              <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-zinc-400">
                                  <Settings2 className="h-4 w-4 text-[color:var(--accent)]" />
                                  İkon
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-[color:var(--accent)]">
                                    <StepIcon className="h-6 w-6" />
                                  </div>

                                  <div className="min-w-0 flex-1 space-y-2">
                                    <Select
                                      value={isKnownIcon ? step.icon : ""}
                                      onChange={(event) => updateStep(index, "icon", event.target.value)}
                                      className="border-white/10 bg-black/20 text-zinc-100"
                                    >
                                      <option value="" disabled>
                                        Hazır ikon seç
                                      </option>
                                      {WORKFLOW_ICON_OPTIONS.map((option) => (
                                        <option key={option.key} value={option.key}>
                                          {option.label} - {option.description}
                                        </option>
                                      ))}
                                    </Select>
                                    <p className="text-[11px] leading-5 text-zinc-500">
                                      Lucide export adını yazabilir veya üstteki listeden seçim yapabilirsiniz.
                                    </p>
                                  </div>
                                </div>

                                <Input
                                  value={step.icon}
                                  onChange={(event) => updateStep(index, "icon", event.target.value)}
                                  placeholder="CalendarDays"
                                  className="border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                                />
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
              <Card className="border-white/10 bg-white/[0.04]">
                <CardHeader>
                  <CardTitle className="text-lg tracking-[0.06em]">Önizleme</CardTitle>
                  <CardDescription>
                    Kaydetmeden önce workflow düzenini ve okunabilirliği kontrol edin.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {workflow.steps.map((step, index) => (
                    <div
                      key={`preview-${step.title}-${index}`}
                      className="rounded-2xl border border-white/10 bg-black/20 p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <Badge variant="secondary">Adım {String(index + 1).padStart(2, "0")}</Badge>
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[color:var(--accent)]">
                          {(() => {
                            const Icon = resolveWorkflowIconComponent(step.icon, index);
                            return <Icon className="h-4 w-4" />;
                          })()}
                        </div>
                        <span className="text-[0.62rem] uppercase tracking-[0.24em] text-zinc-500">
                          {selectedScope.kind === "page" ? "PAGE" : "DETAIL"}
                        </span>
                      </div>
                      <h4 className="mt-3 text-base font-semibold tracking-[0.06em] text-zinc-50">
                        {step.title || "Başlıksız adım"}
                      </h4>
                      <p className="mt-2 text-sm leading-7 text-zinc-400">
                        {step.description || "Açıklama girilmedi."}
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-white/10 bg-white/[0.04]">
                <CardHeader>
                  <CardTitle className="text-lg tracking-[0.06em]">Kayıt özeti</CardTitle>
                  <CardDescription>Seçili workflow&apos;un son durumunu burada kontrol edin.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-500">Hedef</span>
                      <span className="text-zinc-100">{selectedScope.route}</span>
                    </div>
                    <Separator className="my-3 bg-white/10" />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-500">Adım sayısı</span>
                      <span className="text-zinc-100">{workflow.steps.length}</span>
                    </div>
                    <Separator className="my-3 bg-white/10" />
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-zinc-500">Durum</span>
                      <span className={isDirty ? "text-amber-300" : "text-emerald-300"}>
                        {isDirty ? "Taslak" : "Yayına hazır"}
                      </span>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-500">
                    Aynı workflow şablonunu koruyup sadece seçili sayfa veya departman için değişiklik yapabilirsiniz.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

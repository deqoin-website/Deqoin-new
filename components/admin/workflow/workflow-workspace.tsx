"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Loader2, Plus, RefreshCcw, Save, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  DEFAULT_WORKFLOW_STEPS,
  DEFAULT_WORKFLOW_TITLE,
  WORKFLOW_ICON_OPTIONS,
  cloneWorkflowDraft,
  normalizeWorkflowSteps,
  resolveWorkflowIconComponent,
  type WorkflowContentDraft,
  type WorkflowProcessItem,
  workflowDraftFromRecord,
} from "@/lib/workflow-content";
import { type WorkflowApiResponse } from "@/lib/workflow-api";
import { getWorkflowPageAncestors, getWorkflowPageNode } from "@/lib/workflow-pages";
import { cn } from "@/lib/utils";

type WorkflowWorkspaceProps = {
  scope: string;
  onSave: (scope: string, draft: WorkflowContentDraft) => Promise<WorkflowApiResponse>;
  onLoad: (scope: string) => Promise<WorkflowApiResponse>;
  onDirtyChange?: (dirty: boolean) => void;
  refreshToken?: number;
};

const defaultWorkflowTitleForScope = (scope: string, label: string) =>
  scope === "/" ? DEFAULT_WORKFLOW_TITLE : `${label.toUpperCase()} AKIŞI`;

export function WorkflowWorkspace({ scope, onSave, onLoad, onDirtyChange, refreshToken = 0 }: WorkflowWorkspaceProps) {
  const selectedPage = useMemo(() => getWorkflowPageNode(scope), [scope]);
  const ancestors = useMemo(() => getWorkflowPageAncestors(scope), [scope]);
  const [workflow, setWorkflow] = useState<WorkflowContentDraft>(() =>
    cloneWorkflowDraft({
      title: defaultWorkflowTitleForScope(scope, selectedPage.label),
      steps: DEFAULT_WORKFLOW_STEPS,
    }),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedStepIndex, setExpandedStepIndex] = useState<number | null>(0);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await onLoad(scope);
        if (!active) return;

        const draft = workflowDraftFromRecord(
          data,
          defaultWorkflowTitleForScope(scope, selectedPage.label),
          DEFAULT_WORKFLOW_STEPS,
        );
        setWorkflow(cloneWorkflowDraft(draft));
        setExpandedStepIndex(0);
        setIsDirty(false);
      } catch (exception) {
        if (!active) return;
        const fallback = {
          title: defaultWorkflowTitleForScope(scope, selectedPage.label),
          steps: DEFAULT_WORKFLOW_STEPS,
        };
        setWorkflow(cloneWorkflowDraft(fallback));
        setExpandedStepIndex(0);
        setError(exception instanceof Error ? exception.message : "Workflow yüklenemedi.");
        setIsDirty(false);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      active = false;
    };
  }, [onLoad, refreshToken, scope, selectedPage.label]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  const updateTitle = (value: string) => {
    setWorkflow((current) => ({ ...current, title: value }));
    setIsDirty(true);
  };

  const updateStep = (index: number, field: keyof WorkflowProcessItem, value: string) => {
    setWorkflow((current) => {
      const nextSteps = [...current.steps];
      nextSteps[index] = { ...nextSteps[index], [field]: value };
      return { ...current, steps: nextSteps };
    });
    setIsDirty(true);
  };

  const addStep = () => {
    setWorkflow((current) => ({
      ...current,
      steps: [...current.steps, { title: "Yeni Adım", description: "Adım açıklaması", icon: "Sparkles" }],
    }));
    setExpandedStepIndex(workflow.steps.length);
    setIsDirty(true);
  };

  const removeStep = (index: number) => {
    setWorkflow((current) => ({
      ...current,
      steps: current.steps.filter((_, currentIndex) => currentIndex !== index),
    }));
    setExpandedStepIndex((current) => {
      if (current === null) return current;
      if (current === index) return null;
      return current > index ? current - 1 : current;
    });
    setIsDirty(true);
  };

  const moveStep = (index: number, direction: "up" | "down") => {
    setWorkflow((current) => {
      const nextSteps = [...current.steps];
      const target = direction === "up" ? index - 1 : index + 1;
      if (target < 0 || target >= nextSteps.length) return current;
      [nextSteps[index], nextSteps[target]] = [nextSteps[target], nextSteps[index]];
      return { ...current, steps: nextSteps };
    });
    setExpandedStepIndex((current) => {
      if (current === null) return current;
      if (current === index) return direction === "up" ? index - 1 : index + 1;
      if (current === (direction === "up" ? index - 1 : index + 1)) return index;
      return current;
    });
    setIsDirty(true);
  };

  const resetToDefault = () => {
    setWorkflow(
      cloneWorkflowDraft({
        title: defaultWorkflowTitleForScope(scope, selectedPage.label),
        steps: DEFAULT_WORKFLOW_STEPS,
      }),
    );
    setExpandedStepIndex(0);
    setIsDirty(true);
  };

  const normalizeDraft = () =>
    setWorkflow((current) => ({
      ...current,
      steps: normalizeWorkflowSteps(current.steps, DEFAULT_WORKFLOW_STEPS),
    }));

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const saved = await onSave(scope, workflow);
      const draft = workflowDraftFromRecord(
        saved,
        defaultWorkflowTitleForScope(scope, selectedPage.label),
        DEFAULT_WORKFLOW_STEPS,
      );
      setWorkflow(cloneWorkflowDraft(draft));
      setIsDirty(false);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : "Workflow kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  const summary = useMemo(
    () => ({
      breadcrumb: ["Ana Sayfa", ...ancestors.map((item) => item.label), selectedPage.label].join(" / "),
      type: selectedPage.children?.length ? "group" : "page",
      route: selectedPage.route,
      title: selectedPage.label,
      descendants: selectedPage.children?.length || 0,
    }),
    [ancestors, selectedPage],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm text-zinc-300">
          <Loader2 className="h-4 w-4 animate-spin text-[color:var(--admin-accent)]" />
          Workflow yükleniyor
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.78),rgba(2,6,23,0.58))]">
        <CardHeader className="space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-[color:rgba(245,158,11,0.12)] text-[color:var(--admin-accent)]">Workflow</Badge>
            <Badge variant={isDirty ? "default" : "secondary"}>{isDirty ? "Taslak" : "Senkronize"}</Badge>
            <Badge variant={error ? "outline" : "secondary"}>{error ? "Hata" : "API aktif"}</Badge>
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)] xl:items-end">
            <div className="space-y-3">
              <CardTitle className="text-3xl tracking-[0.06em] text-white md:text-5xl">{selectedPage.label}</CardTitle>
              <CardDescription className="max-w-3xl text-base text-zinc-400">{selectedPage.description}</CardDescription>
            </div>

            <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-xs uppercase tracking-[0.24em] text-zinc-400">
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono text-zinc-200">{summary.route}</span>
                <span className="text-[0.62rem] tracking-[0.28em] text-[color:var(--admin-accent)]">{summary.type}</span>
              </div>
              <Separator className="my-3 bg-white/10" />
              <div className="flex items-center justify-between gap-4">
                <span className="font-mono">{summary.title}</span>
                <span className="text-[0.62rem] tracking-[0.28em] text-zinc-500">{summary.descendants} alt sayfa</span>
              </div>
              <Separator className="my-3 bg-white/10" />
              <p className="text-[0.62rem] leading-5 tracking-[0.22em] text-zinc-500">{summary.breadcrumb}</p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {error ? (
        <Card className="border-amber-400/20 bg-amber-400/5">
          <CardContent className="p-5 text-sm text-amber-100">{error}</CardContent>
        </Card>
      ) : null}

      <Card className="border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.74),rgba(2,6,23,0.54))]">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <CardTitle className="text-xl tracking-[0.06em] text-white">Akış düzenleme</CardTitle>
              <CardDescription className="text-zinc-400">Her sayfa için bağımsız workflow kaydı.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={resetToDefault} className="border-white/10 bg-white/[0.03] text-zinc-200">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Varsayılana dön
              </Button>
              <Button variant="outline" onClick={normalizeDraft} className="border-white/10 bg-white/[0.03] text-zinc-200">
                Temizle
              </Button>
              <Button onClick={handleSave} disabled={isSaving} className="bg-[color:var(--admin-accent)] text-black hover:bg-[color:var(--admin-accent)]/90">
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Kaydet
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Workflow başlığı</label>
            <Input
              value={workflow.title}
              onChange={(event) => updateTitle(event.target.value)}
              placeholder={DEFAULT_WORKFLOW_TITLE}
              className="h-12 border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.24em] text-zinc-500">Adımlar</p>
              <p className="text-sm text-zinc-400">Sıralama, ikon ve içerik ayrı ayrı düzenlenir.</p>
            </div>
            <Button onClick={addStep} className="bg-[color:var(--admin-accent)] text-black hover:bg-[color:var(--admin-accent)]/90">
              <Plus className="mr-2 h-4 w-4" />
              Adım ekle
            </Button>
          </div>

          <div className="space-y-4">
            {workflow.steps.map((step, index) => {
              const StepIcon = resolveWorkflowIconComponent(step.icon, index);
              const isExpanded = expandedStepIndex === index;
              const isKnownIcon = WORKFLOW_ICON_OPTIONS.some((option) => option.key === step.icon);

              return (
                <div
                  key={`${selectedPage.route}-${index}-${step.title}`}
                  className={cn(
                    "rounded-3xl border p-4 transition-all",
                    isExpanded
                      ? "border-[color:rgba(245,158,11,0.24)] bg-[color:rgba(245,158,11,0.08)]"
                      : "border-white/10 bg-black/20 hover:border-white/20",
                  )}
                >
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Adım {String(index + 1).padStart(2, "0")}</Badge>
                      <Badge variant="outline">{step.icon}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setExpandedStepIndex(isExpanded ? null : index)}
                        className="h-8 border-white/10 bg-white/[0.03] px-3 text-xs text-zinc-200"
                      >
                        {isExpanded ? "Daralt" : "Düzenle"}
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={index === 0}
                        onClick={() => moveStep(index, "up")}
                        className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-white"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={index === workflow.steps.length - 1}
                        onClick={() => moveStep(index, "down")}
                        className="h-8 w-8 text-zinc-400 hover:bg-white/5 hover:text-white"
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
                      <div className="space-y-2">
                        <h4 className="text-base font-semibold tracking-[0.05em] text-white">{step.title || "Başlıksız adım"}</h4>
                        <p className="line-clamp-2 text-sm leading-6 text-zinc-400">{step.description || "Açıklama girilmedi."}</p>
                      </div>
                      <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-[color:var(--admin-accent)]">
                            <StepIcon className="h-5 w-5" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[0.62rem] uppercase tracking-[0.22em] text-zinc-500">İkon</p>
                            <p className="text-sm text-zinc-200">{step.icon}</p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setExpandedStepIndex(index)}
                          className="h-8 px-3 text-zinc-300 hover:bg-white/5 hover:text-white"
                        >
                          Aç
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Başlık</label>
                          <Input
                            value={step.title}
                            onChange={(event) => updateStep(index, "title", event.target.value)}
                            className="border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                            placeholder="Randevu"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-400">Açıklama</label>
                          <Textarea
                            value={step.description}
                            onChange={(event) => updateStep(index, "description", event.target.value)}
                            className="min-h-[120px] border-white/10 bg-black/20 text-zinc-100 placeholder:text-zinc-500"
                            placeholder="Adım açıklaması..."
                          />
                        </div>
                      </div>

                      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-zinc-400">
                          <StepIcon className="h-4 w-4 text-[color:var(--admin-accent)]" />
                          İkon
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-black/30 text-[color:var(--admin-accent)]">
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
                            <p className="text-[11px] leading-5 text-zinc-500">Lucide export adını manuel girebilirsiniz.</p>
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
                </div>
              );
            })}
          </div>

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <Card className="border-white/10 bg-white/[0.03]">
              <CardHeader>
                <CardTitle className="text-lg tracking-[0.06em] text-white">Önizleme</CardTitle>
                <CardDescription className="text-zinc-400">Kaydetmeden önce iş akışı düzenini kontrol edin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {workflow.steps.map((step, index) => (
                  <div key={`preview-${selectedPage.route}-${index}-${step.title}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Badge variant="secondary">Adım {String(index + 1).padStart(2, "0")}</Badge>
                      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[color:var(--admin-accent)]">
                        {(() => {
                          const Icon = resolveWorkflowIconComponent(step.icon, index);
                          return <Icon className="h-4 w-4" />;
                        })()}
                      </div>
                    </div>
                    <h4 className="mt-3 text-base font-semibold tracking-[0.05em] text-white">{step.title || "Başlıksız adım"}</h4>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">{step.description || "Açıklama girilmedi."}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.03]">
              <CardHeader>
                <CardTitle className="text-lg tracking-[0.06em] text-white">Kayıt özeti</CardTitle>
                <CardDescription className="text-zinc-400">Seçili sayfanın son durumunu burada kontrol edin.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-500">Hedef</span>
                    <span className="text-zinc-100">{selectedPage.route}</span>
                  </div>
                  <Separator className="my-3 bg-white/10" />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-500">Adım sayısı</span>
                    <span className="text-zinc-100">{workflow.steps.length}</span>
                  </div>
                  <Separator className="my-3 bg-white/10" />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-zinc-500">Durum</span>
                    <span className={isDirty ? "text-amber-300" : "text-emerald-300"}>{isDirty ? "Taslak" : "Yayına hazır"}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-500">
                  Bu workflow yalnızca {selectedPage.label} sayfasını etkiler. Diğer sayfalar bağımsız kalır.
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { DEFAULT_WORKFLOW_STEPS, getWorkflowFallbackDraftForScope } from "@/lib/workflow-content";

describe("workflow presets", () => {
  it("keeps legacy defaults for home and material landing pages", () => {
    expect(getWorkflowFallbackDraftForScope("/").steps).toEqual(DEFAULT_WORKFLOW_STEPS);
    expect(getWorkflowFallbackDraftForScope("/materyal-studyo").steps).toEqual(DEFAULT_WORKFLOW_STEPS);
  });

  it("returns simple page-specific steps for public pages", () => {
    expect(getWorkflowFallbackDraftForScope("/galeri").steps[0]?.title).toBe("Filtrele");
    expect(getWorkflowFallbackDraftForScope("/journal").steps[0]?.title).toBe("Ara");
    expect(getWorkflowFallbackDraftForScope("/hakkimizda").steps[0]?.title).toBe("Tanışma");
  });

  it("uses parent presets for nested department pages", () => {
    expect(getWorkflowFallbackDraftForScope("/mimari/mimarlik").steps[0]?.title).toBe("İhtiyaç");
    expect(getWorkflowFallbackDraftForScope("/uygulama/boya-ekipleri").steps[0]?.title).toBe("Ekip");
  });
});

import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { WorkflowWorkspace } from "@/components/admin/workflow";
import { DEFAULT_WORKFLOW_STEPS } from "@/lib/workflow-content";

describe("WorkflowWorkspace", () => {
  it("fetches workflow data for the selected page and saves it for the same page", async () => {
    const onLoad = jest.fn().mockResolvedValue({
      scope: "/mimari",
      route: "/mimari",
      label: "Mimari",
      description: "Mimari ana sayfası",
      title: "Mimari Akışı",
      steps: DEFAULT_WORKFLOW_STEPS,
      source: "workflow",
    });
    const onSave = jest.fn().mockResolvedValue({
      scope: "/mimari",
      route: "/mimari",
      label: "Mimari",
      description: "Mimari ana sayfası",
      title: "Mimari Akışı",
      steps: DEFAULT_WORKFLOW_STEPS,
      source: "workflow",
    });

    render(<WorkflowWorkspace scope="/mimari" onLoad={onLoad} onSave={onSave} />);

    await waitFor(() => {
      expect(onLoad).toHaveBeenCalledWith("/mimari");
    });

    await screen.findByRole("button", { name: /kaydet/i });
    fireEvent.click(screen.getByRole("button", { name: /kaydet/i }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        "/mimari",
        expect.objectContaining({
          title: "Mimari Akışı",
        }),
      );
    });
  });

  it("reloads when the selected scope changes", async () => {
    const onLoad = jest.fn().mockResolvedValue({
      scope: "/mimari",
      route: "/mimari",
      label: "Mimari",
      description: "Mimari ana sayfası",
      title: "Mimari Akışı",
      steps: DEFAULT_WORKFLOW_STEPS,
      source: "workflow",
    });
    const onSave = jest.fn().mockResolvedValue({
      scope: "/uygulama",
      route: "/uygulama",
      label: "Uygulama",
      description: "Uygulama ana sayfası",
      title: "Uygulama Akışı",
      steps: DEFAULT_WORKFLOW_STEPS,
      source: "workflow",
    });

    const { rerender } = render(<WorkflowWorkspace scope="/mimari" onLoad={onLoad} onSave={onSave} />);

    await waitFor(() => expect(onLoad).toHaveBeenCalledWith("/mimari"));

    rerender(<WorkflowWorkspace scope="/uygulama" onLoad={onLoad} onSave={onSave} />);

    await waitFor(() => expect(onLoad).toHaveBeenCalledWith("/uygulama"));
  });
});

import { fireEvent, render, screen } from "@testing-library/react";

import { WorkflowSidebar } from "@/components/admin/workflow";
import { WORKFLOW_PAGE_GROUPS } from "@/lib/workflow-pages";

describe("WorkflowSidebar", () => {
  it("renders hierarchical pages and child routes", () => {
    render(
      <WorkflowSidebar
        groups={WORKFLOW_PAGE_GROUPS}
        activeRoute="/mimari/mimarlik"
        onSelectRoute={() => {}}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    expect(screen.getAllByText("Mimari").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Mimarlık").length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole("button", { name: "Materyal Stüdyo alt öğelerini aç" }));
    expect(screen.getAllByText("Mobilya").length).toBeGreaterThan(0);
  });

  it("calls navigation handler when a nested page is clicked", () => {
    const onSelectRoute = jest.fn();

    render(
      <WorkflowSidebar
        groups={WORKFLOW_PAGE_GROUPS}
        activeRoute="/materyal-studyo/mobilya"
        onSelectRoute={onSelectRoute}
        searchValue=""
        onSearchChange={() => {}}
      />,
    );

    fireEvent.click(screen.getByText("Mobilya"));

    expect(onSelectRoute).toHaveBeenCalledWith("/materyal-studyo/mobilya");
  });
});

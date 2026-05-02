"use client";

import WorkflowSection from "@/components/WorkflowSection";
import { useWorkflowContent } from "@/components/useWorkflowContent";

type PageWorkflowSectionProps = {
  scope: string;
  className?: string;
  title?: string;
};

export default function PageWorkflowSection({ scope, className, title }: PageWorkflowSectionProps) {
  const { workflow } = useWorkflowContent(scope);

  return (
    <div className={className}>
      <WorkflowSection title={title || workflow.title} steps={workflow.steps} />
    </div>
  );
}

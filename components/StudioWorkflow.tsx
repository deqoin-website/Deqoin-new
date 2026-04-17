"use client";

import Link from "next/link";

export interface WorkflowStep {
  id: string;
  icon: string;
  title: string;
  detail: string;
  href: string;
  action?: () => void;
}

interface StudioWorkflowProps {
  steps: WorkflowStep[];
  title?: string;
}

export default function StudioWorkflow({ steps, title = "İŞ AKIŞI" }: StudioWorkflowProps) {
  return (
    <section className="process-section snap-section">
      <div className="process-header">
        <h2>{title}</h2>
        <div className="section-line" />
      </div>

      <div className="process-timeline">
        {steps.map((step, idx) => (
          <Link 
            key={idx} 
            href={step.href} 
            className="process-step"
            onClick={(e) => {
              if (step.action) {
                e.preventDefault();
                step.action();
              }
            }}
          >
            <div className="step-number">
              <span
                className="material-symbols-outlined step-icon"
                style={{ fontVariationSettings: "'FILL' 0, 'wght' 200, 'opsz' 24" }}
              >
                {step.icon}
              </span>
              <span className="step-id">{step.id}</span>
            </div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.detail}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

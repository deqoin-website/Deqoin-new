"use client";

import React from "react";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
};

const workflowSteps: WorkflowStep[] = [
  { id: "01", title: "RANDEVU", description: "Kusursuz sürecin ilk adımı." },
  { id: "02", title: "KEŞİF", description: "İhtiyaçları ve potansiyeli yerinde okuruz." },
  { id: "03", title: "TASARIM", description: "Vizyonu mimari bir dile dönüştürürüz." },
  { id: "04", title: "MALZEME", description: "Doku, kalite ve karakteri seçeriz." },
  { id: "05", title: "UYGULAMA", description: "Tasarıyı sahada gerçeğe dönüştürürüz." },
];

type WorkflowMarqueeProps = {
  steps?: WorkflowStep[];
  title?: string;
  speed?: number;
  className?: string;
};

export default function WorkflowMarquee({
  steps = workflowSteps,
  title = "İŞ AKIŞI",
  speed = 34,
  className = "",
}: WorkflowMarqueeProps) {
  const repeatedSteps = React.useMemo(() => [...steps, ...steps], [steps]);
  const [paused, setPaused] = React.useState(false);

  return (
    <section
      style={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#080808",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
      }}
      className={className}
    >
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginBottom: "3rem",
        }}
      >
        <h2
          style={{
            fontSize: "2.25rem",
            fontWeight: 300,
            letterSpacing: "0.25em",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            width: "3rem",
            height: "1px",
            backgroundColor: "rgba(255,255,255,0.5)",
            margin: "1rem auto 0",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          style={{
            display: "flex",
            gap: "1.5rem",
            width: "max-content",
            paddingLeft: "1rem",
            paddingRight: "1rem",
            animationName: "workflowMarqueeLeft",
            animationDuration: `${Math.max(18, speed)}s`,
            animationTimingFunction: "linear",
            animationIterationCount: "infinite",
            animationPlayState: paused ? "paused" : "running",
            willChange: "transform",
          }}
        >
          {repeatedSteps.map((step, index) => (
            <article
              key={`${step.id}-${index}`}
              style={{
                width: "320px",
                minWidth: "320px",
                height: "500px",
                flexShrink: 0,
                position: "relative",
                backgroundColor: "#18181b",
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "#111111",
                  transform: "scale(1)",
                  transition: "transform 700ms ease",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.8), transparent)",
                }}
              />

              <div
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: 0,
                  width: "100%",
                  padding: "2rem",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "3.75rem",
                    lineHeight: 1,
                    fontWeight: 300,
                    color: "rgba(255,255,255,0.1)",
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.id}
                </span>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    margin: 0,
                    marginBottom: "0.5rem",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "#a1a1aa",
                    margin: 0,
                    lineHeight: 1.6,
                    maxWidth: "24ch",
                  }}
                >
                  {step.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes workflowMarqueeLeft {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div[style*="workflowMarqueeLeft"] {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}

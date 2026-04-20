"use client";

import React from "react";
import Link from "next/link";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  image: string;
  href?: string;
  backText?: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "Kusursuz sürecin ilk adımı.",
    image: "/images/workflow/randevu-v4.svg",
    href: "/iletisim",
    backText: "İlk temas, ihtiyaç analizi ve hedeflerin netleştiği başlangıç görüşmesi.",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "İhtiyaçları ve potansiyeli yerinde okuruz.",
    image: "/images/workflow/kesif-v4.svg",
    href: "/kesif",
    backText: "Ölçü, ışık, mevcut yapı ve potansiyel; kararları belirleyen saha okuması.",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Vizyonu mimari bir dile dönüştürürüz.",
    image: "/images/workflow/tasarim-v4.svg",
    href: "/mimari",
    backText: "Konsept, kompozisyon ve oran; markaya özel mimari dile dönüşür.",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve karakteri seçeriz.",
    image: "/images/workflow/malzeme-v4.svg",
    href: "/materyal-studyo",
    backText: "Yüzey, renk ve doku seçimi; lüks algıyı taşıyan malzeme kurgusu.",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Tasarıyı sahada gerçeğe dönüştürürüz.",
    image: "/images/workflow/uygulama-v4.svg",
    href: "/uygulama",
    backText: "Planlama, koordinasyon ve kusursuz saha yönetimi ile final teslim.",
  },
];

type WorkflowMarqueeProps = {
  steps?: WorkflowStep[];
  title?: string;
  className?: string;
};

export default function WorkflowMarquee({
  steps = workflowSteps,
  title = "İŞ AKIŞI",
  className = "",
}: WorkflowMarqueeProps) {
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const getBackCopy = (step: WorkflowStep) => {
    if (step.backText) return step.backText;
    switch (step.id) {
      case "01":
        return "İlk temas, ihtiyaç analizi ve hedeflerin netleştiği başlangıç görüşmesi.";
      case "02":
        return "Ölçü, ışık, mevcut yapı ve potansiyel; kararları belirleyen saha okuması.";
      case "03":
        return "Konsept, kompozisyon ve oran; markaya özel mimari dile dönüşür.";
      case "04":
        return "Yüzey, renk ve doku seçimi; lüks algıyı taşıyan malzeme kurgusu.";
      case "05":
        return "Planlama, koordinasyon ve kusursuz saha yönetimi ile final teslim.";
      default:
        return step.description;
    }
  };

  const getBackTag = (step: WorkflowStep) => {
    switch (step.id) {
      case "01":
        return "Discovery";
      case "02":
        return "Site Reading";
      case "03":
        return "Concept";
      case "04":
        return "Selection";
      case "05":
        return "Delivery";
      default:
        return "Workflow";
    }
  };

  const getBackKicker = (step: WorkflowStep) => {
    switch (step.id) {
      case "01":
        return "Initial briefing";
      case "02":
        return "Spatial analysis";
      case "03":
        return "Design direction";
      case "04":
        return "Material curation";
      case "05":
        return "On-site execution";
      default:
        return "Project phase";
    }
  };

  return (
    <section
      className={className}
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#080808",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        padding: "4rem 0",
      }}
    >
      <div
        style={{
          width: "100%",
          textAlign: "center",
          marginBottom: "3rem",
          padding: "0 1rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-smooch), sans-serif",
            fontSize: "clamp(4rem, 8vw, 6rem)",
            fontWeight: 100,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
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
          maxWidth: "100%",
          boxSizing: "border-box",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.5rem",
            justifyContent: "center",
            alignItems: "stretch",
            width: "100%",
            margin: "0 auto",
          }}
        >
          {steps.map((step) => {
            const isHovering = hoveredId === step.id;
            return (
              <Link
                key={step.id}
                href={step.href || "/iletisim"}
                onMouseEnter={() => setHoveredId(step.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "400px",
                  flex: "1 1 320px",
                  minHeight: "500px",
                  perspective: "1400px",
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transformStyle: "preserve-3d",
                    transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: isHovering ? "rotateY(180deg)" : "rotateY(0deg)",
                    boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      overflow: "hidden",
                      backgroundColor: "#18181b",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    <img
                      src={step.image}
                      alt={step.title}
                      style={{
                        position: "absolute",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.65), rgba(0,0,0,0))",
                      }}
                    />

                    <div
                      style={{
                        position: "absolute",
                        left: 0,
                        bottom: 0,
                        width: "100%",
                        padding: "2rem",
                        boxSizing: "border-box",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontFamily: "var(--font-smooch), sans-serif",
                          fontSize: "clamp(3rem, 6vw, 4.5rem)",
                          lineHeight: 1,
                          fontWeight: 100,
                          letterSpacing: "0.14em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.14)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {step.id}
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--font-smooch), sans-serif",
                          fontSize: "clamp(2rem, 4vw, 3rem)",
                          fontWeight: 100,
                          letterSpacing: "0.16em",
                          margin: 0,
                          marginBottom: "0.5rem",
                          textTransform: "uppercase",
                          lineHeight: 1,
                        }}
                      >
                        {step.title}
                      </h3>
                      <p
                        style={{
                          fontFamily: "var(--font-display), sans-serif",
                          fontSize: "0.8rem",
                          letterSpacing: "0.1em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.72)",
                          margin: 0,
                          lineHeight: 1.6,
                          maxWidth: "24ch",
                        }}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      overflow: "hidden",
                      background:
                        "linear-gradient(180deg, rgba(18,18,18,0.98) 0%, rgba(8,8,8,0.98) 100%)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        padding: "2rem",
                        boxSizing: "border-box",
                        minHeight: "100%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <span
                          style={{
                            display: "block",
                            fontFamily: "var(--font-smooch), sans-serif",
                            fontSize: "clamp(2rem, 4vw, 3.2rem)",
                            lineHeight: 1,
                            fontWeight: 100,
                            letterSpacing: "0.14em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.94)",
                            marginBottom: "0.75rem",
                          }}
                        >
                          {step.title}
                        </span>
                        <div
                          style={{
                            width: "4rem",
                            height: "1px",
                            backgroundColor: "rgba(255,255,255,0.24)",
                          }}
                        />
                      </div>

                      <div>
                        <span
                          style={{
                            display: "block",
                            fontFamily: "var(--font-smooch), sans-serif",
                            fontSize: "clamp(4.5rem, 9vw, 6.75rem)",
                            lineHeight: 0.9,
                            fontWeight: 100,
                            color: "rgba(255,255,255,0.08)",
                            marginBottom: "0.75rem",
                            textTransform: "uppercase",
                          }}
                        >
                          {step.id}
                        </span>

                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            marginBottom: "1rem",
                            color: "#cca883",
                            textTransform: "uppercase",
                            letterSpacing: "0.25em",
                            fontSize: "0.65rem",
                            fontWeight: 700,
                          }}
                        >
                          <span
                            style={{
                              width: "0.45rem",
                              height: "0.45rem",
                              borderRadius: "999px",
                              backgroundColor: "#cca883",
                            }}
                          />
                          {getBackTag(step)}
                        </div>

                        <p
                          style={{
                            fontFamily: "var(--font-display), sans-serif",
                            fontSize: "0.82rem",
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            lineHeight: 1.85,
                            color: "#e7e1d9",
                            margin: 0,
                            maxWidth: "28ch",
                          }}
                        >
                          {getBackCopy(step)}
                        </p>
                      </div>

                      <div
                        style={{
                          fontFamily: "var(--font-display), sans-serif",
                          fontSize: "0.68rem",
                          letterSpacing: "0.35em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.48)",
                        }}
                      >
                        {getBackKicker(step)}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

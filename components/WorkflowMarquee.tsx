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
        padding: "6rem 0",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(24,24,27,0.42) 0%, rgba(10,10,10,0.24) 38%, rgba(10,10,10,0) 70%)",
          pointerEvents: "none",
        }}
      />
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
          position: "relative",
          zIndex: 1,
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
            padding: "7rem 0",
          }}
        >
          {steps.map((step, index) => {
            const isHovering = hoveredId === step.id;
            const staggerOffset = index % 2 === 1 ? "translateY(5rem)" : "translateY(-1.5rem)";
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
                  transform: staggerOffset,
                  transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1)",
                  willChange: "transform",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    transformStyle: "preserve-3d",
                    transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: isHovering ? "rotateY(180deg)" : "rotateY(0deg)",
                    filter: "drop-shadow(0 0 18px rgba(255,255,255,0.05)) drop-shadow(0 24px 70px rgba(0,0,0,0.45))",
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
                      borderRadius: "0.75rem",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 0 24px rgba(255,255,255,0.04), 0 24px 80px rgba(0,0,0,0.45)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        overflow: "hidden",
                        borderRadius: "0.75rem",
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
                          transform: isHovering ? "scale(1.05)" : "scale(1)",
                          transition: "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
                          willChange: "transform",
                        }}
                      />
                    </div>

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.6) 52%, rgba(5,5,5,0) 100%)",
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
                          fontFamily: "var(--font-display), sans-serif",
                          fontSize: "0.78rem",
                          lineHeight: 1,
                          fontWeight: 300,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.5)",
                          marginBottom: "0.35rem",
                        }}
                      >
                        {step.id}
                      </span>
                      <h3
                        style={{
                          fontFamily: "var(--font-smooch), sans-serif",
                          fontSize: "clamp(2rem, 4vw, 3rem)",
                          fontWeight: 300,
                          letterSpacing: "0.18em",
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
                          color: "rgba(255,255,255,0.6)",
                          margin: 0,
                          lineHeight: 1.8,
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
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "0.75rem",
                      boxShadow: "0 0 0 1px rgba(255,255,255,0.03), 0 0 24px rgba(255,255,255,0.04), 0 24px 80px rgba(0,0,0,0.45)",
                      display: "flex",
                      alignItems: "stretch",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        padding: "2.5rem",
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
                            fontFamily: "var(--font-display), sans-serif",
                            fontSize: "0.78rem",
                            lineHeight: 1,
                            fontWeight: 300,
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            color: "rgba(255,255,255,0.5)",
                            marginBottom: "0.35rem",
                          }}
                        >
                          {step.id}
                        </span>
                        <span
                          style={{
                            display: "block",
                            fontFamily: "var(--font-smooch), sans-serif",
                            fontSize: "clamp(2rem, 4vw, 3.2rem)",
                            fontWeight: 300,
                            letterSpacing: "0.18em",
                            textTransform: "uppercase",
                            lineHeight: 1,
                            color: "rgba(255,255,255,0.94)",
                          }}
                        >
                          {step.title}
                        </span>
                      </div>

                      <div>
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
                            lineHeight: 1.9,
                            color: "rgba(255,255,255,0.78)",
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

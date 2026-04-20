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
    image: "/images/workflow/randevu.svg",
    href: "/iletisim",
    backText: "İlk temas, ihtiyaç analizi ve hedeflerin netleştiği başlangıç görüşmesi.",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "İhtiyaçları ve potansiyeli yerinde okuruz.",
    image: "/images/workflow/kesif.svg",
    href: "/kesif",
    backText: "Ölçü, ışık, mevcut yapı ve potansiyel; kararları belirleyen saha okuması.",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Vizyonu mimari bir dile dönüştürürüz.",
    image: "/images/workflow/tasarim.svg",
    href: "/mimari",
    backText: "Konsept, kompozisyon ve oran; markaya özel mimari dile dönüşür.",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve karakteri seçeriz.",
    image: "/images/workflow/malzeme.svg",
    href: "/materyal-studyo",
    backText: "Yüzey, renk ve doku seçimi; lüks algıyı taşıyan malzeme kurgusu.",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Tasarıyı sahada gerçeğe dönüştürürüz.",
    image: "/images/workflow/uygulama.svg",
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
            fontSize: "clamp(2rem, 4vw, 3rem)",
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
                          fontSize: "clamp(3rem, 6vw, 4.5rem)",
                          lineHeight: 1,
                          fontWeight: 300,
                          color: "rgba(255,255,255,0.14)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {step.id}
                      </span>
                      <h3
                        style={{
                          fontSize: "clamp(1.5rem, 2.3vw, 2rem)",
                          fontWeight: 500,
                          letterSpacing: "0.08em",
                          margin: 0,
                          marginBottom: "0.5rem",
                          textTransform: "uppercase",
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
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      overflow: "hidden",
                      backgroundColor: "#111111",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "flex-end",
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        padding: "2rem",
                        boxSizing: "border-box",
                      }}
                    >
                      <span
                        style={{
                          display: "block",
                          fontSize: "0.75rem",
                          letterSpacing: "0.45em",
                          textTransform: "uppercase",
                          color: "rgba(255,255,255,0.45)",
                          marginBottom: "1rem",
                        }}
                      >
                        Detay
                      </span>
                      <h4
                        style={{
                          fontSize: "1.4rem",
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          margin: 0,
                          marginBottom: "0.75rem",
                          textTransform: "uppercase",
                        }}
                      >
                        {step.title}
                      </h4>
                      <p
                        style={{
                          fontSize: "0.95rem",
                          lineHeight: 1.75,
                          color: "#d4d4d8",
                          margin: 0,
                        }}
                      >
                        {step.backText}
                      </p>
                      <div
                        style={{
                          marginTop: "1.25rem",
                          fontSize: "0.72rem",
                          letterSpacing: "0.35em",
                          textTransform: "uppercase",
                          color: "#a68966",
                        }}
                      >
                        Tıklayın ve inceleyin
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

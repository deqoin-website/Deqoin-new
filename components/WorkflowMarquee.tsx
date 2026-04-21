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
  return (
    <section
      className={className}
      style={{
        width: "100%",
        minHeight: "100svh",
        backgroundColor: "#0e0e0e",
        color: "#e5e2e1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        padding: "0 0 5rem",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.045) 0%, rgba(14,14,14,0.18) 28%, rgba(14,14,14,0.88) 72%, rgba(10,10,10,1) 100%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          textAlign: "center",
          padding: "4.4rem 1.5rem 2.3rem",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2.4rem, 4.3vw, 4.2rem)",
            fontWeight: 300,
            letterSpacing: "0.36em",
            textTransform: "uppercase",
            color: "#ffffff",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            width: "11rem",
            height: "1px",
            margin: "1.4rem auto 0",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%)",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "0 1.25rem",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
          overflow: "visible",
        }}
      >
        <div
          className="flex flex-col gap-7 md:flex-row md:justify-center md:items-start md:gap-3 lg:gap-4"
          style={{
            overflow: "visible",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          {steps.map((step, index) => {
            const offset = index % 2 === 1 ? "md:translate-y-16" : "md:-translate-y-4";
            const heights = ["28rem", "34rem", "28rem", "33rem", "29rem"];
            const cardHeight = heights[index] || "30rem";

            return (
              <div
                key={step.id}
                className={`relative overflow-visible ${offset}`}
                style={{
                  minWidth: 0,
                  width: "clamp(7.25rem, 9.5vw, 10.5rem)",
                  flex: "0 0 clamp(7.25rem, 9.5vw, 10.5rem)",
                }}
              >
                <Link
                  href={step.href || "/iletisim"}
                  className="group relative block w-full overflow-hidden bg-[#141414] transition-transform duration-700"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    minWidth: "0",
                    height: cardHeight,
                    border: "1px solid rgba(255,255,255,0.04)",
                    boxShadow: "0 0 28px rgba(0,0,0,0.24)",
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
                      transition: "transform 1000ms cubic-bezier(0.16, 1, 0.3, 1)",
                    }}
                    className="group-hover:scale-105"
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(5,5,5,0.98) 0%, rgba(5,5,5,0.74) 30%, rgba(5,5,5,0.16) 66%, rgba(5,5,5,0) 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      zIndex: 10,
                      padding: "1.1rem 1rem 1.25rem",
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontFamily: "var(--font-display), sans-serif",
                        fontSize: "0.72rem",
                        color: "rgba(229,226,225,0.5)",
                        letterSpacing: "0.2em",
                        marginBottom: "0.35rem",
                        fontWeight: 300,
                      }}
                    >
                      {step.id}
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--font-display), sans-serif",
                        fontSize: "clamp(1.2rem, 1.15vw, 1.5rem)",
                        fontWeight: 300,
                        letterSpacing: "0.16em",
                        color: "#ffffff",
                        textTransform: "uppercase",
                        margin: 0,
                        marginBottom: "0.55rem",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-body), sans-serif",
                        color: "rgba(229,226,225,0.74)",
                        lineHeight: 1.65,
                        fontSize: "0.74rem",
                        letterSpacing: "0.02em",
                        margin: 0,
                        maxWidth: "15ch",
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

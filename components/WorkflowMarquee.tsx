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
        minHeight: "100vh",
        backgroundColor: "#0e0e0e",
        color: "#e5e2e1",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-start",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        padding: "7rem 0 8rem",
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
          marginBottom: "5rem",
          padding: "0 1rem",
          marginTop: "1rem",
          position: "relative",
          zIndex: 1,
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display), sans-serif",
            fontSize: "clamp(2rem, 4vw, 4rem)",
            fontWeight: 300,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "#ffffff",
            margin: 0,
          }}
        >
          {title}
        </h2>
        <div
          style={{
            width: "16rem",
            height: "1px",
            margin: "1.5rem auto 0",
            background:
              "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
          }}
        />
      </div>

      <div
        style={{
          width: "100%",
          maxWidth: "1920px",
          margin: "0 auto",
          padding: "0 2rem 0.5rem",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
          overflow: "visible",
        }}
      >
        <div
          className="flex flex-col gap-10 md:flex-row md:gap-4 lg:gap-6"
          style={{
            overflow: "visible",
            alignItems: "flex-start",
          }}
        >
          {steps.map((step, index) => {
            const offset = index % 2 === 1 ? "md:translate-y-16" : "md:-translate-y-4";

            return (
              <div
                key={step.id}
                className={`relative overflow-visible md:flex-1 md:min-w-0 ${offset}`}
                style={{
                  minWidth: 0,
                }}
              >
                <Link
                  href={step.href || "/iletisim"}
                  className="group relative block w-full overflow-hidden bg-[#1c1b1b] border border-white/10 shadow-[0_0_50px_rgba(198,198,199,0.06)] transition-transform duration-700"
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    minWidth: "0",
                    height: "32rem",
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
                      background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.72) 58%, rgba(5,5,5,0) 100%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      zIndex: 10,
                      padding: "1.5rem",
                      boxSizing: "border-box",
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        fontFamily: "var(--font-display), sans-serif",
                        fontSize: "0.78rem",
                        color: "rgba(229,226,225,0.5)",
                        letterSpacing: "0.2em",
                        marginBottom: "0.45rem",
                        fontWeight: 300,
                      }}
                    >
                      {step.id}
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--font-display), sans-serif",
                        fontSize: "clamp(1.35rem, 1.2vw, 1.65rem)",
                        fontWeight: 300,
                        letterSpacing: "0.15em",
                        color: "#ffffff",
                        textTransform: "uppercase",
                        margin: 0,
                        marginBottom: "0.65rem",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{
                        fontFamily: "var(--font-body), sans-serif",
                        color: "rgba(229,226,225,0.74)",
                        lineHeight: 1.65,
                        fontSize: "0.78rem",
                        letterSpacing: "0.02em",
                        margin: 0,
                        maxWidth: "16ch",
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

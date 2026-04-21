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
        justifyContent: "center",
        overflow: "hidden",
        position: "relative",
        boxSizing: "border-box",
        padding: "10rem 0 8rem",
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
          maxWidth: "2000px",
          margin: "0 auto",
          padding: "0 1rem",
          boxSizing: "border-box",
          position: "relative",
          zIndex: 1,
          overflow: "visible",
        }}
      >
        <div
          className="flex flex-col gap-12 items-center md:flex-row md:justify-center md:items-stretch md:gap-8 lg:gap-12"
          style={{ overflow: "visible" }}
        >
          {steps.map((step, index) => {
            const staggerClass =
              index % 2 === 1
                ? "md:translate-y-16 translate-x-4 md:translate-x-0"
                : "md:-translate-y-4 -translate-x-4 md:translate-x-0";

            return (
              <Link
                key={step.id}
                href={step.href || "/iletisim"}
                className={`group relative block flex-none w-[85%] md:w-[400px] h-[500px] md:h-[600px] overflow-hidden bg-[#1c1b1b] border border-white/10 shadow-[0_0_60px_rgba(198,198,199,0.05)] transition-transform duration-700 ${staggerClass}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  minWidth: "0",
                  flex: "0 0 auto",
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
                    background: "linear-gradient(to top, #050505 0%, rgba(5,5,5,0.7) 55%, rgba(5,5,5,0) 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    zIndex: 10,
                    padding: "2.5rem",
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
                      marginBottom: "0.5rem",
                      fontWeight: 300,
                    }}
                  >
                    {step.id}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--font-display), sans-serif",
                      fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
                      fontWeight: 300,
                      letterSpacing: "0.15em",
                      color: "#ffffff",
                      textTransform: "uppercase",
                      margin: 0,
                      marginBottom: "0.75rem",
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--font-body), sans-serif",
                      color: "#c6c6c6",
                      lineHeight: 1.75,
                      fontSize: "0.9rem",
                      letterSpacing: "0.02em",
                      margin: 0,
                      maxWidth: "18ch",
                    }}
                  >
                    {step.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

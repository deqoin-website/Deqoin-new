"use client";

import React from "react";

export type WorkflowStep = {
  id: string;
  title: string;
  description: string;
  image: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    id: "01",
    title: "RANDEVU",
    description: "Kusursuz sürecin ilk adımı.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "02",
    title: "KEŞİF",
    description: "İhtiyaçları ve potansiyeli yerinde okuruz.",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "03",
    title: "TASARIM",
    description: "Vizyonu mimari bir dile dönüştürürüz.",
    image:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "04",
    title: "MALZEME",
    description: "Doku, kalite ve karakteri seçeriz.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "05",
    title: "UYGULAMA",
    description: "Tasarıyı sahada gerçeğe dönüştürürüz.",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
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
      className={className}
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
          {steps.map((step) => (
            <article
              key={step.id}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: "400px",
                flex: "1 1 320px",
                minHeight: "500px",
                overflow: "hidden",
                backgroundColor: "#18181b",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

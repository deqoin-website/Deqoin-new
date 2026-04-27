"use client";

import Link from "next/link";

const serviceCards = [
  {
    href: "/mimari",
    title: "Design Studio",
    subTitle: "Mimari Tasarım",
    sideLabel: "Structural Integrity",
    blur: 0,
    overlay: 30,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs",
  },
  {
    href: "/materyal-studyo",
    title: "Material Studio",
    subTitle: "Ürün ve Malzeme",
    sideLabel: "Aesthetic Soul",
    blur: 0,
    overlay: 30,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU",
  },
  {
    href: "/uygulama",
    title: "Execution Studio",
    subTitle: "Uygulama Hizmetleri",
    sideLabel: "Precision Craft",
    blur: 0,
    overlay: 30,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY",
  },
];

export default function FaaliyetAlanlarimiz() {
  return (
    <main className="w-full min-h-screen bg-zinc-950 flex flex-col site-shell project-detail-shell faaliyet-alanlarimiz-page" style={{ paddingTop: "12rem" }}>
      <section className="w-full min-h-screen relative flex flex-col justify-center overflow-hidden py-24 services-section" style={{ background: "transparent" }}>
        <div className="section-inner" style={{ paddingBottom: "4rem", textAlign: "center" }}>
          <div style={{ marginBottom: "5rem" }}>
            <h1 style={{ fontFamily: "var(--font-smooch), sans-serif", fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 100, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>DESIGN & COLLECTION</h1>
            <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1.2rem", letterSpacing: "0.4em", fontWeight: 300, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginTop: "1rem" }}>
              STUDIO SELECTION
            </p>
          </div>
        </div>
        <div className="services-grid">
          {serviceCards.map((card) => (
            <Link key={card.title} href={card.href} className="service-card">
              <img src={card.image} alt={card.title} style={{ filter: `blur(${card.blur || 0}px)` }} />
              <div className="service-overlay" style={{ background: `rgba(0,0,0,${(card.overlay ?? 30) / 100})` }} />
              <div className="service-copy">
                <div>
                  <h3>{card.title}</h3>
                  <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.8)", marginTop: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>{card.subTitle}</p>
                  <div className="service-line" />
                  <div className="service-cta">
                    <span>DETAYLARI GÖR</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
                <span className="vertical-text">{card.sideLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

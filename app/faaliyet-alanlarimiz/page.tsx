"use client";

import Link from "next/link";

const serviceCards = [
  {
    href: "/mimari",
    title: "Design Studio",
    subTitle: "Mimari Tasarım",
    sideLabel: "Structural Integrity",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs",
  },
  {
    href: "/materyal-studyo",
    title: "Material Studio",
    subTitle: "Ürün ve Malzeme",
    sideLabel: "Aesthetic Soul",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU",
  },
  {
    href: "/uygulama",
    title: "Execution Studio",
    subTitle: "Uygulama Hizmetleri",
    sideLabel: "Precision Craft",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY",
  },
];

export default function FaaliyetAlanlarimiz() {
  return (
    <main className="h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth bg-zinc-950 flex flex-col project-detail-shell">
      <section className="snap-start w-full min-h-screen bg-zinc-950 pt-32 pb-24 flex flex-col justify-center">
        <div className="section-inner" style={{ paddingBottom: "4rem", textAlign: "center" }}>
          <div style={{ marginBottom: "5rem" }}>
            <h1 style={{ fontFamily: "var(--font-smooch), sans-serif", fontSize: "clamp(4rem, 10vw, 8rem)", fontWeight: 100, color: "#fff", letterSpacing: "0.2em", textTransform: "uppercase", margin: 0 }}>DESIGN & COLLECTION</h1>
            <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1.2rem", letterSpacing: "0.4em", fontWeight: 300, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", marginTop: "1rem" }}>
              STUDIO SELECTION
            </p>
          </div>
        </div>
      </section>

      <section className="snap-start w-full min-h-screen bg-zinc-950 py-24 md:py-32 flex flex-col justify-center overflow-hidden">
        <div className="section-inner" style={{ paddingBottom: "3rem", textAlign: "center" }}>
          <div style={{ marginBottom: "4rem" }}>
            <h2 style={{ fontFamily: "var(--font-smooch), sans-serif", fontSize: "clamp(3rem, 8vw, 6rem)", fontWeight: 100, color: "#fff", letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>DESIGN & COLLECTION</h2>
            <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1rem", letterSpacing: "0.35em", fontWeight: 300, color: "rgba(255,255,255,0.65)", textTransform: "uppercase", marginTop: "1rem" }}>
              STUDIO SELECTION
            </p>
          </div>
        </div>
        <div className="services-grid">
          {serviceCards.map((card) => (
            <Link key={card.title} href={card.href} className="service-card relative w-full h-[45vh] md:h-[50vh] lg:h-[55vh] rounded-2xl overflow-hidden group cursor-pointer">
              <img
                src={card.image}
                alt={card.title}
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105 blur-[1px] group-hover:blur-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-full p-6 md:p-8 flex flex-col gap-2 z-10">
                <h3 className="text-3xl md:text-4xl lg:text-5xl font-thin text-white uppercase tracking-widest" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                  {card.title}
                </h3>
                <div className="flex items-center gap-4 mt-2">
                  <div className="w-8 h-[1px] bg-red-600" />
                  <p className="text-xs md:text-sm tracking-[0.2em] text-zinc-300 font-light uppercase" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                    {card.subTitle}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

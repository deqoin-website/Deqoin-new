"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { projectsData, Category } from "../data/projects";
import { teamFilters, teamMembers } from "../data/team";
import ConsultationModal from "../components/ConsultationModal";


type ProjectItem = {
  title: string;
  label: string;
  category: Category;
  image: string;
};

const heroSlides = [
  {
    image: "/images/slider/mimari_slide.png",
    title: "DESIGN STUDIO",
    buttonText: "DESIGN STUDIO İÇİN RANDEVU TALEP EDİNİZ",
    caption: "Design Studio"
  },
  {
    image: "/images/slider/tasarim_slide.png",
    title: "MATERIAL STUDIO",
    buttonText: "MATERIAL STUDIO İÇİN RANDEVU TALEP EDİNİZ",
    caption: "Material Studio"
  },
  {
    image: "/images/slider/uygulama_slide.png",
    title: "EXECUTION STUDIO",
    buttonText: "EXECUTION STUDIO İÇİN RANDEVU TALEP EDİNİZ",
    caption: "Execution Studio"
  }
];

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


const projects: ProjectItem[] = [
  {
    title: "ZIND NAABA HOTEL",
    label: "RESIDENT STUDY ROOM",
    category: "ticari",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDQ33Fr_mp_94UQUZyYOcRBRBK4SsC3hdWkie-fw6V2__i_B1h6AdSqBrcIxAAgXdz-v3B0bxiTC-ksADc_Szblsz7rQvFfbm-HT7bZ1XL4bsM_asUURcwntMziJsDYv2IG_IZ29E-x6Q-o8X94qQUEmwhhDhnCvzR73u_lPOfR2qgqCLbkcFE__mn9WB-1VfwW7H_DqV9DkwKYK7M0io-43LvxYatvgMsrwap-p4wEffe-ljtcBwrQlBdN4PP7Q0JGnYBjixX0YQ0",
  },
  {
    title: "ZIND NAABA HOTEL",
    label: "RESIDENT BEDROOM",
    category: "konut",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDb8oJUAbKO838Rur4GmMdhoZA52T9apeuU9wT1MD8aED3l4BUvMiWzCyCUvgmQ_hUnxgOfF8IiulBiI2jOUD_rMvhMhY5q4XF5oN3Orkq525thVCe6a7Qn84IkmcCKdp7RVHGwlMXKCQZWlSwoQRYqNQ54bsoQ6pAqtTv5QeYJjApl9fwBFVCYyWIR0fqefLofCqY7cPmi_F1xk7yjOVIZsTO7FKo0OjDyPcryEMVFbFFRsn19bmHoDjlgz-s838-TizdClIfaG6s",
  },
  {
    title: "ZIND NAABA HOTEL",
    label: "RESIDENT LIVING ROOM",
    category: "konut",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA6ch6quj8NI1itL20E5PhIg-48fajZE_vr98u3teQ-X7iSPzBfAvJnkTJ3RuJVxc2gjJk51KmYZk9sWDTwAjNMVHOwiJPfJh3i0VYt8Cfzsf6cPXv8SRUsh66wCIyRnDgQLMJg2_1yHEHCnFIbIJoBzDcFEntZjDdLiFO8q1WvslXUxTqhQNEyc8D_USmsB4iizRnCFmQqpbt_btAIebK4vy_8mB0LYZXdZk9Mtj6xqQ8e91yqi86iYoLhuoh8fXoG0Gcgep-wrSw",
  },
  {
    title: "MARBLE ATRIUM",
    label: "LUXURY FINISHINGS",
    category: "ic-mimarlik",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU",
  },
  {
    title: "BRUTALIST VILLA",
    label: "EXTERNAL ENVELOPE",
    category: "konut",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs",
  },
  {
    title: "CRAFT STUDIO",
    label: "WORKSPACE INTERIOR",
    category: "ticari",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY",
  },
];

const filters = [
  { key: "all", title: "HEPSİ", sideLabel: "Selection" },
  { key: "konut", title: "KONUT", sideLabel: "Residential" },
  { key: "ticari", title: "TİCARİ", sideLabel: "Commercial" },
  { key: "ic-mimari", title: "İÇ MİMARİ", sideLabel: "Interiors" },
  { key: "restorasyon", title: "RESTORASYON", sideLabel: "Revival" },
] as const;

export default function Page() {
  const [heroIndex, setHeroIndex] = useState(0);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [activeFilter, setActiveFilter] =
    useState<(typeof filters)[number]["key"]>("all");
  const [activeTeamFilter, setActiveTeamFilter] =
    useState<(typeof teamFilters)[number]["key"]>("all");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setHeroIndex((current) => (current + 1) % heroSlides.length);
    }, 8000);

    return () => window.clearInterval(interval);
  }, []);



  const filteredProjects = useMemo(() => {
    if (activeFilter === "all") return projectsData;
    return projectsData.filter((project) => project.category === activeFilter);
  }, [activeFilter]);

  const filteredTeam = useMemo(() => {
    if (activeTeamFilter === "all") return teamMembers;
    return teamMembers.filter((item) => item.category === activeTeamFilter);
  }, [activeTeamFilter]);

  const heroProgressStyle = {
    width: "100%",
    animation: "progressFill 8s linear infinite",
  };


  return (
    <main className="site-shell">

      <section className="hero-section" id="hero-slider">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.image}
            className={`hero-slide ${index === heroIndex ? "active" : ""}`}
            style={{
              backgroundImage: `url(${slide.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              filter: "blur(6px) brightness(0.6)",
              transform: "scale(1.05)"
            }}
          >
            <div className="hero-overlay" />
          </div>
        ))}

        <div className="hero-content" style={{ textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: "3rem", height: "100%", width: "100%" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <span style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "0.65rem", letterSpacing: "0.6em", fontWeight: 300, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", paddingLeft: "0.6em" }}>
              Bölüm {String(heroIndex + 1).padStart(2, '0')} &mdash; {heroSlides[heroIndex].caption}
            </span>
            <h1 style={{ 
              fontFamily: "var(--font-smooch), sans-serif", 
              fontSize: "clamp(4.5rem, 12vw, 11rem)", 
              fontStyle: "normal", 
              fontWeight: 100, 
              color: "#ffffff", 
              letterSpacing: "0.2em", 
              textTransform: "uppercase", 
              margin: 0, 
              lineHeight: "0.9",
              textShadow: "0 15px 50px rgba(0,0,0,0.9)",
              paddingLeft: "0.2em"
            }}>
              {heroSlides[heroIndex].title}
            </h1>
          </div>
          <button 
            className="hero-cta" 
            style={{ marginTop: "1rem", position: "relative", zIndex: 100 }} 
            type="button" 
            onClick={() => setIsConsultationOpen(true)}
          >
            <span className="hero-cta-text">{heroSlides[heroIndex].buttonText}</span>
            <div className="hero-cta-circle">
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </div>
          </button>
        </div>

        <div className="hero-controls">
          <button
            type="button"
            onClick={() => setHeroIndex((current) => (current - 1 + heroSlides.length) % heroSlides.length)}
            aria-label="Previous hero slide"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            type="button"
            onClick={() => setHeroIndex((current) => (current + 1) % heroSlides.length)}
            aria-label="Next hero slide"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        <div className="hero-meta">
          <div className="hero-count">
            <span>{String(heroIndex + 1).padStart(2, "0")}</span>
            <div />
            <small>{String(heroSlides.length).padStart(2, "0")}</small>
          </div>
          <p className="vertical-text">{heroSlides[heroIndex].caption}</p>
        </div>

        <div className="hero-progress">
          <div key={heroIndex} style={heroProgressStyle} />
        </div>
      </section>

      {/* ── DESIGN & BUILD PROCESS SECTION ── */}
      <section className="process-section">
        <div className="process-header">
          <span className="section-small-label" style={{ letterSpacing: "0.5em", color: "#cca883", fontSize: "0.75rem", marginBottom: "1rem", display: "block" }}>PROFESYONEL İŞ AKIŞIMIZ</span>
          <h2>Tasarım ve Keşif Sürecimiz</h2>
          <div className="section-line" />
        </div>

        <div className="process-timeline">
          {[
            { id: "01", icon: "calendar_today", title: "Randevu", detail: "Kusursuz sürecin ilk adımı." },
            { id: "02", icon: "visibility", title: "Keşif", detail: "İhtiyaçların ve potansiyelin öngörülmesi." },
            { id: "03", icon: "architecture", title: "Tasarım", detail: "Vizyonun ve mimari kimliğin kurgulanması." },
            { id: "04", icon: "layers", title: "Malzeme", detail: "Projeye özel premium donatıların entegrasyonu." },
            { id: "05", icon: "precision_manufacturing", title: "Uygulama", detail: "Tüm değerlerinizi ortaya koyan usta işi inşa süreci." }
          ].map((step, idx) => (
            <div key={idx} className="process-step">
              <div className="step-number">
                <span className="material-symbols-outlined step-icon">{step.icon}</span>
                <span className="step-id">{step.id}</span>
              </div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="services-section">
        <div className="section-inner" style={{ paddingBottom: "2rem" }}>
          <div className="section-heading">
            <div>
              <span className="section-small-label" style={{ letterSpacing: "0.5em", color: "#cca883", fontSize: "0.75rem", marginBottom: "1rem", display: "block" }}>STUDIO SELECTION</span>
              <h2 style={{ marginBottom: "0.5rem", textTransform: "uppercase", color: "#000" }}>DESIGN & COLLECTION</h2>
              <span style={{ 
                fontFamily: "var(--font-display), sans-serif", 
                fontSize: "1.1rem", 
                color: "rgba(0,0,0,0.5)", 
                letterSpacing: "0.3em", 
                textTransform: "uppercase",
                display: "block",
                marginBottom: "1.5rem"
              }}>
                TASARIM VE KOLEKSİYON
              </span>
              <div className="section-line" style={{ background: "#000" }} />
            </div>
          </div>
        </div>
        <div className="services-grid">
          {serviceCards.map((card) => (
            <a key={card.title} href={card.href} className="service-card">
              <img src={card.image} alt={card.title} />
              <div className="service-overlay" />
              <div className="service-copy">
                <div>
                  <h3>{card.title}</h3>
                  {"subTitle" in card && (
                    <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.8)", marginTop: "0.5rem", letterSpacing: "0.2em", textTransform: "uppercase" }}>{card.subTitle}</p>
                  )}
                  <div className="service-line" />
                  <div className="service-cta">
                    <span>DETAYLARI GÖR</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
                <span className="vertical-text">{card.sideLabel}</span>
              </div>
            </a>
          ))}
        </div>
      </section>


      <section className="projects-section" id="galeri">
        <div className="section-inner">
          <div className="section-heading projects-heading">
            <div>
              <h2>Galeri</h2>
              <div className="section-line" />
            </div>
            <div className="filter-bar">
              {filters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={`filter-button ${activeFilter === filter.key ? "active" : ""}`}
                  onClick={() => setActiveFilter(filter.key)}
                >
                  <span className="vertical-text">{filter.sideLabel}</span>
                  <span>{filter.title}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="project-grid">
            {filteredProjects.map((project) => (
              <Link href={`/galeri/${project.slug}`} className="project-card" key={`${project.title}-${project.label}`}>
                <img src={project.coverImage} alt={project.title} />
                <div className="project-overlay" />
                <h4>{project.title}</h4>
                <p className="vertical-text">{project.label}</p>
              </Link>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "5rem" }}>
            <Link href="/galeri" className="premium-all-btn">
              <span className="premium-btn-text">TÜM GALERİYİ GÖR</span>
              <span className="material-symbols-outlined premium-btn-icon">east</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="about-section" id="about-us">
        <div className="section-inner about-grid">
          <div className="about-copy">
            <div>
              <h2>Geleneklerin ötesinde.</h2>
              <div className="section-line" />
            </div>
            <div className="about-text">
              <div className="about-label-row">
                <span className="vertical-text">Atölye Felsefesi</span>
                <p>
                  Mimarlığın yaşayan bir varlık olduğu ilkesiyle kurulan DEQOIN, yapı
                  mühendisliğinin soğuk hassasiyetini, kişiye özel iç mekanların sıcak ruhuyla
                  birleştiriyor. Biz sadece ev inşa etmiyoruz; atmosferler kurguluyoruz. Her proje
                  benzersiz bir monolittir; kimliğin ve zamansızlığın tekil, uyumlu bir ifadesidir.
                </p>
              </div>
              <div style={{ marginTop: "2rem" }}>
                <Link href="/faaliyet-alanlarimiz" className="premium-all-btn">
                  <span className="premium-btn-text">Design & Collection</span>
                  <span className="material-symbols-outlined premium-btn-icon">east</span>
                </Link>
              </div>
            </div>
          </div>

          <div className="about-visual">
            <div className="about-frame">
              <div className="about-image-wrap">
                <img
                  src="/images/about_interior.png"
                  alt="Atmospheric architectural interior DEQOIN philosophy masterpiece"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section" id="departman-ekipleri">
        <div className="section-inner">
          <div className="section-heading projects-heading">
            <div>
              <h2>Departman Ekipleri</h2>
              <div className="section-line" />
            </div>
            <div className="filter-bar">
              {teamFilters.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={`filter-button ${activeTeamFilter === filter.key ? "active" : ""}`}
                  onClick={() => setActiveTeamFilter(filter.key)}
                >
                  <span className="filter-border" />
                  <span className="filter-text">{filter.title}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="team-grid">
            {filteredTeam.map((member) => (
              <div className="team-member" key={member.id}>
                <div className="team-image-wrapper">
                  <img src={member.image} alt={member.role} />
                  <div className="team-overlay"></div>
                </div>
                <div className="team-info">
                  <h3>{member.name}</h3>
                  <span className="vertical-text">{member.role}</span>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "5rem" }}>
            <Link href="/departman-ekipleri" className="premium-all-btn">
              <span className="premium-btn-text">TÜM EKİPLERİ GÖR</span>
              <span className="material-symbols-outlined premium-btn-icon">east</span>
            </Link>
          </div>
        </div>
      </section>

      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </main>
  );
}

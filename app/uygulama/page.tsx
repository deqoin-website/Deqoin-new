"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import { Loader2 } from "lucide-react";

export default function UygulamaPage() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/content?page=execution');
        const data = await res.json();
        if (data && data.sections) {
          setContent(data);
        }
      } catch (err) {
        console.error("Failed to fetch execution content:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const scrolled = window.scrollY;
        heroRef.current.style.transform = `translateY(${scrolled * 0.4}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isLoading) {
    return (
      <div className="site-shell" style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="#a68966" />
      </div>
    );
  }

  const heroSection = content?.sections?.find((s: any) => s.id === 'hero');
  const catSection = content?.sections?.find((s: any) => s.id === 'categories');

  return (
    <main className="site-shell project-detail-shell" style={{ background: "#0a0a0a" }}>

      {/* HERO */}
      <section className="mimari-hero">
        <div className="mimari-hero-bg" ref={heroRef}>
          <img
            src={heroSection?.slides?.[0] || "https://lh3.googleusercontent.com/aida-public/AB6AXuBg-MKl4zF6vfhExOXkEX-PKVlktOgQYI9EevfKIIYXVJ2wtmRpvybiQLaOtQdeYc_lIPrntEOUrCatq_Efo6fw-z-0-6TilLvAsA4tcYK-QcbjqdetFT2T2EreDjugTzsElsUeoEqEM9i_daWDWBBOJXiZvrjMKWtS2z5I5ZuzOLXWozpZ8MroEnEj5yRtFuaubPctxfeO_ZAZ5E5Tawo9b6yB5w0pmG4_axQCW--XoR8nAAImAE_M5UpM2vFx3tuR2ePYvZ-VmaY"}
            alt="DEQOIN Uygulama Departmanı"
          />
        </div>
        <div className="mimari-hero-overlay" />
        <div className="mimari-hero-content">
          <span className="mimari-hero-tag">Hizmet — 03 / 03</span>
          <h1 className="mimari-hero-title">{heroSection?.title || 'EXECUTION STUDIO'}</h1>
          <p className="mimari-hero-sub" style={{ fontSize: "1.6rem", letterSpacing: "0.5em", color: "rgba(255,255,255,0.8)", marginBottom: "3rem" }}>
            {heroSection?.subtitle || 'UYGULAMA HİZMETLERİ'}
          </p>
          <p className="mimari-hero-sub">
            Kusursuz Bir Bitiş İçin Teknik Ve Sanatsal Kadro.<br />
            Gerçeğe Dönüştürmek Sadece Bir İnşaat Değil, Sanattır.
          </p>
          <div className="mimari-hero-actions">
            <button type="button" className="hero-cta appointment-cta" onClick={() => setIsConsultationOpen(true)}>
              <span className="hero-cta-text">İLETİŞİM</span>
              <div className="hero-cta-circle">
                <span className="material-symbols-outlined">event_available</span>
              </div>
            </button>
          </div>
        </div>
        <div className="mimari-hero-scroll-hint">
          <span className="vertical-text">Aşağı Kaydır</span>
          <div className="scroll-line" />
        </div>
      </section>

      {/* MANİFESTO */}
      <section className="mimari-manifesto">
        <div className="mimari-manifesto-inner">
          <div className="mimari-manifesto-label">
            <span className="vertical-text">Studio Manifesto</span>
          </div>
          <div className="mimari-manifesto-body">
            <span className="section-small-label">UYGULAMA VİZYONUMUZ</span>
            <blockquote className="mimari-quote" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", lineHeight: "1.2" }}>
              "Tüm değerlerinizi ve vizyonunuzu<br />ortaya koyan tek nokta."
            </blockquote>
            <p className="mimari-manifesto-text">
              DEQOIN'de uygulama, dışarıdan kiralanan bir hizmet değil; projenin ruhunu sahada koruyan özgün bir disiplindir. 
              Belki de henüz farkında olmadığınız uygulama risklerini önceden öngörüyoruz. 
              Bünyemizdeki sanatsal ve teknik kadrolarla, her detayı tasarımın bir parçası olarak inşa ediyoruz. 
              Bizimle çalışırken usta aramanıza gerek kalmaz; her fırça darbesi ve her yapısal bağlantı DEQOIN standartlarında hayata geçer.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICE GRID */}
      <section className="services-section" style={{ background: "transparent", padding: "0" }}>
        <div className="services-grid">
          {(catSection?.items || []).map((card: any) => (
            <Link key={card.title} href={`/uygulama/${card.slug}`} className="service-card">
              <img src={card.image} alt={card.title} />
              <div className="service-overlay" />
              <div className="service-copy">
                <div>
                  <h3>{card.title}</h3>
                  <div className="service-line" />
                  <div className="service-cta">
                    <span>DETAYLARI İNCELE</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
                <span className="vertical-text">{card.sideLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs"
            alt="CTA"
          />
        </div>
        <div className="mimari-cta-overlay" />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>BİR SONRAKI ADIM</span>
          <h2 className="mimari-cta-title">Kusursuz Uygulama İçin Başlayalım</h2>
          <p className="mimari-cta-sub">
            Projenizin her aşamasında şeffaflık ve teknik mükemmellik için iletişim kurun.
          </p>
          <button type="button" className="hero-cta appointment-cta" onClick={() => setIsConsultationOpen(true)}>
            <span className="hero-cta-text">İLETİŞİM</span>
            <div className="hero-cta-circle">
              <span className="material-symbols-outlined">event_available</span>
            </div>
          </button>
        </div>
      </section>

      {/* DİĞER HİZMETLER */}
      <section className="mimari-other-services">
        <div className="mimari-section-inner">
          <span className="section-small-label">DİĞER HİZMETLERİMİZ</span>
          <div className="mimari-other-grid">
            <Link href="/mimari" className="mimari-other-card">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbQTBOayjmIt4JzHbORA9-NQOes7Uaoo4WrcuGAAwzEXJzUo0V4OeCDNGGyxzFDBzG1_DbgXDr5aROetwtqZ4iPhEiaV39HyWZ67_PbpZY6a2KYJHEC2_-3JaDiLZ_71qMkfLsbA991AHjCOdDh70fnYJ3lWy-tXN7nbh5DnUk-PZt4xV5nniOugFFMI4ACHWAkPu85H_YU43TPpuqCiveXM-RLOTvgub4LA47ECVZBRKJhuyDW83lyXynnNyLY1ieUH6-gh23YZs" alt="Mimari" />
              <div className="mimari-other-overlay" />
              <div className="mimari-other-copy">
                <h3>Design Studio</h3>
                <span className="vertical-text">Structural Integrity</span>
              </div>
            </Link>
            <Link href="/materyal-studyo" className="mimari-other-card">
              <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU" alt="Malzeme" />
              <div className="mimari-other-overlay" />
              <div className="mimari-other-copy">
                <h3>Material Studio</h3>
                <span className="vertical-text">Aesthetic Soul</span>
              </div>
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

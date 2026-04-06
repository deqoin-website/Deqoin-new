"use client";

import Link from "next/link";
import { materyalKategorileri } from "../../data/materyal-studyo";

export default function MateryalStudyo() {
  return (
    <main className="site-shell project-detail-shell" style={{ paddingTop: "12rem" }}>
      <section className="services-section" style={{ background: "transparent" }}>
        {/* HEADER */}
        <div style={{ padding: "0 2rem", marginBottom: "5rem", textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-smooch), sans-serif", fontSize: "clamp(5rem, 15vw, 10rem)", fontWeight: 100, color: "#fff", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>MATERIAL STUDIO</h1>
          <p style={{ fontFamily: "var(--font-display), sans-serif", fontSize: "1.4rem", letterSpacing: "0.5em", fontWeight: 300, color: "rgba(255,255,255,0.8)", textTransform: "uppercase", marginTop: "1rem" }}>
            ÜRÜN VE MALZEME
          </p>
        </div>

        {/* NO RETAIL NOTICE */}
        <div className="no-retail-notice">
          <div className="notice-inner">
            <span className="material-symbols-outlined">info</span>
            <p>Burada sergilenen tüm ürün grupları yalnızca kendi projelerimiz ve özel tasarımlarımız için kullanılmaktadır; perakende satışımız yoktur.</p>
          </div>
        </div>
        
        {/* CATEGORY GRID */}
        <div className="services-grid">
          {materyalKategorileri.map((card) => (
            <Link key={card.title} href={`/materyal-studyo/${card.slug}`} className="service-card">
              <img src={card.image} alt={card.title} />
              <div className="service-overlay" />
              <div className="service-copy">
                <div>
                  <h3>{card.title}</h3>
                  <div className="service-line" />
                  <div className="service-cta">
                    <span>GALERİYİ İNCELE</span>
                    <span className="material-symbols-outlined">arrow_forward</span>
                  </div>
                </div>
                <span className="vertical-text">{card.sideLabel}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img src="https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2048&auto=format&fit=crop" alt="CTA" />
        </div>
        <div className="mimari-cta-overlay" />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>ÖZEL TASARIM</span>
          <h2 className="mimari-cta-title">Kendi Projelerimize Özel Dokunuşlar</h2>
          <p className="mimari-cta-sub">
            Seçkin materyal portföyümüzü ve sanatsal yaklaşımlarımızı projelerinizin her köşesine taşıyoruz.
          </p>
          <Link href="/iletisim" className="hero-cta">
            <span className="hero-cta-text">RANDEVU TALEP EDİNİZ</span>
            <div className="hero-cta-circle">
              <span className="material-symbols-outlined">arrow_right_alt</span>
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}

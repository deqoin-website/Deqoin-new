"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ConsultationModal from "../../components/ConsultationModal";
import { Loader2 } from "lucide-react";
import SwipeAppointmentButton from "../../components/SwipeAppointmentButton";
import { materyalKategorileri } from "../../data/materyal-studyo";

const materialCategories = materyalKategorileri.filter((item) =>
  ["mobilya", "aydinlatma", "italyan-sivalar", "sanatsal-calismalar", "tugla-ve-tas"].includes(item.slug)
);

const categoryFilters = [
  { label: "TÜMÜ", value: "all" },
  { label: "Mobilya", value: "mobilya" },
  { label: "Aydınlatma", value: "aydinlatma" },
  { label: "İtalyan Sıvalar", value: "italyan-sivalar" },
  { label: "Sanatsal Çalışmalar", value: "sanatsal-calismalar" },
  { label: "Tuğla ve Taş", value: "tugla-ve-tas" },
] as const;

export default function MateryalStudyo() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<(typeof categoryFilters)[number]["value"]>("all");
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content?page=material");
        const data = await res.json();
        if (data && data.sections) setContent(data);
      } catch (err) {
        console.error("Failed to fetch material studio content:", err);
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
        heroRef.current.style.transform = `translateY(${scrolled * 0.35}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const visibleCards = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return materialCategories.filter((card) => {
      const matchesFilter = activeFilter === "all" || card.slug === activeFilter;
      const matchesSearch =
        q === "" ||
        [card.title, card.sideLabel, card.description, ...(card.categories?.map((c) => c.label) || [])]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchTerm]);

  if (isLoading) {
    return (
      <div className="site-shell" style={{ height: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Loader2 className="animate-spin" size={48} color="#a68966" />
      </div>
    );
  }

  const heroSection = content?.sections?.find((s: any) => s.id === "hero");

  return (
    <main className="site-shell project-detail-shell" style={{ background: "#0a0a0a" }}>
      <section className="mimari-page-hero">
        <div className="mimari-hero-slider">
          <div
            className="mimari-hero-slide active"
            ref={heroRef}
            style={{
              backgroundImage: `url(${heroSection?.slides?.[0] || materialCategories[0]?.image || "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2048&auto=format&fit=crop"})`,
            }}
          />
        </div>
        <div className="mimari-hero-blur-overlay" />
        <div className="mimari-hero-dark-overlay" />

        <div className="mimari-hero-content-centric">
          <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>
            CREATIVE VISION
          </span>
          <h1 className="mimari-hero-title-main">{heroSection?.title || "MATERIAL STUDIO"}</h1>
          <p className="mimari-hero-sub-main">{heroSection?.subtitle || "ÜRÜN VE MALZEME"}</p>
          <div className="mimari-hero-line" />
          <div className="mimari-hero-actions" style={{ justifyContent: "center", marginTop: "3rem" }}>
            <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
            <Link href="/galeri?material=mobilya" className="mimari-ghost-btn">
              <span>GALERİYİ İNCELE</span>
              <span className="material-symbols-outlined">east</span>
            </Link>
          </div>
        </div>

        <div className="mimari-hero-scroll-hint">
          <span className="vertical-text">Detayları Gör</span>
          <div className="scroll-line" />
        </div>
      </section>

      <section className="mimari-manifesto">
        <div className="mimari-manifesto-inner">
          <div className="mimari-manifesto-label">
            <span className="vertical-text">{heroSection?.sideLabel || "Bespoke Material World"}</span>
          </div>
          <div className="mimari-manifesto-body">
            <span className="section-small-label">VİZYONUMUZ</span>
            <h2 className="mimari-quote" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: "1.2", marginBottom: "3rem" }}>
              {heroSection?.title || "Material Studio"} ile hayat bulan mekanlar
            </h2>
            <div className="mimari-manifesto-text">
              {(heroSection?.content || [
                "Burada sergilenen ürün grupları yalnızca kendi projelerimiz ve özel tasarımlarımız için kullanılmaktadır.",
                "Malzeme, doku ve formu aynı mimari disiplin içinde ele alıyor; projeye uygun, seçkin yüzey ve obje kurguları oluşturuyoruz.",
                "İhtiyacınıza uygun materyal senaryosunu birlikte netleştirmek için ekibimizle iletişime geçebilirsiniz.",
              ]).map((paragraph: string, index: number) => (
                <p key={index} style={{ marginBottom: "2rem" }}>{paragraph}</p>
              ))}
              <p style={{ marginBottom: 0, color: "#cca883", fontSize: "0.85rem", letterSpacing: "0.08em", lineHeight: "1.8" }}>
                Sergilenen bu ürünler ve malzemeler yalnızca özel projeleriniz ve tasarımlarınız için kullanılacak olup, kesinlikle perakende satışı yapılmayacaktır.
              </p>
            </div>

            <div style={{ marginTop: "4rem" }}>
              <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
            </div>
          </div>
        </div>
      </section>

      <div className="studio-search-container material-studio-search">
        <div className="studio-search-bar">
          <span className="material-symbols-outlined">search</span>
          <input
            type="text"
            placeholder="Malzeme veya kategori ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="mobile-filter-toggle" onClick={() => setActiveFilter("all")}>
          <span className="material-symbols-outlined">tune</span>
          FİLTRELE
          {activeFilter !== "all" && <span className="active-dot" />}
        </button>
      </div>

      <section className="studio-main material-studio-main">
        <aside className="studio-sidebar">
          <div className="filter-group">
            <h4>KATEGORİLER</h4>
            <ul className="filter-list">
              {categoryFilters.map((filter) => (
                <li key={filter.value} className="filter-item">
                  <button
                    className={`filter-button ${activeFilter === filter.value ? "active" : ""}`}
                    onClick={() => setActiveFilter(filter.value)}
                  >
                    {filter.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="filter-group" style={{ marginTop: "4rem" }}>
            <h4>MATERYAL BRİFİ</h4>
            <p className="material-showcase-sidebar-copy">
              Seçkin malzemeler, projenin ruhunu belirleyen son katman değil; tasarımın başlangıç kararlarından biridir. İhtiyacınıza uygun senaryoyu birlikte netleştirelim.
            </p>
            <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
          </div>
        </aside>

        <div className="studio-gallery">
          {visibleCards.length > 0 ? (
            visibleCards.map((card) => (
              <Link key={card.slug} href={`/materyal-studyo/${card.slug}`} className="project-card-interactive">
                <div className="project-card-img">
                  <img src={card.image} alt={card.title} />
                  <div className="project-card-badge">{card.sideLabel}</div>
                </div>

                <div className="project-card-info">
                  <h3>{card.title}</h3>
                  <div className="project-meta-row">
                    <div className="meta-item">
                      <label>KATEGORİ</label>
                      <span>{card.title}</span>
                    </div>
                    <div className="meta-item">
                      <label>ODAK</label>
                      <span>{card.sideLabel}</span>
                    </div>
                    <div className="meta-item">
                      <label>DETAY</label>
                      <span>{card.categories?.length || 0} Alt Başlık</span>
                    </div>
                  </div>

                  <div className="project-story-section">
                    <div className="story-block">
                      <h5>MALZEME VİZYONU</h5>
                      <p>{card.description}</p>
                    </div>
                    <div className="story-block">
                      <h5>KATEGORİLER</h5>
                      <p>{card.categories?.map((item) => item.label).join(" • ")}</p>
                    </div>
                  </div>

                  <div className="project-card-footer">
                    <button className="project-action-btn" type="button" onClick={() => setIsConsultationOpen(true)}>
                      DETAYLARI GÖR
                      <span className="material-symbols-outlined">arrow_right_alt</span>
                    </button>
                    <span className="material-showcase-footer-note">MATERIAL © DEQOIN</span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div className="material-showcase-empty">
              <span className="material-symbols-outlined">search_off</span>
              <p>Aramanızla eşleşen bir kategori bulunamadı.</p>
            </div>
          )}
        </div>
      </section>

      <section className="mimari-cta-banner">
        <div className="mimari-cta-bg">
          <img src={materialCategories[0]?.image || "https://images.unsplash.com/photo-1540932239986-30128078f3c5?q=80&w=2048&auto=format&fit=crop"} alt="CTA" />
        </div>
        <div className="mimari-cta-overlay" />
        <div className="mimari-cta-content">
          <span className="section-small-label" style={{ color: "#cca883" }}>BİR SONRAKİ ADIM</span>
          <h2 className="mimari-cta-title">Materyal Seçimini Projeye Dönüştürelim</h2>
          <p className="mimari-cta-sub">
            Seçtiğiniz kategori için en doğru teknik ve estetik kombinasyonu birlikte planlayalım.
          </p>
          <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
        </div>
      </section>

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}

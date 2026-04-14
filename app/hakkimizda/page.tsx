"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AboutUs() {
  const imageRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch('/api/admin/content/corporate/about');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("About us fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();

    const handleScroll = () => {
      if (imageRef.current) {
        const scrolled = window.scrollY;
        imageRef.current.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return (
    <div className="site-shell" style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={48} color="#a68966" />
    </div>
  );

  // Fallback defaults if DB is empty
  const title = data?.title || "TASARIMDAN ÖTE: BÜTÜNSEL BİR DENEYİM";
  const subtitle = data?.subtitle || "BİZ KİMİZ";
  const description = data?.description || "Bizler sadece fiziksel yapılar inşa etmiyor; tüm değerlerinizi ortaya koyan bütünsel bir deneyim kurguluyoruz.";
  const heroImage = data?.image || "/images/slider/mimari_slide.png";
  const stats = data?.stats?.length > 0 ? data.stats : [
    { label: "DENEYİM", value: "10+ YIL" },
    { label: "TESLİM EDİLEN", value: "+240 PROJE" },
    { label: "UZMAN EKİP", value: "40+ KİŞİ" }
  ];

  return (
    <main className="site-shell project-detail-shell" style={{ paddingTop: "12rem" }}>
      <div className="section-inner" style={{ paddingBottom: "10rem" }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: "8rem", textAlign: "left" }}>
          <span className="section-small-label" style={{ letterSpacing: "0.5em", color: "rgba(255,255,255,0.4)" }}>
            {subtitle}
          </span>
          <h1 style={{ 
            fontFamily: "var(--font-display), sans-serif", 
            fontSize: "clamp(3rem, 8vw, 5.5rem)", 
            fontWeight: 200, 
            color: "#fff", 
            letterSpacing: "0.05em", 
            textTransform: "uppercase", 
            margin: "1rem 0 0",
            lineHeight: "1.1"
          }} dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }}>
          </h1>
        </div>

        {/* SPLIT CONTENT SECTION */}
        <div style={{ 
          display: "flex", 
          flexDirection: "row", 
          gap: "8rem", 
          alignItems: "flex-start",
          flexWrap: "wrap"
        }}>
          
          {/* IMAGE SIDE */}
          <div style={{ 
            flex: "1 1 500px", 
            position: "relative",
            minHeight: "750px",
            overflow: "hidden",
            boxShadow: "0 50px 100px rgba(0,0,0,0.5)"
          }}>
            <div 
              ref={imageRef}
              style={{ 
                position: "absolute",
                inset: "-10% 0",
                backgroundImage: `url('${heroImage}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "grayscale(0.1) contrast(1.05)"
              }} 
            />
            <div style={{ 
              position: "absolute", 
              inset: 0, 
              background: "linear-gradient(to top, rgba(10,10,10,0.8), transparent)" 
            }} />
          </div>

          {/* TEXT SIDE */}
          <div style={{ 
            flex: "1 1 450px", 
            display: "flex", 
            flexDirection: "column", 
            gap: "3rem",
            paddingTop: "2rem"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <p style={{ 
                fontSize: "1.25rem", 
                lineHeight: "1.8", 
                fontWeight: 300, 
                color: "#fff", 
                margin: 0,
                letterSpacing: "-0.01em",
                whiteSpace: "pre-wrap"
              }}>
                {description}
              </p>
            </div>

            <div style={{ marginTop: "3rem" }}>
              <Link href="/departman-ekipleri" className="premium-all-btn" style={{ padding: "1.2rem 3.5rem" }}>
                <span className="premium-btn-text">EKİBİMİZİ TANIYIN</span>
                <span className="material-symbols-outlined premium-btn-icon">east</span>
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div className="stats-container" style={{ 
          gridTemplateColumns: `repeat(${stats.length}, 1fr)`, 
          marginTop: "12rem",
          padding: "7rem 0", 
          borderTop: "1px solid rgba(255,255,255,0.1)", 
          borderBottom: "1px solid rgba(255,255,255,0.1)" 
        }}>
          {stats.map((stat: any, idx: number) => (
            <div key={idx} className="stat-col" style={{ 
              alignItems: "center", 
              borderTop: "none", 
              padding: 0,
              borderLeft: idx !== 0 ? "1px solid rgba(255,255,255,0.1)" : "none"
            }}>
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value" style={{ fontSize: "3.5rem", fontFamily: "var(--font-smooch)", color: "#fff" }}>{stat.value}</span>
            </div>
          ))}
        </div>

        {/* DYNAMIC WORKFLOW SECTION */}
        {data?.sections && data.sections.length > 0 && (
          <section style={{ marginTop: "15rem" }}>
            <div style={{ textAlign: "center", marginBottom: "8rem" }}>
              <span className="section-small-label" style={{ color: "#a68966", letterSpacing: "0.4em" }}>PROFESYONEL İŞ AKIŞI</span>
              <h2 style={{ 
                fontFamily: "var(--font-display), sans-serif", 
                fontSize: "clamp(2rem, 5vw, 3rem)", 
                color: "#fff", 
                marginTop: "1.5rem",
                letterSpacing: "0.1em"
              }}>
                FİKİRDEN GERÇEĞE UZANAN YOLCULUK
              </h2>
              <div style={{ width: "60px", height: "1px", background: "#a68966", margin: "2rem auto" }} />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem", maxWidth: "1000px", margin: "0 auto" }}>
              {data.sections.map((step: any, idx: number) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: "flex", 
                    gap: "4rem", 
                    alignItems: "flex-start",
                    padding: "4rem",
                    background: "rgba(255,255,255,0.02)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "20px",
                    position: "relative",
                    overflow: "hidden"
                  }}
                >
                   <div style={{ 
                     fontSize: "6rem", 
                     fontFamily: "var(--font-display)", 
                     color: "rgba(166,137,102,0.1)", 
                     lineHeight: "0.8",
                     userSelect: "none"
                   }}>
                     0{idx + 1}
                   </div>
                   <div style={{ flex: 1 }}>
                     <h4 style={{ 
                       color: "#fff", 
                       fontSize: "1.25rem", 
                       letterSpacing: "0.15em", 
                       marginBottom: "1.5rem",
                       textTransform: "uppercase"
                     }}>
                       {step.title}
                     </h4>
                     <p style={{ 
                       color: "rgba(255,255,255,0.5)", 
                       fontSize: "1.05rem", 
                       lineHeight: "1.8",
                       fontWeight: 300
                     }}>
                       {step.content}
                     </p>
                   </div>
                   {/* Visual accent */}
                   <div style={{ 
                     position: "absolute", 
                     right: 0, 
                     top: 0, 
                     bottom: 0, 
                     width: "4px", 
                     background: "linear-gradient(to bottom, transparent, #a68966, transparent)" 
                   }} />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  );
}

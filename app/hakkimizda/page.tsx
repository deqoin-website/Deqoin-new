"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function AboutUs() {
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const scrolled = window.scrollY;
        imageRef.current.style.transform = `translateY(${scrolled * 0.1}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="site-shell project-detail-shell" style={{ paddingTop: "12rem" }}>
      <div className="section-inner" style={{ paddingBottom: "10rem" }}>
        
        {/* HEADER */}
        <div style={{ marginBottom: "8rem", textAlign: "left" }}>
          <span className="section-small-label" style={{ letterSpacing: "0.5em", color: "rgba(255,255,255,0.4)" }}>
            BİZ KİMİZ
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
          }}>
            Tasarımdan Öte:<br />Yaşam Alanları
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
                backgroundImage: "url('/images/slider/mimari_slide.png')",
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
                fontSize: "1.35rem", 
                lineHeight: "1.6", 
                fontWeight: 300, 
                color: "#fff", 
                margin: 0,
                letterSpacing: "-0.01em"
              }}>
                Bizler sadece fiziksel yapılar inşa etmiyor, sizin için gerçek yaşam alanları kurguluyoruz.
              </p>
              
              <p style={{ 
                fontSize: "1.15rem", 
                lineHeight: "1.9", 
                fontWeight: 300, 
                color: "rgba(255,255,255,0.6)", 
                margin: 0,
                maxWidth: "550px"
              }}>
                Henüz kelimelere dökemediğiniz, belki de henüz farkında olmadığınız ancak deneyimlediğinizde eksikliğini hissettiğiniz o ince dokunuşu çok iyi biliyor ve size tam olarak onu sunuyoruz. Kusursuz bir mimari tasarım, en doğru malzeme ve usta işi bir uygulamayı tek bir çatı altında birleştirerek, aradığınız o bütünsel deneyimi gerçeğe dönüştürüyoruz.
              </p>

              <p style={{ 
                fontSize: "1.15rem", 
                lineHeight: "1.9", 
                fontWeight: 400, 
                color: "#fff", 
                margin: "1rem 0 0",
                borderLeft: "2px solid #fff",
                paddingLeft: "2rem"
              }}>
                Aradığınız vizyon ve kalite, tam olarak burada başlıyor.
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
          gridTemplateColumns: "repeat(3, 1fr)", 
          marginTop: "12rem",
          padding: "7rem 0", 
          borderTop: "1px solid rgba(255,255,255,0.1)", 
          borderBottom: "1px solid rgba(255,255,255,0.1)" 
        }}>
          <div className="stat-col" style={{ alignItems: "center", borderTop: "none", padding: 0 }}>
            <span className="stat-label">DENEYİM</span>
            <span className="stat-value" style={{ fontSize: "3.5rem", fontFamily: "var(--font-smooch)", color: "#fff" }}>10+ YIL</span>
          </div>
          <div className="stat-col" style={{ alignItems: "center", borderTop: "none", padding: 0, borderLeft: "1px solid rgba(255,255,255,0.1)", borderRight: "1px solid rgba(255,255,255,0.1)" }}>
            <span className="stat-label">TESLİM EDİLEN</span>
            <span className="stat-value" style={{ fontSize: "3.5rem", fontFamily: "var(--font-smooch)", color: "#fff" }}>+240 PROJE</span>
          </div>
          <div className="stat-col" style={{ alignItems: "center", borderTop: "none", padding: 0 }}>
            <span className="stat-label">UZMAN EKİP</span>
            <span className="stat-value" style={{ fontSize: "3.5rem", fontFamily: "var(--font-smooch)", color: "#fff" }}>40+ KİŞİ</span>
          </div>
        </div>

      </div>
    </main>
  );
}

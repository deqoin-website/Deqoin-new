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
  const heroImage = "https://zzawgisa3efgdxnm.public.blob.vercel-storage.com/hakkimizda-home.png";
  const stats = data?.stats?.length > 0 ? data.stats : [
    { label: "DENEYİM", value: "10+ YIL" },
    { label: "TESLİM EDİLEN", value: "+240 PROJE" },
    { label: "UZMAN EKİP", value: "40+ KİŞİ" }
  ];

  return (
    <main className="site-shell project-detail-shell about-page-shell">
      <div className="section-inner about-page-inner">
        
        {/* HEADER */}
        <div className="about-page-header">
          <span className="section-small-label about-page-kicker">
            {subtitle}
          </span>
          <h1
            className="about-page-title"
            dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }}
          />
        </div>

        {/* SPLIT CONTENT SECTION */}
        <div className="about-page-split">
          
          {/* IMAGE SIDE */}
          <div className="about-page-visual">
            <div 
              ref={imageRef}
              className="about-page-image"
              style={{ backgroundImage: `url('${heroImage}')` }}
            />
            <div className="about-page-image-overlay" />
          </div>

          {/* TEXT SIDE */}
          <div className="about-page-copy">
            <div className="about-page-copy-block">
              <p className="about-page-description">
                {description}
              </p>
            </div>

            <div className="about-page-cta-wrap">
              <Link href="/departman-ekipleri" className="premium-all-btn about-page-cta">
                <span className="premium-btn-text">EKİBİMİZİ TANIYIN</span>
                <span className="material-symbols-outlined premium-btn-icon">east</span>
              </Link>
            </div>
          </div>
        </div>

        {/* BOTTOM STATS */}
        <div
          className="stats-container about-page-stats"
          style={{ gridTemplateColumns: `repeat(${stats.length}, minmax(0, 1fr))` }}
        >
          {stats.map((stat: any, idx: number) => (
            <div
              key={idx}
              className="stat-col about-page-stat"
              style={{ borderLeft: idx !== 0 ? "1px solid rgba(255,255,255,0.1)" : "none" }}
            >
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value about-page-stat-value">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* DYNAMIC WORKFLOW SECTION */}
        {data?.sections && data.sections.length > 0 && (
          <section className="about-page-workflow">
            <div className="about-page-workflow-header">
              <span className="section-small-label about-page-workflow-kicker">PROFESYONEL İŞ AKIŞI</span>
              <h2 className="about-page-workflow-title">
                FİKİRDEN GERÇEĞE UZANAN YOLCULUK
              </h2>
              <div className="about-page-workflow-line" />
            </div>

            <div className="about-page-workflow-list">
              {data.sections.map((step: any, idx: number) => (
                <div key={idx} className="about-page-step-card">
                   <div className="about-page-step-num">
                     0{idx + 1}
                   </div>
                   <div className="about-page-step-copy">
                     <h4 className="about-page-step-title">
                       {step.title}
                     </h4>
                     <p className="about-page-step-text">
                       {step.content}
                     </p>
                   </div>
                   <div className="about-page-step-accent" />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
      <style jsx>{`
        .about-page-shell {
          padding-top: 12rem;
        }

        .about-page-inner {
          padding-bottom: 10rem;
        }

        .about-page-header {
          margin-bottom: 8rem;
          text-align: left;
        }

        .about-page-kicker {
          letter-spacing: 0.5em;
          color: rgba(255, 255, 255, 0.4);
        }

        .about-page-title {
          font-family: var(--font-smooch), sans-serif;
          font-size: clamp(3rem, 8vw, 5.5rem);
          font-weight: 100;
          color: #fff;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin: 1rem 0 0;
          line-height: 1.1;
        }

        .about-page-split {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: clamp(3rem, 6vw, 8rem);
          align-items: flex-start;
        }

        .about-page-visual {
          position: relative;
          min-height: 750px;
          overflow: hidden;
          box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5);
        }

        .about-page-image {
          position: absolute;
          inset: -10% 0;
          background-size: cover;
          background-position: center;
          filter: grayscale(0.1) contrast(1.05);
        }

        .about-page-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(10, 10, 10, 0.8), transparent);
        }

        .about-page-copy {
          display: flex;
          flex-direction: column;
          gap: 3rem;
          padding-top: 2rem;
          min-width: 0;
        }

        .about-page-copy-block {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .about-page-description {
          font-size: 1.25rem;
          line-height: 1.8;
          font-weight: 300;
          color: #fff;
          margin: 0;
          letter-spacing: -0.01em;
          white-space: pre-wrap;
        }

        .about-page-cta-wrap {
          margin-top: 3rem;
        }

        .about-page-cta {
          padding: 1.2rem 3.5rem;
        }

        .about-page-stats {
          margin-top: 12rem;
          padding: 7rem 0;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .about-page-stat {
          align-items: center;
          border-top: none;
          padding: 0;
        }

        .about-page-stat-value {
          font-size: 3.5rem;
          font-family: var(--font-smooch);
          font-weight: 100;
          color: #fff;
        }

        .about-page-workflow {
          margin-top: 15rem;
        }

        .about-page-workflow-header {
          text-align: center;
          margin-bottom: 8rem;
        }

        .about-page-workflow-kicker {
          color: #a68966;
          letter-spacing: 0.4em;
        }

        .about-page-workflow-title {
          font-family: var(--font-smooch), sans-serif;
          font-size: clamp(2.5rem, 6vw, 4rem);
          font-weight: 100;
          color: #fff;
          margin-top: 1.5rem;
          letter-spacing: 0.1em;
          line-height: 1;
        }

        .about-page-workflow-line {
          width: 60px;
          height: 1px;
          background: #a68966;
          margin: 2rem auto;
        }

        .about-page-workflow-list {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }

        .about-page-step-card {
          display: flex;
          gap: 4rem;
          align-items: flex-start;
          padding: 4rem;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .about-page-step-num {
          font-size: 6rem;
          font-family: var(--font-display);
          color: rgba(166, 137, 102, 0.1);
          line-height: 0.8;
          user-select: none;
          flex-shrink: 0;
        }

        .about-page-step-copy {
          flex: 1;
          min-width: 0;
        }

        .about-page-step-title {
          color: #fff;
          font-family: var(--font-smooch), sans-serif;
          font-weight: 300;
          font-size: 1.8rem;
          letter-spacing: 0.1em;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          line-height: 1.2;
        }

        .about-page-step-text {
          color: rgba(255, 255, 255, 0.5);
          font-size: 1.05rem;
          line-height: 1.8;
          font-weight: 300;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .about-page-step-accent {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 4px;
          background: linear-gradient(to bottom, transparent, #a68966, transparent);
        }

        @media (max-width: 1024px) {
          .about-page-shell {
            padding-top: 10rem;
          }

          .about-page-inner {
            padding-bottom: 7rem;
          }

          .about-page-header {
            margin-bottom: 4rem;
          }

          .about-page-split {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .about-page-visual {
            min-height: 560px;
          }

          .about-page-copy {
            padding-top: 0;
            gap: 2rem;
          }

          .about-page-cta-wrap {
            margin-top: 1rem;
          }

          .about-page-stats {
            margin-top: 6rem;
            padding: 3rem 0;
            grid-template-columns: 1fr;
          }

          .about-page-stat {
            padding: 1.5rem 0;
            border-left: none !important;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
          }

          .about-page-stat:first-child {
            border-top: none;
          }

          .about-page-workflow {
            margin-top: 7rem;
          }

          .about-page-workflow-header {
            margin-bottom: 3rem;
          }

          .about-page-step-card {
            gap: 1.5rem;
            padding: 2rem 1.5rem;
          }

          .about-page-step-num {
            font-size: 3.4rem;
          }
        }

        @media (max-width: 767px) {
          .about-page-shell {
            padding-top: 8.5rem;
          }

          .about-page-title {
            font-size: clamp(2.2rem, 10vw, 3.4rem);
            line-height: 1.08;
            letter-spacing: 0.04em;
          }

          .about-page-kicker {
            letter-spacing: 0.32em;
          }

          .about-page-visual {
            min-height: 380px;
          }

          .about-page-description {
            font-size: 1rem;
            line-height: 1.75;
          }

          .about-page-cta {
            width: 100%;
            justify-content: space-between;
            padding: 1rem 1.15rem;
          }

          .about-page-stats {
            margin-top: 4.5rem;
            padding: 2rem 0;
          }

          .about-page-stat-value {
            font-size: 2.5rem;
          }

          .about-page-workflow {
            margin-top: 5rem;
          }

          .about-page-workflow-title {
            font-size: clamp(1.55rem, 7vw, 2.1rem);
            line-height: 1.35;
            letter-spacing: 0.08em;
          }

          .about-page-step-card {
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem 1.1rem;
            border-radius: 16px;
          }

          .about-page-step-num {
            font-size: 2.6rem;
          }

          .about-page-step-title {
            font-size: 0.92rem;
            margin-bottom: 0.8rem;
            letter-spacing: 0.11em;
          }

          .about-page-step-text {
            font-size: 0.92rem;
            line-height: 1.7;
          }

          .about-page-step-accent {
            width: 100%;
            height: 3px;
            top: auto;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to right, transparent, #a68966, transparent);
          }
        }
      `}</style>
    </main>
  );
}

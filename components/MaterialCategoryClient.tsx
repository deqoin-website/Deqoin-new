"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ConsultationModal from "./ConsultationModal";
import MaterialProjectShowcase from "./MaterialProjectShowcase";
import SwipeAppointmentButton from "./SwipeAppointmentButton";
import { MateryalKategori } from "../data/materyal-studyo";
import { projectsData } from "../data/projects";

type MaterialCategoryClientProps = {
  category: MateryalKategori;
};

export default function MaterialCategoryClient({ category }: MaterialCategoryClientProps) {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  
  const [currentSlide, setCurrentSlide] = useState(0);
  const heroSlides = category.sliderImages && category.sliderImages.length > 0 
    ? category.sliderImages 
    : [category.image];

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  return (
    <>
      <section className="studio-hero">
        <div className="studio-hero-slider">
          {heroSlides.map((img, idx) => (
            <div 
              key={idx} 
              className={`studio-hero-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${img})` }}
            />
          ))}
        </div>

        <div className="studio-hero-blur-overlay" />
        <div className="studio-hero-dark-overlay" />

        <div className="studio-hero-content">
          <span className="section-small-label" style={{ color: "#cca883", marginBottom: "1rem", display: "block" }}>
            MATERIAL STUDIO — ÜRÜN & MALZEME
          </span>
          <h1>{category.title.toUpperCase()}</h1>
          <p>Mimari Vizyonu Tamamlayan Üst Segment Çözümler.</p>
          <div className="studio-hero-line" />
          
          <div className="mimari-hero-actions" style={{ justifyContent: "center", marginTop: "3rem" }}>
            <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
            <Link href={`/galeri?material=${category.slug}`} className="mimari-ghost-btn">
              <span>Galeriyi İncele</span>
              <span className="material-symbols-outlined">east</span>
            </Link>
          </div>
        </div>

        <div className="mimari-hero-scroll-hint">
          <span className="vertical-text">Detayları Gör</span>
          <div className="scroll-line" />
        </div>
      </section>

      <div className="no-retail-notice" style={{ marginTop: "4rem", marginBottom: "0" }}>
        <div className="notice-inner">
          <span className="material-symbols-outlined">info</span>
          <p>BU ÜRÜN GRUBU YALNIZCA KENDİ PROJELERİMİZ İÇİN ENTEGRE EDİLMEKTEDİR; PERAKENDE SATIŞIMIZ YOKTUR.</p>
        </div>
      </div>

      <section className="mimari-manifesto">
        <div className="mimari-manifesto-inner">
          <div className="mimari-manifesto-label">
            <span className="vertical-text">{category.sideLabel}</span>
          </div>
          <div className="mimari-manifesto-body">
            <span className="section-small-label">VİZYONUMUZ</span>
            <h2 className="mimari-quote" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", lineHeight: "1.2", marginBottom: "3rem" }}>
              {category.longDescription?.title}
            </h2>
            <div className="mimari-manifesto-text">
              {category.longDescription?.content.map((paragraph, index) => (
                <p key={index} style={{ marginBottom: "2rem" }}>
                  {paragraph.split("**").map((part, i) => (i % 2 === 1 ? <strong key={i} style={{ color: "#fff" }}>{part}</strong> : part))}
                </p>
              ))}
            </div>

            <div style={{ marginTop: "4rem" }}>
              <SwipeAppointmentButton onActivate={() => setIsConsultationOpen(true)} />
            </div>
          </div>
        </div>
      </section>

      <MaterialProjectShowcase materialSlug={category.slug} materialTitle={category.title} projects={projectsData} customCategories={category.categories} />

      <section style={{ padding: "4rem 2rem", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <Link href="/materyal-studyo" className="mimari-ghost-btn" style={{ margin: "0 auto" }}>
          <span className="material-symbols-outlined" style={{ marginRight: "1rem", transform: "rotate(180deg)" }}>arrow_right_alt</span>
          <span>Material Studio Ana Sayfası</span>
        </Link>
      </section>

      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ConsultationModal from "./ConsultationModal";

export default function Footer() {
  const [settings, setSettings] = useState<any>(null);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const pathSegments = pathname.split("/").filter(Boolean);
  const isDepartmentDetailPage =
    pathSegments.length === 2 &&
    ["mimari", "materyal-studyo", "uygulama"].includes(pathSegments[0]);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        setSettings(data);
        if (data.logoUrl) {
          localStorage.setItem('deqoin_logo', data.logoUrl);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  if (pathname.startsWith('/admin') || isDepartmentDetailPage) {
    return null;
  }

  // Fallback defaults
  const logoUrl = settings?.logoUrl || "/images/logo-new.jpeg";
  const address = settings?.address || "350 Evler Mah. Ali Dirikoç Blv. Sena Apartmanı No: 13 İç Kapı No: Z01 Merkez / NEVŞEHİR";
  const tagline = settings?.studioName ? `${settings.studioName} Studio` : "Mimari, Tasarım ve Uygulama alanlarında dünya standartları.";
  const social = settings?.socialLinks || {};

  const footerNav = [
    {
      label: "Hizmetler",
      links: [
        { href: "/mimari", text: "Design Studio" },
        { href: "/materyal-studyo", text: "Material Studio" },
        { href: "/uygulama", text: "Execution Studio" },
      ],
    },
    {
      label: "Kurumsal",
      links: [
        { href: "/hakkimizda", text: "Hakkımızda" },
        { href: "/departman-ekipleri", text: "Departman Ekipleri" },
        { href: "/faaliyet-alanlarimiz", text: "Design & Collection" },
        { href: "/galeri", text: "Galeri" },
      ],
    },
    {
      label: "Randevu",
      links: [
        { href: "/iletisim", text: "Randevu Talep Et" },
        { href: `mailto:${settings?.contactEmail || 'info@deqoin.com'}`, text: settings?.contactEmail || "info@deqoin.com" },
      ],
    },
  ];

  return (
    <footer className={`site-footer ${pathname === "/" ? "homepage-footer-snap" : ""}`.trim()}>
      {/* ── TOP STRIP ── */}
      <div className="footer-top">
        <div className="footer-top-inner">
          <div className="footer-cta-block">
            <span className="footer-cta-label">Bir Projeniz mi Var?</span>
            <h2 className="footer-cta-title">
              Şimdi<br />tasarlayalım.
            </h2>
            <button
              type="button"
              className="footer-cta-btn hero-cta"
              onClick={() => setIsConsultationOpen(true)}
            >
              <span className="hero-cta-text">RANDEVU TALEP ET</span>
              <div className="hero-cta-circle">
                <span className="material-symbols-outlined">arrow_right_alt</span>
              </div>
            </button>
          </div>

          <div className="footer-address-block">
            <span className="footer-nav-label">Ofis Adresimiz</span>
            <address className="footer-address" style={{ whiteSpace: 'pre-wrap' }}>
              {address}
            </address>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className="footer-divider" />

      {/* ── MAIN GRID ── */}
      <div className="footer-main">
        {/* Logo + tagline */}
        <div className="footer-brand">
          <Link href="/" aria-label="DEQOIN Ana Sayfa">
            <img
              src={logoUrl}
              alt="DEQOIN"
              className="footer-logo"
            />
          </Link>
          <p className="footer-tagline">
            {tagline}
          </p>
          <div className="footer-socials">
            {social.instagram && (
              <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
                </svg>
              </a>
            )}
            {social.linkedin && (
              <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            )}
            {social.facebook && (
              <a href={social.facebook} target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
                </svg>
              </a>
            )}
          </div>
        </div>

        {/* Nav columns */}
        {footerNav.map((col) => (
          <div key={col.label} className="footer-nav-col">
            <span className="footer-nav-label">{col.label}</span>
            <ul className="footer-nav-list">
              {col.links.map((link) => (
                <li key={link.text}>
                  <Link href={link.href} className="footer-nav-link">
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="footer-bottom">
        <span className="footer-copy">
          © {year} {settings?.studioName || 'DEQOIN'} Architectural Studio. Tüm hakları saklıdır.
        </span>
        <span className="footer-bottom-tag">
          Nevşehir, Türkiye — Est. 2014
        </span>
      </div>

      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </footer>
  );
}

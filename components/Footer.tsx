"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ConsultationModal from "./ConsultationModal";

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
      { href: "mailto:randevu@deqoin.com", text: "randevu@deqoin.com" },
      { href: "mailto:info@deqoin.com", text: "info@deqoin.com" },
    ],
  },
];

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState("");
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const pathname = usePathname();
  const year = new Date().getFullYear();

  useEffect(() => {
    // Check cache first
    const cachedLogo = localStorage.getItem('deqoin_logo');
    if (cachedLogo) setLogoUrl(cachedLogo);

    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        const data = await res.json();
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
          localStorage.setItem('deqoin_logo', data.logoUrl);
        }
      } catch (err) {
        console.error("Failed to fetch settings:", err);
      }
    };
    fetchSettings();
  }, []);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="site-footer">
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
            <address className="footer-address">
              350 Evler Mah. Ali Dirikoç Blv.<br />
              Sena Apartmanı No: 13<br />
              İç Kapı No: Z01<br />
              Merkez / NEVŞEHİR
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
            Mimari, Tasarım ve Uygulama<br />alanlarında dünya standartları.
          </p>
          <div className="footer-socials">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="LinkedIn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Pinterest">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.236 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.181-.78 1.172-4.97 1.172-4.97s-.299-.598-.299-1.482c0-1.388.806-2.428 1.808-2.428.852 0 1.265.64 1.265 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.806 1.476 1.806 1.772 0 2.977-2.3 2.977-5.023 0-2.07-1.39-3.62-3.913-3.62-2.859 0-4.641 2.14-4.641 4.54 0 .825.24 1.408.619 1.855.174.206.198.288.135.524-.045.174-.149.598-.191.764-.063.24-.25.325-.46.236-1.29-.528-1.89-1.942-1.89-3.54 0-2.64 2.237-5.86 6.68-5.86 3.608 0 5.985 2.63 5.985 5.453 0 3.752-2.086 6.579-5.14 6.579-1.031 0-2.001-.557-2.334-1.185l-.637 2.454c-.208.783-.608 1.566-.972 2.178.73.224 1.504.344 2.306.344 5.523 0 10-4.477 10-10S17.523 2 12 2z"/>
              </svg>
            </a>
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
          © {year} DEQOIN Architectural Studio. Tüm hakları saklıdır.
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

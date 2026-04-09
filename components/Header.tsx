"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { projectsData } from "../data/projects";
import { teamMembers } from "../data/team";
import ConsultationModal from "./ConsultationModal";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");
  const [isLogoLoaded, setIsLogoLoaded] = useState(false);
  const pathname = usePathname();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isMenuOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [isMenuOpen, isSearchOpen]);

  // Scroll detection for frosted glass header
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // run once on mount
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    } else {
      setSearchQuery(""); // clear when closed
    }
  }, [isSearchOpen]);
  
  // Fetch site settings (logo)
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

  // Close menus when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Compute live search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { projects: [], team: [] };
    
    const query = searchQuery.toLowerCase();
    
    const filteredProjects = projectsData.filter(p => 
      p.title.toLowerCase().includes(query) || 
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );

    const filteredTeam = teamMembers.filter(t => 
      t.name.toLowerCase().includes(query) || 
      t.role.toLowerCase().includes(query) ||
      t.category.toLowerCase().includes(query)
    );

    return { projects: filteredProjects, team: filteredTeam };
  }, [searchQuery]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <div className={`mobile-menu-overlay ${isMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-header">
          <button className="icon-button close-button" type="button" onClick={() => setIsMenuOpen(false)} aria-label="Kapat">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <nav className="mobile-menu-nav">
          <Link href="/#hero-slider" onClick={() => setIsMenuOpen(false)}>Ana Sayfa</Link>
          <Link href="/faaliyet-alanlarimiz" onClick={() => setIsMenuOpen(false)}>Design & Collection</Link>
          <Link href="/galeri" onClick={() => setIsMenuOpen(false)}>Galeri</Link>
          <Link href="/hakkimizda" onClick={() => setIsMenuOpen(false)}>Hakkımızda</Link>
          <Link href="/iletisim" onClick={() => setIsMenuOpen(false)}>
            İLETİŞİM
          </Link>
        </nav>
        <div className="mobile-menu-footer">
          <span>DEQOIN ARCHITECTURAL STUDIO</span>
        </div>
      </div>

      {/* World-Class Search Overlay */}
      <div className={`search-overlay-master ${isSearchOpen ? "open" : ""}`}>
        <div className="search-overlay-header">
          <button className="icon-button close-button" type="button" onClick={() => setIsSearchOpen(false)} aria-label="Aramayı Kapat">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="search-overlay-content">
          <div className="search-input-wrapper">
            <span className="material-symbols-outlined search-icon-massive">search</span>
            <input 
              ref={searchInputRef}
              type="text" 
              className="huge-search-input" 
              placeholder="Keşfet..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="search-results-container">
            {searchQuery.trim() !== "" && searchResults.projects.length === 0 && searchResults.team.length === 0 && (
              <div className="no-results-msg">"{searchQuery}" için sonuç bulunamadı.</div>
            )}

            {searchResults.projects.length > 0 && (
              <div className="results-group">
                <span className="results-label">GALERİ</span>
                <div className="results-grid">
                  {searchResults.projects.map(p => (
                    <Link href={`/galeri/${p.slug}`} key={`proj-${p.slug}`} className="search-result-card" onClick={() => setIsSearchOpen(false)}>
                      <div className="result-img-wrap">
                        <img src={p.coverImage} alt={p.title} />
                      </div>
                      <div className="result-info">
                        <h4>{p.title}</h4>
                        <span>{p.category}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchResults.team.length > 0 && (
              <div className="results-group" style={{ marginTop: '3rem' }}>
                <span className="results-label">EKİP</span>
                <div className="results-grid">
                  {searchResults.team.map(t => (
                    <Link href={`/departman-ekipleri`} key={`team-${t.id}`} className="search-result-card" onClick={() => setIsSearchOpen(false)}>
                      <div className="result-img-wrap team-style">
                        <img src={t.image} alt={t.name} />
                      </div>
                      <div className="result-info">
                        <h4>{t.name}</h4>
                        <span>{t.role}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <header className={`topbar${isScrolled ? " scrolled" : ""}`}>
        <nav className="topbar-nav">
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="Menu" onClick={() => setIsMenuOpen(true)}>
              <span className="material-symbols-outlined">menu</span>
            </button>
            <button className="icon-button" type="button" aria-label="Search" onClick={() => setIsSearchOpen(true)}>
              <span className="material-symbols-outlined">search</span>
            </button>
          </div>
          <div className="topbar-brand">
            <div className="topbar-links">
              <Link href="/">Ana Sayfa</Link>
              <Link href="/faaliyet-alanlarimiz">Design & Collection</Link>
              <Link href="/galeri">Galeri</Link>
              <Link href="/hakkimizda">Hakkımızda</Link>
              <Link href="/iletisim" className="topbar-nav-button">
                İLETİŞİM
              </Link>
            </div>
            <Link href="/" className="brand-mark">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt="DEQOIN Architectural Studio"
                  className="topbar-logo"
                  onLoad={() => setIsLogoLoaded(true)}
                  style={{ 
                    opacity: isLogoLoaded ? 1 : 0,
                    transition: 'opacity 0.4s ease-in-out'
                  }}
                />
              )}
            </Link>
          </div>
        </nav>
      </header>
      <ConsultationModal 
        isOpen={isConsultationOpen} 
        onClose={() => setIsConsultationOpen(false)} 
      />
    </>
  );
}

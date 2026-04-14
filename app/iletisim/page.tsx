"use client";

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function IletisimPage() {
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
        }
      } catch (err) {
        console.error("Settings fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  if (loading) return (
    <div className="site-shell" style={{ height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 className="animate-spin" size={48} color="#a68966" />
    </div>
  );

  // Defaults fallback
  const email = settings?.contactEmail || "info@deqoin.com";
  const address = settings?.address || "350 Evler Mah. Ali Dirikoç Blv. Sena Apartmanı No: 13 İç Kapı No: Z01 Merkez / NEVŞEHİR";
  const mapUrl = settings?.googleMapsUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3111.45!2d34.71!3d38.63!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x152a6078e8b61e2f%3A0x6b8a8b1b1b1b1b1b!2sAli%20Diriko%C3%A7%20Blv.%2C%20Nev%C5%9Fehir!5e0!3m2!1str!2str!4v1712218000000!5m2!1str!2str";

  return (
    <main className="contact-page-master">
      <section className="worldwide-section">
        <div className={`contact-map-bg ${isCardOpen ? 'map-zoomed' : ''}`} />
        <div className={`contact-grid-lines ${isCardOpen ? 'fade-out' : ''}`}>
          <div className="v-line" />
          <div className="v-line" />
          <div className="v-line" />
          <div className="v-line" />
          <div className="v-line" />
        </div>

        <div className="contact-pointer-group">
          <div className="cp-title-wrap">
            <h2>WE ARE <span className="highlight-text">WORLDWIDE</span></h2>
          </div>
        </div>
          
        <div className={`cp-pointer-wrapper ${isCardOpen ? 'card-open-active' : ''}`}>
          <button 
            className={`cp-pointer-dot ${isCardOpen ? 'active' : ''}`} 
            type="button" 
            onClick={() => setIsCardOpen(!isCardOpen)}
            aria-label="Lokasyon detaylarını görüntüle"
          >
            <div className="cp-pulse" />
          </button>
        </div>

        <div className={`cp-info-card ${isCardOpen ? 'card-visible' : ''}`}>
          <h4>NEVŞEHİR - <br /><span>TÜRKİYE</span></h4>
          <div className="cp-info-content">
            <p>E-Posta: {email}</p>
            {settings?.phone && <p>Telefon: {settings.phone}</p>}
            <br />
            <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{address}</p>
          </div>
        </div>

        <div className="contact-footer-title">
          <div className="watermark">Randevu</div>
          <h3>RANDEVU TALEP EDİN</h3>
        </div>
      </section>

      <section className="google-map-section">
        <div className="map-header">
          <span className="location-label">MERKEZ OFİSİMİZ</span>
          <h4>NEVŞEHİR, TÜRKİYE</h4>
        </div>
        <div className="map-frame-wrapper">
          <iframe 
            src={mapUrl}
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Deqoin Office Location"
          ></iframe>
          <div className="map-overlay-vignette" />
        </div>
      </section>
    </main>
  );
}

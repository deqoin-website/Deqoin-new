'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, Instagram, Linkedin } from 'lucide-react';
import Link from 'next/link';

export default function MaintenancePage() {
  return (
    <div className="maintenance-wrapper">
      <div className="background-overlay" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="maintenance-content"
      >
        <div className="logo-container">
          <h1 className="studio-name">DEQOIN</h1>
          <div className="divider" />
          <p className="subtitle">ARCHITECTURAL DESIGN STUDIO</p>
        </div>

        <div className="message-container">
          <h2>Şu an Bakımdayız</h2>
          <p>Sizlere daha iyi bir deneyim sunmak için dijital vitrinimizi güncelliyoruz. Çok yakında yeni projelerimiz ve vizyonumuzla tekrar burada olacağız.</p>
        </div>

        <div className="contact-info">
          <div className="contact-item">
            <Mail size={18} />
            <a href="mailto:info@deqoin.com">info@deqoin.com</a>
          </div>
          <div className="contact-item">
            <Phone size={18} />
            <a href="tel:+905555555555">+90 5XX XXX XX XX</a>
          </div>
        </div>

        <div className="social-links">
          <Link href="#" className="social-icon"><Instagram size={20} /></Link>
          <Link href="#" className="social-icon"><Linkedin size={20} /></Link>
        </div>

        <div className="admin-access">
          <Link href="/admin/login">Yönetici Girişi</Link>
        </div>
      </motion.div>

      <style jsx>{`
        .maintenance-wrapper {
          min-height: 100vh;
          background: #080808;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
          color: #fff;
          position: relative;
          overflow: hidden;
          font-family: var(--font-body), sans-serif;
        }

        .background-overlay {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, rgba(166, 137, 102, 0.05) 0%, transparent 70%);
          pointer-events: none;
        }

        .maintenance-content {
          max-width: 600px;
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .logo-container {
          margin-bottom: 4rem;
        }

        .studio-name {
          font-family: var(--font-display), sans-serif;
          font-size: 3.5rem;
          letter-spacing: 0.3em;
          margin: 0;
          font-weight: 200;
        }

        .divider {
          width: 50px;
          height: 1px;
          background: #a68966;
          margin: 1.5rem auto;
        }

        .subtitle {
          font-size: 0.75rem;
          letter-spacing: 0.5em;
          color: #a68966;
          margin: 0;
          font-weight: 700;
        }

        .message-container h2 {
          font-family: var(--font-headline), serif;
          font-size: 2rem;
          margin-bottom: 1.5rem;
        }

        .message-container p {
          font-size: 1rem;
          line-height: 1.8;
          opacity: 0.6;
          font-weight: 300;
        }

        .contact-info {
          margin-top: 4rem;
          display: flex;
          justify-content: center;
          gap: 3rem;
        }

        .contact-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 0.9rem;
          opacity: 0.8;
          transition: opacity 0.3s;
        }

        .contact-item:hover { opacity: 1; color: #a68966; }
        .contact-item a { color: inherit; text-decoration: none; }

        .social-links {
          margin-top: 3rem;
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }

        .social-icon {
          color: rgba(255,255,255,0.3);
          transition: all 0.3s;
        }

        .social-icon:hover { color: #a68966; transform: translateY(-3px); }

        .admin-access {
          margin-top: 5rem;
          opacity: 0.2;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
        }
        .admin-access a { color: inherit; text-decoration: none; }
        .admin-access a:hover { opacity: 1; color: #a68966; }

        @media (max-width: 768px) {
          .studio-name { font-size: 2.5rem; }
          .contact-info { flex-direction: column; gap: 1.5rem; align-items: center; }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, FolderKanban, Aperture, ArrowUpRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newAppointments: 0,
    activeProjects: 0,
    activeStudios: 0
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real scenario, this fetches from multiple API endpoints or an aggregate dashboard API
    // We will simulate the fetch for this CMS architecture implementation
    setTimeout(() => {
      setStats({
        newAppointments: 5,
        activeProjects: 24,
        activeStudios: 3
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1] as const, duration: 0.8 } }
  };

  return (
    <motion.div 
      className="dashboard-container"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <motion.div variants={itemVariants} className="dashboard-header">
        <h2>Sisteme Tekrar Hoş Geldiniz</h2>
        <p>Tüm stüdyo etkinliklerini ve randevularınızı buradan takip edebilirsiniz.</p>
      </motion.div>

      <div className="stats-grid">
        <motion.div variants={itemVariants} className="admin-card stat-card">
          <div className="stat-icon-wrapper appointment-icon">
            <MessageSquare size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Bekleyen Randevu Talepleri</span>
            {isLoading ? <div className="skeleton-text"></div> : <div className="stat-value">{stats.newAppointments}</div>}
          </div>
          <Link href="/admin/crm" className="stat-link">
            İncele <ArrowUpRight size={16} />
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-card stat-card">
          <div className="stat-icon-wrapper project-icon">
            <FolderKanban size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Aktif Yayınlanan Projeler</span>
            {isLoading ? <div className="skeleton-text"></div> : <div className="stat-value">{stats.activeProjects}</div>}
          </div>
          <Link href="/admin/projects" className="stat-link">
            Yönet <ArrowUpRight size={16} />
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-card stat-card">
          <div className="stat-icon-wrapper studio-icon">
            <Aperture size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-label">Aktif Stüdyo Sayısı</span>
            {isLoading ? <div className="skeleton-text"></div> : <div className="stat-value">{stats.activeStudios}</div>}
          </div>
          <Link href="/admin/studios" className="stat-link">
            Düzenle <ArrowUpRight size={16} />
          </Link>
        </motion.div>
      </div>

      <div className="dashboard-grid">
        <motion.div variants={itemVariants} className="admin-card recent-activity">
          <div className="card-header">
            <h3>Son Etkinlikler</h3>
            <button className="text-btn">Tümünü Gör</button>
          </div>
          <div className="activity-list">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="activity-item">
                <div className="activity-icon"><Clock size={16} /></div>
                <div className="activity-details">
                  <p>Yeni bir randevu talebi ulaştı (Tasarım Stüdyosu).</p>
                  <span>{i + 1} saat önce</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-card cinematic-control-card">
          <div className="card-bg-decoration"></div>
          <div className="cinematic-content">
            <div className="cinematic-badge">CANLI DENEYİM</div>
            <h3>SİNEMATİK MEDYA & SLIDER</h3>
            <p>Anasayfa snap-scroll geçişlerini, sloganları ve arka plan efektlerini yönetin.</p>
            <div className="cinematic-actions">
               <Link href="/admin/content/slider" className="premium-manage-btn">
                 DENEYİMİ YÖNET <ArrowUpRight size={18} />
               </Link>
               <div className="status-indicators">
                 <div className="indicator"><div className="dot"></div> Video Desteği Aktif</div>
                 <div className="indicator"><div className="dot"></div> Blur & Overlay Aktif</div>
               </div>
            </div>
          </div>
          <div className="cinematic-visual-hint">
             <Aperture size={80} strokeWidth={0.5} />
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-card quick-actions">
          <div className="card-header">
            <h3>Hızlı İşlemler</h3>
          </div>
          <div className="actions-list">
            <Link href="/admin/projects" className="action-btn">
              <FolderKanban size={20} />
              Yeni Proje Yükle
            </Link>
            <Link href="/admin/crm" className="action-btn">
              <MessageSquare size={20} />
              Randevuları Kontrol Et
            </Link>
            <Link href="/admin/content/workflow" className="action-btn">
               <Briefcase size={20} />
               İş Akışını Düzenle
            </Link>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .dashboard-header h2 {
          font-family: var(--font-display), sans-serif;
          font-size: 2rem;
          font-weight: 300;
          color: #fff;
          margin: 0 0 0.5rem 0;
        }

        .dashboard-header p {
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          margin: 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          position: relative;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          overflow: hidden;
        }

        .stat-icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
        }

        .appointment-icon { color: #a68966; background: rgba(166, 137, 102, 0.1); }
        .project-icon { color: #bf1f5a; background: rgba(191, 31, 90, 0.1); }
        .studio-icon { color: #4dabf7; background: rgba(77, 171, 247, 0.1); }

        .stat-content {
          display: flex;
          flex-direction: column;
          z-index: 2;
        }

        .stat-label {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-family: var(--font-display), sans-serif;
          font-size: 2.5rem;
          font-weight: 300;
          color: #fff;
          line-height: 1;
        }

        .skeleton-text {
          height: 2.5rem;
          width: 50px;
          background: rgba(255,255,255,0.05);
          border-radius: 4px;
          animation: pulse 1.5s infinite;
        }

        .stat-link {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.3s ease;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          z-index: 2;
        }

        .stat-link:hover { color: #fff; }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.5rem;
        }

        .card-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .card-header h3 {
          font-size: 1rem;
          font-weight: 500;
          color: #fff;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .text-btn {
          background: transparent;
          border: none;
          color: #a68966;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.02);
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.02);
        }

        .activity-icon {
          color: rgba(255,255,255,0.3);
          padding-top: 2px;
        }

        .activity-details p {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: rgba(255,255,255,0.8);
        }

        .activity-details span {
          font-size: 0.7rem;
          color: rgba(255,255,255,0.4);
        }

        .actions-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .action-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          border-radius: 8px;
          color: #fff;
          text-decoration: none;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.3s ease;
        }

        .action-btn:hover {
          background: rgba(166, 137, 102, 0.1);
          border-color: rgba(166, 137, 102, 0.3);
          color: #a68966;
        }

        /* CINEMATIC CARD */
        .cinematic-control-card {
          position: relative;
          background: linear-gradient(135deg, rgba(166, 137, 102, 0.1) 0%, rgba(0, 0, 0, 0) 100%);
          border: 1px solid rgba(166, 137, 102, 0.2);
          overflow: hidden;
          padding: 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-bg-decoration {
          position: absolute;
          top: -20%;
          right: -10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(166, 137, 102, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
          filter: blur(40px);
          pointer-events: none;
        }

        .cinematic-content {
          position: relative;
          z-index: 2;
          max-width: 60%;
        }

        .cinematic-badge {
          display: inline-block;
          background: rgba(166, 137, 102, 0.15);
          color: #a68966;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.6rem;
          font-weight: 800;
          letter-spacing: 0.2em;
          margin-bottom: 1.5rem;
        }

        .cinematic-content h3 {
          font-family: var(--font-display), sans-serif;
          font-size: 1.5rem;
          color: #fff;
          margin: 0 0 1rem 0;
          letter-spacing: 0.1em;
        }

        .cinematic-content p {
          color: rgba(255,255,255,0.5);
          font-size: 0.9rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .cinematic-actions {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .premium-manage-btn {
          background: #a68966;
          color: #000;
          padding: 1rem 2rem;
          border-radius: 4px;
          text-decoration: none;
          font-weight: 800;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          transition: all 0.3s ease;
        }

        .premium-manage-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(166, 137, 102, 0.3);
        }

        .status-indicators {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .indicator {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          font-weight: 600;
          letter-spacing: 0.05em;
        }

        .dot {
          width: 6px;
          height: 6px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.5);
        }

        .cinematic-visual-hint {
          color: rgba(166, 137, 102, 0.1);
          transform: rotate(-15deg);
        }

        @keyframes pulse {
          0% { opacity: 0.5; }
          50% { opacity: 0.8; }
          100% { opacity: 0.5; }
        }

        @media (max-width: 1024px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </motion.div>
  );
}

'use client';

import { motion } from 'framer-motion';
import { FolderKanban, Users, Eye, TrendingUp } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Toplam Proje', value: '12', icon: FolderKanban, color: '#a68966' },
    { name: 'Ekip Üyeleri', value: '8', icon: Users, color: '#a68966' },
    { name: 'Aylık İzlenme', value: '2.4k', icon: Eye, color: '#a68966' },
    { name: 'Dönüşüm Oranı', value: '%14', icon: TrendingUp, color: '#a68966' },
  ];

  return (
    <div className="dashboard-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="stats-grid"
      >
        {stats.map((stat, idx) => (
          <div key={idx} className="stat-card">
            <div className="stat-icon-wrap" style={{ background: `${stat.color}15` }}>
              <stat.icon size={24} style={{ color: stat.color }} />
            </div>
            <div className="stat-info">
              <span className="stat-name">{stat.name}</span>
              <span className="stat-value">{stat.value}</span>
            </div>
          </div>
        ))}
      </motion.div>

      <div className="dashboard-sections" style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div className="section-card">
          <h3>Son Projeler</h3>
          <div className="placeholder-content">Henüz veritabanı bağlantısı kurulmadı.</div>
        </div>
        <div className="section-card">
          <h3>Hızlı Aksiyonlar</h3>
          <div className="action-list">
             <button className="quick-action-btn" onClick={() => window.location.href='/admin/projects'}>Yeni Proje Ekle</button>
             <button className="quick-action-btn" onClick={() => window.location.href='/admin/settings'}>Logoyu Güncelle</button>
             <button 
                className="quick-action-btn migrate-btn" 
                onClick={async () => {
                  if(confirm('Mevcut verileri MongoDB\'ye aktarmak istiyor musunuz?')) {
                    const res = await fetch('/api/admin/migrate', { method: 'POST' });
                    const data = await res.json();
                    alert(data.message || data.error);
                  }
                }}
             >
                Verileri İçeri Aktar (Migration)
             </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .migrate-btn {
          border-color: rgba(166, 137, 102, 0.4) !important;
          background: rgba(166, 137, 102, 0.05) !important;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1.5rem;
        }

        .stat-card {
          background: #141414;
          border: 1px solid rgba(255, 255, 255, 0.03);
          padding: 2rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
          border-radius: 4px;
        }

        .stat-icon-wrap {
          width: 56px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }

        .stat-info {
          display: flex;
          flex-direction: column;
        }

        .stat-name {
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          opacity: 0.4;
          margin-bottom: 0.5rem;
        }

        .stat-value {
          font-family: var(--font-display), sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
        }

        .section-card {
          background: #141414;
          border: 1px solid rgba(255, 255, 255, 0.03);
          padding: 2rem;
          border-radius: 4px;
        }

        .section-card h3 {
          font-family: var(--font-display), sans-serif;
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          margin-bottom: 2rem;
          text-transform: uppercase;
          color: #a68966;
        }

        .placeholder-content {
          padding: 4rem 0;
          text-align: center;
          opacity: 0.3;
          border: 1px dashed rgba(255, 255, 255, 0.1);
        }

        .action-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .quick-action-btn {
          width: 100%;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: #fff;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.85rem;
          border-radius: 4px;
        }

        .quick-action-btn:hover {
          background: rgba(166, 137, 102, 0.08);
          border-color: rgba(166, 137, 102, 0.2);
          color: #a68966;
        }

        @media (max-width: 1100px) {
          .dashboard-sections {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

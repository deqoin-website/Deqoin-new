'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageSquare, 
  FolderKanban, 
  Aperture, 
  ArrowUpRight, 
  Clock, 
  Briefcase, 
  Users, 
  Zap, 
  Server, 
  ShieldCheck, 
  Plus, 
  Layout, 
  ChevronRight,
  TrendingUp,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    appointments: 0,
    projects: 0,
    team: 0,
    studios: 12 // static or from DB
  });

  const [isLoading, setIsLoading] = useState(true);
  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projRes, teamRes, appRes] = await Promise.all([
          fetch('/api/projects'),
          fetch('/api/admin/team'),
          fetch('/api/admin/appointments')
        ]);

        const projects = await projRes.json();
        const team = await teamRes.json();
        const appointments = await appRes.json();

        setStats({
          projects: Array.isArray(projects) ? projects.length : 0,
          team: Array.isArray(team) ? team.length : 0,
          appointments: Array.isArray(appointments) ? appointments.length : 0,
          studios: 12
        });
        
        setRecentProjects(Array.isArray(projects) ? projects.slice(0, 3) : []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.6 } }
  } as const;

  return (
    <motion.div 
      className="dashboard-wrapper"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* HEADER SECTION */}
      <motion.div variants={itemVariants} className="dashboard-intro">
        <div className="intro-text">
          <h2>Sistem Özetiniz</h2>
          <p>Stüdyonuzun dijital performansı ve güncel içerik durumu.</p>
        </div>
        <div className="system-health">
          <div className="health-item active">
            <Server size={14} />
            <span>SUNUCU AKTİF</span>
          </div>
          <div className="health-item active">
            <ShieldCheck size={14} />
            <span>SSL GÜVENLİ</span>
          </div>
          <div className="health-item">
            <Zap size={14} />
            <span>V3.0 CORE</span>
          </div>
        </div>
      </motion.div>

      {/* STATS GRID */}
      <div className="stats-grid">
        <motion.div variants={itemVariants} className="admin-stat-card glass">
          <div className="stat-top">
            <div className="stat-icon-box appointments"><MessageSquare size={20} /></div>
            <Link href="/admin/crm" className="stat-link-icon"><ArrowUpRight size={16} /></Link>
          </div>
          <div className="stat-value-group">
            <h3>{isLoading ? '--' : stats.appointments}</h3>
            <span>Randevu Talebi</span>
          </div>
          <div className="stat-trend positive">
            <TrendingUp size={12} />
            <span>+12% artış</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-stat-card glass">
          <div className="stat-top">
            <div className="stat-icon-box projects"><FolderKanban size={20} /></div>
            <Link href="/admin/projects" className="stat-link-icon"><ArrowUpRight size={16} /></Link>
          </div>
          <div className="stat-value-group">
            <h3>{isLoading ? '--' : stats.projects}</h3>
            <span>Toplam Proje</span>
          </div>
          <div className="stat-trend">
            <Clock size={12} />
            <span>Son güncelleme bugün</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-stat-card glass">
          <div className="stat-top">
            <div className="stat-icon-box team"><Users size={20} /></div>
            <Link href="/admin/team" className="stat-link-icon"><ArrowUpRight size={16} /></Link>
          </div>
          <div className="stat-value-group">
            <h3>{isLoading ? '--' : stats.team}</h3>
            <span>Ekip Üyesi</span>
          </div>
          <div className="stat-trend positive">
            <TrendingUp size={12} />
            <span>Tam kadro aktif</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="admin-stat-card glass">
          <div className="stat-top">
            <div className="stat-icon-box studios"><Aperture size={20} /></div>
            <Link href="/admin/studios/mimarlik" className="stat-link-icon"><ArrowUpRight size={16} /></Link>
          </div>
          <div className="stat-value-group">
            <h3>{stats.studios}</h3>
            <span>Birim/Departman</span>
          </div>
          <div className="stat-trend opacity-50">
            <span>Sanal Ofis Aktif</span>
          </div>
        </motion.div>
      </div>

      <div className="dashboard-main-grid">
        <div className="main-grid-left">
          {/* RECENT PROJECTS TABLE-LIKE LIST */}
          <motion.section variants={itemVariants} className="dashboard-section glass">
            <div className="section-header">
              <h3>Son Yayınlanan Projeler</h3>
              <Link href="/admin/projects" className="view-all">Tümünü Yönet <ChevronRight size={14} /></Link>
            </div>
            <div className="project-preview-list">
              {isLoading ? (
                Array(3).fill(0).map((_, i) => <div key={i} className="preview-skeleton" />)
              ) : recentProjects.map((p, i) => (
                <div key={p._id || i} className="preview-item">
                  <div className="preview-img">
                    {p.coverImage ? <img src={p.coverImage} alt={p.title} /> : <div className="img-placeholder"><ImageIcon size={16}/></div>}
                  </div>
                  <div className="preview-info">
                    <h4>{p.title}</h4>
                    <p>{p.category}</p>
                  </div>
                  <div className="preview-status active">YAYINDA</div>
                  <Link href="/admin/projects" className="edit-mini-btn"><Briefcase size={14}/></Link>
                </div>
              ))}
              {recentProjects.length === 0 && !isLoading && <p className="empty-msg">Henüz proje eklenmemiş.</p>}
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="dashboard-section reset-mini glass">
            <div className="reset-mini-badge">İŞ AKIŞ SÜRECİ</div>
            <h3>Alan sıfırlandı</h3>
            <p>Eski içerik, görsel ve yönetim katmanı kaldırıldı. Yeni kurgu için boş bırakıldı.</p>
          </motion.section>
        </div>

        <div className="main-grid-right">
          {/* QUICK ACTIONS */}
          <motion.section variants={itemVariants} className="dashboard-section glass">
            <div className="section-header">
              <h3>Hızlı İşlemler</h3>
            </div>
            <div className="quick-action-btns">
              <Link href="/admin/projects" className="q-btn">
                <Plus size={18} />
                <span>Yeni Proje Ekle</span>
              </Link>
              <Link href="/admin/team" className="q-btn">
                <Users size={18} />
                <span>Ekip Üyesi Ekle</span>
              </Link>
              <Link href="/admin/content/slider" className="q-btn">
                <Layout size={18} />
                <span>Slider Düzenle</span>
              </Link>
              <Link href="/admin/settings" className="q-btn">
                <FileText size={18} />
                <span>SEO Ayarları</span>
              </Link>
            </div>
          </motion.section>

          {/* ACTIVITY LOG */}
          <motion.section variants={itemVariants} className="dashboard-section glass">
            <div className="section-header">
              <h3>Sistem Günlüğü</h3>
            </div>
            <div className="activity-timeline">
              <div className="timeline-item">
                <div className="time-dot"></div>
                <div className="time-info">
                  <p>Yönetici paneline giriş yapıldı</p>
                  <span>Az önce</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="time-dot"></div>
                <div className="time-info">
                  <p>Ayarlar güncellendi</p>
                  <span>14 dakika önce</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="time-dot"></div>
                <div className="time-info">
                  <p>Projeler senkronize edildi</p>
                  <span>2 saat önce</span>
                </div>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </motion.div>
  );
}

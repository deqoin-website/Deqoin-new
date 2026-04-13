'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

          {/* QUICK DRAFT / STATUS AREA */}
          <motion.section variants={itemVariants} className="dashboard-section workflow-mini glass">
             <div className="workflow-content">
               <div className="workflow-badge">CMS WORKFLOW</div>
               <h3>İş Akışınızı Güncelleyin</h3>
               <p>Müşterilerinize sunduğunuz kurumsal adımları ve çalışma prensiplerinizi tek tıkla yenileyebilirsiniz.</p>
               <Link href="/admin/content/workflow" className="action-button-premium">
                 DÜZENLEMEYE BAŞLA <ArrowUpRight size={18} />
               </Link>
             </div>
             <div className="workflow-visual">
               <Zap size={100} strokeWidth={0.5} />
             </div>
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

      <style jsx>{`
        .dashboard-wrapper { display: flex; flex-direction: column; gap: 2.5rem; }
        
        .dashboard-intro { display: flex; justify-content: space-between; align-items: center; }
        .intro-text h2 { font-family: var(--font-display), sans-serif; font-size: 1.75rem; font-weight: 300; letter-spacing: 0.1em; color: var(--text); margin: 0 0 0.5rem 0; }
        .intro-text p { color: var(--text-muted); font-size: 0.9rem; margin: 0; }
        
        .system-health { display: flex; gap: 1.5rem; }
        .health-item { display: flex; align-items: center; gap: 0.5rem; font-size: 0.65rem; font-weight: 800; color: var(--text-muted); opacity: 0.5; }
        .health-item.active { color: #22c55e; opacity: 1; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; }
        .admin-stat-card { padding: 2rem; border-radius: 20px; display: flex; flex-direction: column; gap: 1.5rem; transition: all 0.3s; }
        .admin-stat-card:hover { transform: translateY(-5px); border-color: var(--accent); }
        
        .stat-top { display: flex; justify-content: space-between; align-items: center; }
        .stat-icon-box { width: 44px; height: 44px; border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .stat-icon-box.appointments { background: rgba(166, 137, 102, 0.1); color: #a68966; }
        .stat-icon-box.projects { background: rgba(191, 31, 90, 0.1); color: #bf1f5a; }
        .stat-icon-box.team { background: rgba(34, 197, 94, 0.1); color: #22c55e; }
        .stat-icon-box.studios { background: rgba(77, 171, 247, 0.1); color: #4dabf7; }
        .stat-link-icon { color: var(--text-muted); opacity: 0.5; transition: all 0.3s; }
        .stat-link-icon:hover { opacity: 1; color: var(--accent); }
        
        .stat-value-group h3 { font-family: var(--font-display), sans-serif; font-size: 2.25rem; font-weight: 300; margin: 0; }
        .stat-value-group span { font-size: 0.75rem; color: var(--text-muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; }
        
        .stat-trend { display: flex; align-items: center; gap: 4px; font-size: 0.7rem; color: var(--text-muted); font-weight: 700; }
        .stat-trend.positive { color: #22c55e; }
        
        .dashboard-main-grid { display: grid; grid-template-columns: 2fr 1fr; gap: 1.75rem; }
        .main-grid-left, .main-grid-right { display: flex; flex-direction: column; gap: 1.75rem; }
        
        .dashboard-section { padding: 2rem; border-radius: 20px; }
        .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .section-header h3 { font-family: var(--font-display), sans-serif; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--accent); margin: 0; }
        .view-all { font-size: 0.75rem; font-weight: 700; color: var(--text-muted); display: flex; align-items: center; gap: 4px; }
        .view-all:hover { color: var(--accent); }

        .project-preview-list { display: flex; flex-direction: column; gap: 1rem; }
        .preview-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: rgba(255,255,255,0.02); border-radius: 12px; }
        .preview-img { width: 50px; height: 50px; border-radius: 8px; overflow: hidden; flex-shrink: 0; background: var(--surface-muted); }
        .preview-img img { width: 100%; height: 100%; object-fit: cover; }
        .preview-info { flex: 1; }
        .preview-info h4 { font-size: 0.85rem; margin: 0 0 4px 0; color: var(--text); }
        .preview-info p { font-size: 0.7rem; color: var(--text-muted); margin: 0; }
        .preview-status { font-size: 0.6rem; font-weight: 800; background: rgba(34, 197, 94, 0.15); color: #22c55e; padding: 4px 8px; border-radius: 4px; }
        .edit-mini-btn { width: 32px; height: 32px; border-radius: 50%; background: var(--surface-muted); display: flex; align-items: center; justify-content: center; color: var(--text-muted); }

        .workflow-mini { display: flex; justify-content: space-between; align-items: center; background: linear-gradient(135deg, rgba(166, 137, 102, 0.1) 0%, transparent 100%); position: relative; overflow: hidden; }
        .workflow-content { position: relative; z-index: 2; max-width: 60%; }
        .workflow-badge { font-size: 0.55rem; font-weight: 900; color: var(--accent); background: rgba(166, 137, 102, 0.1); padding: 4px 8px; border-radius: 4px; width: fit-content; margin-bottom: 1rem; }
        .workflow-content h3 { font-family: var(--font-display), sans-serif; font-size: 1.5rem; margin: 0 0 1rem 0; }
        .workflow-content p { font-size: 0.85rem; color: var(--text-muted); line-height: 1.6; margin-bottom: 2rem; }
        .action-button-premium { background: var(--accent); color: #000; padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 800; display: inline-flex; align-items: center; gap: 8px; border-radius: 4px; }
        .workflow-visual { position: absolute; right: -20px; top: 50%; transform: translateY(-50%) rotate(15deg); color: var(--accent); opacity: 0.1; }

        .quick-action-btns { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .q-btn { background: var(--surface-muted); border: 1px solid var(--line); padding: 1.5rem 1rem; border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 0.75rem; text-align: center; transition: all 0.3s; }
        .q-btn:hover { background: var(--accent); color: #000; border-color: var(--accent); }
        .q-btn span { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }

        .activity-timeline { display: flex; flex-direction: column; gap: 1.5rem; }
        .timeline-item { display: flex; gap: 1rem; }
        .time-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--accent); margin-top: 6px; position: relative; }
        .timeline-item:not(:last-child) .time-dot::after { content: ''; position: absolute; height: 40px; width: 1px; background: var(--line); left: 3.5px; top: 8px; }
        .time-info p { font-size: 0.8rem; margin: 0 0 4px 0; font-weight: 500; }
        .time-info span { font-size: 0.7rem; color: var(--text-muted); }

        .glass { background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(20px); border: 1px solid var(--line); }
        [data-theme='light'] .glass { background: rgba(0, 0, 0, 0.02); }

        @media (max-width: 1024px) {
          .dashboard-main-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: 1fr 1fr; }
        }
        @media (max-width: 600px) {
          .stats-grid { grid-template-columns: 1fr; }
          .dashboard-intro { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .system-health { width: 100%; justify-content: space-between; }
        }
      `}</style>
    </motion.div>
  );
}

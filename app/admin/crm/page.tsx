'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  FileText, 
  MessageCircle, 
  MoreVertical, 
  X, 
  Filter, 
  Loader2, 
  Check, 
  Calendar, 
  Users, 
  Clock, 
  AlertCircle,
  Archive,
  CheckCircle2,
  Trash2,
  ArrowRight
} from 'lucide-react';

export default function CRMPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [filter, setFilter] = useState('Hepsi');

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await fetch('/api/admin/appointments');
      const data = await res.json();
      setAppointments(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) fetchAppointments();
    } catch (e) {
      console.error(e);
    }
  };

  const printLeadAsPDF = (lead: any) => {
    setSelectedLead(lead);
    setTimeout(() => window.print(), 500); // Wait for state to update render
  };

  const filteredLeads = appointments.filter(lead => filter === 'Hepsi' || lead.status === filter);

  const stats = {
    total: appointments.length,
    new: appointments.filter(l => l.status === 'Yeni').length,
    inProgress: appointments.filter(l => l.status === 'İletişime Geçildi').length,
    completed: appointments.filter(l => l.status === 'Arşivlendi').length
  };

  return (
    <div className="crm-container">
      {/* STATS AREA */}
      <div className="crm-stats-grid">
        <div className="stat-lux-card">
          <div className="stat-icon-wrap blue"><Users size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">TOPLAM TALEP</span>
            <span className="stat-val">{stats.total}</span>
          </div>
        </div>
        <div className="stat-lux-card">
          <div className="stat-icon-wrap gold"><Calendar size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">YENİ RANDEVULAR</span>
            <span className="stat-val">{stats.new}</span>
          </div>
        </div>
        <div className="stat-lux-card">
          <div className="stat-icon-wrap green"><CheckCircle2 size={20} /></div>
          <div className="stat-info">
            <span className="stat-label">İLETİŞİME GEÇİLEN</span>
            <span className="stat-val">{stats.inProgress}</span>
          </div>
        </div>
      </div>
      
      {/* Header Actions */}
      <div className="crm-actions admin-card">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="İsim, mail veya proje ara..." />
        </div>
        <div className="filter-group-scroll">
          <div className="filter-group">
            {['Hepsi', 'Yeni', 'İncelendi', 'İletişime Geçildi', 'Arşivlendi'].map(f => (
              <button 
                key={f} 
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="crm-content-wrap">
        {loading ? (
          <div className="loading-state"><Loader2 className="spinner" size={32} /></div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="desktop-view admin-card">
              <table className="crm-table">
                <thead>
                  <tr>
                    <th>Tarih</th>
                    <th>Müşteri Bilgisi</th>
                    <th>İlgili Birim</th>
                    <th>Durum</th>
                    <th className="align-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, i) => (
                    <motion.tr 
                      key={lead._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => setSelectedLead(lead)}
                    >
                      <td className="date-col">
                        <div className="date-badge">
                          <Clock size={12} />
                          {new Date(lead.createdAt).toLocaleDateString('tr-TR')}
                        </div>
                      </td>
                      <td>
                        <div className="lead-info">
                          <span className="lead-name">{lead.name} {lead.surname}</span>
                          <span className="lead-contact">{lead.email}</span>
                        </div>
                      </td>
                      <td><span className="dept-badge">{lead.interestedDepartment}</span></td>
                      <td>
                        <div className={`status-badge-premium ${lead.status.toLowerCase().replace(' ', '-')}`}>
                          {lead.status}
                        </div>
                      </td>
                      <td className="align-right">
                        <div className="action-buttons">
                          <a 
                            href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}`}
                            target="_blank"  rel="noreferrer"
                            className="icon-btn wa-btn"
                            onClick={e => e.stopPropagation()}
                          >
                            <MessageCircle size={16} />
                          </a>
                          <button className="icon-btn" onClick={(e) => { e.stopPropagation(); setSelectedLead(lead); }}>
                            <ArrowRight size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="mobile-view">
              <div className="mobile-card-grid">
                {filteredLeads.map((lead) => (
                  <motion.div 
                    key={lead._id}
                    className="lead-mobile-card admin-card"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="m-card-header">
                      <div className="m-date">{new Date(lead.createdAt).toLocaleDateString('tr-TR')}</div>
                      <div className={`status-badge-small ${lead.status.toLowerCase().replace(' ', '-')}`}>
                        {lead.status}
                      </div>
                    </div>
                    <div className="m-card-body">
                      <h3>{lead.name} {lead.surname}</h3>
                      <p>{lead.interestedDepartment} • {lead.city}</p>
                    </div>
                    <div className="m-card-footer">
                      <div className="m-contact-info">{lead.phone}</div>
                      <div className="m-actions">
                        <a href={`tel:${lead.phone}`} onClick={e => e.stopPropagation()} className="m-action-btn"><Users size={16}/></a>
                        <button className="m-action-btn gold" onClick={e => { e.stopPropagation(); setSelectedLead(lead); }}><ArrowRight size={16}/></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {filteredLeads.length === 0 && (
              <div className="empty-state-lux">
                <AlertCircle size={48} />
                <p>Aradığınız kriterlere uygun randevu talebi bulunamadı.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* LEAD DETAILS DRAWER */}
      <AnimatePresence>
        {selectedLead && (
          <div className="drawer-overlay" onClick={() => setSelectedLead(null)}>
            <motion.div 
              className="drawer-content"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.5 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="drawer-header">
                <h2>Talep Detayları</h2>
                <button onClick={() => setSelectedLead(null)} className="close-btn"><X size={20} /></button>
              </div>
              <div className="drawer-body">
                <div className="detail-hero">
                  <span className="m-cat-tag">{selectedLead.interestedDepartment}</span>
                  <h2>{selectedLead.name} {selectedLead.surname}</h2>
                  <div className={`status-badge-lg ${selectedLead.status.toLowerCase().replace(/ /g, '-')}`}>
                    {selectedLead.status}
                  </div>
                </div>

                <div className="detail-status-edit">
                  <label>DURUMU GÜNCELLE</label>
                  <div className="status-options">
                    {['Yeni', 'İncelendi', 'İletişime Geçildi', 'Arşivlendi'].map(s => (
                      <button 
                        key={s}
                        className={`status-opt-btn ${selectedLead.status === s ? 'active' : ''}`}
                        onClick={() => handleStatusChange(selectedLead._id, s)}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-item">
                    <label>TELEFON</label>
                    <p>{selectedLead.phone}</p>
                  </div>
                  <div className="detail-item">
                    <label>E-POSTA</label>
                    <p>{selectedLead.email}</p>
                  </div>
                  <div className="detail-item">
                    <label>ŞEHİR</label>
                    <p>{selectedLead.city}</p>
                  </div>
                  <div className="detail-item">
                    <label>TARİH</label>
                    <p>{new Date(selectedLead.createdAt).toLocaleString('tr-TR')}</p>
                  </div>
                </div>

                <div className="detail-message-box">
                  <label>MESAJ / PROJE DETAYLARI</label>
                  <div className="message-content">
                    {selectedLead.projectDetails || "Bir açıklama eklenmemiş."}
                  </div>
                </div>

                <div className="drawer-footer-actions">
                  <a 
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank" rel="noreferrer"
                    className="lux-action-btn wa"
                  >
                    <MessageCircle size={20} /> WHATSAPP MESAJI GÖNDER
                  </a>
                  <button className="lux-action-btn pdf" onClick={() => printLeadAsPDF(selectedLead)}>
                    <FileText size={20} /> PDF RAPORU OLUŞTUR
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HIDDEN PRINT VIEW */}
      <div className="print-view">
        {selectedLead && (
          <div className="pdf-document">
            <div className="pdf-header">
              <h1>DEQOIN STUDIO</h1>
              <p>MÜŞTERİ TALEP BİLGİ FORMU</p>
            </div>
            <div className="pdf-body">
              <div className="pdf-row"><strong>Tarih:</strong> {new Date(selectedLead.createdAt).toLocaleDateString()}</div>
              <div className="pdf-row"><strong>Ad Soyad:</strong> {selectedLead.name} {selectedLead.surname}</div>
              <div className="pdf-row"><strong>İletişim:</strong> {selectedLead.phone} / {selectedLead.email}</div>
              <div className="pdf-row"><strong>Şehir:</strong> {selectedLead.city}</div>
              <div className="pdf-row"><strong>İlgili Birim:</strong> {selectedLead.interestedDepartment}</div>
              <div className="pdf-row desc-box"><strong>Proje Detayı:</strong><br/>{selectedLead.projectDetails}</div>
            </div>
            <div className="pdf-footer">
              BU BELGE DEQOIN ARCHITECTURAL STUDIO TARAFINDAN OTOMATİK OLUŞTURULMUŞTUR.
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .crm-container { display: flex; flex-direction: column; gap: 2rem; }
        
        /* STATS */
        .crm-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .stat-lux-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 12px; display: flex; align-items: center; gap: 1.25rem; transition: transform 0.3s; }
        .stat-lux-card:hover { transform: translateY(-3px); border-color: rgba(166,137,102,0.3); }
        .stat-icon-wrap { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); }
        .stat-icon-wrap.blue { color: #3b82f6; background: rgba(59,130,246,0.1); }
        .stat-icon-wrap.gold { color: #a68966; background: rgba(166,137,102,0.1); }
        .stat-icon-wrap.green { color: #10b981; background: rgba(16,185,129,0.1); }
        .stat-info { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.6rem; letter-spacing: 0.15em; color: var(--text-soft); font-weight: 800; }
        .stat-val { font-size: 1.25rem; font-weight: 300; color: #fff; font-family: var(--font-display); }

        .crm-actions { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; }
        .search-box { display: flex; align-items: center; gap: 1rem; background: var(--background); border: 1px solid var(--line); border-radius: 8px; padding: 0.75rem 1.25rem; width: 350px; }
        .search-box input { background: transparent; border: none; color: #fff; font-family: inherit; font-size: 0.9rem; flex: 1; outline: none; }
        
        .filter-group { display: flex; gap: 0.5rem; }
        .filter-btn { background: var(--surface-muted); border: 1px solid var(--line); color: var(--text-muted); padding: 0.6rem 1.25rem; border-radius: 40px; font-size: 0.65rem; font-weight: 700; cursor: pointer; letter-spacing: 0.05em; transition: all 0.3s; }
        .filter-btn.active { background: #a68966; color: #000; border-color: #a68966; box-shadow: 0 5px 15px rgba(166,137,102,0.2); }

        /* TABLE */
        .desktop-view { overflow: hidden; }
        .crm-table { width: 100%; border-collapse: collapse; }
        .crm-table th { text-align: left; padding: 1.5rem; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.15em; color: #a68966; border-bottom: 2px solid var(--line); font-weight: 800; }
        .crm-table td { padding: 1.5rem; border-bottom: 1px solid var(--line); font-size: 0.9rem; vertical-align: middle; }
        .crm-table tr { cursor: pointer; transition: background 0.3s; }
        .crm-table tr:hover { background: rgba(166,137,102,0.03); }

        .date-badge { display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; color: var(--text-muted); background: var(--surface-muted); padding: 4px 10px; border-radius: 4px; width: fit-content; }
        .lead-name { font-weight: 600; color: #fff; display: block; font-size: 1rem; }
        .lead-contact { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.2rem; }
        .dept-badge { font-size: 0.7rem; font-weight: 800; color: #a68966; background: rgba(166,137,102,0.1); padding: 0.3rem 0.8rem; border-radius: 4px; border: 1px solid rgba(166,137,102,0.1); }

        .status-badge-premium { padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.6rem; font-weight: 900; letter-spacing: 0.1em; display: inline-flex; border: 1px solid transparent; }
        .status-badge-premium.yeni { background: rgba(166,137,102,0.1); color: #a68966; border-color: rgba(166,137,102,0.3); }
        .status-badge-premium.incelendi { background: rgba(59,130,246,0.1); color: #3b82f6; border-color: rgba(59,130,246,0.2); }
        .status-badge-premium.iletisi me-ge-ildi { background: rgba(16,185,129,0.1); color: #10b981; border-color: rgba(16,185,129,0.2); }
        .status-badge-premium.ar-ivlendi { background: var(--surface-muted); color: var(--text-soft); border-color: var(--line); }

        .action-buttons { display: flex; gap: 0.5rem; }
        .icon-btn { width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; background: var(--surface-muted); color: var(--text-muted); border: 1px solid var(--line); cursor: pointer; transition: all 0.3s; }
        .icon-btn:hover { border-color: #a68966; color: #a68966; }
        .wa-btn:hover { background: #25d366; color: #fff; border-color: #25d366; }

        /* MOBILE VIEW */
        .mobile-view { display: none; }
        
        /* DRAWER IMPROVED */
        .drawer-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 1000; display: flex; justify-content: flex-end; }
        .drawer-content { width: 600px; height: 100%; background: var(--surface); border-left: 1px solid var(--line); display: flex; flex-direction: column; }
        .drawer-header { padding: 2.5rem; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; }
        .drawer-header h2 { margin: 0; font-family: var(--font-display); font-size: 1.25rem; letter-spacing: 0.15em; color: #a68966; }
        .close-btn { background: transparent; border: none; color: #fff; cursor: pointer; width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; }

        .drawer-body { padding: 2.5rem; display: flex; flex-direction: column; gap: 3rem; overflow-y: auto; }
        .detail-hero { display: flex; flex-direction: column; gap: 1rem; align-items: flex-start; }
        .m-cat-tag { font-size: 0.7rem; color: #a68966; letter-spacing: 0.2rem; font-weight: 800; border: 1px solid rgba(166,137,102,0.3); padding: 4px 12px; border-radius: 4px; }
        .detail-hero h2 { font-size: 2.5rem; font-family: var(--font-display); margin: 0; font-weight: 300; }
        
        .status-badge-lg { padding: 0.75rem 2rem; border-radius: 40px; font-size: 0.8rem; font-weight: 900; letter-spacing: 0.1em; display: inline-flex; border: 1px solid rgba(255,255,255,0.1); }
        .status-badge-lg.yeni { border-color: #a68966; color: #a68966; }
        .status-badge-lg.iletisi me-ge-ildi { border-color: #10b981; color: #10b981; }

        .detail-status-edit { display: flex; flex-direction: column; gap: 1rem; }
        .detail-status-edit label { font-size: 0.6rem; letter-spacing: 0.2em; color: var(--text-muted); font-weight: 800; }
        .status-options { display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
        .status-opt-btn { background: var(--background); border: 1px solid var(--line); color: var(--text-soft); padding: 1rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .status-opt-btn.active { border-color: #a68966; color: #a68966; background: rgba(166,137,102,0.05); }

        .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        .detail-item label { font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.15em; font-weight: 800; margin-bottom: 0.5rem; display: block; }
        .detail-item p { margin: 0; font-size: 1.1rem; color: #fff; font-weight: 400; }

        .detail-message-box label { font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.15em; margin-bottom: 1rem; display: block; font-weight: 800; }
        .message-content { background: rgba(0,0,0,0.2); border: 1px solid var(--line); padding: 2rem; border-radius: 12px; font-size: 1rem; line-height: 1.8; color: var(--text-soft); }

        .drawer-footer-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .lux-action-btn { padding: 1.25rem; border-radius: 12px; font-weight: 800; font-size: 0.7rem; letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; gap: 0.75rem; cursor: pointer; border: none; transition: all 0.3s; }
        .lux-action-btn.wa { background: #25d366; color: #fff; }
        .lux-action-btn.wa:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(37,211,102,0.2); }
        .lux-action-btn.pdf { background: #fff; color: #000; }
        .lux-action-btn.pdf:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }

        @media (max-width: 1024px) {
          .crm-stats-grid { grid-template-columns: 1fr; }
          .desktop-view { display: none; }
          .mobile-view { display: block; }
          .crm-actions { flex-direction: column; gap: 1.5rem; align-items: stretch; }
          .search-box { width: 100%; }
          .filter-group-scroll { overflow-x: auto; padding-bottom: 0.5rem; }
          .filter-group { width: max-content; }
          
          .mobile-card-grid { display: flex; flex-direction: column; gap: 1.5rem; }
          .lead-mobile-card { padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
          .m-card-header { display: flex; justify-content: space-between; align-items: center; }
          .m-date { font-size: 0.7rem; color: var(--text-muted); font-weight: 600; }
          .status-badge-small { font-size: 0.55rem; font-weight: 900; background: rgba(255,255,255,0.05); padding: 4px 10px; border-radius: 4px; color: #a68966; letter-spacing: 0.05em; }
          .m-card-body h3 { margin: 0; font-size: 1.25rem; font-family: var(--font-display); }
          .m-card-body p { margin: 0.5rem 0 0 0; font-size: 0.8rem; color: var(--text-muted); }
          .m-card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 1rem; }
          .m-contact-info { font-size: 0.8rem; font-weight: 600; color: #a68966; }
          .m-actions { display: flex; gap: 0.75rem; }
          .m-action-btn { width: 40px; height: 40px; border-radius: 50%; background: var(--surface-muted); color: var(--text-soft); border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; }
          .m-action-btn.gold { color: #a68966; border-color: #a68966; }
          
          .drawer-content { width: 100vw; }
          .detail-hero h2 { font-size: 1.75rem; }
          .detail-grid { grid-template-columns: 1fr; gap: 1.5rem; }
          .drawer-footer-actions { grid-template-columns: 1fr; }
        }

        @media print {
          body * { visibility: hidden; }
          .print-view, .print-view * { visibility: visible; }
          .print-view { position: absolute; left: 0; top: 0; width: 100%; padding: 2cm; background: white !important; color: black !important; }
          .pdf-document { text-align: left; }
          .pdf-header { text-align: center; border-bottom: 2px solid black; padding-bottom: 20px; margin-bottom: 40px; }
          .pdf-header h1 { font-size: 24px; margin: 0 0 10px 0; letter-spacing: 4px; }
          .pdf-header p { font-size: 14px; margin: 0; color: #555; }
          .pdf-row { margin-bottom: 15px; font-size: 12pt; line-height: 1.5; }
          .desc-box { margin-top: 30px; padding: 20px; border: 1px solid #ccc; }
          .pdf-footer { margin-top: 50px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, MessageCircle, MoreVertical, X, Filter, Loader2, Check } from 'lucide-react';

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

  return (
    <div className="crm-container">
      
      {/* Header Actions */}
      <div className="crm-actions admin-card">
        <div className="search-box">
          <Search size={18} />
          <input type="text" placeholder="İsim, mail veya proje ara..." />
        </div>
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

      {/* Main List */}
      <div className="crm-table-card admin-card">
        {loading ? (
          <div className="loading-state"><Loader2 className="spinner" size={32} /></div>
        ) : (
          <table className="crm-table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Müşteri Bilgisi</th>
                <th>İlgili Birim</th>
                <th>Durum</th>
                <th className="align-right">Aksiyonlar</th>
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
                    {new Date(lead.createdAt).toLocaleDateString('tr-TR')}
                  </td>
                  <td>
                    <div className="lead-info">
                      <span className="lead-name">{lead.name} {lead.surname}</span>
                      <span className="lead-contact">{lead.email} • {lead.city}</span>
                    </div>
                  </td>
                  <td><span className="dept-badge">{lead.interestedDepartment}</span></td>
                  <td>
                    <select 
                      className={`status-select ${lead.status.toLowerCase().replace(' ', '-')}`}
                      value={lead.status}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleStatusChange(lead._id, e.target.value);
                      }}
                      onClick={e => e.stopPropagation()}
                    >
                      <option value="Yeni">Yeni</option>
                      <option value="İncelendi">İncelendi</option>
                      <option value="İletişime Geçildi">İletişime Geçildi</option>
                      <option value="Arşivlendi">Arşivlendi</option>
                    </select>
                  </td>
                  <td className="align-right">
                    <div className="action-buttons">
                      <a 
                        href={`https://wa.me/${lead.phone.replace(/[^0-9]/g, '')}?text=Merhaba%20${lead.name}%20Bey/Hanım,%20Deqoin%20Studio'dan%20ulaşıyorum.`}
                        target="_blank" 
                        rel="noreferrer"
                        className="icon-btn wa-btn"
                        title="WhatsApp'tan Yaz"
                        onClick={e => e.stopPropagation()}
                      >
                        <MessageCircle size={16} />
                      </a>
                      <button 
                        className="icon-btn" 
                        title="PDF Z Raporu"
                        onClick={(e) => { e.stopPropagation(); printLeadAsPDF(lead); }}
                      >
                        <FileText size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="empty-state">Bu filtreye uygun randevu bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
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
                <div className="detail-group">
                  <label>MÜŞTERİ</label>
                  <p className="detail-value highlight">{selectedLead.name} {selectedLead.surname}</p>
                </div>
                <div className="detail-row">
                  <div className="detail-group">
                    <label>TELEFON</label>
                    <p className="detail-value">{selectedLead.phone}</p>
                  </div>
                  <div className="detail-group">
                    <label>E-POSTA</label>
                    <p className="detail-value">{selectedLead.email}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <div className="detail-group">
                    <label>ŞEHİR / BÖLGE</label>
                    <p className="detail-value">{selectedLead.city}</p>
                  </div>
                  <div className="detail-group">
                    <label>İLGİLİ BİRİM</label>
                    <p className="detail-value">{selectedLead.interestedDepartment}</p>
                  </div>
                </div>
                <div className="detail-group">
                  <label>PROJE AÇIKLAMASI</label>
                  <div className="detail-box">
                    {selectedLead.projectDetails || "Açıklama girilmemiş."}
                  </div>
                </div>

                <div className="drawer-actions">
                  <a 
                    href={`https://wa.me/${selectedLead.phone.replace(/[^0-9]/g, '')}?text=Merhaba%20${selectedLead.name}%20Bey/Hanım,%20Deqoin%20Studio'dan%20ulaşıyorum.`}
                    target="_blank" 
                    rel="noreferrer"
                    className="full-btn wa-bg"
                  >
                    <MessageCircle size={18} /> WhatsApp Üzerinden İletişime Geç
                  </a>
                  <button className="full-btn ghost-btn" onClick={() => printLeadAsPDF(selectedLead)}>
                    <FileText size={18} /> Talebi PDF Olarak İndir (Print)
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
        .crm-container {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .crm-actions {
          padding: 1rem 1.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(10, 10, 10, 0.4);
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 8px;
          padding: 0.75rem 1rem;
          width: 300px;
        }

        .search-box input {
          background: transparent;
          border: none;
          color: #fff;
          font-family: inherit;
          width: 100%;
        }

        .search-box input:focus { outline: none; }
        .search-box input::placeholder { color: rgba(255,255,255,0.3); }

        .filter-group {
          display: flex;
          gap: 0.5rem;
        }

        .filter-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.5);
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .filter-btn.active, .filter-btn:hover {
          background: #a68966;
          color: #fff;
          border-color: #a68966;
        }

        .crm-table-card {
          padding: 0;
          overflow: hidden;
        }

        .crm-table {
          width: 100%;
          border-collapse: collapse;
        }

        .crm-table th {
          text-align: left;
          padding: 1.5rem;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255,255,255,0.4);
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-weight: 600;
        }

        .crm-table td {
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.03);
          vertical-align: middle;
        }

        .crm-table tbody tr {
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .crm-table tbody tr:hover {
          background: rgba(255,255,255,0.02);
        }

        .date-col {
          color: rgba(255,255,255,0.4);
          font-size: 0.85rem;
        }

        .lead-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .lead-name {
          font-weight: 600;
          color: #fff;
        }

        .lead-contact {
          font-size: 0.75rem;
          color: rgba(255,255,255,0.4);
        }

        .dept-badge {
          background: rgba(255,255,255,0.05);
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.75rem;
          color: rgba(255,255,255,0.7);
        }

        .status-select {
          background: rgba(20,20,20,0.8);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          padding: 0.4rem 0.8rem;
          border-radius: 4px;
          font-size: 0.75rem;
          cursor: pointer;
          font-family: inherit;
        }

        .status-select:focus { outline: none; border-color: #a68966; }

        .align-right { text-align: right !important; }

        .action-buttons {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
        }

        .icon-btn {
          width: 32px;
          height: 32px;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255,255,255,0.05);
          color: rgba(255,255,255,0.6);
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .icon-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
        .wa-btn:hover { background: #25D366; color: #fff; }

        .empty-state { text-align: center; padding: 4rem !important; color: rgba(255,255,255,0.3); }
        .loading-state { display: flex; justify-content: center; padding: 4rem; color: #a68966; }
        .spinner { animation: spin 1s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* DRAWER */
        .drawer-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(5px);
          z-index: 1000;
          display: flex;
          justify-content: flex-end;
        }

        .drawer-content {
          width: 500px;
          max-width: 100%;
          background: #0d0d0d;
          border-left: 1px solid rgba(166, 137, 102, 0.2);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .drawer-header {
          padding: 2rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .drawer-header h2 { margin: 0; font-family: var(--font-display); font-size: 1.2rem; letter-spacing: 0.1em; }
        .close-btn { background: none; border: none; color: #fff; cursor: pointer; opacity: 0.5; }
        .close-btn:hover { opacity: 1; }

        .drawer-body {
          padding: 2rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .detail-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .detail-group { display: flex; flex-direction: column; gap: 0.5rem; }
        
        .detail-group label {
          font-size: 0.65rem;
          color: rgba(255,255,255,0.4);
          letter-spacing: 0.1em;
        }

        .detail-value { margin: 0; font-size: 0.95rem; color: #fff; }
        .highlight { font-family: var(--font-display); font-size: 1.5rem; color: #a68966; letter-spacing: 0.05em; }

        .detail-box {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          padding: 1.5rem;
          border-radius: 8px;
          font-size: 0.9rem;
          line-height: 1.6;
          color: rgba(255,255,255,0.8);
          min-height: 100px;
        }

        .drawer-actions { margin-top: auto; display: flex; flex-direction: column; gap: 1rem; }

        .full-btn {
          width: 100%;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
          text-decoration: none;
          transition: all 0.3s ease;
        }

        .wa-bg { background: #25D366; color: #fff; }
        .wa-bg:hover { background: #1eb355; }

        .ghost-btn { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #fff; }
        .ghost-btn:hover { border-color: #fff; }

        /* PRINT STYLES */
        .print-view { display: none; }

        @media print {
          body * { visibility: hidden; }
          .print-view, .print-view * { visibility: visible; }
          .print-view {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 2cm;
            background: white !important;
            color: black !important;
          }

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

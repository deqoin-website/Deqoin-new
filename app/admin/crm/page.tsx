'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
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
  ArrowRight,
  Download
} from 'lucide-react';

export default function CRMPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any | null>(null);
  const [filter, setFilter] = useState('Hepsi');
  const [isBulkPrinting, setIsBulkPrinting] = useState(false);
  const [activeScope, setActiveScope] = useState<'daily' | 'weekly' | 'monthly' | 'all'>('all');
  const [bulkReportTitle, setBulkReportTitle] = useState('GENEL RANDEVU LİSTESİ');
  const [bulkLeads, setBulkLeads] = useState<any[]>([]);
  const [libLoaded, setLibLoaded] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isBulkMode, setIsBulkMode] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    // Automatically prepare report data when scope or data changes
    prepareReportData();
  }, [activeScope, appointments, filter]);

  const prepareReportData = () => {
    const now = new Date();
    let startDate = new Date();
    let title = '';
    let data = [];

    if (activeScope === 'daily') {
      startDate.setHours(0,0,0,0);
      title = 'GÜNLÜK RANDEVU RAPORU';
      data = appointments.filter(a => new Date(a.createdAt) >= startDate);
    } else if (activeScope === 'weekly') {
      startDate.setDate(now.getDate() - 7);
      title = 'HAFTALIK RANDEVU RAPORU';
      data = appointments.filter(a => new Date(a.createdAt) >= startDate);
    } else if (activeScope === 'monthly') {
      startDate.setDate(now.getDate() - 30);
      title = 'AYLIK RANDEVU RAPORU';
      data = appointments.filter(a => new Date(a.createdAt) >= startDate);
    } else {
      title = `GENEL RANDEVU LİSTESİ (${filter.toUpperCase()})`;
      data = appointments.filter(lead => filter === 'Hepsi' || lead.status === filter);
    }

    setBulkReportTitle(title);
    setBulkLeads(data);
  };

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
    setIsBulkPrinting(false);
    setSelectedLead(lead);
    setTimeout(() => window.print(), 500); 
  };

  const openPreview = (mode: 'single' | 'bulk') => {
    setIsBulkMode(mode === 'bulk');
    if (mode === 'bulk') {
      setSelectedLead(null);
    }
    setIsBulkPrinting(mode === 'bulk');
    setIsPreviewOpen(true);
  };

  const handleDownloadPDF = async () => {
    if (!libLoaded) return;

    // Target the specific preview paper inside the modal
    const element = document.querySelector('.preview-paper');
    if (!element) return;

    let filename = 'Deqoin_Rapor.pdf';
    if (!isBulkMode && selectedLead) {
      filename = `Musteri_${selectedLead.name}_${selectedLead.surname}.pdf`;
    } else {
      filename = `${bulkReportTitle.replace(/ /g, '_')}_${new Date().toLocaleDateString('tr-TR')}.pdf`;
    }

    const opt = {
      margin: 10,
      filename: filename,
      image: { type: 'jpeg', quality: 1.0 },
      html2canvas: { scale: 3, useCORS: true, letterRendering: true, logging: false },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', precision: 32 }
    };

    try {
      // @ts-ignore
      await html2pdf().set(opt).from(element).save();
    } catch (e) {
      console.error('PDF Download Error:', e);
    }
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
        <div className="crm-header-btns">
          <div className="report-ux-wrapper">
            <div className="scope-picker">
              <span className="scope-label-mini">KAPSAM:</span>
              <button className={`scope-btn ${activeScope === 'daily' ? 'active' : ''}`} onClick={() => setActiveScope('daily')}>GÜNLÜK</button>
              <button className={`scope-btn ${activeScope === 'weekly' ? 'active' : ''}`} onClick={() => setActiveScope('weekly')}>HAFTALIK</button>
              <button className={`scope-btn ${activeScope === 'monthly' ? 'active' : ''}`} onClick={() => setActiveScope('monthly')}>AYLIK</button>
              <button className={`scope-btn ${activeScope === 'all' ? 'active' : ''}`} onClick={() => setActiveScope('all')}>GENEL</button>
            </div>
            <div className="report-actions">
              <button className="lux-report-btn" onClick={() => openPreview('bulk')} title="Raporu Önizle">
                <FileText size={16} /> RAPORU GÖR (ÖNİZLE)
              </button>
            </div>
          </div>
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
            <div className="desktop-view admin-card desktop-only">
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

            {/* Mobile View */}
            <div className="mobile-only">
              <div className="mobile-card-grid">
                {filteredLeads.map((lead) => (
                  <motion.div 
                    key={lead._id}
                    className="mobile-lead-card"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedLead(lead)}
                  >
                    <div className="card-header">
                      <div className="card-id">{new Date(lead.createdAt).toLocaleDateString('tr-TR')}</div>
                      <div className={`status-badge-premium ${lead.status.toLowerCase().replace(' ', '-')}`}>
                        {lead.status}
                      </div>
                    </div>
                    <div className="card-body">
                      <h3>{lead.name} {lead.surname}</h3>
                      <p className="card-dept">{lead.interestedDepartment} • {lead.city}</p>
                      <div className="card-meta">
                        <span>{lead.phone}</span>
                      </div>
                    </div>
                    <div className="card-footer">
                      <button className="btn-card-action">HIZLI İNCELE</button>
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
                <h2>TALEP DETAYLARI</h2>
                <button onClick={() => setSelectedLead(null)} className="close-btn"><X size={24} /></button>
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
                  <button className="lux-action-btn pdf" onClick={() => openPreview('single')}>
                    <FileText size={20} /> FORMU ÖNİZLE & İNDİR
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PREVIEW MODAL */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="preview-overlay" onClick={() => setIsPreviewOpen(false)}>
            <motion.div 
              className="preview-container"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="preview-toolbar">
                <div className="toolbar-left">
                  <h3>PDF ÖNİZLEME</h3>
                  <span className="toolbar-badge">A4 KURUMSAL FORMAT</span>
                </div>
                <div className="toolbar-actions">
                  <button className="tool-btn" onClick={() => window.print()}>
                    <FileText size={16} /> YAZDIR
                  </button>
                  <button className="tool-btn gold" onClick={handleDownloadPDF} disabled={!libLoaded}>
                    <Download size={16} /> {libLoaded ? 'PDF İNDİR' : 'YÜKLENİYOR...'}
                  </button>
                  <button className="tool-btn close" onClick={() => setIsPreviewOpen(false)}>
                    <X size={20} />
                  </button>
                </div>
              </div>
              
              <div className="preview-content-scroll">
                <div className="preview-paper">
                    <div className="pdf-header">
                      <div className="pdf-brand-box">
                        <h1>Deqoin Design Studio</h1>
                        <p>ARCHITECTURAL & DESIGN SOLUTIONS</p>
                      </div>
                      <div className="pdf-header-divider"></div>
                      <div className="pdf-meta">
                        <span><strong>DÖKÜMAN NO:</strong> DQ-{Math.floor(1000 + Math.random() * 9000)}</span>
                        <span><strong>RAPOR TARİHİ:</strong> {new Date().toLocaleDateString('tr-TR')}</span>
                        <span><strong>BİRİM:</strong> CRM / RANDEVU YÖNETİMİ</span>
                      </div>
                    </div>

                    {isBulkMode ? (
                      <div className="pdf-bulk-document">
                        <h2 className="pdf-title">{bulkReportTitle}</h2>
                        
                        <div className="pdf-summary-analysis">
                          <div className="summary-item">
                            <span className="s-label">TOPLAM KAYIT</span>
                            <span className="s-val">{bulkLeads.length}</span>
                          </div>
                          <div className="summary-item">
                            <span className="s-label">YENİ TALEPLER</span>
                            <span className="s-val">{bulkLeads.filter(l => l.status === 'Yeni').length}</span>
                          </div>
                          <div className="summary-item">
                            <span className="s-label">İncelenen / İşlemde</span>
                            <span className="s-val">{bulkLeads.filter(l => l.status !== 'Yeni' && l.status !== 'Arşivlendi').length}</span>
                          </div>
                        </div>

                        <table className="pdf-table">
                          <thead>
                            <tr>
                              <th style={{ width: '15%' }}>TARİH / SAAT</th>
                              <th style={{ width: '25%' }}>MÜŞTERİ BİLGİSİ</th>
                              <th style={{ width: '25%' }}>İLETİŞİM BİLGİLERİ</th>
                              <th style={{ width: '15%' }}>İLGİLİ BİRİM</th>
                              <th style={{ width: '20%' }}>GÜNCEL DURUM</th>
                            </tr>
                          </thead>
                          <tbody>
                            {bulkLeads.length > 0 ? bulkLeads.map((lead) => (
                              <tr key={lead._id}>
                                <td>
                                  <span className="pdf-date">{new Date(lead.createdAt).toLocaleDateString('tr-TR')}</span>
                                  <span className="pdf-time">{new Date(lead.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                                </td>
                                <td><div className="pdf-txt-bold">{lead.name} {lead.surname}</div><div className="pdf-txt-small">{lead.city}</div></td>
                                <td><div className="pdf-txt-main">{lead.phone}</div><div className="pdf-txt-small">{lead.email}</div></td>
                                <td><span className="pdf-dept-tag">{lead.interestedDepartment}</span></td>
                                <td><div className="pdf-status-pill">{lead.status}</div></td>
                              </tr>
                            )) : (
                              <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '20mm', color: '#888' }}>
                                  Seçili zaman aralığında veya kriterlerde herhangi bir randevu kaydı bulunmamaktadır.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    ) : selectedLead && (
                      <div className="pdf-document">
                        <h2 className="pdf-title">MÜŞTERİ TALEP BİLGİ FORMU</h2>
                        <div className="pdf-form-body">
                          <div className="pdf-section">
                            <h3>KİŞİSEL BİLGİLER</h3>
                            <div className="pdf-data-row"><strong>AD SOYAD:</strong> {selectedLead.name} {selectedLead.surname}</div>
                            <div className="pdf-data-row"><strong>TELEFON:</strong> {selectedLead.phone}</div>
                            <div className="pdf-data-row"><strong>E-POSTA:</strong> {selectedLead.email}</div>
                            <div className="pdf-data-row"><strong>ŞEHİR:</strong> {selectedLead.city}</div>
                          </div>
                          <div className="pdf-section">
                            <h3>TALEB DETAYLARI</h3>
                            <div className="pdf-data-row"><strong>İLGİLİ BİRİM:</strong> {selectedLead.interestedDepartment}</div>
                            <div className="pdf-data-row"><strong>DURUM:</strong> {selectedLead.status}</div>
                            <div className="pdf-data-row"><strong>TALEP TARİHİ:</strong> {new Date(selectedLead.createdAt).toLocaleString('tr-TR')}</div>
                          </div>
                          <div className="pdf-section full">
                            <h3>PROJE AÇIKLAMASI / MESAJ</h3>
                            <div className="pdf-message-box">
                              {selectedLead.projectDetails || "Bir açıklama eklenmemiş."}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="pdf-signature-area">
                      <div className="sig-box">
                        <p>HAZIRLAYAN</p>
                        <div className="sig-line"></div>
                        <span>Dijital CRM Sistemi</span>
                      </div>
                      <div className="sig-box">
                        <p>ONAY / İMZA</p>
                        <div className="sig-line"></div>
                        <span>Deqoin Yönetim</span>
                      </div>
                    </div>

                    <div className="pdf-footer">
                      <p>BU BELGE DEQOIN ARCHITECTURAL STUDIO DİJİTAL SİSTEMLERİ TARAFINDAN OTOMATİK OLARAK OLUŞTURULMUŞTUR.</p>
                      <div className="pdf-footer-line"></div>
                      <span>www.deqoin.com • Deqoin Design Studio</span>
                    </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Script 
        src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js" 
        strategy="afterInteractive"
        onLoad={() => setLibLoaded(true)}
        onError={() => {
          // Fallback to unpkg if cdnjs fails
          const s = document.createElement('script');
          s.src = "https://unpkg.com/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js";
          s.onload = () => setLibLoaded(true);
          document.body.appendChild(s);
        }}
      />

      {/* PRINT VIEW ENGINE */}
      <div className="print-view">
        <div className="pdf-header">
          <div className="pdf-brand-box">
            <h1>Deqoin Design Studio</h1>
            <p>ARCHITECTURAL & DESIGN SOLUTIONS</p>
          </div>
          <div className="pdf-header-divider"></div>
          <div className="pdf-meta">
            <span><strong>DÖKÜMAN NO:</strong> DQ-{Math.floor(1000 + Math.random() * 9000)}</span>
            <span><strong>RAPOR TARİHİ:</strong> {new Date().toLocaleDateString('tr-TR')}</span>
            <span><strong>BİRİM:</strong> CRM / RANDEVU YÖNETİMİ</span>
          </div>
        </div>

        {/* SINGLE REPORT */}
        {selectedLead && !isBulkPrinting && (
          <div className="pdf-document">
            <h2 className="pdf-title">MÜŞTERİ TALEP BİLGİ FORMU</h2>
            <div className="pdf-form-body">
              <div className="pdf-section">
                <h3>KİŞİSEL BİLGİLER</h3>
                <div className="pdf-data-row"><strong>AD SOYAD:</strong> {selectedLead.name} {selectedLead.surname}</div>
                <div className="pdf-data-row"><strong>TELEFON:</strong> {selectedLead.phone}</div>
                <div className="pdf-data-row"><strong>E-POSTA:</strong> {selectedLead.email}</div>
                <div className="pdf-data-row"><strong>ŞEHİR:</strong> {selectedLead.city}</div>
              </div>
              <div className="pdf-section">
                <h3>TALEB DETAYLARI</h3>
                <div className="pdf-data-row"><strong>İLGİLİ BİRİM:</strong> {selectedLead.interestedDepartment}</div>
                <div className="pdf-data-row"><strong>DURUM:</strong> {selectedLead.status}</div>
                <div className="pdf-data-row"><strong>TALEP TARİHİ:</strong> {new Date(selectedLead.createdAt).toLocaleString('tr-TR')}</div>
              </div>
              <div className="pdf-section full">
                <h3>PROJE AÇIKLAMASI / MESAJ</h3>
                <div className="pdf-message-box">
                  {selectedLead.projectDetails || "Bir açıklama eklenmemiş."}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BULK REPORT */}
        {isBulkPrinting && (
          <div className="pdf-bulk-document">
            <h2 className="pdf-title">{bulkReportTitle}</h2>
            
            {/* Summary Analysis */}
            <div className="pdf-summary-analysis">
              <div className="summary-item">
                <span className="s-label">TOPLAM KAYIT</span>
                <span className="s-val">{bulkLeads.length}</span>
              </div>
              <div className="summary-item">
                <span className="s-label">YENİ TALEPLER</span>
                <span className="s-val">{bulkLeads.filter(l => l.status === 'Yeni').length}</span>
              </div>
              <div className="summary-item">
                <span className="s-label">İncelenen / İşlemde</span>
                <span className="s-val">{bulkLeads.filter(l => l.status !== 'Yeni' && l.status !== 'Arşivlendi').length}</span>
              </div>
            </div>

            <table className="pdf-table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>TARİH / SAAT</th>
                  <th style={{ width: '25%' }}>MÜŞTERİ BİLGİSİ</th>
                  <th style={{ width: '25%' }}>İLETİŞİM BİLGİLERİ</th>
                  <th style={{ width: '15%' }}>İLGİLİ BİRİM</th>
                  <th style={{ width: '20%' }}>GÜNCEL DURUM</th>
                </tr>
              </thead>
              <tbody>
                {bulkLeads.length > 0 ? bulkLeads.map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <span className="pdf-date">{new Date(lead.createdAt).toLocaleDateString('tr-TR')}</span>
                      <span className="pdf-time">{new Date(lead.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td><div className="pdf-txt-bold">{lead.name} {lead.surname}</div><div className="pdf-txt-small">{lead.city}</div></td>
                    <td><div className="pdf-txt-main">{lead.phone}</div><div className="pdf-txt-small">{lead.email}</div></td>
                    <td><span className="pdf-dept-tag">{lead.interestedDepartment}</span></td>
                    <td><div className="pdf-status-pill">{lead.status}</div></td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '20mm', color: '#888' }}>
                      Seçili zaman aralığında veya kriterlerde herhangi bir randevu kaydı bulunmamaktadır.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pdf-signature-area">
              <div className="sig-box">
                <p>HAZIRLAYAN</p>
                <div className="sig-line"></div>
                <span>Dijital CRM Sistemi</span>
              </div>
              <div className="sig-box">
                <p>ONAY / İMZA</p>
                <div className="sig-line"></div>
                <span>Deqoin Yönetim</span>
              </div>
            </div>
          </div>
        )}

        <div className="pdf-footer">
          <p>BU BELGE DEQOIN ARCHITECTURAL STUDIO DİJİTAL SİSTEMLERİ TARAFINDAN OTOMATİK OLARAK OLUŞTURULMUŞTUR.</p>
          <div className="pdf-footer-line"></div>
          <span>www.deqoin.com • Deqoin Design Studio</span>
        </div>
      </div>

      <style jsx>{`
        .crm-container { display: flex; flex-direction: column; gap: 2rem; }
        
        /* STATS */
        .crm-stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .stat-lux-card { background: var(--surface); border: 1px solid var(--line); padding: 1.5rem; border-radius: 12px; display: flex; align-items: center; gap: 1.25rem; transition: transform 0.3s; box-shadow: var(--shadow); }
        .stat-lux-card:hover { transform: translateY(-3px); border-color: #a68966; }
        .stat-icon-wrap { width: 44px; height: 44px; border-radius: 10px; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.03); }
        .stat-icon-wrap.blue { color: #3b82f6; background: rgba(59,130,246,0.1); }
        .stat-icon-wrap.gold { color: #a68966; background: rgba(166,137,102,0.1); }
        .stat-icon-wrap.green { color: #10b981; background: rgba(16,185,129,0.1); }
        .stat-info { display: flex; flex-direction: column; }
        .stat-label { font-size: 0.6rem; letter-spacing: 0.15em; color: var(--text-muted); font-weight: 800; opacity: 0.7; }
        .stat-val { font-size: 1.25rem; font-weight: 300; color: var(--text); font-family: var(--font-display); }

        .crm-actions { display: flex; justify-content: space-between; align-items: center; padding: 1.25rem; }
        .search-box { display: flex; align-items: center; gap: 1rem; background: var(--background); border: 1px solid var(--line); border-radius: 8px; padding: 0.75rem 1.25rem; width: 350px; }
        .search-box input { background: transparent; border: none; color: #fff; font-family: inherit; font-size: 0.9rem; flex: 1; outline: none; }
        
        /* NEW HEADER BTN */
        .crm-header-btns { margin-left: auto; }
        .report-ux-wrapper { display: flex; align-items: center; gap: 1.5rem; background: rgba(0,0,0,0.1); padding: 6px 12px; border-radius: 12px; border: 1px solid var(--line); }
        
        .scope-picker { display: flex; align-items: center; gap: 0.25rem; }
        .scope-label-mini { font-size: 0.55rem; font-weight: 900; color: var(--text-muted); margin-right: 0.5rem; letter-spacing: 0.1em; }
        .scope-btn { background: transparent; border: none; color: var(--text-soft); padding: 0.5rem 1rem; border-radius: 6px; font-size: 0.65rem; font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .scope-btn:hover { color: #fff; background: rgba(255,255,255,0.03); }
        .scope-btn.active { background: #a68966; color: #fff; }

        .report-actions { display: flex; gap: 0.5rem; border-left: 1px solid var(--line); padding-left: 1.5rem; }
        .lux-report-btn { background: #a68966; color: #fff; border: none; padding: 0.6rem 1.5rem; border-radius: 8px; font-size: 0.65rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: all 0.3s; }
        .lux-report-btn:hover { background: #fff; color: #000; transform: translateY(-2px); }

        /* PREVIEW MODAL STYLES */
        .preview-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(15px); z-index: 2000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .preview-container { width: 1000px; height: 95vh; background: var(--surface); border: 1px solid var(--line); border-radius: 16px; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 25px 50px rgba(0,0,0,0.5); }
        .preview-toolbar { padding: 1.5rem 2rem; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.03); }
        .preview-toolbar h3 { margin: 0; font-size: 0.9rem; letter-spacing: 0.2rem; color: #a68966; font-weight: 900; }
        .toolbar-badge { font-size: 0.55rem; font-weight: 900; color: var(--text-muted); background: rgba(255,255,255,0.05); padding: 3px 8px; border-radius: 4px; margin-left: 1rem; }
        
        .toolbar-actions { display: flex; gap: 0.75rem; }
        .tool-btn { background: var(--surface-muted); color: #fff; border: 1px solid var(--line); padding: 0.6rem 1.25rem; border-radius: 8px; font-size: 0.7rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s; }
        .tool-btn:hover { transform: translateY(-2px); border-color: #a68966; }
        .tool-btn.gold { background: #a68966; border-color: #a68966; }
        .tool-btn.close { background: rgba(239,68,68,0.1); color: #ef4444; border-color: rgba(239,68,68,0.2); }

        .preview-content-scroll { flex: 1; overflow-y: auto; padding: 3rem; background: rgba(0,0,0,0.2); display: flex; justify-content: center; }
        .preview-paper { 
            width: 210mm; min-height: 297mm; background: #fff; color: #000; padding: 15mm; 
            box-shadow: 0 10px 40px rgba(0,0,0,0.4); border-radius: 2px;
            display: flex; flex-direction: column;
        }

        /* PRINT MEDIA (KEEP ORIGINAL FOR WINDOW.PRINT) */

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
        .status-badge-premium.iletisive-gecildi { background: rgba(16,185,129,0.1); color: #10b981; border-color: rgba(16,185,129,0.2); }
        .status-badge-premium.arsivlendi { background: var(--surface-muted); color: var(--text-soft); border-color: var(--line); }

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
        .status-badge-lg.iletisive-gecildi { border-color: #10b981; color: #10b981; }

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
        .lux-action-btn.download-btn { background: #a68966; color: #fff; }
        .lux-action-btn.download-btn:hover { background: #fff; color: #000; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(166,137,102,0.3); }

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

        /* PRINT ENGINE STYLES (ENHANCED) */
        .print-view { display: none; }
        
        @media print {
          @page { size: A4; margin: 15mm; }
          body * { visibility: hidden; pointer-events: none; }
          .print-view, .print-view * { visibility: visible; }
          
          .print-view {
            position: absolute; left: 0; top: 0; width: 210mm; min-height: 297mm;
            background: #fff !important; color: #000 !important;
            display: flex !important; flex-direction: column;
            padding: 10mm; font-family: sans-serif;
          }

          .pdf-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 0.5pt solid #eee; padding-bottom: 6mm; margin-bottom: 8mm; position: relative; }
          .pdf-brand-box h1 { margin: 0; font-size: 24pt; letter-spacing: 2px; font-weight: 900; font-family: serif; color: #000; line-height: 1; }
          .pdf-brand-box p { margin: 2mm 0 0 0; font-size: 8pt; color: #666; letter-spacing: 3px; font-weight: 600; text-transform: uppercase; }
          
          /* Force A4 in PDF generation */
          .preview-paper, .print-view { width: 210mm; min-height: 297mm; background: #fff !important; color: #000 !important; }
          
          .pdf-header-divider { position: absolute; bottom: -1px; left: 0; width: 40mm; height: 2px; background: #a68966; }
          .pdf-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 1.5mm; font-size: 8.5pt; text-align: right; color: #333; }
          .pdf-meta strong { color: #a68966; margin-right: 2mm; font-weight: 800; }
          
          .pdf-title { text-align: center; font-size: 14pt; letter-spacing: 5px; margin: 8mm 0 10mm 0; border: 1px solid #000; padding: 4mm 0; font-weight: 400; text-transform: uppercase; background: #fafafa; }
          
          /* Summary Analysis Dashboard */
          .pdf-summary-analysis { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8mm; margin-bottom: 12mm; page-break-inside: avoid; }
          .summary-item { border: 1px solid #eee; padding: 6mm 4mm; display: flex; flex-direction: column; align-items: center; background: #fff; box-shadow: 0 2px 4px rgba(0,0,0,0.02); border-top: 3px solid #eee; }
          .summary-item:first-child { border-top-color: #a68966; }
          .s-label { font-size: 7.5pt; color: #888; font-weight: 800; letter-spacing: 1.5px; margin-bottom: 3mm; text-transform: uppercase; }
          .s-val { font-size: 18pt; font-weight: 300; color: #000; font-family: serif; }
          
          /* Single Report Perfect Alignment */
          .pdf-form-body { display: grid; grid-template-columns: 1fr 1fr; gap: 12mm; }
          .pdf-section { display: flex; flex-direction: column; gap: 3.5mm; margin-bottom: 10mm; page-break-inside: avoid; }
          .pdf-section.full { grid-column: 1 / -1; }
          .pdf-section h3 { margin: 0 0 3mm 0; font-size: 9.5pt; border-bottom: 1px solid #a68966; padding-bottom: 1.5mm; color: #a68966; font-weight: 800; letter-spacing: 1px; }
          .pdf-data-row { font-size: 10.5pt; line-height: 1.6; border-bottom: 1px solid #f9f9f9; padding: 1mm 0; }
          .pdf-data-row strong { width: 120px; display: inline-block; color: #555; font-size: 9pt; }
          .pdf-message-box { padding: 8mm; border: 1px solid #eee; background: #fdfdfd; font-size: 10.5pt; line-height: 1.8; white-space: pre-wrap; color: #333; }

          /* Bulk Table Perfection */
          .pdf-table { width: 100%; border-collapse: collapse; margin-top: 5mm; table-layout: fixed; border: 1px solid #000; }
          .pdf-table th { background: #000; border: 1px solid #000; padding: 4.5mm 3mm; text-align: left; font-size: 8pt; color: #fff; letter-spacing: 1.5px; font-weight: 800; text-transform: uppercase; }
          .pdf-table td { border: 1px solid #eee; padding: 4.5mm 3mm; font-size: 9.5pt; vertical-align: middle; line-height: 1.5; overflow: hidden; word-wrap: break-word; }
          .pdf-table tr:nth-child(even) { background: #fcfcfc; }
          .pdf-table tr { page-break-inside: avoid; }

          .pdf-date { display: block; font-weight: 700; color: #000; font-size: 9pt; }
          .pdf-time { display: block; font-size: 7.5pt; color: #a68966; font-weight: 800; }
          .pdf-txt-bold { font-weight: 700; color: #000; font-size: 10pt; }
          .pdf-txt-main { color: #333; font-weight: 500; }
          .pdf-txt-small { font-size: 8pt; color: #888; margin-top: 1mm; }
          .pdf-dept-tag { font-size: 7pt; font-weight: 900; color: #a68966; text-transform: uppercase; border: 0.5pt solid #a68966; padding: 1mm 2mm; border-radius: 2px; }
          .pdf-status-pill { font-size: 7.5pt; font-weight: 900; background: #eee; padding: 1.5mm 3mm; border-radius: 40px; display: inline-block; text-transform: uppercase; border: 0.5pt solid #ddd; }

          .pdf-signature-area { margin-top: 25mm; display: flex; justify-content: space-between; padding-top: 10mm; page-break-inside: avoid; }
          .sig-box { width: 65mm; text-align: center; }
          .sig-box p { font-size: 8.5pt; font-weight: 800; margin-bottom: 15mm; letter-spacing: 2px; text-transform: uppercase; color: #000; }
          .sig-line { border-bottom: 1.5pt solid #000; margin-bottom: 4mm; }
          .sig-box span { font-size: 7.5pt; color: #666; font-weight: 600; }

          .pdf-footer { margin-top: auto; padding-top: 12mm; text-align: center; font-size: 7.5pt; color: #aaa; letter-spacing: 1px; }

        /* RESPONSIVE CSS */
        @media (max-width: 1200px) {
          .crm-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 900px) {
          .crm-header { flex-direction: column !important; align-items: stretch !important; gap: 1rem !important; }
          .crm-header-btns { margin-left: 0 !important; width: 100% !important; }
          .report-ux-wrapper { flex-direction: column !important; align-items: stretch !important; gap: 1rem !important; padding: 1.25rem !important; border-radius: 12px !important; width: 100% !important; background: rgba(0,0,0,0.2) !important; display: flex !important; }
          
          .scope-picker { display: flex !important; flex-direction: column !important; gap: 0.5rem !important; width: 100% !important; }
          .scope-label-mini { margin-bottom: 0.5rem !important; text-align: center !important; font-size: 0.7rem !important; color: #a68966 !important; display: block !important; }
          .scope-btn { width: 100% !important; padding: 1rem !important; font-size: 0.85rem !important; text-align: center !important; background: rgba(255,255,255,0.05) !important; border: 1px solid var(--line) !important; border-radius: 8px !important; display: block !important; }
          .scope-btn.active { background: #a68966 !important; border-color: #a68966 !important; color: #fff !important; }
          
          .report-actions { border-left: none !important; border-top: 1px solid var(--line) !important; padding-left: 0 !important; padding-top: 1.25rem !important; margin-top: 0.5rem !important; width: 100% !important; display: flex !important; }
          .lux-report-btn { width: 100% !important; justify-content: center !important; padding: 1.25rem !important; font-size: 0.85rem !important; letter-spacing: 2px !important; font-weight: 900 !important; }

          .desktop-only { display: none !important; }
          .mobile-only { display: block !important; }
          
          .mobile-lead-card { background: var(--surface-muted); border: 1px solid var(--line); border-radius: 12px; padding: 1.25rem; margin-bottom: 1rem; cursor: pointer; transition: all 0.3s; }
          .mobile-lead-card:active { transform: scale(0.98); background: rgba(255,255,255,0.05); }
          .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
          .card-id { font-size: 0.65rem; color: var(--text-muted); font-weight: 800; }
          .card-body h3 { margin: 0 0 0.5rem 0; font-size: 1.1rem; color: #fff; }
          .card-dept { font-size: 0.75rem; color: #a68966; font-weight: 700; text-transform: uppercase; margin-bottom: 0.75rem; }
          .card-meta { display: flex; gap: 0.5rem; font-size: 0.75rem; color: var(--text-muted); }
          .btn-card-action { width: 100%; margin-top: 1.25rem; background: rgba(255,255,255,0.05); border: 1px solid var(--line); color: #fff; padding: 0.75rem; border-radius: 8px; font-size: 0.8rem; font-weight: 700; }

          .sidebar-item { border-radius: 12px; margin-bottom: 1rem; }
          
          /* Preview Modal Mobile */
          .preview-container { width: 100%; height: 100vh; border-radius: 0; border: none; }
          .preview-content-scroll { padding: 1.5rem 1rem; }
          .preview-paper { 
            width: 100%; min-width: 210mm; /* Force A4 for render, but scale it down */
            transform: scale(0.45); transform-origin: top center;
            margin-bottom: -150mm; /* Offset scale shrink */
          }
          .preview-toolbar { padding: 1rem; flex-direction: column; gap: 1rem; }
          .toolbar-actions { width: 100%; display: grid; grid-template-columns: 1fr 1fr 44px; gap: 0.5rem; }
          .tool-btn { padding: 0.75rem 0.5rem; font-size: 0.6rem; justify-content: center; }
        }

        @media (max-width: 600px) {
          .crm-stats-grid { grid-template-columns: 1fr; }
          .filter-group-scroll { overflow-x: auto; padding-bottom: 10px; -webkit-overflow-scrolling: touch; }
          .filter-btn { white-space: nowrap; }
          
          .preview-paper { transform: scale(0.35); margin-bottom: -180mm; }
        }
          .pdf-footer p { margin-bottom: 2mm; }
          .pdf-footer-line { height: 1px; background: #eee; margin: 3mm auto; width: 50%; }
        }
      `}</style>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Type, 
  BarChart3, 
  Layers,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { AdminSaveBar } from '@/components/admin/AdminSaveBar';

export default function CorporateAboutAdmin() {
  const { showToast } = useNotification();
  const [data, setData] = useState<any>(null);
  const [initialData, setInitialData] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('main'); // 'main', 'stats', 'workflow'
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content/corporate/about');
      if (res.ok) {
        const json = await res.json();
        setData(json);
        setInitialData(JSON.parse(JSON.stringify(json)));
      }
    } catch (err) {
      console.error(err);
      showToast("İçerik yüklenemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/content/corporate/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        showToast("İçerik başarıyla güncellendi!", "success");
        setInitialData(JSON.parse(JSON.stringify(data)));
        setIsDirty(false);
      } else {
        showToast("Güncelleme sırasında hata oluştu.", "error");
      }
    } catch (err) {
      showToast("Bağlantı hatası.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setData(JSON.parse(JSON.stringify(initialData)));
    setIsDirty(false);
    showToast("Değişiklikler geri alındı.", "info");
  };

  const addWorkflowStep = () => {
    const newSections = [...(data.sections || []), { title: 'Yeni Adım', content: '' }];
    setData({ ...data, sections: newSections });
    setIsDirty(true);
  };

  const removeWorkflowStep = (index: number) => {
    const newSections = data.sections.filter((_: any, i: number) => i !== index);
    setData({ ...data, sections: newSections });
    setIsDirty(true);
  };

  const updateWorkflowStep = (index: number, field: string, value: string) => {
    const newSections = [...data.sections];
    newSections[index][field] = value;
    setData({ ...data, sections: newSections });
    setIsDirty(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file
      });
      const blob = await res.json();
      setData({ ...data, image: blob.url });
      setIsDirty(true);
    } catch (err) {
      showToast("Görsel yüklenemedi.", "error");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  if (loading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="lux-admin-container">
      <div className="lux-header">
        <div className="header-text">
          <h1>KURUMSAL FİLOZOFi</h1>
          <p>Hakkımızda sayfası içeriklerini ve profesyonel iş akışını yönetin.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isDirty && (
            <button 
              className="lux-save-btn" 
              style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text-muted)', boxShadow: 'none' }}
              onClick={handleCancel}
            >
              SIFIRLA
            </button>
          )}
          <button className={`lux-save-btn ${isDirty ? 'dirty-pulse' : ''}`} onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isDirty ? 'KAYDETMEYİ UNUTMAYIN' : 'DEĞİŞİKLİKLERİ YAYINLA'}</span>
          </button>
        </div>
      </div>

      <AdminSaveBar 
        isVisible={isDirty} 
        onSave={handleSave} 
        onCancel={handleCancel}
        isSaving={saving}
      />

      <div className="lux-tabs">
        <button className={activeTab === 'main' ? 'active' : ''} onClick={() => setActiveTab('main')}>
          <FileText size={16} /> ANA İÇERİK
        </button>
        <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>
          <BarChart3 size={16} /> İSTATİSTİKLER
        </button>
        <button className={activeTab === 'workflow' ? 'active' : ''} onClick={() => setActiveTab('workflow')}>
          <Layers size={16} /> İŞ AKIŞI
        </button>
      </div>

      <div className="lux-content-grid">
        <AnimatePresence mode="wait">
          {activeTab === 'main' && (
            <motion.div 
               key="main" 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }}
               className="lux-card-stack"
            >
              <section className="lux-card">
                <div className="card-label">SAYFA BAŞLIKLARI</div>
                <div className="lux-group">
                  <label>ÜST BAŞLIK (Small Label)</label>
                  <input 
                    type="text" 
                    value={data.subtitle} 
                    onChange={e => { setData({...data, subtitle: e.target.value}); setIsDirty(true); }} 
                    placeholder="BİZ KİMİZ"
                  />
                </div>
                <div className="lux-group">
                  <label>ANA BAŞLIK</label>
                  <textarea 
                    rows={2}
                    value={data.title} 
                    onChange={e => { setData({...data, title: e.target.value}); setIsDirty(true); }}
                    placeholder="TASARIMDAN ÖTE: BÜTÜNSEL BİR DENEYİM"
                  />
                  <span>Fikir: Satır atlamak için metin içinde uygun yerlerde bırakabilirsiniz.</span>
                </div>
              </section>

              <section className="lux-card">
                <div className="card-label">GÖRSEL VE AÇIKLAMA</div>
                <div 
                  className={`media-upload-zone ${isDragging ? 'drag-active' : ''}`}
                  onClick={() => document.getElementById('about-img')?.click()}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  {data.image ? (
                    <img src={data.image} alt="About Us" className="preview-img" />
                  ) : (
                    <div className="upload-placeholder">
                      <ImageIcon size={40} />
                      <p>Kapak Görseli Yükle</p>
                    </div>
                  )}
                  <input id="about-img" type="file" className="hidden" onChange={handleImageUpload} />
                </div>
                <div className="lux-group">
                  <label>ANA AÇIKLAMA METNİ</label>
                  <textarea 
                    rows={6}
                    value={data.description} 
                    onChange={e => { setData({...data, description: e.target.value}); setIsDirty(true); }}
                    placeholder="Şirket vizyonu ve felsefesi..."
                  />
                </div>
              </section>
            </motion.div>
          )}

          {activeTab === 'stats' && (
            <motion.div 
               key="stats" 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }}
               className="lux-card"
            >
              <div className="card-label">SAYISAL VERİLER</div>
              <div className="stats-editor-grid">
                {data.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="stat-edit-group">
                    <div className="lux-group">
                      <label>ETİKET {idx+1}</label>
                      <input 
                        type="text" 
                        value={stat.label} 
                        onChange={e => {
                          const newStats = [...data.stats];
                          newStats[idx].label = e.target.value;
                          setData({...data, stats: newStats});
                          setIsDirty(true);
                        }}
                      />
                    </div>
                    <div className="lux-group">
                      <label>DEĞER {idx+1}</label>
                      <input 
                        type="text" 
                        value={stat.value} 
                        onChange={e => {
                          const newStats = [...data.stats];
                          newStats[idx].value = e.target.value;
                          setData({...data, stats: newStats});
                          setIsDirty(true);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'workflow' && (
            <motion.div 
               key="workflow" 
               initial={{ opacity: 0, y: 10 }} 
               animate={{ opacity: 1, y: 0 }} 
               exit={{ opacity: 0, y: -10 }}
               className="lux-card"
            >
              <div className="card-header-flex">
                <div className="card-label">İŞ AKIŞI ADIMLARI</div>
                <button className="add-step-btn" onClick={addWorkflowStep}>
                  <Plus size={14} /> ADIM EKLE
                </button>
              </div>

              <div className="workflow-editor-list">
                {data.sections?.map((step: any, idx: number) => (
                  <div key={idx} className="workflow-edit-item">
                    <div className="step-num">0{idx + 1}</div>
                    <div className="step-fields">
                      <input 
                        type="text" 
                        value={step.title} 
                        onChange={e => updateWorkflowStep(idx, 'title', e.target.value)}
                        placeholder="Adım Başlığı (Örn: Randevu)"
                      />
                      <textarea 
                        rows={2}
                        value={step.content} 
                        onChange={e => updateWorkflowStep(idx, 'content', e.target.value)}
                        placeholder="Kısa açıklama..."
                      />
                    </div>
                    <button className="remove-step-btn" onClick={() => removeWorkflowStep(idx)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                {(!data.sections || data.sections.length === 0) && (
                  <div className="empty-state">Henüz bir adım eklenmemiş.</div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .lux-admin-container { display: flex; flex-direction: column; gap: 3rem; max-width: 1000px; }
        
        .lux-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid rgba(166,137,102,0.2); padding-bottom: 2.5rem; gap: 1.5rem; }
        @media (max-width: 768px) {
          .lux-header { flex-direction: column; align-items: stretch; text-align: center; }
          .lux-save-btn { justify-content: center; }
        }

        .header-text h1 { font-family: var(--font-display), sans-serif; font-size: 1.5rem; letter-spacing: 0.3em; color: #a68966; margin: 0; }
        .header-text p { font-size: 0.85rem; color: var(--text-muted); margin-top: 0.5rem; }
        
        .lux-save-btn { background: #a68966; color: #000; border: none; padding: 1rem 2rem; border-radius: 4px; font-family: var(--font-display); font-weight: 800; letter-spacing: 0.15em; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: all 0.3s; box-shadow: 0 10px 30px rgba(166,137,102,0.3); }
        .lux-save-btn:hover { background: #d4b591; transform: translateY(-2px); }
        .lux-save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

        .lux-save-btn.dirty-pulse { background: #a68966; box-shadow: 0 0 20px rgba(166,137,102,0.4); animation: pulse-border 2s infinite; }
        @keyframes pulse-border { 0% { box-shadow: 0 0 0 0 rgba(166,137,102,0.4); } 70% { box-shadow: 0 0 0 10px rgba(166,137,102,0); } 100% { box-shadow: 0 0 0 0 rgba(166,137,102,0); } }

        .lux-tabs { display: flex; gap: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); overflow-x: auto; scrollbar-width: none; -ms-overflow-style: none; }
        .lux-tabs::-webkit-scrollbar { display: none; }
        .lux-tabs button { background: transparent; border: none; border-bottom: 2px solid transparent; color: var(--text-muted); padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; transition: 0.3s; display: flex; align-items: center; gap: 0.75rem; white-space: nowrap; }
        .lux-tabs button:hover { color: var(--text); }
        .lux-tabs button.active { color: #a68966; border-color: #a68966; background: rgba(166,137,102,0.05); }

        .lux-card-stack { display: flex; flex-direction: column; gap: 2rem; }
        .lux-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 16px; padding: 2.5rem; position: relative; }
        @media (max-width: 600px) { .lux-card { padding: 1.5rem; } .card-label { left: 16px; font-size: 0.5rem; } }
        .card-label { position: absolute; top: -12px; left: 24px; background: #a68966; color: #000; font-family: var(--font-display); font-size: 0.55rem; font-weight: 900; letter-spacing: 0.2em; padding: 4px 12px; border-radius: 4px; }
        
        .lux-group { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 2rem; }
        .lux-group:last-child { margin-bottom: 0; }
        .lux-group label { font-size: 0.65rem; color: var(--text-muted); font-weight: 800; letter-spacing: 0.1em; }
        .lux-group input, .lux-group textarea { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.08); padding: 1rem; color: var(--text); border-radius: 8px; font-size: 0.9rem; transition: 0.3s; }
        .lux-group input:focus, .lux-group textarea:focus { outline: none; border-color: #a68966; background: rgba(0,0,0,0.4); }
        .lux-group span { font-size: 0.65rem; color: var(--text-muted); font-style: italic; margin-top: 0.5rem; opacity: 0.6; }

        .media-upload-zone { width: 100%; height: 300px; background: rgba(0,0,0,0.3); border: 1px dashed rgba(166,137,102,0.3); border-radius: 12px; margin-bottom: 2.5rem; cursor: pointer; overflow: hidden; position: relative; transition: 0.3s; }
        .media-upload-zone:hover { border-color: #a68966; background: rgba(0,0,0,0.4); }
        .preview-img { width: 100%; height: 100%; object-fit: cover; }
        .upload-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-muted); }
        
        .stats-editor-grid { display: grid; grid-template-columns: 1fr; gap: 2rem; }
        .stat-edit-group { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 12px; }
        @media (max-width: 600px) { .stat-edit-group { grid-template-columns: 1fr; gap: 1rem; } }

        .card-header-flex { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        @media (max-width: 600px) { .card-header-flex { flex-direction: column; align-items: flex-start; gap: 1rem; } }
        .add-step-btn { background: transparent; border: 1px solid #a68966; color: #a68966; padding: 0.6rem 1.2rem; border-radius: 4px; font-size: 0.7rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: 0.3s; }
        .add-step-btn:hover { background: #a68966; color: #000; }

        .workflow-editor-list { display: flex; flex-direction: column; gap: 1.5rem; }
        .workflow-edit-item { display: flex; gap: 1.5rem; padding: 1.5rem; background: rgba(255,255,255,0.03); border-radius: 12px; align-items: flex-start; }
        @media (max-width: 600px) { .workflow-edit-item { flex-direction: column; gap: 1rem; position: relative; } .remove-step-btn { position: absolute; top: 1rem; right: 1rem; } }
        .step-num { font-family: var(--font-display); font-size: 2rem; color: rgba(166,137,102,0.2); line-height: 1; }
        .step-fields { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
        .step-fields input { background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.1); color: #a68966; font-weight: 700; font-size: 1rem; padding: 0.5rem 0; width: 100%; }
        .step-fields input:focus { outline: none; border-color: #a68966; }
        .step-fields textarea { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); color: var(--text-muted); font-size: 0.85rem; padding: 0.75rem; border-radius: 6px; width: 100%; resize: none; }
        .remove-step-btn { background: rgba(255,77,77,0.1); color: #ff4d4d; border: none; padding: 0.75rem; border-radius: 6px; cursor: pointer; transition: 0.3s; }
        .remove-step-btn:hover { background: #ff4d4d; color: #fff; }
        .empty-state { text-align: center; padding: 3rem; color: var(--text-muted); opacity: 0.5; }

        .loader-wrap { height: 400px; display: flex; align-items: center; justify-content: center; color: #a68966; }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}

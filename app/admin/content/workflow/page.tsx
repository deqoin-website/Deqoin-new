'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, BarChart3, Type, Image as ImageIcon, Upload, Plus, Trash2 } from 'lucide-react';
import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { AdminSaveBar } from '@/components/admin/AdminSaveBar';

export default function CorporateContentPage() {
  const { showToast } = useNotification();
  const [activeTab, setActiveTab] = useState<'hakkimizda' | 'rakamlar' | 'is-akisi'>('hakkimizda');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState<any>(null);

  const [data, setData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    stats: [] as { label: string; value: string }[],
    sections: [] as { title: string; content: string; image?: string }[]
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/admin/content/corporate/about');
      if (res.ok) {
        const json = await res.json();
        const formattedData = {
          title: json.title || '',
          subtitle: json.subtitle || '',
          description: json.description || '',
          image: json.image || '',
          stats: json.stats || [],
          sections: json.sections || []
        };
        setData(formattedData);
        setInitialData(JSON.parse(JSON.stringify(formattedData)));
      }
    } catch (e) {
      console.error(e);
      showToast("İerik yüklenemedi.", "error");
    } finally {
      setLoading(false);
    }
  };

  const runMigration = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/migrate/corporate');
      if (res.ok) {
        showToast("Kurumsal içerikler ve iş akışı başarıyla aktarıldı!", "success");
        fetchContent();
      }
    } catch (e) {
      showToast("Aktarım sırasında bir hata oluştu.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/content/corporate/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        showToast("Kurumsal içerikler başarıyla güncellendi!", "success");
        setInitialData(JSON.parse(JSON.stringify(data)));
        setIsDirty(false);
      } else {
        showToast("Kayıt sırasında hata oluştu.", "error");
      }
    } catch (e) {
      console.error(e);
      showToast("Bağlantı hatası.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setData(JSON.parse(JSON.stringify(initialData)));
    setIsDirty(false);
    showToast("Değişiklikler geri alındı.", "info");
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      const blob = await res.json();
      setData(prev => ({ ...prev, image: blob.url }));
      setIsDirty(true);
    } catch (err) {
      showToast("Fotoğraf yükleme başarısız.", "error");
    }
  };

  const addStat = () => {
    setData(prev => ({ ...prev, stats: [...prev.stats, { label: '', value: '' }] }));
    setIsDirty(true);
  };

  const updateStat = (index: number, key: string, value: string) => {
    setData(prev => {
      const newStats = [...prev.stats];
      (newStats[index] as any)[key] = value;
      return { ...prev, stats: newStats };
    });
    setIsDirty(true);
  };

  const removeStat = (index: number) => {
    setData(prev => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
    setIsDirty(true);
  };

  const addWorkflowStep = () => {
    setData(prev => ({ ...prev, sections: [...prev.sections, { title: '', content: '' }] }));
    setIsDirty(true);
  };

  const updateWorkflowStep = (index: number, key: string, value: string) => {
    setData(prev => {
      const newSections = [...prev.sections];
      (newSections[index] as any)[key] = value;
      return { ...prev, sections: newSections };
    });
    setIsDirty(true);
  };

  const removeWorkflowStep = (index: number) => {
    setData(prev => ({ ...prev, sections: prev.sections.filter((_, i) => i !== index) }));
    setIsDirty(true);
  };

  if (loading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="corporate-manager">
      <div className="manager-header">
        <div>
          <h2>KURUMSAL İÇERİK & İŞ AKIŞI</h2>
          <p>Hakkımızda sayfası vizyon metinlerini, istatistikleri ve kurumsal görselleri buradan yönetin.</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {isDirty && (
            <button 
              className="save-btn" 
              style={{ background: 'transparent', border: '1px solid var(--line)', color: 'var(--text-muted)' }}
              onClick={handleCancel}
            >
              SIFIRLA
            </button>
          )}
          <button className={`save-btn ${isDirty ? 'dirty-pulse' : ''}`} onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSaving ? 'KAYDEDİLİYOR...' : (isDirty ? 'KAYDETMEYİ UNUTMAYIN' : 'DEĞİŞİKLİKLERİ KAYDET')}
          </button>
        </div>
      </div>

      <AdminSaveBar 
        isVisible={isDirty} 
        onSave={handleSave} 
        onCancel={handleCancel}
        isSaving={isSaving}
      />

      <div className="tabs-nav">
        {[
          { id: 'hakkimizda', label: 'HAKKIMIZDA & VİZYON', icon: Type },
          { id: 'rakamlar', label: 'RAKAMLARLA DEQOIN', icon: BarChart3 },
          { id: 'is-akisi', label: 'PROFESYONEL İŞ AKIŞI', icon: ImageIcon }
        ].map(tab => (
          <button 
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-content admin-card">
        <AnimatePresence mode="wait">
          {activeTab === 'hakkimizda' && (
            <motion.div key="about" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="panel">
              <div className="form-group">
                <label>ANA BAŞLIK (H1)</label>
                <input type="text" value={data.title} onChange={e => { setData({...data, title: e.target.value}); setIsDirty(true); }} placeholder="Örn: TASARIMDAN ÖTE: BÜTÜNSEL BİR DENEYİM" />
              </div>
              <div className="form-group">
                <label>ALT ETİKET (EYEBROW)</label>
                <input type="text" value={data.subtitle} onChange={e => { setData({...data, subtitle: e.target.value}); setIsDirty(true); }} placeholder="Örn: BİZ KİMİZ" />
              </div>
              <div className="form-group">
                <label>VİZYON AÇIKLAMASI</label>
                <textarea rows={8} value={data.description} onChange={e => { setData({...data, description: e.target.value}); setIsDirty(true); }} placeholder="Kurumsal kimliğinizi ve yaklaşımınızı anlatan ana metin..." />
              </div>

              <div className="image-upload-wrap">
                <label>KURUMSAL KAPAK FOTOĞRAFI</label>
                <div className="image-preview" onClick={() => document.getElementById('about-file')?.click()}>
                  {data.image ? <img src={data.image} alt="Preview" /> : <div className="placeholder"><Upload size={24} /><p>Görsel Yükle</p></div>}
                </div>
                <input id="about-file" type="file" className="hidden" onChange={handleImageUpload} />
              </div>
            </motion.div>
          )}

          {activeTab === 'rakamlar' && (
            <motion.div key="stats" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="panel">
              <div className="panel-header-inline">
                <h3>İstatistik & Başarı Rakamları</h3>
                <button className="add-btn-small" onClick={addStat}><Plus size={16}/> YENİ RAKAM EKLE</button>
              </div>
              
              <div className="stats-grid-admin">
                {data.stats.map((stat, i) => (
                  <div key={i} className="stat-card-admin">
                    <div className="stat-card-header">
                       <span className="stat-num">#{i+1}</span>
                       <button className="delete-stat" onClick={() => removeStat(i)}><Trash2 size={14} /></button>
                    </div>
                    <div className="stat-inputs">
                      <input type="text" placeholder="LABE (Örn: DENEYİM)" value={stat.label} onChange={e => updateStat(i, 'label', e.target.value)} />
                      <input type="text" placeholder="DEĞER (Örn: 10+ YIL)" value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'is-akisi' && (
            <motion.div key="workflow" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="panel">
              <div className="panel-header-inline">
                <h3>Profesyonel İş Akışı Adımları</h3>
                <button className="add-btn-small" onClick={addWorkflowStep}><Plus size={16}/> YENİ ADIM EKLE</button>
              </div>

              <div className="workflow-list-admin">
                {data.sections.map((step, i) => (
                  <div key={i} className="workflow-item-card">
                    <div className="step-badge">ADIM {i + 1}</div>
                    <div className="step-inputs-wrap">
                      <div className="form-group border-none">
                         <input 
                           type="text" 
                           className="title-input-large"
                           placeholder="Adım Başlığı (Örn: Konsept Tasarım)" 
                           value={step.title} 
                           onChange={e => updateWorkflowStep(i, 'title', e.target.value)} 
                         />
                      </div>
                      <div className="form-group border-none">
                         <textarea 
                           rows={3}
                           placeholder="Adım detayı ve süreç açıklaması..." 
                           value={step.content} 
                           onChange={e => updateWorkflowStep(i, 'content', e.target.value)} 
                         />
                      </div>
                    </div>
                    <button className="delete-step-btn" onClick={() => removeWorkflowStep(i)}><Trash2 size={18}/></button>
                  </div>
                ))}

                {data.sections.length === 0 && (
                  <div className="migration-helper-workflow">
                    <ImageIcon size={40} className="icon-fade" />
                    <p>Henüz bir iş akışı adımı eklenmemiş. Kurumsal şablonu aktararak başlayabilirsiniz.</p>
                    <button className="migrate-btn-workflow" onClick={runMigration} disabled={isSaving}>
                       {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
                       VARSAYILAN İÇERİĞİ AKTAR
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .corporate-manager { display: flex; flex-direction: column; gap: 2.5rem; }
        
        .manager-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .manager-header h2 { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.1em; color: var(--text); margin: 0 0 0.5rem 0; }
        .manager-header p { margin: 0; color: var(--text-soft); opacity: 0.7; font-size: 0.85rem; }

        .save-btn.dirty-pulse { background: #a68966; box-shadow: 0 0 20px rgba(166,137,102,0.4); animation: pulse-border 2s infinite; }
        @keyframes pulse-border { 0% { box-shadow: 0 0 0 0 rgba(166,137,102,0.4); } 70% { box-shadow: 0 0 0 10px rgba(166,137,102,0); } 100% { box-shadow: 0 0 0 0 rgba(166,137,102,0); } }

        .save-btn { background: #a68966; color: #000; border: none; padding: 1rem 2rem; border-radius: 4px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: transform 0.3s; }
        .save-btn:hover { transform: translateY(-2px); }

        .tabs-nav { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--line); }
        .tab-btn { background: transparent; border: none; color: var(--text-muted); padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; border-bottom: 2px solid transparent; transition: all 0.3s; }
        .tab-btn:hover { color: var(--text); }
        .tab-btn.active { color: #a68966; border-bottom-color: #a68966; background: rgba(166,137,102,0.05); }

        .tab-content { padding: 3rem; }
        .panel { display: flex; flex-direction: column; gap: 3rem; }

        .form-group { display: flex; flex-direction: column; gap: 1rem; }
        .form-group label, .image-upload-wrap label { font-size: 0.65rem; color: #a68966; letter-spacing: 0.2em; font-weight: 800; text-transform: uppercase; }
        .form-group input, .form-group textarea { background: var(--background); border: 1px solid var(--line); padding: 1.2rem; color: var(--text); border-radius: 4px; font-family: inherit; font-size: 0.9rem; transition: border-color 0.3s; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #a68966; background: rgba(166,137,102,0.02); }

        .image-upload-wrap { display: flex; flex-direction: column; gap: 1.5rem; }
        .image-preview { width: 100%; height: 400px; background: var(--background); border: 1px dashed var(--line); border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.3s; }
        .image-preview:hover { border-color: #a68966; }
        .image-preview img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--text-muted); }

        .panel-header-inline { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .panel-header-inline h3 { margin: 0; font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.1em; color: #a68966; }
        .add-btn-small { background: var(--surface-muted); color: var(--text); border: 1px solid var(--line); padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.7rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }

        .stats-grid-admin { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .stat-card-admin { background: var(--surface-muted); border: 1px solid var(--line); padding: 1.5rem; border-radius: 8px; display: flex; flex-direction: column; gap: 1rem; }
        .stat-card-header { display: flex; justify-content: space-between; align-items: center; }
        .stat-num { font-size: 0.6rem; color: var(--text-muted); font-weight: 800; }
        .delete-stat { background: transparent; border: none; color: rgba(255,77,77,0.5); cursor: pointer; transition: color 0.3s; }
        .delete-stat:hover { color: #ff4d4d; }
        
        .stat-inputs { display: flex; flex-direction: column; gap: 0.5rem; }
        .stat-inputs input { background: var(--background); border: 1px solid var(--line); padding: 0.75rem; color: var(--text); border-radius: 4px; font-size: 0.8rem; }

        .empty-state-placeholder { padding: 5rem; text-align: center; color: var(--text-muted); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .icon-fade { opacity: 0.2; }
        .add-btn-placeholder { background: rgba(166,137,102,0.1); color: #a68966; border: 1px solid rgba(166,137,102,0.3); padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 0.7rem; font-weight: 800; cursor: pointer; letter-spacing: 0.1em; }
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        /* WORKFLOW SPECIFIC */
        .workflow-list-admin { display: flex; flex-direction: column; gap: 1.5rem; }
        .workflow-item-card { background: var(--surface-muted); border: 1px solid var(--line); border-radius: 12px; padding: 2rem; position: relative; display: flex; gap: 2rem; align-items: flex-start; }
        .step-badge { background: #a68966; color: #000; font-size: 0.6rem; font-weight: 900; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.1em; }
        .step-inputs-wrap { flex: 1; display: flex; flex-direction: column; gap: 1rem; }
        .border-none input, .border-none textarea { background: var(--background) !important; border: 1px solid var(--line) !important; }
        .title-input-large { font-size: 1.1rem !important; font-weight: 600; color: #a68966 !important; }
        .delete-step-btn { background: rgba(255,77,77,0.05); color: #ff4d4d; border: 1px solid rgba(255,77,77,0.1); width: 44px; height: 44px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
        .delete-step-btn:hover { background: #ff4d4d; color: #fff; }

        .migration-helper-workflow { padding: 4rem; text-align: center; border: 1px dashed rgba(166,137,102,0.3); background: rgba(166,137,102,0.03); border-radius: 12px; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; }
        .migrate-btn-workflow { background: #a68966; color: #000; border: none; padding: 1rem 2rem; border-radius: 4px; font-weight: 800; font-size: 0.7rem; letter-spacing: 0.1em; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: all 0.3s; }
        .migrate-btn-workflow:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(166,137,102,0.2); }

        .hidden { display: none; }
        .loader-wrap { height: 60vh; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 1024px) {
          .stats-grid-admin { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}

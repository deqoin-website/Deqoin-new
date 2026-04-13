'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Loader2, BarChart3, Type, Image as ImageIcon, Upload, Plus, Trash2 } from 'lucide-react';

export default function CorporateContentPage() {
  const [activeTab, setActiveTab] = useState<'hakkimizda' | 'rakamlar' | 'is-akisi'>('hakkimizda');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        setData({
          title: json.title || '',
          subtitle: json.subtitle || '',
          description: json.description || '',
          image: json.image || '',
          stats: json.stats || [],
          sections: json.sections || []
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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
        alert("Kurumsal içerikler başarıyla güncellendi!");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      const blob = await res.json();
      setData(prev => ({ ...prev, image: blob.url }));
    } catch (err) {
      alert("Fotoğraf yükleme başarısız.");
    }
  };

  const addStat = () => {
    setData(prev => ({ ...prev, stats: [...prev.stats, { label: '', value: '' }] }));
  };

  const updateStat = (index: number, key: string, value: string) => {
    setData(prev => {
      const newStats = [...prev.stats];
      (newStats[index] as any)[key] = value;
      return { ...prev, stats: newStats };
    });
  };

  const removeStat = (index: number) => {
    setData(prev => ({ ...prev, stats: prev.stats.filter((_, i) => i !== index) }));
  };

  if (loading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="corporate-manager">
      <div className="manager-header">
        <div>
          <h2>KURUMSAL İÇERİK & İŞ AKIŞI</h2>
          <p>Hakkımızda sayfası vizyon metinlerini, istatistikleri ve kurumsal görselleri buradan yönetin.</p>
        </div>
        <button className="save-btn" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
        </button>
      </div>

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
                <input type="text" value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="Örn: TASARIMDAN ÖTE: BÜTÜNSEL BİR DENEYİM" />
              </div>
              <div className="form-group">
                <label>ALT ETİKET (EYEBROW)</label>
                <input type="text" value={data.subtitle} onChange={e => setData({...data, subtitle: e.target.value})} placeholder="Örn: BİZ KİMİZ" />
              </div>
              <div className="form-group">
                <label>VİZYON AÇIKLAMASI</label>
                <textarea rows={8} value={data.description} onChange={e => setData({...data, description: e.target.value})} placeholder="Kurumsal kimliğinizi ve yaklaşımınızı anlatan ana metin..." />
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
              <div className="empty-state-placeholder">
                 <Loader2 className="spin" size={32} />
                 <p>İş Akışı (Workflow) detaylı düzenleme modülü bir sonraki güncellemede bu ekrana dahil edilecektir. Şimdilik statik yapı korunmaktadır.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .corporate-manager { display: flex; flex-direction: column; gap: 2.5rem; }
        
        .manager-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .manager-header h2 { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.1em; color: #fff; margin: 0 0 0.5rem 0; }
        .manager-header p { margin: 0; color: rgba(255,255,255,0.5); font-size: 0.85rem; }

        .save-btn { background: #a68966; color: #000; border: none; padding: 1rem 2rem; border-radius: 4px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: transform 0.3s; }
        .save-btn:hover { transform: translateY(-2px); }

        .tabs-nav { display: flex; gap: 0.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
        .tab-btn { background: transparent; border: none; color: rgba(255,255,255,0.4); padding: 1rem 1.5rem; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; border-bottom: 2px solid transparent; transition: all 0.3s; }
        .tab-btn:hover { color: #fff; }
        .tab-btn.active { color: #a68966; border-bottom-color: #a68966; background: rgba(166,137,102,0.05); }

        .tab-content { padding: 3rem; }
        .panel { display: flex; flex-direction: column; gap: 2rem; }

        .form-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .form-group label { font-size: 0.65rem; color: rgba(255,255,255,0.5); letter-spacing: 0.15em; font-weight: 600; }
        .form-group input, .form-group textarea { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1.2rem; color: #fff; border-radius: 4px; font-family: inherit; font-size: 0.9rem; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #a68966; }

        .image-upload-wrap { display: flex; flex-direction: column; gap: 1rem; }
        .image-preview { width: 100%; height: 400px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.3s; }
        .image-preview:hover { border-color: rgba(255,255,255,0.3); }
        .image-preview img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.2); }

        .panel-header-inline { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
        .panel-header-inline h3 { margin: 0; font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.1em; color: #a68966; }
        .add-btn-small { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 0.5rem 1rem; border-radius: 4px; font-size: 0.7rem; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }

        .stats-grid-admin { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .stat-card-admin { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; border-radius: 8px; display: flex; flex-direction: column; gap: 1rem; }
        .stat-card-header { display: flex; justify-content: space-between; align-items: center; }
        .stat-num { font-size: 0.6rem; color: rgba(255,255,255,0.2); font-weight: 800; }
        .delete-stat { background: transparent; border: none; color: rgba(255,77,77,0.5); cursor: pointer; transition: color 0.3s; }
        .delete-stat:hover { color: #ff4d4d; }
        
        .stat-inputs { display: flex; flex-direction: column; gap: 0.5rem; }
        .stat-inputs input { background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.05); padding: 0.75rem; color: #fff; border-radius: 4px; font-size: 0.8rem; }

        .empty-state-placeholder { padding: 5rem; text-align: center; color: rgba(255,255,255,0.3); display: flex; flex-direction: column; align-items: center; gap: 1rem; }
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { 100% { transform: rotate(360deg); } }

        .hidden { display: none; }
        .loader-wrap { height: 60vh; display: flex; align-items: center; justify-content: center; }

        @media (max-width: 1024px) {
          .stats-grid-admin { grid-template-columns: 1fr 1fr; }
        }
      `}</style>
    </div>
  );
}

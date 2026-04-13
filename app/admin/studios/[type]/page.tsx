'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, Upload, Loader2, X } from 'lucide-react';

export default function DepartmentManagerPage() {
  const params = useParams();
  const rawType = params?.type; 
  const slug = Array.isArray(rawType) ? rawType[0] : rawType || 'mimarlik';

  const [activeTab, setActiveTab] = useState<'genel' | 'surec' | 'odak' | 'kategoriler'>('genel');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Department State
  const [data, setData] = useState({
    title: '',
    sideLabel: '',
    description: '',
    image: '',
    mediaType: 'image',
    sliderImages: [] as string[],
    process: [] as { title: string; desc: string }[],
    focusAreas: [] as { title: string; icon: string; desc: string }[],
    categories: [] as { label: string; value: string }[]
  });

  useEffect(() => {
    fetchDepartmentData();
  }, [slug]);

  const fetchDepartmentData = async () => {
    try {
      const res = await fetch(`/api/admin/departments/${slug}`);
      if (res.ok) {
        const json = await res.json();
        setData({
          title: json.title || '',
          sideLabel: json.sideLabel || '',
          description: json.description || '',
          image: json.image || '',
          mediaType: json.mediaType || 'image',
          sliderImages: json.sliderImages || [],
          process: json.process || [],
          focusAreas: json.focusAreas || [],
          categories: json.categories || []
        });
      } else {
        // Fallback for new empty slug setup
        if (slug === 'design') setData(prev => ({...prev, title: 'Mimari Studio'}));
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
      const res = await fetch(`/api/admin/departments/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert("Başarıyla Kaydedildi!");
      } else {
        alert("Kaydetme sırasında bir hata oluştu.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      const blob = await res.json();
      
      const isVideo = file.type.startsWith('video/');
      setData(prev => ({ 
        ...prev, 
        [field]: blob.url,
        mediaType: isVideo ? 'video' : 'image'
      }));
    } catch (err) {
      alert("Yükleme başarısız.");
    }
  };

  // Array Handlers
  const addItem = (field: 'process' | 'focusAreas' | 'categories', emptyItem: any) => {
    setData(prev => ({ ...prev, [field]: [...prev[field], emptyItem] }));
  };

  const removeItem = (field: 'process' | 'focusAreas' | 'categories', index: number) => {
    setData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const updateItem = (field: 'process' | 'focusAreas' | 'categories', index: number, key: string, value: string) => {
    setData(prev => {
      const newArray = [...prev[field]];
      (newArray[index] as any)[key] = value;
      return { ...prev, [field]: newArray };
    });
  };

  if (loading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="dept-manager-layout">
      {/* HEADER */}
      <div className="dept-header">
        <div>
          <h2>"{slug.toUpperCase()}" DİNAMİK YÖNETİM PANELİ</h2>
          <p>Seçili departmanın web sitesindeki görünen tüm verilerini (Genel Ayarlar, İş Akışı, Odak Noktaları) yönetin.</p>
        </div>
        <button className="save-btn-main" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? 'KAYDEDİLİYOR...' : 'TÜMÜNÜ KAYDET'}
        </button>
      </div>

      {/* TABS NAVIGATION */}
      <div className="tabs-nav">
        {[
          { id: 'genel', label: 'GENEL BİLGİLER & MEDYA' },
          { id: 'surec', label: 'İŞ AKIŞI (PROCESS)' },
          { id: 'odak', label: 'ODAK ALANLARI (CARDS)' },
          { id: 'kategoriler', label: 'PROJE KATEGORİSİ' }
        ].map(tab => (
          <button 
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENTS */}
      <div className="tab-content-area admin-card">
        <AnimatePresence mode="wait">
          
          {/* GENEL BİLGİLER */}
          {activeTab === 'genel' && (
            <motion.div key="genel" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="tab-panel">
              <div className="form-grid-2">
                <div className="form-group">
                  <label>SAYFA BAŞLIĞI</label>
                  <input type="text" value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="Örn: Mimarlık" />
                </div>
                <div className="form-group">
                  <label>YAN/ALT BAŞLIK (İngilizce/Tematik)</label>
                  <input type="text" value={data.sideLabel} onChange={e => setData({...data, sideLabel: e.target.value})} placeholder="Örn: Structural Form" />
                </div>
              </div>
              
              <div className="form-group">
                <label>GENEL AÇIKLAMA METNİ</label>
                <textarea rows={6} value={data.description} onChange={e => setData({...data, description: e.target.value})} placeholder="Departmanın vizyonunu ve nasıl çalıştığını anlatan ana paragraf..." />
              </div>

              <div className="hero-upload-section">
                <label>KAPAK MEDYASI (VİDEO YADA GÖRSEL)</label>
                <div className="hero-preview" onClick={() => document.getElementById('hero-img-upload')?.click()}>
                  {data.image ? (
                    data.mediaType === 'video' ? (
                      <video src={data.image} autoPlay muted loop className="preview-media" />
                    ) : (
                      <img src={data.image} alt="Hero" className="preview-media" />
                    )
                  ) : (
                    <div className="placeholder"><Upload size={24} /> <p>Dosya Yükle</p></div>
                  )}
                </div>
                
                <div className="url-input-row" style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                   <input 
                     type="text" 
                     placeholder="Manuel Video/Görsel URL (MP4 destekler)..." 
                     value={data.image}
                     onChange={e => {
                       const url = e.target.value;
                       const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg)$/) !== null;
                       setData({...data, image: url, mediaType: isVideo ? 'video' : 'image'});
                     }}
                     style={{ flex: 1, padding: '0.85rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '4px' }}
                   />
                   <button className="upload-btn-sm" onClick={() => document.getElementById('hero-img-upload')?.click()} style={{ padding: '0 1rem', background: '#a68966', color: '#000', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 700 }}>YÜKLE</button>
                </div>
                <input id="hero-img-upload" type="file" className="hidden" onChange={e => handleImageUpload(e, 'image')} accept="image/*,video/*" />
                <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.5rem' }}>Anasayfadaki ilk kapak görseli veya video burada yönetilir. MP4 formatı önerilir.</p>
              </div>
            </motion.div>
          )}

          {/* SÜREÇ (PROCESS) */}
          {activeTab === 'surec' && (
            <motion.div key="surec" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="tab-panel list-panel">
              <div className="panel-header">
                <h3>İş Akışı Süreçleri</h3>
                <button className="add-item-btn" onClick={() => addItem('process', { title: '', desc: '' })}>
                  <Plus size={16} /> YENİ ADIM EKLE
                </button>
              </div>
              <div className="items-list">
                {data.process.map((step, i) => (
                  <div key={i} className="list-item-card">
                    <div className="drag-handle"><GripVertical size={20} /></div>
                    <div className="item-inputs">
                      <input type="text" placeholder="Adım Başlığı (Örn: Konsept ve Keşif)" value={step.title} onChange={e => updateItem('process', i, 'title', e.target.value)} />
                      <textarea placeholder="Adım Açıklaması..." value={step.desc} onChange={e => updateItem('process', i, 'desc', e.target.value)} rows={2} />
                    </div>
                    <button className="remove-btn" onClick={() => removeItem('process', i)}><Trash2 size={16} /></button>
                  </div>
                ))}
                {data.process.length === 0 && <p className="empty">Henüz bir süreç adımı eklenmemiş.</p>}
              </div>
            </motion.div>
          )}

          {/* ODAK ALANLARI (FOCUS AREAS) */}
          {activeTab === 'odak' && (
            <motion.div key="odak" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="tab-panel list-panel">
              <div className="panel-header">
                <h3>Odak Alanları / İkonlu Kartlar</h3>
                <button className="add-item-btn" onClick={() => addItem('focusAreas', { title: '', icon: 'architecture', desc: '' })}>
                  <Plus size={16} /> YENİ KART EKLE
                </button>
              </div>
              <div className="items-grid">
                {data.focusAreas.map((focus, i) => (
                  <div key={i} className="grid-item-card">
                    <div className="card-top">
                      <select className="icon-select" value={focus.icon} onChange={e => updateItem('focusAreas', i, 'icon', e.target.value)}>
                        <option value="architecture">Mimari İkon (Bina)</option>
                        <option value="diamond">Elmas / Lüks İkon</option>
                        <option value="eco">Yaprak / Çevre İkon</option>
                        <option value="lightbulb">Işık / Fikir İkon</option>
                        <option value="hammer">Çekiç / Uygulama İkon</option>
                      </select>
                      <button className="remove-btn-small" onClick={() => removeItem('focusAreas', i)}><X size={14} /></button>
                    </div>
                    <input type="text" placeholder="Kart Başlığı" value={focus.title} onChange={e => updateItem('focusAreas', i, 'title', e.target.value)} />
                    <textarea placeholder="Kart Açıklaması" value={focus.desc} onChange={e => updateItem('focusAreas', i, 'desc', e.target.value)} rows={3} />
                  </div>
                ))}
                {data.focusAreas.length === 0 && <p className="empty">Odak kartı bulunamadı.</p>}
              </div>
            </motion.div>
          )}

          {/* KATEGORİLER */}
          {activeTab === 'kategoriler' && (
            <motion.div key="kategoriler" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="tab-panel list-panel">
              <div className="panel-header">
                <h3>Proje Filtre Kategorileri</h3>
                <button className="add-item-btn" onClick={() => addItem('categories', { label: '', value: '' })}>
                  <Plus size={16} /> KATEGORİ EKLE
                </button>
              </div>
              <p className="hint">Bu departmanın stüdyo sayfasında listelenecek projelerin kategorilerini ayarlar. Değer (value) alanı boşluksuz ve İngilizce olmalıdır (Örn: luks-konut).</p>
              
              <div className="category-list">
                {data.categories.map((cat, i) => (
                  <div key={i} className="category-row">
                    <input type="text" placeholder="Görünen Etiket (Örn: LÜKS KONUT)" value={cat.label} onChange={e => updateItem('categories', i, 'label', e.target.value)} />
                    <span className="arrow">→</span>
                    <input type="text" placeholder="Sistem Değeri (Örn: luks-konut)" value={cat.value} onChange={e => updateItem('categories', i, 'value', e.target.value)} />
                    <button className="remove-btn-small ml-auto" onClick={() => removeItem('categories', i)}><Trash2 size={16} /></button>
                  </div>
                ))}
                {data.categories.length === 0 && <p className="empty">Kategori bulunamadı.</p>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style jsx>{`
        .dept-manager-layout { display: flex; flex-direction: column; gap: 2rem; }
        
        .dept-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .dept-header h2 { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.1em; color: var(--text); margin: 0 0 0.5rem 0; }
        .dept-header p { margin: 0; color: var(--text-soft); opacity: 0.7; font-size: 0.85rem; }

        .save-btn-main { background: #a68966; color: #000; border: none; padding: 1rem 2rem; border-radius: 4px; font-family: var(--font-display); font-weight: 700; letter-spacing: 0.1em; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: background 0.3s; }
        .save-btn-main:hover { background: #c5a680; }
        .save-btn-main:disabled { opacity: 0.7; cursor: not-allowed; }

        .tabs-nav { display: flex; gap: 0.5rem; border-bottom: 1px solid var(--line); padding-bottom: 1rem; }
        .tab-btn { background: transparent; border: none; color: var(--text-muted); padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.1em; cursor: pointer; transition: all 0.3s; }
        .tab-btn:hover { color: var(--text); background: var(--surface-muted); }
        .tab-btn.active { background: rgba(166,137,102,0.1); color: #a68966; }

        .tab-content-area { padding: 3rem; min-height: 400px; }
        
        .tab-panel { display: flex; flex-direction: column; gap: 2rem; }

        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .form-group label { font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.15em; font-weight: 600; }
        .form-group input, .form-group textarea { background: var(--background); border: 1px solid var(--line); padding: 1rem; color: var(--text); border-radius: 4px; font-family: inherit; resize: vertical; }
        .form-group input:focus, .form-group textarea:focus { outline: none; border-color: #a68966; }

        .hero-upload-section { display: flex; flex-direction: column; gap: 0.75rem; }
        .hero-upload-section label { font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.15em; font-weight: 600; }
        .hero-preview { width: 100%; height: 300px; background: var(--background); border: 1px dashed var(--line); border-radius: 8px; overflow: hidden; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: border-color 0.3s; }
        .hero-preview:hover { border-color: var(--accent); }
        .hero-preview img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: var(--text-muted); font-size: 0.8rem; }

        /* LIST PANELS */
        .panel-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--line); padding-bottom: 1rem; }
        .panel-header h3 { margin: 0; color: #a68966; font-family: var(--font-display); font-size: 1.1rem; letter-spacing: 0.1em; }
        
        .add-item-btn { background: var(--surface-muted); border: 1px solid var(--line); color: var(--text); padding: 0.5rem 1rem; border-radius: 4px; display: flex; align-items: center; gap: 0.5rem; font-size: 0.75rem; cursor: pointer; transition: background 0.3s; }
        .add-item-btn:hover { background: var(--line); }

        .items-list { display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem; }
        .list-item-card { display: flex; align-items: flex-start; gap: 1rem; background: var(--surface-muted); border: 1px solid var(--line); padding: 1.5rem; border-radius: 8px; }
        .drag-handle { padding-top: 0.5rem; color: var(--text-muted); cursor: grab; }
        .item-inputs { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
        .item-inputs input, .item-inputs textarea { background: var(--background); border: 1px solid var(--line); color: var(--text); padding: 0.85rem; border-radius: 4px; font-family: inherit; }
        .item-inputs input:focus, .item-inputs textarea:focus { outline: none; border-color: rgba(166,137,102,0.5); }
        .remove-btn { background: rgba(255,77,77,0.1); color: #ff4d4d; border: none; width: 44px; height: 44px; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
        .remove-btn:hover { background: #ff4d4d; color: #fff; }

        .items-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1rem; }
        .grid-item-card { display: flex; flex-direction: column; gap: 0.75rem; background: var(--surface-muted); border: 1px solid var(--line); padding: 1.5rem; border-radius: 8px; }
        .card-top { display: flex; justify-content: space-between; align-items: center; }
        .icon-select { background: var(--background); border: 1px solid var(--line); color: #a68966; padding: 0.5rem; border-radius: 4px; font-family: inherit; font-size: 0.8rem; }
        .icon-select:focus { outline: none; border-color: #a68966; }
        .grid-item-card input, .grid-item-card textarea { background: var(--background); border: 1px solid var(--line); color: var(--text); padding: 0.85rem; border-radius: 4px; font-family: inherit; }
        .grid-item-card input:focus, .grid-item-card textarea:focus { outline: none; border-color: rgba(166,137,102,0.5); }
        .remove-btn-small { background: rgba(255,77,77,0.1); color: #ff4d4d; border: none; width: 32px; height: 32px; border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .category-list { display: flex; flex-direction: column; gap: 0.75rem; margin-top: 1rem; }
        .category-row { display: flex; align-items: center; gap: 1rem; background: var(--surface-muted); border: 1px solid var(--line); padding: 1rem; border-radius: 8px; }
        .category-row input { background: var(--background); border: 1px solid var(--line); color: var(--text); padding: 0.75rem; border-radius: 4px; font-family: inherit; flex: 1; }
        .arrow { color: var(--text-muted); }
        .ml-auto { margin-left: auto; }

        .hint { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 1rem; }
        .empty { text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 2rem; border: 1px dashed var(--line); border-radius: 8px; margin-top: 1rem; }
        .hidden { display: none; }
        .loader-wrap { height: 60vh; display: flex; align-items: center; justify-content: center; color: #a68966; }
      `}</style>
    </div>
  );
}

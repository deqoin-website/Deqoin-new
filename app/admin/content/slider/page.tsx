'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Image as ImageIcon, 
  Video, 
  Save, 
  Sliders, 
  Type, 
  Plus, 
  Trash2, 
  Upload, 
  Loader2, 
  Check, 
  Eye,
  GripVertical
} from 'lucide-react';

export default function SliderConfigPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activePreviewId, setActivePreviewId] = useState<string | null>(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const res = await fetch('/api/admin/slides');
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
        if (data.length > 0) setActivePreviewId(data[0]._id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const addSlide = () => {
    const newSlide = {
      title: 'YENİ SAHNE',
      subtitle: 'ALT BAŞLIK',
      mediaUrl: '',
      mediaType: 'image',
      blur: 0,
      overlay: 30,
      order: slides.length,
      active: true
    };
    setSlides([...slides, { ...newSlide, _temporary: true, _id: Date.now().toString() }]);
  };

  const updateSlide = (id: string, key: string, value: any) => {
    setSlides(slides.map(s => s._id === id ? { ...s, [key]: value } : s));
  };

  const removeSlide = async (id: string, isTemporary?: boolean) => {
    if (!confirm("Bu sahneyi silmek istediğinize emin misiniz?")) return;
    if (isTemporary) {
      setSlides(slides.filter(s => s._id !== id));
      return;
    }
    try {
      const res = await fetch(`/api/admin/slides/${id}`, { method: 'DELETE' });
      if (res.ok) fetchSlides();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Logic: Save each slide. Optimized version would be a bulk update API.
      // For now, we'll save them one by one for simplicity and robustness.
      for (const slide of slides) {
        const method = slide._temporary ? 'POST' : 'PUT';
        const url = slide._temporary ? '/api/admin/slides' : `/api/admin/slides/${slide._id}`;
        
        const { _temporary, _id, ...saveBody } = slide;
        
        await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(saveBody)
        });
      }
      alert("Tüm sahneler başarıyla kaydedildi!");
      fetchSlides();
    } catch (e) {
      console.error(e);
      alert("Kayıt sırasında bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slideId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      const blob = await res.json();
      
      const isVideo = file.type.startsWith('video/');
      
      setSlides(slides.map(s => s._id === slideId ? { 
        ...s, 
        mediaUrl: blob.url, 
        mediaType: isVideo ? 'video' : 'image' 
      } : s));
    } catch (err) {
      alert("Yükleme başarısız.");
    }
  };

  const runMigration = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/migrate/slides');
      if (res.ok) {
        alert("Varsayılan sahneler başarıyla aktarıldı!");
        fetchSlides();
      }
    } catch (e) {
      alert("Aktarım sırasında bir hata oluştu.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="slider-manager">
      <div className="manager-header">
        <div>
          <h2>SİNEMATİK MEDYA & SLIDER</h2>
          <p>Anasayfa snap-scroll geçişlerini, sloganları ve arka plan efektlerini yönetin.</p>
        </div>
        <div className="header-actions">
           <button className="add-btn-outline" onClick={addSlide}><Plus size={18} /> YENİ SAHNE</button>
           <button className="save-btn" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              {isSaving ? 'KAYDEDİLİYOR...' : 'TÜMÜNÜ KAYDET'}
           </button>
        </div>
      </div>

      <div className="slides-layout">
        <div className="slides-list">
          {slides.map((slide, i) => (
            <div 
              key={slide._id} 
              className={`slide-item-sm ${activePreviewId === slide._id ? 'active' : ''}`}
              onClick={() => setActivePreviewId(slide._id)}
            >
              <div className="drag-handle"><GripVertical size={16}/></div>
              <div className="item-thumb">
                {slide.mediaType === 'image' ? <img src={slide.mediaUrl || '/images/placeholder.jpg'} alt="" /> : <div className="video-thumb"><Video size={16}/></div>}
              </div>
              <div className="item-meta">
                <span className="item-title">{slide.title || 'BAŞLIKSIZ'}</span>
                <span className="item-sub">{slide.mediaType.toUpperCase()}</span>
              </div>
              <button 
                className="delete-item-btn" 
                onClick={(e) => { e.stopPropagation(); removeSlide(slide._id, slide._temporary); }}
              >
                <Trash2 size={14}/>
              </button>
            </div>
          ))}
          {slides.length === 0 && (
            <div className="migration-helper admin-card">
              <ImageIcon size={32} className="icon-gold" />
              <h4>VERİTABANI BOŞ</h4>
              <p>Henüz yönetilebilir bir sahne bulunamadı. Web sitesindeki varsayılan sahneleri buraya aktararak başlayabilirsiniz.</p>
              <button className="migrate-btn" onClick={runMigration} disabled={isSaving}>
                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                VARSAYILANLARI AKTAR
              </button>
            </div>
          )}
        </div>

        <div className="editor-side">
          {activePreviewId ? (
            <AnimatePresence mode="wait">
              {slides.filter(s => s._id === activePreviewId).map(slide => (
                <motion.div 
                  key={slide._id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="slide-editor-card admin-card"
                >
                  <div className="editor-top">
                     <h3>SAHNE AYARLARI</h3>
                     <div className="badge">{slide.mediaType === 'video' ? <Video size={14}/> : <ImageIcon size={14} />} {slide.mediaType.toUpperCase()}</div>
                  </div>

                  <div className="visual-preview-container">
                    <div className="preview-label"><Eye size={12}/> CANLI ÖNİZLEME</div>
                    <div className="dynamic-preview-box">
                       {slide.mediaType === 'image' ? (
                         <div className="preview-bg" style={{ backgroundImage: `url(${slide.mediaUrl || '/images/placeholder.jpg'})`, filter: `blur(${slide.blur}px)` }}></div>
                       ) : (
                         <video key={slide.mediaUrl} className="preview-bg" autoPlay muted loop style={{ filter: `blur(${slide.blur}px)` }}><source src={slide.mediaUrl} /></video>
                       )}
                       <div className="preview-overlay" style={{ background: `rgba(0,0,0,${slide.overlay / 100})` }}></div>
                       <div className="preview-content">
                         <span className="prev-sub">{slide.subtitle}</span>
                         <span className="prev-title">{slide.title}</span>
                       </div>
                    </div>
                  </div>

                  <div className="editor-grid">
                    <div className="editor-group">
                       <label><Type size={14} /> METİN İÇERİKLERİ</label>
                       <div className="input-stack">
                         <input type="text" placeholder="Ana Başlık (Örn: TASARIM)" value={slide.title} onChange={e => updateSlide(slide._id, 'title', e.target.value)} />
                         <input type="text" placeholder="Alt Başlık (Örn: HAYALLERİN MİMARİSİ)" value={slide.subtitle} onChange={e => updateSlide(slide._id, 'subtitle', e.target.value)} />
                       </div>
                    </div>

                    <div className="editor-group">
                       <label><ImageIcon size={14} /> MEDYA DOSYASI (VİDEO/GÖRSEL)</label>
                       <div className="file-control">
                         <input 
                           type="text" 
                           value={slide.mediaUrl} 
                           onChange={e => {
                             const url = e.target.value;
                             const isVideo = url.toLowerCase().match(/\.(mp4|webm|ogg)$/) !== null;
                             updateSlide(slide._id, 'mediaUrl', url);
                             updateSlide(slide._id, 'mediaType', isVideo ? 'video' : 'image');
                           }}
                           placeholder="MP4 linki yapıştırın veya dosya yükleyin..." 
                         />
                         <button className="upload-mini-btn" onClick={() => document.getElementById(`file-${slide._id}`)?.click()}>
                           <Upload size={14}/> DOSYA YÜKLE
                         </button>
                         <input id={`file-${slide._id}`} type="file" className="hidden" onChange={e => handleFileUpload(e, slide._id)} accept="image/*,video/*" />
                       </div>
                       <p className="hint-txt">Vercel Blob ile doğrudan yükleme yapabilir veya harici bir MP4/Resim bağlantısı kullanabilirsiniz.</p>
                    </div>

                    <div className="editor-group">
                       <label><Sliders size={14} /> SİNEMATİK EFEKTLER</label>
                       <div className="range-rows">
                         <div className="range-row">
                           <div className="range-info">
                             <span>Arka Plan Fluluğu (Blur)</span>
                             <strong>{slide.blur}px</strong>
                           </div>
                           <input type="range" min="0" max="40" value={slide.blur} onChange={e => updateSlide(slide._id, 'blur', parseInt(e.target.value))} />
                         </div>
                         <div className="range-row">
                           <div className="range-info">
                             <span>Karanlık Maske (Overlay)</span>
                             <strong>%{slide.overlay}</strong>
                           </div>
                           <input type="range" min="0" max="90" value={slide.overlay} onChange={e => updateSlide(slide._id, 'overlay', parseInt(e.target.value))} />
                         </div>
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="no-selection admin-card">
              <ImageIcon size={48} />
              <p>Düzenlemek için soldaki listeden bir sahne seçin veya yeni bir tane ekleyin.</p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .slider-manager { display: flex; flex-direction: column; gap: 2rem; }
        
        .manager-header { display: flex; justify-content: space-between; align-items: flex-end; }
        .manager-header h2 { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.1em; color: var(--text); margin: 0 0 0.5rem 0; }
        .manager-header p { margin: 0; color: var(--text-soft); opacity: 0.7; font-size: 0.85rem; }

        .header-actions { display: flex; gap: 1rem; }
        .add-btn-outline { background: transparent; border: 1px solid var(--line); color: var(--text); padding: 0.85rem 1.5rem; border-radius: 4px; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; }
        .save-btn { background: #a68966; color: #000; border: none; padding: 0.85rem 2rem; border-radius: 4px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; transition: transform 0.3s; }
        .save-btn:hover { transform: translateY(-2px); }

        .slides-layout { display: grid; grid-template-columns: 320px 1fr; gap: 2rem; align-items: start; }
        
        /* LIST SIDE */
        .slides-list { display: flex; flex-direction: column; gap: 0.75rem; }
        .slide-item-sm { background: var(--surface-muted); border: 1px solid var(--line); padding: 0.75rem; border-radius: 8px; display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: all 0.3s; position: relative; }
        .slide-item-sm:hover { background: var(--line); }
        .slide-item-sm.active { background: rgba(166,137,102,0.1); border-color: #a68966; }
        
        .drag-handle { color: var(--text-muted); cursor: grab; }
        .item-thumb { width: 60px; height: 40px; border-radius: 4px; overflow: hidden; background: #000; }
        .item-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .video-thumb { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.3); }

        .item-meta { flex: 1; display: flex; flex-direction: column; min-width: 0; }
        .item-title { font-size: 0.75rem; font-weight: 700; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: 0.05em; }
        .item-sub { font-size: 0.6rem; color: var(--text-muted); }
        
        .delete-item-btn { position: absolute; right: 0.75rem; background: transparent; border: none; color: rgba(255,77,77,0.3); cursor: pointer; opacity: 0; transition: opacity 0.3s; }
        .slide-item-sm:hover .delete-item-btn { opacity: 1; }
        .delete-item-btn:hover { color: #ff4d4d; }

        /* EDITOR SIDE */
        .slide-editor-card { padding: 2rem; }
        .editor-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .editor-top h3 { margin: 0; font-family: var(--font-display); font-size: 1rem; color: #a68966; letter-spacing: 0.1em; }
        .badge { background: var(--background); color: var(--text-soft); opacity: 0.7; padding: 4px 10px; border-radius: 4px; font-size: 0.6rem; font-weight: 700; display: flex; align-items: center; gap: 0.5rem; }

        .visual-preview-container { margin-bottom: 2.5rem; }
        .preview-label { font-size: 0.6rem; color: var(--text-muted); letter-spacing: 0.1em; margin-bottom: 0.5rem; font-weight: 800; display: flex; align-items: center; gap: 0.4rem; }
        .dynamic-preview-box { width: 100%; height: 300px; background: #000; border-radius: 12px; position: relative; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .preview-bg { position: absolute; inset: -20px; background-size: cover; background-position: center; transition: filter 0.3s; }
        .preview-overlay { position: absolute; inset: 0; transition: background 0.3s; }
        .preview-content { position: relative; z-index: 2; text-align: center; }
        .prev-title { display: block; font-family: var(--font-display); font-size: 2.5rem; color: #fff; letter-spacing: 0.15em; font-weight: 200; }
        .prev-sub { display: block; font-size: 0.75rem; color: rgba(255,255,255,0.7); letter-spacing: 0.3em; margin-bottom: 0.5rem; }

        .editor-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        .editor-group { display: flex; flex-direction: column; gap: 1rem; }
        .editor-group label { display: flex; align-items: center; gap: 0.6rem; font-size: 0.7rem; color: var(--text-muted); font-weight: 700; letter-spacing: 0.1em; border-bottom: 1px solid var(--line); padding-bottom: 0.5rem; }
        
        .input-stack { display: flex; flex-direction: column; gap: 0.75rem; }
        .input-stack input { background: var(--background); border: 1px solid var(--line); padding: 0.85rem; border-radius: 4px; color: var(--text); font-family: inherit; font-size: 0.85rem; }
        .input-stack input:focus { border-color: #a68966; outline: none; }

        .file-control { display: flex; gap: 0.5rem; }
        .file-control input { flex: 1; background: var(--background); border: 1px solid var(--line); padding: 0.75rem; border-radius: 4px; color: var(--text-soft); font-size: 0.75rem; }
        .upload-mini-btn { background: var(--surface-muted); color: var(--text); border: 1px solid var(--line); padding: 0 1.25rem; border-radius: 4px; font-size: 0.7rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; }

        .range-rows { display: flex; flex-direction: column; gap: 1.5rem; }
        .range-row { display: flex; flex-direction: column; gap: 0.5rem; }
        .range-info { display: flex; justify-content: space-between; font-size: 0.7rem; color: rgba(255,255,255,0.4); }
        .range-info strong { color: #a68966; }
        .range-row input[type="range"] { accent-color: #a68966; cursor: pointer; }

        .no-selection { height: 500px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--text-muted); opacity: 0.3; gap: 1.5rem; text-align: center; padding: 3rem; }
        .no-selection p { font-size: 0.9rem; color: var(--text-muted); opacity: 0.7; }

        .loader-wrap { height: 60vh; display: flex; align-items: center; justify-content: center; }
        .hidden { display: none; }

        .migration-helper { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1rem; padding: 2.5rem 1.5rem; background: rgba(166,137,102,0.05); border: 1px dashed rgba(166,137,102,0.3); margin-top: 1rem; }
        .migration-helper h4 { font-size: 0.8rem; letter-spacing: 0.2em; color: #a68966; margin: 0; }
        .migration-helper p { font-size: 0.75rem; color: var(--text-soft); opacity: 0.6; line-height: 1.6; margin: 0; }
        .icon-gold { color: #a68966; opacity: 0.6; }
        .migrate-btn { background: #a68966; color: #000; border: none; padding: 0.75rem 1.25rem; border-radius: 4px; font-size: 0.65rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.5rem; transition: all 0.3s; margin-top: 0.5rem; }
        .migrate-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(166,137,102,0.2); }
        .migrate-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        @media (max-width: 1280px) {
          .slides-layout { grid-template-columns: 1fr; }
          .slides-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); }
        }
      `}</style>
    </div>
  );
}

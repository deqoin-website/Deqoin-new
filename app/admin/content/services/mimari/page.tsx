'use client';

import { useState, useEffect } from 'react';
import { 
  Upload, 
  Save, 
  Plus, 
  Trash2, 
  Loader2,
  Image as ImageIcon,
  Layout,
  ExternalLink,
  PlusCircle,
  X
} from 'lucide-react';

export default function MimariEditor() {
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newService, setNewService] = useState({ title: '', sideLabel: '', slug: '', image: '/images/slider/mimari_slide.png' });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const res = await fetch('/api/content?page=mimari');
      const data = await res.json();
      if (data && data.sections) {
        setContent(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, index?: number, isCategory?: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file
      });
      const blob = await res.json();
      
      const newContent = { ...content };
      const section = newContent.sections.find((s: any) => s.id === sectionId);
      
      if (isCategory && index !== undefined) {
        section.items[index].image = blob.url;
      } else if (index !== undefined) {
        section.slides[index] = blob.url;
      } else if (section.slides) {
        section.slides.push(blob.url);
      }
      setContent(newContent);
    } catch (err) {
      alert("Görsel yüklenemedi.");
    }
  };

  const addService = async () => {
    if (!newService.title || !newService.slug) return alert("Başlık ve Slug zorunludur.");
    
    const newContent = { ...content };
    const catSection = newContent.sections.find((s: any) => s.id === 'categories');
    
    catSection.items.push({
      ...newService,
      image: newService.image || '/images/slider/mimari_slide.png'
    });
    
    setContent(newContent);
    setIsAddModalOpen(false);
    setNewService({ title: '', sideLabel: '', slug: '', image: '/images/slider/mimari_slide.png' });
  };

  const removeService = (index: number) => {
    if (!confirm("Bu hizmet alanını silmek istediğinize emin misiniz?")) return;
    const newContent = { ...content };
    const catSection = newContent.sections.find((s: any) => s.id === 'categories');
    catSection.items.splice(index, 1);
    setContent(newContent);
  };

  const saveContent = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      alert("Değişiklikler başarıyla kaydedildi!");
    } catch (err) {
      alert("Kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;
  if (!content) return <div className="loader-wrap">Veri yüklenemedi.</div>;

  const heroSection = content.sections?.find((s: any) => s.id === 'hero');
  const catSection = content.sections?.find((s: any) => s.id === 'categories');

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="header-info">
          <h1>Mimari Stüdyo Yönetimi</h1>
          <p>Tüm hizmet alanlarını ve ana girişi buradan yönetin.</p>
        </div>
        <button className="save-btn" onClick={saveContent} disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>DEĞİŞİKLİKLERİ KAYDET</span>
        </button>
      </div>

      <div className="editor-sections">
        {/* HERO SECTION */}
        <section className="section-card">
          <div className="section-title">
            <Layout size={20} />
            <h2>Ana Giriş (Hero Slider)</h2>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <label>Büyük Başlık</label>
              <input 
                type="text" 
                value={heroSection?.title || ''} 
                onChange={e => {
                  const nc = {...content};
                  nc.sections.find((s:any)=>s.id==='hero').title = e.target.value;
                  setContent(nc);
                }} 
              />
            </div>
            <div className="input-group">
              <label>Alt Slogan</label>
              <input 
                type="text" 
                value={heroSection?.subtitle || ''} 
                onChange={e => {
                  const nc = {...content};
                  nc.sections.find((s:any)=>s.id==='hero').subtitle = e.target.value;
                  setContent(nc);
                }} 
              />
            </div>
          </div>
          <div className="slides-grid">
            {heroSection?.slides?.map((slide: string, idx: number) => (
              <div key={idx} className="slide-item">
                <img src={slide} alt="Slide" />
                <button className="delete-slide" onClick={() => {
                  const nc = {...content};
                  nc.sections.find((s:any)=>s.id==='hero').slides.splice(idx,1);
                  setContent(nc);
                }}><Trash2 size={12} /></button>
              </div>
            ))}
            <label className="add-slide-btn">
              <Plus size={20} />
              <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'hero')} />
            </label>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="section-card">
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <ExternalLink size={20} />
              <h2>Hizmet Alanları (Departmanlar)</h2>
            </div>
            <button className="add-area-btn" onClick={() => setIsAddModalOpen(true)}>
              <PlusCircle size={18} />
              <span>YENİ DEPARTMAN EKLE</span>
            </button>
          </div>

          <div className="category-grid">
            {catSection?.items?.map((item: any, idx: number) => (
              <div key={idx} className="category-item-card">
                <div className="cat-image" onClick={() => document.getElementById(`cat-up-${idx}`)?.click()}>
                  <img src={item.image} alt={item.title} />
                  <div className="cat-overlay"><Upload size={16} /></div>
                  <input id={`cat-up-${idx}`} type="file" className="hidden" onChange={e => handleImageUpload(e, 'categories', idx, true)} />
                </div>
                <div className="cat-info">
                  <input className="cat-title-input" value={item.title} onChange={e => {
                    const nc = {...content};
                    nc.sections.find((s:any)=>s.id==='categories').items[idx].title = e.target.value;
                    setContent(nc);
                  }} />
                  <input className="cat-label-input" value={item.sideLabel} onChange={e => {
                    const nc = {...content};
                    nc.sections.find((s:any)=>s.id==='categories').items[idx].sideLabel = e.target.value;
                    setContent(nc);
                  }} />
                  <div className="cat-actions">
                    <a href={`/admin/content/services/mimari/${item.slug}`} className="detail-edit-link">
                       <ImageIcon size={14} /> <span>DETAYLAR</span>
                    </a>
                    <button className="delete-area-btn" onClick={() => removeService(idx)}><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Yeni Departman Ekle</h3>
              <button onClick={() => setIsAddModalOpen(false)}><X /></button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label>Departman Adı (Örn: Restorasyon)</label>
                <input type="text" value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} />
              </div>
              <div className="input-group">
                <label>Yan Etiket (Örn: Heritage Revival)</label>
                <input type="text" value={newService.sideLabel} onChange={e => setNewService({...newService, sideLabel: e.target.value})} />
              </div>
              <div className="input-group">
                <label>URL Slug (Örn: restorasyon)</label>
                <input type="text" value={newService.slug} onChange={e => setNewService({...newService, slug: e.target.value})} />
              </div>
              <button className="save-btn" style={{ width: '100%', marginTop: '1rem' }} onClick={addService}>EKLE</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .editor-container { display: flex; flex-direction: column; gap: 3rem; padding-bottom: 5rem; }
        .editor-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1px solid var(--line); padding-bottom: 2rem; }
        .header-info h1 { font-family: var(--font-display), sans-serif; font-size: 1.5rem; letter-spacing: 0.1em; color: var(--text); }
        .header-info p { font-size: 0.9rem; color: var(--text-soft); opacity: 0.7; margin-top: 0.5rem; }

        .save-btn { background: #a68966; color: #080808; border: none; padding: 1rem 2.5rem; display: flex; align-items: center; gap: 1rem; font-family: var(--font-display), sans-serif; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.2em; cursor: pointer; transition: 0.3s; }
        .save-btn:hover { background: #c2a785; transform: translateY(-2px); }

        .editor-sections { display: flex; flex-direction: column; gap: 2.5rem; }
        .section-card { background: var(--surface); padding: 2.5rem; border: 1px solid var(--line); }
        .section-title { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .section-title h2 { font-family: var(--font-display), sans-serif; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--text); }

        .add-area-btn { background: rgba(166,137,102,0.1); border: 1px solid #a68966; color: #a68966; padding: 0.6rem 1.2rem; display: flex; align-items: center; gap: 0.8rem; font-size: 0.65rem; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .add-area-btn:hover { background: #a68966; color: #000; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .input-group { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
        .input-group label { font-size: 0.7rem; color: var(--text-muted); opacity: 0.8; letter-spacing: 0.1em; text-transform: uppercase; }
        .input-group input { background: var(--background); border: 1px solid var(--line); padding: 1rem; color: var(--text); font-size: 0.9rem; }

        .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .category-item-card { background: var(--surface-muted); border: 1px solid var(--line); padding: 1.25rem; display: flex; gap: 1.25rem; }
        
        .cat-image { width: 100px; aspect-ratio: 1; position: relative; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); }
        .cat-image img { width: 100%; height: 100%; object-fit: cover; }
        .cat-overlay { position: absolute; inset: 0; background: rgba(166,137,102,0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; color: #000; }
        .cat-image:hover .cat-overlay { opacity: 1; }

        .cat-info { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .cat-title-input { background: transparent; border: none; border-bottom: 1px solid var(--line); color: var(--text); font-size: 1rem; font-weight: 600; padding: 0.3rem 0; width: 100%; }
        .cat-label-input { background: transparent; border: none; color: #a68966; font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; width: 100%; }
        
        .cat-actions { display: flex; gap: 0.5rem; margin-top: auto; }
        .detail-edit-link { flex: 1; display: flex; align-items: center; justify-content: center; gap: 0.5rem; background: var(--surface); border: 1px solid var(--line); color: var(--text); text-decoration: none; padding: 0.5rem; font-size: 0.65rem; font-weight: 700; transition: 0.3s; }
        .detail-edit-link:hover { background: var(--accent); color: #000; border-color: var(--accent); }
        .delete-area-btn { background: rgba(255,68,68,0.1); border: 1px solid rgba(255,68,68,0.3); color: #ff4444; width: 35px; height: 35px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s; }
        .delete-area-btn:hover { background: #ff4444; color: #fff; }

        .slides-grid { display: flex; flex-wrap: wrap; gap: 1rem; }
        .slide-item { width: 150px; aspect-ratio: 16/9; position: relative; border: 1px solid rgba(255,255,255,0.1); }
        .slide-item img { width: 100%; height: 100%; object-fit: cover; }
        .delete-slide { position: absolute; top: -5px; right: -5px; background: #ff4444; color: #fff; border: none; width: 18px; height: 18px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .add-slide-btn { width: 150px; aspect-ratio: 16/9; border: 1px dashed rgba(166,137,102,0.4); display: flex; align-items: center; justify-content: center; color: #a68966; cursor: pointer; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .modal-content { background: var(--surface); width: 100%; max-width: 450px; padding: 2rem; border: 1px solid var(--line); border-radius: 12px; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; border-bottom: 1px solid var(--line); padding-bottom: 1rem; }
        .modal-header h3 { font-family: var(--font-display), sans-serif; font-size: 1.1rem; letter-spacing: 0.1em; color: var(--text); }
        .modal-header button { background: transparent; border: none; color: var(--text); cursor: pointer; opacity: 0.5; }

        .loader-wrap { height: 400px; display: flex; align-items: center; justify-content: center; color: #a68966; }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}

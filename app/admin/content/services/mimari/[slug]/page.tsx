'use client';

import { useState, useEffect, use as useReact } from 'react';
import { 
  Upload, 
  Save, 
  Plus, 
  Trash2, 
  Loader2,
  ChevronLeft,
  ImageIcon,
  LayoutText,
  Workflow,
  Target,
  Filter
} from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailEditor({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = useReact(params);
  const { slug } = resolvedParams;

  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, [slug]);

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content?page=service-${slug}`);
      const data = await res.json();
      
      if (data && data.sections && data.sections.length > 0) {
        // Ensure complex structures exist
        const section = data.sections[0];
        if (!section.process) section.process = [];
        if (!section.focusAreas) section.focusAreas = [];
        if (!section.categories) section.categories = [{ label: 'TÜM PROJELER', value: 'ALL' }];
        setContent(data);
      } else {
        // Fallback or empty state
        setContent({
          page: `service-${slug}`,
          sections: [
            {
              id: 'detail',
              type: 'gallery-detail',
              title: slug.charAt(0).toUpperCase() + slug.slice(1),
              subtitle: 'DETAYLI HİZMET ÇÖZÜMLERİ',
              description: '',
              heroImage: '/images/slider/mimari_slide.png',
              gallery: [],
              process: [],
              focusAreas: [],
              categories: [{ label: 'TÜM PROJELER', value: 'ALL' }]
            }
          ]
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isHero: boolean = false, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file
      });
      const blob = await res.json();
      
      const newContent = { ...content };
      if (isHero) {
        newContent.sections[0].heroImage = blob.url;
      } else if (index !== undefined) {
        newContent.sections[0].gallery[index] = blob.url;
      } else {
        newContent.sections[0].gallery.push(blob.url);
      }
      setContent(newContent);
    } catch (err) {
      alert("Görsel yüklenemedi.");
    }
  };

  const saveContent = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content)
      });
      alert("Hizmet başarıyla güncellendi!");
    } catch (err) {
      alert("Kaydedilemedi.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;
  if (!content) return <div className="loader-wrap">Veri yok.</div>;

  const detail = content.sections[0];

  return (
    <div className="editor-container">
      <div className="editor-header">
        <Link href="/admin/content/services/mimari" className="back-link">
          <ChevronLeft size={20} />
          <span>Mimari Stüdyo'ya Dön</span>
        </Link>
        <div className="header-info">
          <h1>{detail.title} Yönetimi</h1>
          <p>Tüm içeriği, süreçleri ve teknik detayları buradan yönetin.</p>
        </div>
        <button className="save-btn" onClick={saveContent} disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          <span>KAYDET</span>
        </button>
      </div>

      <div className="editor-sections">
        {/* HERO & DESCRIPTION */}
        <section className="section-card">
          <div className="section-title">
            <LayoutText size={20} />
            <h2>Vizyon & Giriş</h2>
          </div>
          <div className="hero-edit-area">
             <div className="hero-preview" onClick={() => document.getElementById('h-up')?.click()}>
                <img src={detail.heroImage} alt="Hero" />
                <div className="hero-overlay"><Upload /></div>
                <input id="h-up" type="file" className="hidden" onChange={e => handleImageUpload(e, true)} />
             </div>
             <div className="hero-form">
               <div className="input-group">
                 <label>Hizmet Başlığı</label>
                 <input value={detail.title} onChange={e => {
                   const nc = {...content};
                   nc.sections[0].title = e.target.value;
                   setContent(nc);
                 }} />
               </div>
               <div className="input-group">
                 <label>Alt Slogan</label>
                 <input value={detail.subtitle} onChange={e => {
                   const nc = {...content};
                   nc.sections[0].subtitle = e.target.value;
                   setContent(nc);
                 }} />
               </div>
               <div className="input-group">
                 <label>Hizmet Açıklaması (Vizyon Metni)</label>
                 <textarea rows={6} value={detail.description} onChange={e => {
                   const nc = {...content};
                   nc.sections[0].description = e.target.value;
                   setContent(nc);
                 }} />
               </div>
             </div>
          </div>
        </section>

        {/* PROCESS STEPS */}
        <section className="section-card">
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <Workflow size={20} />
               <h2>İş Süreci (Process)</h2>
             </div>
             <button className="add-btn" onClick={() => {
               const nc = {...content};
               nc.sections[0].process.push({ title: 'Yeni Adım', desc: 'Açıklama' });
               setContent(nc);
             }}>ADIM EKLE</button>
          </div>
          <div className="items-list">
            {detail.process?.map((p: any, idx: number) => (
              <div key={idx} className="item-row">
                <input placeholder="Adım Başlığı" value={p.title} onChange={e => {
                  const nc = {...content};
                  nc.sections[0].process[idx].title = e.target.value;
                  setContent(nc);
                }} />
                <textarea placeholder="Açıklama" value={p.desc} onChange={e => {
                  const nc = {...content};
                  nc.sections[0].process[idx].desc = e.target.value;
                  setContent(nc);
                }} />
                <button className="del-btn" onClick={() => {
                  const nc = {...content};
                  nc.sections[0].process.splice(idx, 1);
                  setContent(nc);
                }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </section>

        {/* FOCUS AREAS */}
        <section className="section-card">
          <div className="section-title" style={{ justifyContent: 'space-between' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <Target size={20} />
               <h2>Odak Alanları (Focus Areas)</h2>
             </div>
             <button className="add-btn" onClick={() => {
               const nc = {...content};
               nc.sections[0].focusAreas.push({ title: 'Yeni Odak', icon: 'diamond', desc: 'Açıklama' });
               setContent(nc);
             }}>ODAK EKLE</button>
          </div>
          <div className="items-list">
            {detail.focusAreas?.map((f: any, idx: number) => (
              <div key={idx} className="item-row">
                <input placeholder="İkon Adı (Material Icon)" value={f.icon} onChange={e => {
                  const nc = {...content};
                  nc.sections[0].focusAreas[idx].icon = e.target.value;
                  setContent(nc);
                }} />
                <input placeholder="Başlık" value={f.title} onChange={e => {
                  const nc = {...content};
                  nc.sections[0].focusAreas[idx].title = e.target.value;
                  setContent(nc);
                }} />
                <textarea placeholder="Açıklama" value={f.desc} onChange={e => {
                  const nc = {...content};
                  nc.sections[0].focusAreas[idx].desc = e.target.value;
                  setContent(nc);
                }} />
                <button className="del-btn" onClick={() => {
                  const nc = {...content};
                  nc.sections[0].focusAreas.splice(idx, 1);
                  setContent(nc);
                }}><Trash2 size={14} /></button>
              </div>
            ))}
          </div>
        </section>

        {/* GALLERRY & CATEGORIES */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <section className="section-card">
               <div className="section-title"><Filter size={20} /><h2>Kategoriler (Filtreler)</h2></div>
               <div className="items-list">
                  {detail.categories?.map((c: any, idx: number) => (
                    <div key={idx} className="item-row" style={{ flexDirection: 'row', gap: '1rem' }}>
                      <input placeholder="Etiket" value={c.label} onChange={e => {
                        const nc = {...content};
                        nc.sections[0].categories[idx].label = e.target.value;
                        setContent(nc);
                      }} />
                      <input placeholder="Değer" value={c.value} onChange={e => {
                        const nc = {...content};
                        nc.sections[0].categories[idx].value = e.target.value;
                        setContent(nc);
                      }} />
                      <button className="del-btn" onClick={() => {
                        const nc = {...content};
                        nc.sections[0].categories.splice(idx, 1);
                        setContent(nc);
                      }}><Trash2 size={14} /></button>
                    </div>
                  ))}
                  <button className="add-btn-small" onClick={() => {
                    const nc = {...content};
                    nc.sections[0].categories.push({ label: 'Yeni Kategori', value: 'yeni-kat' });
                    setContent(nc);
                  }}>+ KATEGORİ EKLE</button>
               </div>
            </section>

            <section className="section-card">
              <div className="section-title"><ImageIcon size={20} /><h2>Galeri Fotoğrafları</h2></div>
              <div className="gallery-grid">
                {detail.gallery?.map((img: string, idx: number) => (
                  <div key={idx} className="gal-item">
                    <img src={img} alt="Gal" />
                    <button className="del-btn-abs" onClick={() => {
                      const nc = {...content};
                      nc.sections[0].gallery.splice(idx, 1);
                      setContent(nc);
                    }}><Trash2 size={12} /></button>
                  </div>
                ))}
                <label className="add-gal-box">
                  <Plus />
                  <input type="file" className="hidden" onChange={e => handleImageUpload(e, false)} />
                </label>
              </div>
            </section>
        </div>
      </div>

      <style jsx>{`
        .editor-container { display: flex; flex-direction: column; gap: 2rem; padding-bottom: 5rem; }
        .editor-header { background: #141414; padding: 2.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
        .back-link { display: flex; align-items: center; gap: 0.5rem; color: #a68966; text-decoration: none; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; }
        .header-info h1 { font-family: var(--font-display), sans-serif; font-size: 1.8rem; letter-spacing: 0.05em; color: #fff; margin-top: 0.5rem; }
        .header-info p { font-size: 0.8rem; opacity: 0.5; margin-top: 0.3rem; }

        .save-btn { background: #a68966; color: #000; border: none; padding: 1rem 2.5rem; display: flex; align-items: center; gap: 1rem; font-weight: 800; cursor: pointer; transition: 0.3s; font-family: var(--font-display), sans-serif; font-size: 0.75rem; letter-spacing: 0.1em; }
        .save-btn:hover { background: #c2a785; transform: scale(1.02); }

        .editor-sections { display: flex; flex-direction: column; gap: 2rem; padding: 0 2.5rem; }
        .section-card { background: #141414; border: 1px solid rgba(255,255,255,0.03); padding: 2rem; }
        .section-title { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; color: #a68966; }
        .section-title h2 { font-family: var(--font-display), sans-serif; font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; color: #fff; }

        .hero-edit-area { display: flex; gap: 2.5rem; }
        .hero-preview { width: 350px; aspect-ratio: 16/9; position: relative; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; }
        .hero-preview img { width: 100%; height: 100%; object-fit: cover; }
        .hero-overlay { position: absolute; inset: 0; background: rgba(166,137,102,0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; color: #000; }
        .hero-preview:hover .hero-overlay { opacity: 1; }

        .hero-form { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
        .input-group { display: flex; flex-direction: column; gap: 0.6rem; }
        .input-group label { font-size: 0.65rem; color: #a68966; letter-spacing: 0.1em; text-transform: uppercase; }
        .input-group input, .input-group textarea { background: #0c0c0c; border: 1px solid rgba(255,255,255,0.1); padding: 1rem; color: #fff; font-size: 0.9rem; width: 100%; }
        
        .items-list { display: flex; flex-direction: column; gap: 1rem; }
        .item-row { background: #0c0c0c; border: 1px solid rgba(255,255,255,0.05); padding: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; position: relative; }
        .item-row input { background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.1); color: #fff; font-weight: 600; padding: 0.5rem 0; width: 100%; }
        .item-row textarea { background: transparent; border: none; color: rgba(255,255,255,0.5); font-size: 0.85rem; line-height: 1.6; width: 100%; min-height: 60px; }
        
        .add-btn { background: rgba(166,137,102,0.15); border: 1px solid #a68966; color: #a68966; padding: 0.5rem 1rem; font-size: 0.65rem; font-weight: 800; cursor: pointer; }
        .add-btn:hover { background: #a68966; color: #000; }
        .add-btn-small { background: transparent; border: 1px dashed rgba(255,255,255,0.2); color: #fff; opacity: 0.5; padding: 0.75rem; font-size: 0.6rem; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .add-btn-small:hover { opacity: 1; border-color: #fff; }

        .del-btn { position: absolute; top: 1rem; right: 1rem; background: rgba(255,0,0,0.1); border: none; color: #ff4444; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        .gal-item { position: relative; aspect-ratio: 1; }
        .gal-item img { width: 100%; height: 100%; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); }
        .del-btn-abs { position: absolute; top: -5px; right: -5px; background: #ff4444; color: #fff; border: none; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }
        
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 1rem; }
        .add-gal-box { aspect-ratio: 1; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; color: #a68966; cursor: pointer; }

        .loader-wrap { height: 500px; display: flex; align-items: center; justify-content: center; color: #a68966; }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}

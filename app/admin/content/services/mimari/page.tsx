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
import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { AdminSaveBar } from '@/components/admin/AdminSaveBar';

const DEFAULT_MIMARI_CATEGORIES = [
  {
    href: "/mimari/insaat-muhendisligi",
    title: "Mühendislik",
    sideLabel: "Structural Strength",
    image: "/images/projects/gallery_1.png",
    slug: "insaat-muhendisligi",
  },
  {
    href: "/mimari/mimarlik",
    title: "Mimarlık",
    sideLabel: "Structural Form",
    image: "/images/slider/mimari_slide.png",
    slug: "mimarlik",
  },
  {
    href: "/mimari/elektrik-elektronik-muhendisligi",
    title: "Mekanik",
    sideLabel: "Power & Logic",
    image: "/images/projects/gallery_2.png",
    slug: "elektrik-elektronik-muhendisligi",
  },
  {
    href: "/mimari/ic-mimarlik",
    title: "İç Mimarlık",
    sideLabel: "Interior Essence",
    image: "/images/about_interior.png",
    slug: "ic-mimarlik",
  },
  {
    href: "/mimari/restorasyon",
    title: "Restorasyon",
    sideLabel: "Heritage Revival",
    image: "/images/projects/gallery_1.png",
    slug: "restorasyon",
  },
  {
    href: "/mimari/peyzaj-mimarligi",
    title: "Peyzaj",
    sideLabel: "Natural Canvas",
    image: "/images/projects/gallery_2.png",
    slug: "peyzaj-mimarligi",
  },
];

function withVersion(url?: string, version?: string) {
  if (!url) return "";
  if (!version) return url;
  return `${url}${url.includes("?") ? "&" : "?"}v=${encodeURIComponent(version)}`;
}

export default function MimariEditor() {
  const { showToast, confirm: premiumConfirm } = useNotification();
  const [content, setContent] = useState<any>(null);
  const [initialContent, setInitialContent] = useState<any>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newService, setNewService] = useState({ title: '', sideLabel: '', slug: '', image: '/images/slider/mimari_slide.png' });
  const [categoryPreviews, setCategoryPreviews] = useState<Record<number, string>>({});
  const [contentVersion, setContentVersion] = useState<string>("");

  useEffect(() => {
    fetchContent();
  }, []);

  const cloneContent = (value: any) => JSON.parse(JSON.stringify(value));

  const persistContent = async (nextContent: any) => {
    const payload = {
      page: nextContent?.page || 'mimari',
      sections: nextContent?.sections || [],
    };
    const res = await fetch('/api/content', {
      method: 'POST',
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      throw new Error('Content save failed');
    }

    const refreshed = await res.json();
    if (refreshed?.metadata?.updatedAt) {
      setContentVersion(String(refreshed.metadata.updatedAt));
    }
    setContent(refreshed);
    setInitialContent(cloneContent(refreshed));
    setIsDirty(false);
    return refreshed;
  };

  const createDefaultContent = () => ({
    page: 'mimari',
    sections: [
      {
        id: 'hero',
        type: 'hero',
        title: 'DESIGN STUDIO',
        subtitle: 'MİMARİ TASARIM',
        blur: 0,
        overlay: 30,
        slides: ['/images/slider/mimari_slide.png'],
      },
      {
        id: 'cta',
        type: 'cta',
        image: '/images/slider/mimari_slide.png',
        blur: 0,
        overlay: 30,
      },
      {
        id: 'categories',
        type: 'categories',
        items: DEFAULT_MIMARI_CATEGORIES,
      },
    ],
  });

  const fetchContent = async () => {
    try {
      const res = await fetch(`/api/content?page=mimari&ts=${Date.now()}`, { cache: 'no-store' });
      const data = await res.json();
      if (data?.metadata?.updatedAt) {
        setContentVersion(String(data.metadata.updatedAt));
      }
      const safeData = data && Array.isArray(data.sections) && data.sections.length > 0
        ? data
        : createDefaultContent();
      const heroSection = safeData.sections.find((s: any) => s.id === 'hero');
      if (heroSection) {
        if (heroSection.blur === undefined) heroSection.blur = 0;
        if (heroSection.overlay === undefined) heroSection.overlay = 30;
        if (!heroSection.slides) heroSection.slides = [];
      }
      const hasCtaSection = safeData.sections.some((s: any) => s.id === 'cta');
      if (!hasCtaSection) {
        safeData.sections.push({
          id: 'cta',
          type: 'cta',
          image: '/images/slider/mimari_slide.png',
          blur: 0,
          overlay: 30,
        });
      }
      const categorySection = safeData.sections.find((s: any) => s.id === 'categories');
      if (categorySection) {
        if (!Array.isArray(categorySection.items) || categorySection.items.length === 0) {
          categorySection.items = DEFAULT_MIMARI_CATEGORIES;
        }
      }
      setCategoryPreviews({});
      setContent(safeData);
      setInitialContent(cloneContent(safeData));
    } catch (err) {
      console.error(err);
      showToast("İçerik yüklenemedi.", "error");
      const fallback = createDefaultContent();
      setContentVersion(String(Date.now()));
      setContent(fallback);
      setInitialContent(cloneContent(fallback));
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionId: string, index?: number, isCategory?: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('filename', file.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      if (!res.ok) throw new Error('Upload failed');
      const blob = await res.json();
      const uploadedUrl = blob?.url || blob?.downloadUrl;
      if (!uploadedUrl) throw new Error('Upload URL missing');

      const newContent = cloneContent(content || createDefaultContent());
      const section = newContent.sections.find((s: any) => s.id === sectionId);
      
      if (isCategory && index !== undefined) {
        if (!section.items[index]) section.items[index] = {};
        section.items[index].image = uploadedUrl;
        setCategoryPreviews(prev => ({ ...prev, [index]: uploadedUrl }));
      } else if (index !== undefined) {
        section.slides[index] = uploadedUrl;
      } else if (section.image !== undefined) {
        section.image = uploadedUrl;
      } else if (section.slides) {
        section.slides.push(uploadedUrl);
      }
      setContent(newContent);
      const saved = await persistContent(newContent);
      if (saved) {
        setContent(saved);
        setInitialContent(cloneContent(saved));
      }
      showToast("Görsel yüklendi ve kaydedildi.", "success");
    } catch (err) {
      showToast("Görsel yüklenemedi.", "error");
    } finally {
      e.target.value = "";
    }
  };

  const openCategoryImagePicker = (index: number) => {
    document.getElementById(`cat-up-${index}`)?.click();
  };

  const addService = async () => {
    if (!newService.title || !newService.slug) return showToast("Başlık ve Slug zorunludur.", "error");
    
    const newContent = cloneContent(content || createDefaultContent());
    const catSection = newContent.sections.find((s: any) => s.id === 'categories');
    
    catSection.items.push({
      ...newService,
      image: newService.image || '/images/slider/mimari_slide.png'
    });
    
    setContent(newContent);
    setIsDirty(true);
    setIsAddModalOpen(false);
    setNewService({ title: '', sideLabel: '', slug: '', image: '/images/slider/mimari_slide.png' });
  };

  const removeService = async (index: number) => {
    const ok = await premiumConfirm({
      title: 'HİZMET SİLME',
      message: 'Bu hizmet alanını silmek istediğinize emin misiniz?',
      confirmText: 'SİL',
      isDanger: true
    });
    if (!ok) return;
    const newContent = cloneContent(content || createDefaultContent());
    const catSection = newContent.sections.find((s: any) => s.id === 'categories');
    catSection.items.splice(index, 1);
    setContent(newContent);
    setIsDirty(true);
  };

  const saveContent = async () => {
    setIsSaving(true);
    try {
      const saved = await persistContent(content);
      if (saved) {
        setContent(saved);
        setInitialContent(cloneContent(saved));
      }
      showToast("Değişiklikler başarıyla kaydedildi!", "success");
    } catch (err) {
      showToast("Bağlantı hatası.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setContent(JSON.parse(JSON.stringify(initialContent)));
    setCategoryPreviews({});
    setIsDirty(false);
    showToast("Değişiklikler geri alındı.", "info");
  };

  const updateCategoryImageValue = (index: number, value: string) => {
    const nextContent = cloneContent(content || createDefaultContent());
    const categorySection = nextContent.sections.find((s: any) => s.id === 'categories');
    if (!categorySection?.items?.[index]) return;
    categorySection.items[index].image = value;
    setCategoryPreviews(prev => ({ ...prev, [index]: value }));
    setContent(nextContent);
    setIsDirty(true);
  };

  const persistCategoryImageValue = async (index: number, value: string) => {
    const nextContent = cloneContent(content || createDefaultContent());
    const categorySection = nextContent.sections.find((s: any) => s.id === 'categories');
    if (!categorySection?.items?.[index]) return;
    categorySection.items[index].image = value;
    setCategoryPreviews(prev => ({ ...prev, [index]: value }));
    setContent(nextContent);
    const saved = await persistContent(nextContent);
    if (saved) {
      setContent(saved);
      setInitialContent(cloneContent(saved));
    }
    showToast("Kart görseli güncellendi.", "success");
  };

  if (isLoading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;
  if (!content) return <div className="loader-wrap">Veri yüklenemedi.</div>;

  const heroSection = content.sections?.find((s: any) => s.id === 'hero');
  const catSection = content.sections?.find((s: any) => s.id === 'categories');
  const ctaSection = content.sections?.find((s: any) => s.id === 'cta');
  const categoryItems = Array.isArray(catSection?.items) && catSection.items.length > 0 ? catSection.items : DEFAULT_MIMARI_CATEGORIES;

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="header-info">
          <h1>Mimari Stüdyo Yönetimi</h1>
          <p>Tüm hizmet alanlarını ve ana girişi buradan yönetin.</p>
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
          <button className={`save-btn ${isDirty ? 'dirty-pulse' : ''}`} onClick={saveContent} disabled={isSaving}>
            {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            <span>{isDirty ? 'KAYDETMEYİ UNUTMAYIN' : 'DEĞİŞİKLİKLERİ KAYDET'}</span>
          </button>
        </div>
      </div>

      <AdminSaveBar 
        isVisible={isDirty} 
        onSave={saveContent} 
        onCancel={handleCancel}
        isSaving={isSaving}
      />

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
                  setIsDirty(true);
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
                  setIsDirty(true);
                }} 
              />
            </div>
            <div className="input-group">
              <label>Hero Blur Oranı</label>
              <div className="range-row">
                <div className="range-meta">
                  <span>Blur</span>
                  <strong>{heroSection?.blur ?? 0}px</strong>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="40"
                  value={heroSection?.blur ?? 0}
                  onChange={e => {
                    const nc = {...content};
                    nc.sections.find((s:any)=>s.id==='hero').blur = Number(e.target.value);
                    setContent(nc);
                    setIsDirty(true);
                  }} 
                />
              </div>
            </div>
            <div className="input-group">
              <label>Hero Koyu Katman (%)</label>
              <div className="range-row">
                <div className="range-meta">
                  <span>Katman</span>
                  <strong>%{heroSection?.overlay ?? 30}</strong>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="90"
                  value={heroSection?.overlay ?? 30}
                  onChange={e => {
                    const nc = {...content};
                    nc.sections.find((s:any)=>s.id==='hero').overlay = Number(e.target.value);
                    setContent(nc);
                    setIsDirty(true);
                  }} 
                />
              </div>
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
                  setIsDirty(true);
                }}><Trash2 size={12} /></button>
              </div>
            ))}
            <label className="add-slide-btn">
              <Plus size={20} />
              <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'hero')} />
            </label>
          </div>
        </section>

        <section className="section-card">
          <div className="section-title">
            <ImageIcon size={20} />
            <h2>CTA Alanı (Bir Sonraki Adım)</h2>
          </div>
          <div className="form-grid">
            <div className="input-group">
              <label>CTA Blur Oranı</label>
              <div className="range-row">
                <div className="range-meta">
                  <span>Blur</span>
                  <strong>{ctaSection?.blur ?? 0}px</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={ctaSection?.blur ?? 0}
                  onChange={e => {
                    const nc = { ...content };
                    nc.sections.find((s:any) => s.id === 'cta').blur = Number(e.target.value);
                    setContent(nc);
                    setIsDirty(true);
                  }}
                />
              </div>
            </div>
            <div className="input-group">
              <label>CTA Koyu Katman (%)</label>
              <div className="range-row">
                <div className="range-meta">
                  <span>Katman</span>
                  <strong>%{ctaSection?.overlay ?? 30}</strong>
                </div>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={ctaSection?.overlay ?? 30}
                  onChange={e => {
                    const nc = { ...content };
                    nc.sections.find((s:any) => s.id === 'cta').overlay = Number(e.target.value);
                    setContent(nc);
                    setIsDirty(true);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="slides-grid">
            {ctaSection?.image && (
              <div className="slide-item">
                <img src={ctaSection.image} alt="CTA görseli" />
                <button className="delete-slide" onClick={() => {
                  const nc = { ...content };
                  nc.sections.find((s:any) => s.id === 'cta').image = '';
                  setContent(nc);
                  setIsDirty(true);
                }}><Trash2 size={12} /></button>
              </div>
            )}
            <label className="add-slide-btn">
              <Upload size={20} />
              <input type="file" className="hidden" onChange={e => handleImageUpload(e, 'cta')} />
            </label>
          </div>
        </section>

        {/* CATEGORIES SECTION */}
        <section className="section-card">
          <div className="section-title section-title-split">
            <div className="section-title-copy">
              <span className="section-eyebrow">MİMARİ STÜDYO</span>
              <div className="section-title-row">
                <ExternalLink size={20} />
                <h2>Hizmet Alanları (Departmanlar)</h2>
              </div>
            </div>
            <button className="add-area-btn" onClick={() => setIsAddModalOpen(true)}>
              <PlusCircle size={18} />
              <span>YENİ DEPARTMAN EKLE</span>
            </button>
          </div>

          <div className="category-grid">
            {categoryItems.map((item: any, idx: number) => (
              <div key={idx} className="category-item-card">
              <div className="cat-image-column">
                <div className="cat-image" onClick={() => openCategoryImagePicker(idx)}>
                    {categoryPreviews[idx] || item.image ? (
                      <img src={withVersion(categoryPreviews[idx] || item.image, contentVersion)} alt={item.title} />
                    ) : (
                      <div className="cat-image-empty">Gorsel Yok</div>
                    )}
                    <div className="cat-overlay"><Upload size={16} /></div>
                    <input id={`cat-up-${idx}`} type="file" className="hidden" accept="image/*" onChange={e => handleImageUpload(e, 'categories', idx, true)} />
                  </div>
                  <button type="button" className="cat-image-btn" onClick={() => openCategoryImagePicker(idx)}>
                    <Upload size={14} />
                    GÖRSELİ DEĞİŞTİR
                  </button>
                  <div className="cat-image-filename">
                    {item.image ? "Önizleme aktif" : "Görsel bekleniyor"}
                  </div>
                  <input
                    type="text"
                    className="cat-image-url"
                    value={categoryPreviews[idx] || item.image || ''}
                    placeholder="Görsel URL"
                    onChange={e => updateCategoryImageValue(idx, e.target.value)}
                    onBlur={async e => {
                      const value = e.target.value.trim();
                      if (!value || value === (initialContent?.sections?.find((s: any) => s.id === 'categories')?.items?.[idx]?.image || '')) {
                        return;
                      }
                      try {
                        await persistCategoryImageValue(idx, value);
                      } catch {
                        showToast("Kart görseli kaydedilemedi.", "error");
                      }
                    }}
                    onKeyDown={async e => {
                      if (e.key !== 'Enter') return;
                      e.preventDefault();
                      const value = (e.currentTarget.value || '').trim();
                      if (!value) return;
                      try {
                        await persistCategoryImageValue(idx, value);
                      } catch {
                        showToast("Kart görseli kaydedilemedi.", "error");
                      }
                    }}
                  />
                </div>
                <div className="cat-info">
                  <input className="cat-title-input" value={item.title} onChange={e => {
                    const nc = {...content};
                    nc.sections.find((s:any)=>s.id==='categories').items[idx].title = e.target.value;
                    setContent(nc);
                    setIsDirty(true);
                  }} />
                  <input className="cat-label-input" value={item.sideLabel} onChange={e => {
                    const nc = {...content};
                    nc.sections.find((s:any)=>s.id==='categories').items[idx].sideLabel = e.target.value;
                    setContent(nc);
                    setIsDirty(true);
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
              <div className="input-group">
                <label>Görsel URL</label>
                <input type="text" value={newService.image} onChange={e => setNewService({...newService, image: e.target.value})} />
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

        .save-btn.dirty-pulse { background: #a68966; box-shadow: 0 0 20px rgba(166,137,102,0.4); animation: pulse-border 2s infinite; }
        @keyframes pulse-border { 0% { box-shadow: 0 0 0 0 rgba(166,137,102,0.4); } 70% { box-shadow: 0 0 0 10px rgba(166,137,102,0); } 100% { box-shadow: 0 0 0 0 rgba(166,137,102,0); } }

        .save-btn { background: #a68966; color: #080808; border: none; padding: 1rem 2.5rem; display: flex; align-items: center; gap: 1rem; font-family: var(--font-display), sans-serif; font-weight: 700; font-size: 0.75rem; letter-spacing: 0.2em; cursor: pointer; transition: 0.3s; }
        .save-btn:hover { background: #c2a785; transform: translateY(-2px); }

        .editor-sections { display: flex; flex-direction: column; gap: 2.5rem; }
        .section-card { background: var(--surface); padding: 2.5rem; border: 1px solid var(--line); }
        .section-title { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .section-title-split { justify-content: space-between; align-items: flex-end; gap: 2rem; }
        .section-title-copy { display: flex; flex-direction: column; gap: 0.6rem; min-width: 0; }
        .section-eyebrow { font-size: 0.62rem; letter-spacing: 0.24em; text-transform: uppercase; color: #a68966; font-weight: 800; }
        .section-title-row { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
        .section-title h2 { font-family: var(--font-display), sans-serif; font-size: 1.05rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text); margin: 0; }

        .add-area-btn { background: rgba(166,137,102,0.1); border: 1px solid #a68966; color: #a68966; padding: 0.6rem 1.2rem; display: flex; align-items: center; gap: 0.8rem; font-size: 0.65rem; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .add-area-btn:hover { background: #a68966; color: #000; }

        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
        .input-group { display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1rem; }
        .input-group label { font-size: 0.7rem; color: var(--text-muted); opacity: 0.8; letter-spacing: 0.1em; text-transform: uppercase; }
        .input-group input { background: var(--background); border: 1px solid var(--line); padding: 1rem; color: var(--text); font-size: 0.9rem; }
        .range-row { display: flex; flex-direction: column; gap: 0.75rem; padding: 1rem; border: 1px solid var(--line); background: var(--background); }
        .range-meta { display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; color: var(--text-muted); letter-spacing: 0.12em; text-transform: uppercase; }
        .range-meta strong { color: var(--text); font-size: 0.9rem; letter-spacing: 0.04em; }
        .range-row input[type="range"] { width: 100%; accent-color: #a68966; cursor: pointer; padding: 0; border: none; background: transparent; }

        .category-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .category-item-card { background: var(--surface-muted); border: 1px solid var(--line); padding: 1.25rem; display: flex; gap: 1.25rem; align-items: flex-start; }
        .cat-image-column { width: 180px; display: flex; flex-direction: column; gap: 0.6rem; flex-shrink: 0; }
        .cat-image { width: 100%; aspect-ratio: 1; position: relative; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); overflow: hidden; background: #111; }
        .cat-image img { width: 100%; height: 100%; object-fit: cover; }
        .cat-image-empty { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.45); font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; }
        .cat-overlay { position: absolute; inset: 0; background: rgba(166,137,102,0.8); display: flex; align-items: center; justify-content: center; opacity: 0; transition: 0.3s; color: #000; }
        .cat-image:hover .cat-overlay { opacity: 1; }
        .cat-image-btn { width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem; background: rgba(166,137,102,0.1); border: 1px solid rgba(166,137,102,0.35); color: #a68966; padding: 0.65rem 0.8rem; font-size: 0.62rem; font-weight: 800; letter-spacing: 0.14em; cursor: pointer; transition: 0.25s ease; }
        .cat-image-btn:hover { background: rgba(166,137,102,0.18); transform: translateY(-1px); }
        .cat-image-filename { font-size: 0.64rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-muted); opacity: 0.75; }
        .cat-image-url { width: 100%; background: var(--background); border: 1px solid var(--line); color: var(--text); padding: 0.7rem 0.8rem; font-size: 0.8rem; }

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
        @media (max-width: 860px) {
          .section-title-split { flex-direction: column; align-items: flex-start; }
          .add-area-btn { width: 100%; justify-content: center; }
          .cat-image-column { width: 100%; }
        }
      `}</style>
    </div>
  );
}

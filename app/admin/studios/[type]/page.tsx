'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Plus, Trash2, GripVertical, Image as ImageIcon, Upload, Loader2, X, Settings } from 'lucide-react';

export default function DepartmentManagerPage() {
  const params = useParams();
  const rawType = params?.type; 
  const slug = Array.isArray(rawType) ? rawType[0] : rawType || 'mimarlik';

  const [activeTab, setActiveTab] = useState<'genel' | 'surec' | 'odak' | 'kategoriler' | 'projeler'>('genel');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    label: '',
    categories: [] as string[],
    publishTargets: {
      designStudio: true,
      materialStudio: false,
      executionStudio: false
    },
    coverImage: '',
    description: '',
    client: '',
    year: '',
    area: '',
    vision: '',
    techDetails: '',
    story: '',
    seoMeta: { title: '', description: '', keywords: '' },
    gallery: [] as { url: string; imageAlt: string; caption: string }[]
  });

  const CATEGORIES = ["Lüks Konut", "Ticari Yapı", "Karma Kullanım", "Kurumsal Alan", "Butik Otel", "Kültür Yapısı"];

  useEffect(() => {
    fetchDepartmentData();
    if (activeTab === 'projeler') {
      fetchStudioProjects();
    }
  }, [slug, activeTab]);

  const getTargetFromSlug = (s: string) => {
    const designSlugs = ['mimarlik', 'ic-mimarlik', 'restorasyon', 'peyzaj-mimarligi', 'insaat-muhendisligi', 'elektrik-elektronik-muhendisligi'];
    const materialSlugs = ['mobilya', 'aydinlatma', 'italyan-sivalar', 'sanatsal-calismalar', 'tugla-ve-tas'];
    const executionSlugs = ['insaat-ekipleri', 'siva-ve-alci-ekipleri', 'boya-ekipleri', 'duvar-sanatcilari', 'ressamlar', 'heykeltiraslar'];
    
    if (designSlugs.includes(s)) return 'designStudio';
    if (materialSlugs.includes(s)) return 'materialStudio';
    if (executionSlugs.includes(s)) return 'executionStudio';
    return 'designStudio';
  };

  const fetchStudioProjects = async () => {
    setIsProjectsLoading(true);
    try {
      const target = getTargetFromSlug(slug);
      const res = await fetch(`/api/projects?target=${target}`);
      const json = await res.json();
      setProjects(json);
    } catch (e) {
      console.error(e);
    } finally {
      setIsProjectsLoading(false);
    }
  };

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
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => {
      const currentCats = (prev as any).categories || [];
      const newCats = currentCats.includes(cat) ? currentCats.filter((c: string) => c !== cat) : [...currentCats, cat];
      return { ...prev, categories: newCats };
    });
  };

  const togglePublishTarget = (target: string) => {
    setFormData(prev => {
      const targets = (prev as any).publishTargets || { designStudio: false, materialStudio: false, executionStudio: false };
      return { ...prev, publishTargets: { ...targets, [target]: !targets[target] } };
    });
  };

  const updateGalleryItem = (index: number, key: string, value: string) => {
    setFormData(prev => {
      const newGallery = [...prev.gallery];
      newGallery[index] = { ...newGallery[index], [key]: value };
      return { ...prev, gallery: newGallery };
    });
  };

  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects';
    const method = editingProject ? 'PATCH' : 'POST';
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setIsModalOpen(false);
        fetchStudioProjects();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'cover' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      const blob = await res.json();
      
      if (field === 'image') {
        const isVideo = file.type.startsWith('video/');
        setData(prev => ({ ...prev, image: blob.url, mediaType: isVideo ? 'video' : 'image' }));
      } else if (field === 'cover') {
        setFormData(prev => ({ ...prev, coverImage: blob.url }));
      } else if (field === 'gallery') {
        setFormData(prev => ({ ...prev, gallery: [...prev.gallery, { url: blob.url, imageAlt: '', caption: '' }] }));
      }
    } catch (err) {
      alert("Yükleme başarısız.");
    }
  };

  const openEditModal = (project: any = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title || '',
        label: project.label || '',
        categories: project.categories || [],
        publishTargets: project.publishTargets || { designStudio: true, materialStudio: false, executionStudio: false },
        coverImage: project.coverImage || '',
        description: project.description || '',
        client: project.client || '',
        year: project.year || '',
        area: project.area || '',
        vision: project.vision || '',
        techDetails: project.techDetails || '',
        story: project.story || '',
        seoMeta: project.seoMeta || { title: '', description: '', keywords: '' },
        gallery: project.gallery?.map((g: any) => typeof g === 'string' ? { url: g, imageAlt: '', caption: '' } : g) || []
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: '', label: '', categories: [],
        publishTargets: {
          designStudio: getTargetFromSlug(slug) === 'designStudio',
          materialStudio: getTargetFromSlug(slug) === 'materialStudio',
          executionStudio: getTargetFromSlug(slug) === 'executionStudio'
        },
        coverImage: '', description: '', client: '', year: '', area: '', vision: '', techDetails: '', story: '',
        seoMeta: { title: '', description: '', keywords: '' },
        gallery: []
      });
    }
    setIsModalOpen(true);
  };

  const handleProjectDelete = async (id: string) => {
    if (!confirm("Bu projeyi silmek istediğinize emin misiniz?")) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    fetchStudioProjects();
  };

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
      <div className="dept-header">
        <div>
          <h2>"{slug.toUpperCase()}" DİNAMİK YÖNETİM PANELİ</h2>
          <p>Seçili departmanın web sitesindeki görünen tüm verilerini yönetin.</p>
        </div>
        <button className="save-btn-main" onClick={handleSave} disabled={isSaving}>
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          {isSaving ? 'KAYDEDİLİYOR...' : 'TÜMÜNÜ KAYDET'}
        </button>
      </div>

      <div className="tabs-nav">
        {[
          { id: 'genel', label: 'GENEL BİLGİLER & MEDYA' },
          { id: 'surec', label: 'İŞ AKIŞI (PROCESS)' },
          { id: 'odak', label: 'ODAK ALANLARI (CARDS)' },
          { id: 'kategoriler', label: 'PROJE KATEGORİSİ' },
          { id: 'projeler', label: 'PROJELER (PORTFOLIO)' }
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
          {/* PROJELER TAB */}
          {activeTab === 'projeler' && (
            <motion.div key="projeler" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="tab-panel">
               <div className="panel-header">
                <div>
                  <h3>Studio Portfolyosu</h3>
                  <p className="hint">Bu sayfaya bağlı stüdyo grubu projelerini buradan yönetin veya yenisini ekleyin.</p>
                </div>
                <button className="add-project-bt-v2" onClick={() => openEditModal(null)}>
                  <Plus size={16} /> YENİ PROJE EKLE
                </button>
              </div>

              {isProjectsLoading ? (
                <div className="loader-wrap-sm"><Loader2 className="animate-spin" /></div>
              ) : (
                <div className="studio-projects-grid">
                  {projects.map((project: any) => (
                    <motion.div layout key={project._id} className="engine-card">
                      <div className="card-clickable-area" onClick={() => openEditModal(project)}>
                        <div className="card-thumb">
                          {project.coverImage && <img src={project.coverImage} alt={project.title} />}
                          <div className="thumb-overlay">
                            <ImageIcon size={24} />
                            <span>DÜZENLE</span>
                          </div>
                        </div>
                        <div className="card-info">
                          <h4>{project.title}</h4>
                          <span className="sc-badge">{project.label}</span>
                        </div>
                      </div>
                      <div className="card-actions-v2">
                         <button onClick={() => openEditModal(project)} className="v2-btn edit">DÜZENLE</button>
                         <button onClick={(e) => { e.stopPropagation(); handleProjectDelete(project._id); }} className="v2-btn delete">SİL</button>
                      </div>
                    </motion.div>
                  ))}
                  {projects.length === 0 && <p className="empty">Bu stüdyo grubu için henüz proje eklenmemiş.</p>}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* EDIT MODAL INTEGRATION */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="hybrid-modal-overlay">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`hybrid-modal-content ${showAdvancedPanel ? 'advanced-open' : ''}`}
            >
              <div className="modal-inner-scroll">
                <div className="premium-modal-header">
                  <div className="header-badge">STÜDYO EDİTÖRÜ</div>
                  <div className="header-main">
                    <h3>{editingProject ? editingProject.title : 'YENİ STÜDYO PROJESİ'}</h3>
                    <div className="header-actions">
                      <button className="premium-toggle-btn" onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}>
                        <Settings size={16} /> 
                        <span>{showAdvancedPanel ? 'TEMEL AYARLARA DÖN' : 'GELİŞMİŞ & SEO AYARLARI'}</span>
                      </button>
                      <button onClick={() => setIsModalOpen(false)} className="premium-close-btn"><X size={20} /></button>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleProjectSubmit} className="premium-modal-form">
                  <div className="main-form-content" style={{ display: showAdvancedPanel ? 'none' : 'flex' }}>
                    
                    <div className="form-section-card">
                      <div className="section-header"><h4>PROJE TEMEL VERİLERİ</h4></div>
                      <div className="form-cols-3">
                         <div className="lux-group">
                           <label>PROJE ADI</label>
                           <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Proje Başlığı..." />
                         </div>
                         <div className="lux-group">
                           <label>MÜŞTERİ / KONUM</label>
                           <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="Örn: Özel Konut / İzmir" />
                         </div>
                         <div className="lux-group">
                           <label>ETİKET</label>
                           <input type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} required placeholder="Örn: MİMARİ" />
                         </div>
                      </div>

                      <div className="form-cols-2">
                         <div className="lux-group">
                           <label>YIL</label>
                           <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="2024" />
                         </div>
                         <div className="lux-group">
                           <label>ALAN (m²)</label>
                           <input type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="400 m²" />
                         </div>
                      </div>

                      <div className="lux-group">
                        <label>KISA ÖZET</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Projenin tanıtım cümlesi..." />
                      </div>
                    </div>

                    <div className="media-section-card">
                       <div className="media-grid">
                          <div className="cover-upload-zone">
                            <label className="section-label">KAPAK MEDYASI</label>
                            <div className="lux-cover-preview" onClick={() => document.getElementById('proj-cover')?.click()}>
                              {formData.coverImage ? (
                                <div className="img-wrapper">
                                  <img src={formData.coverImage} alt="Cover" />
                                  <div className="change-overlay"><Upload size={24} /></div>
                                </div>
                              ) : (
                                <div className="lux-placeholder">
                                  <div className="pulse-icon"><Upload size={32} /></div>
                                  <p>Görsel Yükle</p>
                                </div>
                              )}
                            </div>
                            <input id="proj-cover" type="file" className="hidden" onChange={e => handleImageUpload(e, 'cover')} />
                          </div>

                          <div className="gallery-upload-zone">
                             <label className="section-label">GALERİ & DETAYLAR</label>
                             <div className="lux-gallery-container">
                               <div className="lux-gallery-grid">
                                 {formData.gallery.map((item, i) => (
                                   <div key={i} className="lux-gallery-item">
                                      <div className="item-thumb"><img src={item.url} alt="Gallery" /></div>
                                      <div className="item-meta">
                                         <input type="text" placeholder="SEO Alt Etiketi" value={item.imageAlt} onChange={e => updateGalleryItem(i, 'imageAlt', e.target.value)} />
                                         <input type="text" placeholder="Görsel Altyazısı" value={item.caption} onChange={e => updateGalleryItem(i, 'caption', e.target.value)} />
                                      </div>
                                      <button type="button" className="lux-remove-btn" onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, idx)=>idx!==i)})}><Trash2 size={14}/></button>
                                   </div>
                                 ))}
                               </div>
                               <button type="button" className="lux-add-photo-btn" onClick={() => document.getElementById('proj-gal')?.click()}>
                                 <Plus size={18} /> GÖRSEL EKLE
                               </button>
                             </div>
                             <input id="proj-gal" type="file" className="hidden" onChange={e => handleImageUpload(e, 'gallery')} />
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* ADVANCED DRAWER PANEL */}
                  <div className="advanced-form-content" style={{ display: showAdvancedPanel ? 'flex' : 'none' }}>
                    <div className="premium-advanced-grid">
                      <div className="adv-left">
                        <div className="lux-section">
                          <div className="section-header"><h4>İÇERİK VE HİKAYELEŞTİRME</h4></div>
                          <div className="lux-group mb-6">
                            <label>DESIGN STORY (Hikaye)</label>
                            <textarea value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} rows={4} placeholder="Projenin arka plan hikayesi..." />
                          </div>
                          <div className="lux-group mb-6">
                            <label>ARCHITECTURAL VISION (Vizyon)</label>
                            <textarea value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})} rows={4} placeholder="Tasarım felsefesi..." />
                          </div>
                          <div className="lux-group">
                            <label>TEXHNICAL DETAILS (Teknik)</label>
                            <textarea value={formData.techDetails} onChange={e => setFormData({...formData, techDetails: e.target.value})} rows={4} placeholder="Malzeme ve teknik veriler..." />
                          </div>
                        </div>
                      </div>

                      <div className="adv-right">
                        <div className="lux-section">
                          <div className="section-header"><h4>DAĞITIM KONTROLLERİ</h4></div>
                          <div className="dist-group mb-8">
                            <span className="dist-label">DEPARTMANLAR</span>
                            <div className="lux-cb-grid">
                              <label className="lux-cb">
                                <input type="checkbox" checked={formData.publishTargets.designStudio} onChange={() => togglePublishTarget('designStudio')} />
                                <span className="cb-inner">Design Studio</span>
                              </label>
                              <label className="lux-cb">
                                <input type="checkbox" checked={formData.publishTargets.materialStudio} onChange={() => togglePublishTarget('materialStudio')} />
                                <span className="cb-inner">Material Studio</span>
                              </label>
                              <label className="lux-cb">
                                <input type="checkbox" checked={formData.publishTargets.executionStudio} onChange={() => togglePublishTarget('executionStudio')} />
                                <span className="cb-inner">Execution Studio</span>
                              </label>
                            </div>
                          </div>

                          <div className="dist-group">
                            <span className="dist-label">KATEGORİLER</span>
                            <div className="lux-chip-grid">
                              {CATEGORIES.map(cat => (
                                <button
                                  key={cat}
                                  type="button"
                                  className={`lux-chip ${formData.categories.includes(cat) ? 'active' : ''}`}
                                  onClick={() => toggleCategory(cat)}
                                >
                                  {cat}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="lux-section mt-8">
                          <div className="section-header"><h4>SEO & GOOGLE AYARLARI</h4></div>
                          <div className="lux-group mb-4">
                            <label>SEO BAŞLIĞI</label>
                            <input type="text" value={formData.seoMeta.title} onChange={e => setFormData({...formData, seoMeta: {...formData.seoMeta, title: e.target.value}})} />
                          </div>
                          <div className="lux-group">
                            <label>SEO AÇIKLAMASI</label>
                            <textarea value={formData.seoMeta.description} onChange={e => setFormData({...formData, seoMeta: {...formData.seoMeta, description: e.target.value}})} rows={3} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lux-modal-footer">
                     <button type="submit" className="lux-save-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'KAYDEDİLİYOR...' : (editingProject ? 'GÜNCELLE' : 'EKLE')}
                     </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
        .loader-wrap-sm { padding: 5rem; display: flex; justify-content: center; color: #a68966; }

        /* PROJECTS GRID */
        .studio-projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1.5rem; margin-top: 1rem; }
        .engine-card { background: var(--surface); border: 1px solid var(--line); border-radius: 12px; overflow: hidden; transition: all 0.3s; }
        .engine-card:hover { transform: translateY(-5px); border-color: #a68966; box-shadow: 0 10px 25px rgba(0,0,0,0.2); }
        .card-clickable-area { cursor: pointer; }
        .card-thumb { aspect-ratio: 16/10; position: relative; overflow: hidden; }
        .card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .engine-card:hover img { transform: scale(1.05); }
        .thumb-overlay { position: absolute; inset: 0; background: rgba(166,137,102,0.9); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem; opacity: 0; transition: 0.3s; color: #000; }
        .thumb-overlay span { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; }
        .card-clickable-area:hover .thumb-overlay { opacity: 1; }
        .card-info { padding: 1rem; }
        .card-info h4 { margin: 0 0 0.25rem 0; font-size: 0.85rem; color: var(--text); font-family: var(--font-display); }
        .sc-badge { font-size: 0.6rem; color: #a68966; font-weight: 700; letter-spacing: 0.05em; }
        
        .add-project-bt-v2 {
          background: #a68966; color: #000; border: none; padding: 0.8rem 1.5rem; border-radius: 4px;
          display: flex; align-items: center; gap: 0.75rem; cursor: pointer;
          font-family: var(--font-display); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.1em;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .add-project-bt-v2:hover { background: #c5a680; transform: translateY(-2px); box-shadow: 0 8px 20px rgba(166,137,102,0.3); }

        .card-actions-v2 { display: flex; gap: 0.5rem; padding: 0 1rem 1rem 1rem; }
        .v2-btn { flex: 1; border: none; padding: 0.6rem; border-radius: 4px; font-size: 0.6rem; font-weight: 800; cursor: pointer; transition: 0.3s; }
        .v2-btn.edit { background: var(--surface-muted); color: var(--text); border: 1px solid var(--line); }
        .v2-btn.edit:hover { background: #a68966; color: #000; }
        .v2-btn.delete { background: rgba(255,77,77,0.05); color: #ff4d4d; border: 1px solid rgba(255,77,77,0.1); }
        .v2-btn.delete:hover { background: #ff4d4d; color: #fff; }

        /* LUX MODAL OVERHAUL */
        .hybrid-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(15px); z-index: 2000;
          display: flex; align-items: center; justify-content: center; padding: 2rem;
        }

        .hybrid-modal-content {
          background: rgba(15,15,15,0.7); border: 1px solid rgba(166,137,102,0.2); width: 100%; max-width: 1100px;
          height: 90vh; border-radius: 24px; display: flex; flex-direction: column; overflow: hidden;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8);
        }

        .modal-inner-scroll { overflow-y: auto; height: 100%; display: flex; flex-direction: column; }
        
        .premium-modal-header { padding: 2rem 3rem; background: rgba(166,137,102,0.05); border-bottom: 1px solid rgba(166,137,102,0.1); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(10px); }
        .header-badge { font-family: var(--font-display); font-size: 0.6rem; color: #a68966; letter-spacing: 0.3em; margin-bottom: 0.5rem; font-weight: 800; }
        .header-main { display: flex; justify-content: space-between; align-items: center; }
        .header-main h3 { margin: 0; font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.1em; color: var(--text); }
        .header-actions { display: flex; align-items: center; gap: 2rem; }
        
        .premium-toggle-btn { 
          background: rgba(166,137,102,0.1); border: 1px solid rgba(166,137,102,0.3); color: #a68966;
          padding: 0.6rem 1.2rem; border-radius: 100px; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em;
          display: flex; align-items: center; gap: 0.75rem; cursor: pointer; transition: all 0.3s;
        }
        .premium-toggle-btn:hover { background: #a68966; color: #000; }
        .premium-close-btn { background: rgba(255,255,255,0.05); border: none; color: var(--text-muted); width: 44px; height: 44px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .premium-close-btn:hover { background: rgba(255,255,255,0.1); color: #fff; transform: rotate(90deg); }

        .premium-modal-form { padding: 3rem; display: flex; flex-direction: column; gap: 3rem; flex: 1; }
        
        .form-section-card, .media-section-card { display: flex; flex-direction: column; gap: 2rem; }
        .section-header h4 { font-family: var(--font-display); font-size: 0.85rem; color: #a68966; letter-spacing: 0.2em; border-left: 3px solid #a68966; padding-left: 1rem; margin: 0; }

        .form-cols-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 2rem; }
        .form-cols-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
        
        .lux-group { display: flex; flex-direction: column; gap: 0.75rem; }
        .lux-group label { font-size: 0.65rem; color: var(--text-muted); letter-spacing: 0.15em; font-weight: 800; }
        .lux-group input, .lux-group textarea { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1.2rem; color: var(--text); border-radius: 8px; font-family: inherit; font-size: 0.9rem; transition: all 0.3s; }
        .lux-group input:focus, .lux-group textarea:focus { outline: none; border-color: #a68966; background: rgba(255,255,255,0.05); box-shadow: 0 0 20px rgba(166,137,102,0.1); }
        .mb-6 { margin-bottom: 1.5rem; }

        .media-grid { display: grid; grid-template-columns: 350px 1fr; gap: 3rem; }
        .section-label { font-size: 0.65rem; color: #a68966; letter-spacing: 0.2em; font-weight: 800; margin-bottom: 1.5rem; display: block; }
        
        .lux-cover-preview { 
          width: 100%; aspect-ratio: 16/10; border: 1px dashed rgba(166,137,102,0.3); border-radius: 16px;
          cursor: pointer; overflow: hidden; position: relative; background: rgba(0,0,0,0.2);
          transition: all 0.4s;
        }
        .lux-cover-preview:hover { border-color: #a68966; transform: scale(1.02); }
        .img-wrapper { width: 100%; height: 100%; position: relative; }
        .img-wrapper img { width: 100%; height: 100%; object-fit: cover; }
        .change-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); opacity: 0; display: flex; align-items: center; justify-content: center; color: #fff; transition: 0.3s; }
        .img-wrapper:hover .change-overlay { opacity: 1; }
        
        .lux-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; color: var(--text-muted); text-align: center; padding: 2rem; }
        .lux-placeholder p { font-size: 0.85rem; margin: 0; color: var(--text); }
        .lux-placeholder span { font-size: 0.65rem; opacity: 0.5; }
        .pulse-icon { color: #a68966; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { transform: scale(1); opacity: 0.5; } 50% { transform: scale(1.1); opacity: 1; } 100% { transform: scale(1); opacity: 0.5; } }

        .lux-gallery-container { display: flex; flex-direction: column; gap: 1.5rem; }
        .lux-gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .lux-gallery-item { display: flex; gap: 1rem; background: rgba(255,255,255,0.03); padding: 1rem; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); align-items: center; position: relative; }
        .item-thumb { width: 70px; height: 70px; border-radius: 8px; overflow: hidden; }
        .item-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .item-meta { flex: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .item-meta input { background: transparent; border: none; border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text); padding: 0.3rem 0; font-size: 0.75rem; }
        .item-meta input:focus { outline: none; border-color: #a68966; }
        .lux-remove-btn { position: absolute; top: -10px; right: -10px; width: 28px; height: 28px; background: #ff4d4d; color: #fff; border: none; border-radius: 50%; opacity: 0; transform: scale(0.8); transition: all 0.3s; cursor: pointer; }
        .lux-gallery-item:hover .lux-remove-btn { opacity: 1; transform: scale(1); }
        
        .lux-add-photo-btn { 
          background: rgba(166,137,102,0.05); color: #a68966; border: 1px dashed rgba(166,137,102,0.3);
          padding: 1.5rem; border-radius: 12px; display: flex; align-items: center; justify-content: center; gap: 0.75rem;
          cursor: pointer; font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; transition: all 0.3s;
        }
        .lux-add-photo-btn:hover { background: rgba(166,137,102,0.1); transform: translateY(-3px); }

        .premium-advanced-grid { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 4rem; }
        .lux-section { display: flex; flex-direction: column; gap: 2rem; }
        
        .lux-cb-grid { display: grid; grid-template-columns: 1fr; gap: 1rem; }
        .lux-cb { display: flex; align-items: center; gap: 1rem; cursor: pointer; }
        .lux-cb input { position: absolute; opacity: 0; }
        .cb-inner { 
          flex: 1; padding: 1.2rem; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 12px; font-size: 0.85rem; color: var(--text-soft); transition: all 0.3s;
          display: flex; justify-content: space-between; align-items: center;
        }
        .lux-cb input:checked + .cb-inner { border-color: #a68966; background: rgba(166,137,102,0.15); color: #fff; }
        .lux-cb input:checked + .cb-inner::after { content: '✓'; color: #a68966; font-weight: 800; }

        .lux-chip-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .lux-chip { 
          background: rgba(255,255,255,0.05); color: var(--text-muted); border: 1px solid rgba(255,255,255,0.1);
          padding: 0.6rem 1.2rem; border-radius: 100px; font-size: 0.7rem; font-weight: 700; cursor: pointer; transition: all 0.3s;
        }
        .lux-chip:hover { border-color: #a68966; color: #a68966; }
        .lux-chip.active { background: #a68966; color: #000; border-color: #a68966; }

        .lux-modal-footer { margin-top: 4rem; padding-top: 3rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: flex-end; }
        .lux-save-btn { 
          background: #a68966; color: #000; border: none; padding: 1.5rem 4rem; border-radius: 12px;
          font-family: var(--font-display); font-weight: 800; letter-spacing: 0.15em; font-size: 0.9rem;
          cursor: pointer; box-shadow: 0 10px 40px rgba(166,137,102,0.4); transition: all 0.3s;
        }
        .lux-save-btn:hover { background: #c5a680; transform: translateY(-5px); box-shadow: 0 15px 50px rgba(166,137,102,0.6); }
        .lux-save-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

        .mb-2 { margin-bottom: 0.5rem; }
        .mb-4 { margin-bottom: 1rem; }
        .mb-8 { margin-bottom: 2rem; }
        .mt-8 { margin-top: 2rem; }
        .hidden { display: none; }
      `}</style>
    </div>
  );
}

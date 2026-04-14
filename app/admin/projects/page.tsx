'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Loader2, 
  X, 
  Upload,
  Settings,
  Image as ImageIcon,
  FolderKanban
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotification } from '@/components/admin/AdminNotificationProvider';

export default function AdminProjects() {
  const { showToast, confirm: premiumConfirm } = useNotification();
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Advanced panel toggle (for SEO & Publishing)
  const [showAdvancedPanel, setShowAdvancedPanel] = useState(false);

  // Form State
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
  const [isMigrating, setIsMigrating] = useState(false);

  const CATEGORIES = ["Lüks Konut", "Ticari Yapı", "Karma Kullanım", "Kurumsal Alan", "Butik Otel", "Kültür Yapısı"];

  useEffect(() => {
    fetchProjects();
  }, []);

  const runMigration = async () => {
    setIsMigrating(true);
    try {
      const res = await fetch('/api/admin/migrate/projects');
      if (res.ok) {
        showToast("Varsayılan projeler başarıyla aktarıldı!", "success");
        fetchProjects();
      }
    } catch (e) {
      showToast("Aktarım sırasında bir hata oluştu.", "error");
    } finally {
      setIsMigrating(false);
    }
  };

  const [uploading, setUploading] = useState(false);
  const [dragOverCover, setDragOverCover] = useState(false);
  const [dragOverGallery, setDragOverGallery] = useState<number | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDropCover = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverCover(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setUploading(true);
      try {
        const res = await fetch(`/api/upload?filename=${file.name}`, {
          method: 'POST',
          body: file
        });
        const blob = await res.json();
        setFormData({ ...formData, coverImage: blob.url });
      } catch (err) {
        showToast("Yükleme başarısız.", "error");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleDropGallery = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverGallery(null);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploading(true);
      try {
        const uploads = await Promise.all(
          files.map(async (file) => {
            const res = await fetch(`/api/upload?filename=${file.name}`, {
              method: 'POST',
              body: file
            });
            return res.json();
          })
        );
        
        const newItems = uploads.map(blob => ({ url: blob.url, imageAlt: '', caption: '' }));
        setFormData({ 
          ...formData, 
          gallery: [...formData.gallery, ...newItems] 
        });
      } catch (err) {
        showToast("Bazı görseller yüklenemedi.", "error");
      } finally {
        setUploading(false);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCover: boolean = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file
      });
      const blob = await res.json();
      
      if (isCover) {
        setFormData({ ...formData, coverImage: blob.url });
      } else {
        setFormData({ 
          ...formData, 
          gallery: [...formData.gallery, { url: blob.url, imageAlt: '', caption: '' }] 
        });
      }
    } catch (err) {
      showToast("Yükleme başarısız.", "error");
    }
  };

  const toggleCategory = (cat: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(cat) 
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const togglePublishTarget = (target: 'designStudio' | 'materialStudio' | 'executionStudio') => {
    setFormData(prev => ({
      ...prev,
      publishTargets: {
        ...prev.publishTargets,
        [target]: !prev.publishTargets[target]
      }
    }));
  };

  const updateGalleryItem = (index: number, field: string, value: string) => {
    const updatedGallery = [...formData.gallery];
    updatedGallery[index] = { ...updatedGallery[index], [field]: value };
    setFormData({ ...formData, gallery: updatedGallery });
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
        fetchProjects();
        resetForm();
        showToast(editingProject ? "Proje başarıyla güncellendi." : "Yeni proje başarıyla eklendi.", "success");
      } else {
        showToast("Proje kaydedilirken hata oluştu.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Bağlantı hatası oluştu.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleProjectDelete = async (id: string) => {
    const ok = await premiumConfirm({
      title: 'PROJEYİ SİL',
      message: 'Bu projeyi tamamen havuzdan silmek istediğinize emin misiniz?',
      confirmText: 'SİL',
      isDanger: true
    });
    
    if (!ok) return;
    
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProjects();
        showToast("Proje başarıyla silindi.", "success");
      } else {
        showToast("Silme işlemi sırasında hata oluştu.", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Silme işlemi başarısız.", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      label: '',
      categories: [],
      publishTargets: { designStudio: true, materialStudio: false, executionStudio: false },
      coverImage: '',
      description: '',
      client: '',
      year: '',
      area: '',
      vision: '',
      techDetails: '',
      story: '',
      seoMeta: { title: '', description: '', keywords: '' },
      gallery: []
    });
    setEditingProject(null);
    setShowAdvancedPanel(false);
  };

  const openEditModal = (project: any) => {
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
    setIsModalOpen(true);
  };

  return (
    <div className="portfolio-engine-container">
      <div className="engine-header">
        <div className="header-text">
          <p>ÇAPRAZ PORTFÖY HAVUZU</p>
          <span>Aşağıdaki havuzdan projeleri farklı departmanlara (Mimari, Materyal, İnşaat) dağıtabilirsiniz.</span>
        </div>
        <button className="add-engine-btn" onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus size={18} /> PROJE EKLE
        </button>
      </div>

      {isLoading ? (
        <div className="loader-wrap"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="engine-grid">
          {projects.map((project: any) => (
            <motion.div layout key={project._id} className="engine-card">
              <div className="card-clickable-area" onClick={() => openEditModal(project)}>
                <div className="card-thumb">
                  {project.coverImage && <img src={project.coverImage} alt={project.title} />}
                  <div className="thumb-overlay">
                    <Edit3 size={24} />
                    <span>DÜZENLEMEK İÇİN TIKLAYIN</span>
                  </div>
                </div>
                <div className="card-info">
                  <h4>{project.title}</h4>
                  <div className="publish-badges">
                    {project.publishTargets?.designStudio && <span className="badge design">DESIGN</span>}
                    {project.publishTargets?.materialStudio && <span className="badge material">MAT.</span>}
                    {project.publishTargets?.executionStudio && <span className="badge execution">EXEC.</span>}
                  </div>
                </div>
              </div>
              
              <div className="card-actions-v2">
                 <button onClick={() => openEditModal(project)} className="v2-btn edit">
                   <Edit3 size={14} /> DÜZENLE
                 </button>
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleProjectDelete(project._id);
                  }} 
                  className="v2-btn delete"
                 >
                   <Trash2 size={14} /> SİL
                 </button>
              </div>
            </motion.div>
          ))}
          {projects.length === 0 && (
            <div className="empty-state-container">
              <div className="migration-helper admin-card">
                 <FolderKanban size={40} className="icon-gold" />
                 <h4>PROJE HAVUZU BOŞ</h4>
                 <p>Şu an sistemde düzenlenebilir proje bulunmuyor. Web sitesindeki mevcut projeleri buraya aktararak düzenlemeye başlayabilirsiniz.</p>
                 <button className="migrate-btn" onClick={runMigration} disabled={isMigrating}>
                   {isMigrating ? <Loader2 className="animate-spin" size={18} /> : <ImageIcon size={18} />}
                   {isMigrating ? 'AKTARILIYOR...' : 'VARSAYILAN PROJELERİ AKTAR'}
                 </button>
              </div>
            </div>
          )}
        </div>
      )}

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
                  <div className="header-badge">PROJE EDİTÖRÜ</div>
                  <div className="header-main">
                    <h3>{editingProject ? editingProject.title : 'YENİ MİMARİ PROJE'}</h3>
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
                      <div className="section-header"><h4>TEMEL KÜNYE BİLGİLERİ</h4></div>
                      <div className="form-cols-3">
                         <div className="lux-group">
                           <label>PROJE ADI</label>
                           <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required placeholder="Örn: Skyline Villa" />
                         </div>
                         <div className="lux-group">
                           <label>MÜŞTERİ & LOKASYON</label>
                           <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} placeholder="Örn: Özel Müşteri / Bodrum" />
                         </div>
                         <div className="lux-group">
                           <label>TASARIM TİPİ</label>
                           <input type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} required placeholder="Örn: KONUT" />
                         </div>
                      </div>

                      <div className="form-cols-2">
                         <div className="lux-group">
                           <label>TESLİM YILI</label>
                           <input type="text" value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="2024" />
                         </div>
                         <div className="lux-group">
                           <label>İŞLEM HACMİ (m²)</label>
                           <input type="text" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="650 m²" />
                         </div>
                      </div>

                      <div className="lux-group">
                        <label>PROJE ÖZETİ</label>
                        <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} placeholder="Projenin kısa bir tanıtımı..." />
                      </div>
                    </div>

                    <div className="media-section-card">
                       <div className="media-grid">
                          <div className="cover-upload-zone">
                            <label className="section-label">ANA KAPAK GÖRSELİ</label>
                            <div 
                              className={`lux-cover-preview ${dragOverCover ? 'drag-active' : ''}`} 
                              onClick={() => document.getElementById('cover-up')?.click()}
                              onDragOver={(e) => { e.preventDefault(); setDragOverCover(true); }}
                              onDragLeave={() => setDragOverCover(false)}
                              onDrop={handleDropCover}
                            >
                              {formData.coverImage ? (
                                <div className="img-wrapper">
                                  <img src={formData.coverImage} alt="Cover" />
                                  <div className="change-overlay"><Upload size={24} /></div>
                                </div>
                              ) : (
                                <div className="lux-placeholder">
                                  <div className="pulse-icon"><Upload size={32} /></div>
                                  <p>Fotoğrafı buraya bırakın veya tıklayın</p>
                                  <span>Önerilen: 1920x1080px</span>
                                </div>
                              )}
                            </div>
                            <input id="cover-up" type="file" className="hidden" onChange={e => handleImageUpload(e, true)} />
                          </div>

                          <div className="gallery-upload-zone">
                             <label className="section-label">PROJE GALERİSİ & DETAYLAR</label>
                             <div className="lux-gallery-container">
                               <div className="lux-gallery-grid">
                                 {formData.gallery.map((item, i) => (
                                   <div key={i} className="lux-gallery-item">
                                      <div className="item-thumb"><img src={item.url} alt="Gallery" /></div>
                                      <div className="item-meta">
                                         <input type="text" placeholder="SEO Alt Metni" value={item.imageAlt} onChange={e => updateGalleryItem(i, 'imageAlt', e.target.value)} />
                                         <input type="text" placeholder="Görsel Altyazısı" value={item.caption} onChange={e => updateGalleryItem(i, 'caption', e.target.value)} />
                                      </div>
                                      <button type="button" className="lux-remove-btn" onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, idx)=>idx!==i)})}><Trash2 size={14}/></button>
                                   </div>
                                 ))}
                               </div>
                               <button 
                                 type="button" 
                                 className={`lux-add-photo-btn ${dragOverGallery === 99 ? 'drag-active' : ''}`} 
                                 onClick={() => document.getElementById('gal-up')?.click()}
                                 onDragOver={(e) => { e.preventDefault(); setDragOverGallery(99); }}
                                 onDragLeave={() => setDragOverGallery(null)}
                                 onDrop={handleDropGallery}
                               >
                                 <Plus size={18} /> YENİ GÖRSEL EKLE
                               </button>
                             </div>
                             <input id="gal-up" type="file" className="hidden" onChange={e => handleImageUpload(e, false)} />
                          </div>
                       </div>
                    </div>
                  </div>

                  {/* ADVANCED DRAWER PANEL */}
                  <div className="advanced-form-content" style={{ display: showAdvancedPanel ? 'flex' : 'none' }}>
                    <div className="premium-advanced-grid">
                      <div className="adv-left">
                        <div className="lux-section">
                          <div className="section-header"><h4>EDİTÖRYAL ANLATIM</h4></div>
                          <div className="lux-group mb-6">
                            <label>DESIGN STORY (Hikaye)</label>
                            <textarea value={formData.story} onChange={e => setFormData({...formData, story: e.target.value})} rows={4} placeholder="Projenin yaratım süreci ve hikayesi..." />
                          </div>
                          <div className="lux-group mb-6">
                            <label>ARCHITECTURAL VISION (Vizyon)</label>
                            <textarea value={formData.vision} onChange={e => setFormData({...formData, vision: e.target.value})} rows={4} placeholder="Tasarım felsefesi ve hedef..." />
                          </div>
                          <div className="lux-group">
                            <label>TECH & MATERIAL DETAILS</label>
                            <textarea value={formData.techDetails} onChange={e => setFormData({...formData, techDetails: e.target.value})} rows={4} placeholder="Teknik veriler ve malzeme seçimi..." />
                          </div>
                        </div>
                      </div>

                      <div className="adv-right">
                        <div className="lux-section">
                          <div className="section-header"><h4>YAYIN VE ETİKET AYARLARI</h4></div>
                          <div className="dist-group mb-8">
                            <span className="dist-label">DEPARTMAN DAĞITIMI</span>
                            <div className="lux-cb-grid">
                              <label className="lux-cb">
                                <input type="checkbox" checked={formData.publishTargets.designStudio} onChange={() => togglePublishTarget('designStudio')} />
                                <span className="cb-inner">Mimari Stüdyo</span>
                              </label>
                              <label className="lux-cb">
                                <input type="checkbox" checked={formData.publishTargets.materialStudio} onChange={() => togglePublishTarget('materialStudio')} />
                                <span className="cb-inner">Materyal Stüdyo</span>
                              </label>
                              <label className="lux-cb">
                                <input type="checkbox" checked={formData.publishTargets.executionStudio} onChange={() => togglePublishTarget('executionStudio')} />
                                <span className="cb-inner">Uygulama Birimi</span>
                              </label>
                            </div>
                          </div>

                          <div className="dist-group">
                            <span className="dist-label">KATEGORİ SEÇİMİ</span>
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
                          <div className="section-header"><h4>SEO & META VERİLERİ</h4></div>
                          <div className="lux-group mb-4">
                            <label>SAYFA BAŞLIĞI (TITLE)</label>
                            <input type="text" value={formData.seoMeta.title} onChange={e => setFormData({...formData, seoMeta: {...formData.seoMeta, title: e.target.value}})} />
                          </div>
                          <div className="lux-group">
                            <label>SAYFA AÇIKLAMASI (DESCRIPTION)</label>
                            <textarea value={formData.seoMeta.description} onChange={e => setFormData({...formData, seoMeta: {...formData.seoMeta, description: e.target.value}})} rows={3} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lux-modal-footer">
                     <button type="submit" className="lux-save-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'İŞLENİYOR...' : (editingProject ? 'DEĞİŞİKLİKLERİ KAYDET' : 'PORTFÖYE YAYINLA')}
                     </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .portfolio-engine-container { display: flex; flex-direction: column; gap: 2rem; }
        
        .engine-header {
          display: flex; justify-content: space-between; align-items: flex-end;
          padding: 2.5rem 3rem; background: rgba(255,255,255,0.02); border-bottom: 1px solid rgba(166,137,102,0.2);
          gap: 2rem;
        }
        .header-text p { font-family: var(--font-display), sans-serif; font-size: 1.5rem; letter-spacing: 0.3em; color: #a68966; margin: 0; font-weight: 500; }
        .header-text span { font-size: 0.85rem; color: var(--text-muted); display: block; margin-top: 0.5rem; opacity: 0.8; }

        .add-engine-btn { 
          background: #a68966; color: #000; border: none; padding: 1rem 2rem; border-radius: 4px; 
          font-family: var(--font-display); font-weight: 800; letter-spacing: 0.15em; font-size: 0.75rem; 
          cursor: pointer; display: flex; align-items: center; gap: 1rem; transition: all 0.3s; 
          box-shadow: 0 10px 30px rgba(166,137,102,0.3);
        }
        .add-engine-btn:hover { background: #d4b591; transform: translateY(-2px); }

        @media (max-width: 768px) {
          .engine-header { flex-direction: column; align-items: stretch; padding: 2rem 1.5rem; text-align: center; }
          .add-engine-btn { justify-content: center; margin-top: 1rem; }
        }

        .loader-wrap { display: flex; justify-content: center; padding: 5rem; color: #a68966; }

        .engine-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        @media (max-width: 480px) {
          .engine-grid { grid-template-columns: 1fr; }
        }

        .engine-card {
          background: var(--surface); border: 1px solid var(--line); border-radius: 12px; overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .engine-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,0,0,0.2); border-color: #a68966; }
        
        .card-clickable-area { cursor: pointer; }
        
        .card-thumb { aspect-ratio: 16/10; position: relative; overflow: hidden; }
        .card-thumb img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s ease; }
        .engine-card:hover .card-thumb img { transform: scale(1.05); }
        
        .thumb-overlay {
          position: absolute; inset: 0; background: rgba(166,137,102,0.8); 
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 0.5rem;
          opacity: 0; transition: opacity 0.3s ease; color: #000;
        }
        .thumb-overlay span { font-size: 0.7rem; font-weight: 800; letter-spacing: 0.1em; }
        .card-clickable-area:hover .thumb-overlay { opacity: 1; }

        .card-info { padding: 1.25rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .card-info h4 { margin: 0; font-size: 0.9rem; font-weight: 500; font-family: var(--font-display); color: var(--text); letter-spacing: 0.05em; }
        
        .card-actions-v2 { display: flex; gap: 0.5rem; padding: 0 1.25rem 1.25rem 1.25rem; }
        .v2-btn { flex: 1; border: none; padding: 0.75rem; border-radius: 6px; font-size: 0.65rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; transition: all 0.3s; letter-spacing: 0.05em; }
        
        .v2-btn.edit { background: var(--surface-muted); color: var(--text); border: 1px solid var(--line); }
        .v2-btn.edit:hover { background: #a68966; color: #000; border-color: #a68966; }
        
        .v2-btn.delete { background: rgba(255,77,77,0.05); color: #ff4d4d; border: 1px solid rgba(255,77,77,0.1); }
        .v2-btn.delete:hover { background: #ff4d4d; color: #fff; }
        
        .publish-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .badge { font-size: 0.6rem; padding: 2px 6px; border-radius: 2px; letter-spacing: 0.1em; font-weight: 700; }
        .badge.design { background: rgba(166,137,102,0.2); color: #a68966; }
        .badge.material { background: rgba(191,31,90,0.2); color: #bf1f5a; }
        .badge.execution { background: rgba(77,171,247,0.2); color: #4dabf7; }

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

        @media (max-width: 900px) {
          .hybrid-modal-overlay { padding: 0.5rem; align-items: flex-start; overflow-y: auto; }
          .hybrid-modal-content { 
            width: 100% !important; 
            max-width: 100% !important; 
            height: auto !important; 
            min-height: calc(100vh - 1rem) !important;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
          }
          .premium-modal-header { padding: 1.5rem; position: sticky; top: 0; }
          .header-main { flex-direction: column; align-items: flex-start; gap: 1rem; }
          .header-main h3 { font-size: 1.1rem; line-height: 1.4; }
          .header-actions { width: 100%; justify-content: space-between; gap: 0.5rem; }
          .premium-toggle-btn { flex: 1; padding: 0.6rem; font-size: 0.6rem; justify-content: center; }
          .premium-toggle-btn span { display: inline; font-size: 0.55rem; }
          
          .premium-modal-form { padding: 1.5rem; gap: 2rem; }
          .form-cols-3, .form-cols-2 { grid-template-columns: 1fr !important; gap: 1.5rem !important; }
          
          .media-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .cover-upload-zone { width: 100%; }
          .gallery-upload-zone { width: 100%; }
          
          .premium-advanced-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          
          .lux-modal-footer { margin-top: 2rem; padding: 2rem 1.5rem; border-top: 1px solid rgba(166,137,102,0.1); }
          .lux-save-btn { width: 100%; padding: 1.25rem; font-size: 0.8rem; justify-content: center; }
          
          .lux-gallery-grid { grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)) !important; gap: 1rem !important; }
          .lux-gallery-item { flex-direction: column; align-items: stretch; }
          .item-thumb { width: 100%; height: 120px; }
        }

        .modal-inner-scroll { overflow-y: auto; height: 100%; display: flex; flex-direction: column; }
        
        .premium-modal-header { padding: 2rem 3rem; background: rgba(166,137,102,0.05); border-bottom: 1px solid rgba(166,137,102,0.1); position: sticky; top: 0; z-index: 10; backdrop-filter: blur(10px); }
        .header-badge { font-family: var(--font-display); font-size: 0.6rem; color: #a68966; letter-spacing: 0.3em; margin-bottom: 0.5rem; font-weight: 800; }
        .header-main { display: flex; justify-content: space-between; align-items: center; }
        .header-main h3 { margin: 0; font-family: var(--font-display); font-size: 1.4rem; letter-spacing: 0.1em; color: #fff; }
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
        .lux-group label { font-size: 0.65rem; color: #fff; letter-spacing: 0.15em; font-weight: 800; opacity: 0.8; }
        .lux-group input, .lux-group textarea { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1.2rem; color: #fff; border-radius: 8px; font-family: inherit; font-size: 0.9rem; transition: all 0.3s; }
        .lux-group input:focus, .lux-group textarea:focus { outline: none; border-color: #a68966; background: rgba(255,255,255,0.05); box-shadow: 0 0 20px rgba(166,137,102,0.1); color: #fff; }
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
        .lux-placeholder p { font-size: 0.85rem; margin: 0; color: #fff; }
        .lux-placeholder span { font-size: 0.65rem; color: rgba(255,255,255,0.5); }
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
          border-radius: 12px; font-size: 0.85rem; color: #fff; transition: all 0.3s;
          display: flex; justify-content: space-between; align-items: center;
        }
        .lux-cb input:checked + .cb-inner { border-color: #a68966; background: rgba(166,137,102,0.15); color: #fff; }
        .lux-cb input:checked + .cb-inner::after { content: '✓'; color: #a68966; font-weight: 800; }

        .lux-chip-grid { display: flex; flex-wrap: wrap; gap: 0.75rem; }
        .lux-chip { 
          background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1);
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

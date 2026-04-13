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
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProjects() {
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
    seoMeta: { title: '', description: '', keywords: '' },
    gallery: [] as { url: string; imageAlt: string; caption: string }[]
  });

  const CATEGORIES = ["Lüks Konut", "Ticari Yapı", "Karma Kullanım", "Kurumsal Alan", "Butik Otel", "Kültür Yapısı"];

  useEffect(() => {
    fetchProjects();
  }, []);

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
      alert("Yükleme başarısız.");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const url = editingProject ? `/api/projects/${editingProject._id}` : '/api/projects';
    const method = editingProject ? 'PATCH' : 'POST'; // Assuming the API handles PATCH like PUT

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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu projeyi tamamen havuzdan silmek istediğinize emin misiniz?')) return;
    
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (err) {
      console.error(err);
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
              <div className="card-thumb">
                {project.coverImage && <img src={project.coverImage} alt={project.title} />}
                <div className="card-overlay">
                   <button onClick={() => openEditModal(project)} className="action-icn"><Edit3 size={16} /></button>
                   <button onClick={() => handleDelete(project._id)} className="action-icn delete"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="card-meta">
                <h4>{project.title}</h4>
                <div className="publish-badges">
                  {project.publishTargets?.designStudio && <span className="badge design">DESIGN</span>}
                  {project.publishTargets?.materialStudio && <span className="badge material">MAT.</span>}
                  {project.publishTargets?.executionStudio && <span className="badge execution">EXEC.</span>}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* NEW HYBRID MODAL + DRAWER FOR ADVANCED SETTINGS */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="hybrid-modal-overlay">
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className={`hybrid-modal-content ${showAdvancedPanel ? 'advanced-open' : ''}`}
            >
              <div className="modal-inner-scroll">
                <div className="modal-header">
                  <h3>{editingProject ? 'PROJE BİLGİLERİNİ DÜZENLE' : 'YENİ PROJE YÜKLE'}</h3>
                  <div className="header-actions">
                    <button className="text-btn" onClick={() => setShowAdvancedPanel(!showAdvancedPanel)}>
                      <Settings size={16} /> {showAdvancedPanel ? 'TEMEL AYARLAR' : 'DAĞITIM & SEO AYARLARI'}
                    </button>
                    <button onClick={() => setIsModalOpen(false)} className="close-btn"><X size={20} /></button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                  <div className="main-form-content" style={{ display: showAdvancedPanel ? 'none' : 'flex' }}>
                    <div className="form-cols">
                       <div className="group">
                         <label>PROJE ADI</label>
                         <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                       </div>
                       <div className="group">
                         <label>ETİKET</label>
                         <input type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} required />
                       </div>
                    </div>

                    <div className="group">
                      <label>AÇIKLAMA</label>
                      <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
                    </div>

                    <div className="upload-sections">
                      <div className="upload-box">
                        <label>KAPAK GÖRSELİ</label>
                        <div className="cover-preview" onClick={() => document.getElementById('cover-up')?.click()}>
                          {formData.coverImage ? <img src={formData.coverImage} alt="Cover" /> : <div className="placeholder"><Upload size={20} /></div>}
                        </div>
                        <input id="cover-up" type="file" className="hidden" onChange={e => handleImageUpload(e, true)} />
                      </div>

                      <div className="upload-box flex-1">
                        <label>GALERİ & METİNLER (Gelişmiş)</label>
                        <div className="advanced-gallery">
                          {formData.gallery.map((item, i) => (
                            <div key={i} className="gallery-card">
                               <img src={item.url} alt="Gallery item" />
                               <div className="gallery-fields">
                                  <input type="text" placeholder="Fotoğraf Alt Etiketi (SEO)" value={item.imageAlt} onChange={e => updateGalleryItem(i, 'imageAlt', e.target.value)} />
                                  <input type="text" placeholder="Fotoğraf Altyazısı (Görünür)" value={item.caption} onChange={e => updateGalleryItem(i, 'caption', e.target.value)} />
                               </div>
                               <button type="button" className="remove-btn" onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, idx)=>idx!==i)})}><Trash2 size={12}/></button>
                            </div>
                          ))}
                          <button type="button" className="add-photo-btn" onClick={() => document.getElementById('gal-up')?.click()}>
                            <Plus size={16} /> GÖRSEL EKLE
                          </button>
                        </div>
                        <input id="gal-up" type="file" className="hidden" onChange={e => handleImageUpload(e, false)} />
                      </div>
                    </div>
                  </div>

                  {/* ADVANCED DRAWER PANEL */}
                  <div className="advanced-form-content" style={{ display: showAdvancedPanel ? 'flex' : 'none' }}>
                    <div className="advanced-section">
                      <h4>DEPARTMAN DAĞITIMI</h4>
                      <p className="hint">Bu projenin web sitesinde hangi stüdyo sayfalarında görüneceğini seçin.</p>
                      <div className="checkbox-grid">
                        <label className="custom-cb">
                          <input type="checkbox" checked={formData.publishTargets.designStudio} onChange={() => togglePublishTarget('designStudio')} />
                          <span className="cb-mark"></span> Design Studio (Mimari)
                        </label>
                        <label className="custom-cb">
                          <input type="checkbox" checked={formData.publishTargets.materialStudio} onChange={() => togglePublishTarget('materialStudio')} />
                          <span className="cb-mark"></span> Material Studio (Mobilya vs.)
                        </label>
                        <label className="custom-cb">
                          <input type="checkbox" checked={formData.publishTargets.executionStudio} onChange={() => togglePublishTarget('executionStudio')} />
                          <span className="cb-mark"></span> Execution Studio (Uygulama)
                        </label>
                      </div>
                    </div>

                    <div className="advanced-section mt-4">
                      <h4>KATEGORİLER (Filtreleme İçin)</h4>
                      <div className="checkbox-grid">
                        {CATEGORIES.map(cat => (
                          <label key={cat} className="custom-cb">
                            <input type="checkbox" checked={formData.categories.includes(cat)} onChange={() => toggleCategory(cat)} />
                            <span className="cb-mark"></span> {cat}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="advanced-section mt-4">
                      <h4>SEO & META DEĞERLERİ</h4>
                      <div className="group">
                        <label>SAYFA BAŞLIĞI (TITLE)</label>
                        <input type="text" value={formData.seoMeta.title} onChange={e => setFormData({...formData, seoMeta: {...formData.seoMeta, title: e.target.value}})} />
                      </div>
                      <div className="group">
                        <label>META AÇIKLAMA (DESCRIPTION)</label>
                        <textarea value={formData.seoMeta.description} onChange={e => setFormData({...formData, seoMeta: {...formData.seoMeta, description: e.target.value}})} rows={2} />
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer">
                     <button type="submit" className="action-btn-main" disabled={isSubmitting}>
                        {isSubmitting ? 'KAYDEDİLİYOR...' : (editingProject ? 'PROJEYİ GÜNCELLE' : 'PORTFÖYE YÜKLE')}
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
          padding: 1.5rem 2rem; background: rgba(10,10,10,0.5); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px;
        }

        .header-text p { font-family: var(--font-display); font-size: 0.8rem; letter-spacing: 0.2em; color: #a68966; margin: 0 0 5px 0; font-weight: 700; }
        .header-text span { font-size: 0.75rem; color: rgba(255,255,255,0.5); }

        .add-engine-btn {
          background: #fff; color: #000; border: none; padding: 0.8rem 1.5rem; display: flex; align-items: center; gap: 0.5rem;
          font-family: var(--font-display), sans-serif; font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; cursor: pointer; border-radius: 4px;
        }
        .add-engine-btn:hover { background: #e0e0e0; }

        .loader-wrap { display: flex; justify-content: center; padding: 5rem; color: #a68966; }

        .engine-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }

        .engine-card {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; overflow: hidden;
        }
        
        .card-thumb { aspect-ratio: 16/10; position: relative; overflow: hidden; }
        .card-thumb img { width: 100%; height: 100%; object-fit: cover; }
        
        .card-overlay {
          position: absolute; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; gap: 1rem; opacity: 0; transition: opacity 0.3s ease;
        }
        .engine-card:hover .card-overlay { opacity: 1; }
        
        .action-icn { width: 40px; height: 40px; border-radius: 50%; background: #fff; color: #000; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .action-icn:hover { transform: scale(1.05); }
        .action-icn.delete:hover { background: #ff4d4d; color: #fff; }

        .card-meta { padding: 1rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .card-meta h4 { margin: 0; font-size: 0.9rem; font-weight: 500; font-family: var(--font-display); }
        
        .publish-badges { display: flex; gap: 0.5rem; flex-wrap: wrap; }
        .badge { font-size: 0.6rem; padding: 2px 6px; border-radius: 2px; letter-spacing: 0.1em; font-weight: 700; }
        .badge.design { background: rgba(166,137,102,0.2); color: #a68966; }
        .badge.material { background: rgba(191,31,90,0.2); color: #bf1f5a; }
        .badge.execution { background: rgba(77,171,247,0.2); color: #4dabf7; }

        /* MODAL */
        .hybrid-modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); z-index: 1000;
          display: flex; align-items: center; justify-content: center; padding: 2rem;
        }

        .hybrid-modal-content {
          background: #0d0d0d; border: 1px solid rgba(255,255,255,0.1); width: 100%; max-width: 900px;
          height: 85vh; border-radius: 12px; display: flex; flex-direction: column; overflow: hidden;
        }

        .modal-inner-scroll { overflow-y: auto; height: 100%; display: flex; flex-direction: column; }

        .modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; background: rgba(13,13,13,0.9); z-index: 10; }
        .modal-header h3 { margin: 0; font-family: var(--font-display); font-size: 1rem; letter-spacing: 0.15em; color: #fff; }
        .header-actions { display: flex; align-items: center; gap: 1.5rem; }
        .text-btn { background: none; border: none; color: #a68966; font-size: 0.75rem; letter-spacing: 0.1em; display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
        .close-btn { background: none; border: none; color: rgba(255,255,255,0.5); cursor: pointer; }

        .modal-form { padding: 2rem; display: flex; flex-direction: column; gap: 2rem; flex: 1; }
        .main-form-content, .advanced-form-content { flex-direction: column; gap: 1.5rem; }

        .form-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        
        .group { display: flex; flex-direction: column; gap: 0.5rem; }
        .group label { font-size: 0.65rem; color: rgba(255,255,255,0.5); letter-spacing: 0.15em; }
        .group input, .group textarea { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 1rem; color: #fff; border-radius: 4px; font-family: inherit; }
        .group input:focus, .group textarea:focus { outline: none; border-color: #a68966; }

        .upload-sections { display: flex; gap: 2rem; align-items: flex-start; }
        .upload-box { display: flex; flex-direction: column; gap: 0.5rem; }
        .upload-box label { font-size: 0.65rem; color: rgba(255,255,255,0.5); letter-spacing: 0.15em; }
        .flex-1 { flex: 1; }

        .cover-preview { width: 250px; aspect-ratio: 16/10; border: 1px dashed rgba(255,255,255,0.2); border-radius: 4px; display: flex; align-items: center; justify-content: center; cursor: pointer; overflow: hidden; background: rgba(255,255,255,0.02); }
        .cover-preview img { width: 100%; height: 100%; object-fit: cover; }
        .placeholder { color: rgba(255,255,255,0.3); }

        .advanced-gallery { display: flex; flex-direction: column; gap: 1rem; }
        .gallery-card { display: flex; gap: 1rem; background: rgba(255,255,255,0.02); padding: 1rem; border-radius: 4px; border: 1px solid rgba(255,255,255,0.05); align-items: center; }
        .gallery-card img { width: 80px; height: 80px; object-fit: cover; border-radius: 2px; }
        .gallery-fields { display: flex; flex-direction: column; gap: 0.5rem; flex: 1; }
        .gallery-fields input { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.05); color: #fff; padding: 0.4rem 0.8rem; font-size: 0.8rem; border-radius: 2px; }
        .remove-btn { background: #ff4d4d; color: #fff; border: none; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .add-photo-btn { background: rgba(255,255,255,0.05); color: #fff; border: 1px dashed rgba(255,255,255,0.2); padding: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem; cursor: pointer; border-radius: 4px; font-size: 0.75rem; letter-spacing: 0.1em; }

        /* ADVANCED STYLES */
        .advanced-section h4 { font-family: var(--font-display); font-size: 0.8rem; color: #a68966; margin: 0 0 0.5rem 0; letter-spacing: 0.1em; border-bottom: 1px solid rgba(166,137,102,0.2); padding-bottom: 0.5rem; }
        .hint { font-size: 0.75rem; color: rgba(255,255,255,0.4); margin-bottom: 1rem; }
        
        .checkbox-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 1rem; }
        .custom-cb { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; cursor: pointer; color: rgba(255,255,255,0.8); }
        .custom-cb input { display: none; }
        .cb-mark { width: 18px; height: 18px; border: 1px solid rgba(255,255,255,0.2); border-radius: 3px; display: inline-flex; position: relative; }
        .custom-cb input:checked + .cb-mark { background: #a68966; border-color: #a68966; }
        .custom-cb input:checked + .cb-mark::after { content: '✓'; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); color: #000; font-size: 12px; }

        .mt-4 { margin-top: 2rem; }
        .hidden { display: none; }

        .modal-footer { margin-top: auto; padding-top: 2rem; display: flex; justify-content: flex-end; }
        .action-btn-main { background: #a68966; color: #000; padding: 1.2rem 3rem; border: none; border-radius: 4px; font-family: var(--font-display); font-weight: 700; letter-spacing: 0.15em; font-size: 0.85rem; cursor: pointer; }
        
      `}</style>
    </div>
  );
}

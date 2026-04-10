'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Loader2, 
  X, 
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    label: '',
    category: 'mimarlik',
    coverImage: '',
    description: '',
    client: '',
    year: '',
    area: '',
    gallery: [] as string[]
  });

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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'coverImage' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, {
        method: 'POST',
        body: file
      });
      const blob = await res.json();
      
      if (field === 'coverImage') {
        setFormData({ ...formData, coverImage: blob.url });
      } else {
        setFormData({ ...formData, gallery: [...formData.gallery, blob.url] });
      }
    } catch (err) {
      alert("Yükleme başarısız.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu projeyi silmek istediğinize emin misiniz?')) return;
    
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
      category: 'mimarlik',
      coverImage: '',
      description: '',
      client: '',
      year: '',
      area: '',
      gallery: []
    });
    setEditingProject(null);
  };

  const openEditModal = (project: any) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      label: project.label,
      category: project.category,
      coverImage: project.coverImage,
      description: project.description,
      client: project.client || '',
      year: project.year || '',
      area: project.area || '',
      gallery: project.gallery || []
    });
    setIsModalOpen(true);
  };

  return (
    <div className="projects-admin-container">
      <div className="page-header">
        <div className="header-text">
          <p>PROJE YÖNETİMİ</p>
          <span>Portfolyonuzdaki tüm çalışmaları buradan yönetin.</span>
        </div>
        <button className="add-project-btn" onClick={() => { resetForm(); setIsModalOpen(true); }}>
          <Plus size={20} />
          <span>YENI PROJE EKLE</span>
        </button>
      </div>

      {isLoading ? (
        <div className="loader-wrap"><Loader2 className="animate-spin" /></div>
      ) : (
        <div className="projects-list-grid">
          {projects.map((project: any) => (
            <motion.div layout key={project._id} className="project-admin-card">
              <div className="card-img">
                {project.coverImage && <img src={project.coverImage} alt={project.title} />}
                <div className="card-overlay">
                   <button onClick={() => openEditModal(project)} className="action-icn"><Edit3 size={18} /></button>
                   <button onClick={() => handleDelete(project._id)} className="action-icn delete"><Trash2 size={18} /></button>
                </div>
              </div>
              <div className="card-info">
                <h4>{project.title}</h4>
                <span>{project.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="modal-content"
            >
              <div className="modal-header">
                <h3>{editingProject ? 'PROJEYİ DÜZENLE' : 'YENİ PROJE OLUŞTUR'}</h3>
                <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="modal-form">
                <div className="form-row">
                  <div className="input-group">
                    <label>Proje Başlığı</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <label>Etiket (Örn: Lüks Konut)</label>
                    <input type="text" value={formData.label} onChange={e => setFormData({...formData, label: e.target.value})} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="input-group">
                    <label>Kategori</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                      <option value="mimarlik">Mimarlık</option>
                      <option value="ic-mimarlik">İç Mimarlık</option>
                      <option value="uygulama">Uygulama</option>
                      <option value="peyzaj">Peyzaj</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Client / Müşteri</label>
                    <input type="text" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                  </div>
                </div>

                <div className="input-group">
                  <label>Açıklama</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} rows={3} />
                </div>

                <div className="image-upload-sections">
                  <div className="upload-box main-cover">
                    <label>KAPAK GÖRSELİ</label>
                    <div className="cover-preview" onClick={() => document.getElementById('cover-up')?.click()}>
                      {formData.coverImage ? <img src={formData.coverImage} alt="Cover" /> : <div className="upload-placeholder"><Upload size={24} /></div>}
                    </div>
                    <input id="cover-up" type="file" className="hidden" onChange={e => handleImageUpload(e, 'coverImage')} />
                  </div>

                  <div className="upload-box gallery-box">
                    <label>GALERİ GÖRSELLERİ</label>
                    <div className="gallery-previews">
                      {formData.gallery.map((url, i) => (
                        <div key={i} className="gallery-item">
                           {url && <img src={url} alt="Gallery" />}
                           <button type="button" onClick={() => setFormData({...formData, gallery: formData.gallery.filter((_, idx)=>idx!==i)})}><X size={12}/></button>
                        </div>
                      ))}
                      <button type="button" className="add-gallery-btn" onClick={() => document.getElementById('gal-up')?.click()}>
                        <Plus size={20} />
                      </button>
                    </div>
                    <input id="gal-up" type="file" className="hidden" onChange={e => handleImageUpload(e, 'gallery')} />
                  </div>
                </div>

                <div className="modal-footer">
                   <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>İPTAL</button>
                   <button type="submit" className="submit-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'KAYDEDİLİYOR...' : (editingProject ? 'GÜNCELLE' : 'YAYINLA')}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .projects-admin-container {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 2rem;
        }

        .header-text p {
          font-family: var(--font-display), sans-serif;
          font-size: 0.75rem;
          letter-spacing: 0.3em;
          color: #a68966;
          margin-bottom: 0.5rem;
        }

        .header-text span {
          font-size: 0.85rem;
          opacity: 0.4;
        }

        .add-project-btn {
          background: #a68966;
          color: #080808;
          border: none;
          padding: 1rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: var(--font-display), sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .add-project-btn:hover { background: #c2a785; transform: translateY(-2px); }

        .loader-wrap { height: 400px; display: flex; align-items: center; justify-content: center; color: #a68966; }

        .projects-list-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .project-admin-card {
          background: #141414;
          border-radius: 4px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: border-color 0.3s ease;
        }

        .project-admin-card:hover { border-color: rgba(166, 137, 102, 0.3); }

        .card-img {
          aspect-ratio: 16 / 10;
          position: relative;
          overflow: hidden;
        }

        .card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }

        .card-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .project-admin-card:hover .card-overlay { opacity: 1; }
        .project-admin-card:hover img { transform: scale(1.05); }

        .action-icn {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #fff;
          color: #000;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.3s ease;
        }

        .action-icn:hover { transform: scale(1.1); }
        .action-icn.delete:hover { background: #ff4d4d; color: #fff; }

        .card-info { padding: 1.5rem; }
        .card-info h4 { font-family: var(--font-display), sans-serif; font-size: 0.9rem; letter-spacing: 0.05em; margin-bottom: 0.5rem; }
        .card-info span { font-size: 0.7rem; text-transform: uppercase; opacity: 0.4; letter-spacing: 0.1em; }

        /* MODAL STYLES */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(10px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .modal-content {
          background: #121212;
          width: 100%;
          max-width: 800px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid rgba(166, 137, 102, 0.2);
          border-radius: 4px;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .modal-header h3 { font-family: var(--font-display), sans-serif; font-size: 1rem; letter-spacing: 0.2em; color: #a68966; }
        .modal-header button { background: none; border: none; color: #fff; opacity: 0.4; cursor: pointer; }

        .modal-form { padding: 2.5rem; display: flex; flex-direction: column; gap: 2rem; }

        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }

        .input-group label { display: block; font-size: 0.7rem; opacity: 0.5; margin-bottom: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; }
        .input-group input, .input-group select, .input-group textarea {
          width: 100%;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 1rem;
          color: #fff;
          font-family: inherit;
          border-radius: 2px;
        }

        .image-upload-sections { display: grid; grid-template-columns: 200px 1fr; gap: 3rem; }
        
        .cover-preview {
          width: 100%;
          aspect-ratio: 16 / 10;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          overflow: hidden;
        }

        .cover-preview img { width: 100%; height: 100%; object-fit: cover; }

        .gallery-previews { display: flex; flex-wrap: wrap; gap: 1rem; }
        .gallery-item { position: relative; width: 80px; height: 80px; border-radius: 4px; overflow: hidden; }
        .gallery-item img { width: 100%; height: 100%; object-fit: cover; }
        .gallery-item button { position: absolute; top: 2px; right: 2px; background: #ff4d4d; color: #fff; border: none; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        .add-gallery-btn { width: 80px; height: 80px; border: 1px dashed rgba(255, 255, 255, 0.1); background: transparent; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; opacity: 0.4; transition: opacity 0.3s; }
        .add-gallery-btn:hover { opacity: 1; }

        .modal-footer { display: flex; justify-content: flex-end; gap: 1.5rem; margin-top: 2rem; border-top: 1px solid rgba(255, 255, 255, 0.05); padding-top: 2.5rem; }
        
        .submit-btn {
          background: #a68966;
          color: #080808;
          border: none;
          padding: 1rem 3rem;
          font-family: var(--font-display), sans-serif;
          font-weight: 700;
          font-size: 0.75rem;
          letter-spacing: 0.15em;
          cursor: pointer;
        }

        .cancel-btn { background: transparent; border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 1rem 2rem; font-size: 0.7rem; cursor: pointer; letter-spacing: 0.1em; }

        .hidden { display: none; }
      `}</style>
    </div>
  );
}

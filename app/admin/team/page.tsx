'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, Upload, Save, X, Loader2, Users, Search, Filter } from 'lucide-react';

const TEAM_CATEGORIES = [
  { key: "mimarlik", title: "Mimarlık" },
  { key: "ic-mimarlik", title: "İç Mimarlık" },
  { key: "restorasyon", title: "Restorasyon Mimarlığı" },
  { key: "peyzaj", title: "Peyzaj Mimarlığı" },
  { key: "insaat-muhendisligi", title: "İnşaat Mühendisliği" },
  { key: "elektrik-elektronik-muhendisligi", title: "Elektrik ve Elektronik Mühendisliği" },
  { key: "plan-proje", title: "Plan ve Proje" },
  { key: "uygulama", title: "Uygulama Departmanı" },
  { key: "malzeme", title: "Malzeme Departmanı" },
];

export default function TeamManagementPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [filtering, setFiltering] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    category: 'mimarlik',
    image: '',
    order: 99,
    socials: { linkedin: '', instagram: '' }
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch('/api/admin/team');
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      role: '',
      category: 'mimarlik',
      image: '',
      order: 99,
      socials: { linkedin: '', instagram: '' }
    });
    setIsModalOpen(true);
  };

  const openEditModal = (member: any) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      category: member.category,
      image: member.image,
      order: member.order || 99,
      socials: member.socials || { linkedin: '', instagram: '' }
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingMember ? `/api/admin/team/${editingMember._id}` : '/api/admin/team';
      const method = editingMember ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        fetchMembers();
        setIsModalOpen(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu üyeyi silmek istediğinize emin misiniz?")) return;
    try {
      const res = await fetch(`/api/admin/team/${id}`, { method: 'DELETE' });
      if (res.ok) fetchMembers();
    } catch (e) {
      console.error(e);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const res = await fetch(`/api/upload?filename=${file.name}`, { method: 'POST', body: file });
      const blob = await res.json();
      setFormData(prev => ({ ...prev, image: blob.url }));
    } catch (err) {
      alert("Yükleme başarısız.");
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesFilter = filtering === 'all' || m.category === filtering;
    const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          m.role.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) return <div className="loader-wrap"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="team-manager">
      {/* HEADER */}
      <div className="manager-top">
        <div>
          <h2>EKİP YÖNETİMİ</h2>
          <p>Stüdyonun profesyonel ekibini, rollerini ve departmanlarını buradan yönetin.</p>
        </div>
        <button className="add-btn" onClick={openAddModal}>
          <Plus size={18} /> YENİ ÜYE EKLE
        </button>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="İsim veya rol ara..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="category-tabs">
          <button 
            className={`filter-btn ${filtering === 'all' ? 'active' : ''}`}
            onClick={() => setFiltering('all')}
          >
            HEPSİ
          </button>
          {TEAM_CATEGORIES.map(cat => (
            <button 
              key={cat.key}
              className={`filter-btn ${filtering === cat.key ? 'active' : ''}`}
              onClick={() => setFiltering(cat.key)}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* TEAM GRID */}
      <div className="team-grid">
        <AnimatePresence>
          {filteredMembers.map((member) => (
            <motion.div 
              key={member._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="member-card"
            >
              <div className="member-image">
                {member.image ? <img src={member.image} alt={member.name} /> : <div className="no-img"><Users size={32} /></div>}
                <div className="member-actions">
                  <button onClick={() => openEditModal(member)} className="action-btn edit"><Edit2 size={16}/></button>
                  <button onClick={() => handleDelete(member._id)} className="action-btn delete"><Trash2 size={16}/></button>
                </div>
              </div>
              <div className="member-info">
                <h3>{member.name}</h3>
                <span>{member.role}</span>
                <div className="cat-tag">{TEAM_CATEGORIES.find(c => c.key === member.category)?.title}</div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {filteredMembers.length === 0 && (
          <div className="empty-state">
             <Users size={40} />
             <p>Aradığınız kriterlerde üye bulunamadı.</p>
          </div>
        )}
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="modal-content admin-card"
            >
              <div className="modal-header">
                <h3>{editingMember ? 'ÜYEYİ DÜZENLE' : 'YENİ ÜYE EKLE'}</h3>
                <button className="close-btn" onClick={() => setIsModalOpen(false)}><X size={20}/></button>
              </div>

              <form onSubmit={handleSave} className="modal-form">
                <div className="form-row-split">
                  <div className="photo-upload-side">
                    <label>PROFİL FOTOĞRAFI</label>
                    <div className="upload-preview" onClick={() => document.getElementById('member-file')?.click()}>
                      {formData.image ? <img src={formData.image} alt="Preview" /> : <div className="upload-placeholder"><Upload size={24}/><p>Fotoğraf</p></div>}
                    </div>
                    <input id="member-file" type="file" className="hidden" onChange={handleImageUpload} />
                  </div>
                  
                  <div className="inputs-side">
                    <div className="form-group">
                      <label>AD SOYAD</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.name} 
                        onChange={e => setFormData({...formData, name: e.target.value})} 
                        placeholder="Örn: Alp Yılmaz"
                      />
                    </div>
                    <div className="form-group">
                      <label>ÜNVAN / ROL</label>
                      <input 
                        required 
                        type="text" 
                        value={formData.role} 
                        onChange={e => setFormData({...formData, role: e.target.value})} 
                        placeholder="Örn: Kurucu Mimar"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group">
                    <label>DEPARTMAN</label>
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                    >
                      {TEAM_CATEGORIES.map(cat => (
                        <option key={cat.key} value={cat.key}>{cat.title}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>SIRALAMA (ÖNCELİK)</label>
                    <input 
                      type="number" 
                      value={formData.order} 
                      onChange={e => setFormData({...formData, order: parseInt(e.target.value)})} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>LINKEDIN PROFIL (OPSİYONEL)</label>
                  <input 
                    type="url" 
                    value={formData.socials.linkedin} 
                    onChange={e => setFormData({...formData, socials: {...formData.socials, linkedin: e.target.value}})} 
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>

                <div className="modal-footer">
                   <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>İPTAL</button>
                   <button type="submit" className="submit-btn" disabled={isSaving}>
                      {isSaving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                      {isSaving ? 'KAYDEDİLİYOR...' : 'KAYDET'}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .team-manager { display: flex; flex-direction: column; gap: 2.5rem; }
        
        .manager-top { display: flex; justify-content: space-between; align-items: flex-end; }
        .manager-top h2 { font-family: var(--font-display); font-size: 1.5rem; letter-spacing: 0.1em; color: #fff; margin: 0 0 0.5rem 0; }
        .manager-top p { margin: 0; color: rgba(255,255,255,0.4); font-size: 0.85rem; }

        .add-btn { background: #a68966; color: #000; border: none; padding: 0.85rem 1.5rem; border-radius: 4px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; font-size: 0.75rem; letter-spacing: 0.05em; transition: all 0.3s; }
        .add-btn:hover { background: #c5a680; transform: translateY(-2px); }

        .filters-bar { display: flex; flex-direction: column; gap: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1.5rem; }
        .search-box { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 0.75rem 1.25rem; display: flex; align-items: center; gap: 1rem; color: rgba(255,255,255,0.3); max-width: 400px; }
        .search-box input { background: transparent; border: none; color: #fff; font-family: inherit; font-size: 0.9rem; flex: 1; }
        .search-box input:focus { outline: none; }

        .category-tabs { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .filter-btn { background: transparent; border: 1px solid rgba(255,255,255,0.05); color: rgba(255,255,255,0.4); padding: 0.5rem 1rem; border-radius: 40px; font-size: 0.65rem; font-weight: 600; cursor: pointer; transition: all 0.3s; }
        .filter-btn:hover { border-color: rgba(255,255,255,0.2); color: #fff; }
        .filter-btn.active { background: #a68966; color: #000; border-color: #a68966; }

        .team-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 2rem; }
        .member-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; overflow: hidden; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .member-card:hover { transform: translateY(-5px); border-color: rgba(166,137,102,0.3); }

        .member-image { height: 260px; position: relative; overflow: hidden; background: #000; }
        .member-image img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease; }
        .member-card:hover .member-image img { transform: scale(1.05); }
        .no-img { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: rgba(255,255,255,0.1); }

        .member-actions { position: absolute; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; gap: 1rem; opacity: 0; transition: opacity 0.3s; }
        .member-card:hover .member-actions { opacity: 1; }
        .action-btn { width: 40px; height: 40px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
        .action-btn.edit { background: #fff; color: #000; }
        .action-btn.delete { background: #ff4d4d; color: #fff; }
        .action-btn:hover { transform: scale(1.1); }

        .member-info { padding: 1.5rem; text-align: center; display: flex; flex-direction: column; gap: 0.5rem; }
        .member-info h3 { margin: 0; font-size: 1rem; color: #fff; letter-spacing: 0.05em; }
        .member-info span { font-size: 0.75rem; color: rgba(255,255,255,0.4); }
        .cat-tag { margin-top: 0.5rem; font-size: 0.6rem; color: #a68966; background: rgba(166,137,102,0.1); padding: 0.25rem 0.75rem; border-radius: 4px; display: inline-block; align-self: center; text-transform: uppercase; font-weight: 700; letter-spacing: 0.1em; }

        .empty-state { grid-column: 1 / -1; padding: 5rem; text-align: center; color: rgba(255,255,255,0.2); display: flex; flex-direction: column; align-items: center; gap: 1rem; }

        /* MODAL */
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.9); backdrop-filter: blur(5px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 2rem; }
        .modal-content { width: 100%; max-width: 650px; padding: 0; overflow: hidden; }
        .modal-header { padding: 1.5rem 2rem; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
        .modal-header h3 { margin: 0; font-size: 0.9rem; letter-spacing: 0.15em; color: #a68966; }
        .close-btn { background: transparent; border: none; color: rgba(255,255,255,0.3); cursor: pointer; }

        .modal-form { padding: 2rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .form-row-split { display: flex; gap: 2rem; }
        .photo-upload-side { width: 140px; display: flex; flex-direction: column; gap: 0.75rem; }
        .photo-upload-side label { font-size: 0.6rem; color: rgba(255,255,255,0.4); font-weight: 700; }
        .upload-preview { width: 140px; height: 160px; background: rgba(255,255,255,0.03); border: 1px dashed rgba(255,255,255,0.1); border-radius: 8px; cursor: pointer; overflow: hidden; display: flex; align-items: center; justify-content: center; }
        .upload-preview img { width: 100%; height: 100%; object-fit: cover; }
        .upload-placeholder { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; color: rgba(255,255,255,0.1); font-size: 0.7rem; }
        
        .inputs-side { flex: 1; display: flex; flex-direction: column; gap: 1.5rem; }
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        
        .form-group { display: flex; flex-direction: column; gap: 0.6rem; }
        .form-group label { font-size: 0.65rem; color: rgba(255,255,255,0.5); font-weight: 600; letter-spacing: 0.1em; }
        .form-group input, .form-group select { background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); padding: 0.85rem; color: #fff; border-radius: 4px; font-family: inherit; font-size: 0.85rem; }
        .form-group input:focus, .form-group select:focus { outline: none; border-color: #a68966; }

        .modal-footer { margin-top: 1rem; padding-top: 1.5rem; border-top: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: flex-end; gap: 1rem; }
        .cancel-btn { background: transparent; border: 1px solid rgba(255,255,255,0.1); color: #fff; padding: 0.75rem 1.5rem; border-radius: 4px; font-size: 0.75rem; cursor: pointer; transition: all 0.3s; }
        .cancel-btn:hover { background: rgba(255,255,255,0.05); }
        .submit-btn { background: #a68966; color: #000; border: none; padding: 0.75rem 2rem; border-radius: 4px; font-size: 0.75rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 0.75rem; transition: all 0.3s; }
        .submit-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(166,137,102,0.2); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .hidden { display: none; }
        .loader-wrap { height: 60vh; display: flex; align-items: center; justify-content: center; }
      `}</style>
    </div>
  );
}

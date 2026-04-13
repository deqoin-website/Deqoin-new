'use client';

import { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Edit3, 
  Shield, 
  UserCircle, 
  CheckCircle, 
  XCircle,
  MoreVertical,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    role: 'editor'
  });

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = '/api/admin/users';
    const method = editingUser ? 'PUT' : 'POST';
    const payload = editingUser ? { ...formData, userId: editingUser._id } : formData;

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        setEditingUser(null);
        setFormData({ username: '', password: '', name: '', role: 'editor' });
        fetchUsers();
      } else {
        const errData = await res.json();
        alert(errData.error || "İşlem başarısız");
      }
    } catch (err) {
      alert("Bir hata oluştu");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchUsers();
      } else {
        const err = await res.json();
        alert(err.error || "Silme işlemi başarısız");
      }
    } catch (err) {
      alert("Bir hata oluştu");
    }
  };

  const openEdit = (user: any) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '', // Don't show old password
      name: user.name,
      role: user.role
    });
    setIsModalOpen(true);
  };

  return (
    <div className="users-container">
      <div className="admin-page-header">
        <div className="header-copy">
          <h2>Kullanıcı Yönetimi</h2>
          <p>Sisteme erişimi olan yöneticileri ve yetkilerini yönetin.</p>
        </div>
        <button className="premium-btn primary" onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>
          <UserPlus size={18} />
          <span>YENİ KULLANICI EKLE</span>
        </button>
      </div>

      <div className="admin-card users-card">
        {isLoading ? (
          <div className="loading-state">Yükleniyor...</div>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Kullanıcı</th>
                  <th>Kullanıcı Adı</th>
                  <th>Rol / Yetki</th>
                  <th>Kayıt Tarihi</th>
                  <th>İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <div className="user-info-cell">
                        <div className="user-avatar-mini">{user.name.charAt(0)}</div>
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td><code className="username-tag">{user.username}</code></td>
                    <td>
                      <span className={`role-badge ${user.role}`}>
                        {user.role === 'admin' ? <Shield size={12} /> : <UserCircle size={12} />}
                        {user.role.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString('tr-TR')}</td>
                    <td>
                      <div className="table-actions">
                        <button onClick={() => openEdit(user)} className="action-btn edit" title="Düzenle">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDelete(user._id)} className="action-btn delete" title="Sil">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="admin-modal"
            >
              <div className="modal-header">
                <h3>{editingUser ? 'Kullanıcıyı Düzenle' : 'Yeni Kullanıcı'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="close-modal">×</button>
              </div>
              
              <form onSubmit={handleSubmit} className="admin-form">
                <div className="form-group">
                  <label>Tam İsim</label>
                  <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Kullanıcı Adı</label>
                  <input 
                    type="text" 
                    value={formData.username} 
                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                    required 
                  />
                </div>
                <div className="form-group">
                  <label>Şifre {editingUser && '(Değiştirmek istemiyorsanız boş bırakın)'}</label>
                  <input 
                    type="password" 
                    value={formData.password} 
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser} 
                  />
                </div>
                <div className="form-group">
                  <label>Yetki Rolü</label>
                  <select 
                    value={formData.role} 
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  >
                    <option value="editor">Editör (İçerik Yönetimi)</option>
                    <option value="admin">Admin (Tam Yetki)</option>
                  </select>
                </div>
                <div className="modal-footer">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">İptal</button>
                   <button type="submit" className="btn-primary">
                     {editingUser ? 'GÜNCELLE' : 'EKLE'}
                   </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .users-container { display: flex; flex-direction: column; gap: 2rem; }
        .admin-page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 1rem; }
        .header-copy h2 { font-family: var(--font-display), sans-serif; font-size: 1.75rem; font-weight: 300; letter-spacing: 0.1em; color: var(--accent); margin: 0; }
        .header-copy p { color: var(--text-muted); font-size: 0.9rem; margin: 0.5rem 0 0 0; }
        
        .users-card { padding: 0.5rem; overflow: hidden; background: var(--surface); border: 1px solid var(--line); box-shadow: var(--shadow); }
        .admin-table { width: 100%; border-collapse: collapse; text-align: left; }
        .admin-table th { padding: 1.5rem 2rem; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.2em; color: var(--accent); border-bottom: 1px solid var(--line); }
        .admin-table td { padding: 1.25rem 2rem; font-size: 0.85rem; border-bottom: 1px solid var(--line); vertical-align: middle; color: var(--text); }
        
        .user-info-cell { display: flex; align-items: center; gap: 1rem; }
        .user-avatar-mini { width: 32px; height: 32px; background: var(--accent); color: #000; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.75rem; }
        .username-tag { background: var(--surface-muted); padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; color: var(--accent); }
        
        .role-badge { padding: 4px 10px; border-radius: 99px; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; gap: 6px; width: fit-content; border: 1px solid transparent; }
        .role-badge.admin { background: rgba(166, 137, 102, 0.1); color: var(--accent); border-color: rgba(166, 137, 102, 0.2); }
        .role-badge.editor { background: var(--surface-muted); color: var(--text-soft); border-color: var(--line); }
        
        .table-actions { display: flex; gap: 0.5rem; }
        .action-btn { width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--line); background: transparent; color: var(--text-muted); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .action-btn:hover { color: var(--text); border-color: var(--accent); background: rgba(166, 137, 102, 0.1); }
        .action-btn.delete:hover { border-color: #ff4d4d; color: #ff4d4d; background: rgba(255, 77, 77, 0.1); }
        
        /* Modal Styles */
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 1000; }
        .admin-modal { background: var(--background); border: 1px solid var(--line); border-radius: 20px; width: 100%; max-width: 500px; padding: 2.5rem; box-shadow: var(--shadow); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .modal-header h3 { font-family: var(--font-display), sans-serif; font-size: 1.25rem; font-weight: 300; letter-spacing: 0.1em; color: var(--text); margin:0; }
        .close-modal { background: none; border: none; color: var(--text); font-size: 2rem; cursor: pointer; opacity: 0.5; }
        
        .admin-form { display: flex; flex-direction: column; gap: 1.5rem; }
        .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
        .form-group label { font-size: 0.7rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--accent); font-weight: 600; }
        .form-group input, .form-group select { background: var(--surface-muted); border: 1px solid var(--line); border-radius: 8px; padding: 0.75rem 1rem; color: var(--text); outline: none; transition: border-color 0.3s; }
        .form-group input:focus { border-color: var(--accent); }
        
        .modal-footer { display: flex; gap: 1rem; margin-top: 1rem; }
        .btn-primary { flex: 1; background: var(--accent); color: #000; border: none; padding: 1rem; border-radius: 8px; font-weight: 800; cursor: pointer; letter-spacing: 0.1em; }
        .btn-secondary { background: var(--surface-muted); color: var(--text); border: none; padding: 1rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
        
        .premium-btn { background: var(--accent); border: none; color: #000; padding: 0.75rem 1.5rem; border-radius: 8px; display: flex; align-items: center; gap: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.3s; }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(166, 137, 102, 0.3); }
      `}</style>
    </div>
  );
}

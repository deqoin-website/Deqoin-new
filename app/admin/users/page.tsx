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
                <div className="form-group-premium">
                  <label><UserCircle size={14} /> AD SOYAD</label>
                  <div className="input-with-icn">
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required 
                      placeholder="Tam isim girin"
                    />
                  </div>
                </div>

                <div className="form-group-premium">
                  <label><Users size={14} /> KULLANICI ADI</label>
                  <div className="input-with-icn">
                    <input 
                      type="text" 
                      value={formData.username} 
                      onChange={e => setFormData({ ...formData, username: e.target.value })}
                      required 
                      placeholder="Giriş adını belirleyin"
                    />
                  </div>
                </div>

                <div className="form-group-premium">
                  <label><Shield size={14} /> ŞİFRE</label>
                  <div className="input-with-icn">
                    <input 
                      type="password" 
                      value={formData.password} 
                      onChange={e => setFormData({ ...formData, password: e.target.value })}
                      required={!editingUser} 
                      placeholder={editingUser ? "Değiştirmek istemiyorsanız boş bırakın" : "Güçlü bir şifre girin"}
                    />
                  </div>
                  {editingUser && <p className="field-hint">Şifre güvenliği için düzenli güncelleme önerilir.</p>}
                </div>

                <div className="form-group-premium">
                  <label><Shield size={14} /> YETKİ SEVİYESİ</label>
                  <div className="select-wrapper">
                    <select 
                      value={formData.role} 
                      onChange={e => setFormData({ ...formData, role: e.target.value })}
                    >
                      <option value="editor">Editör (İçerik Yönetimi)</option>
                      <option value="admin">Admin (Tam Yetki)</option>
                    </select>
                  </div>
                  <div className="role-description">
                     {formData.role === 'admin' ? 
                       "Tam yetki: Kullanıcı ekleyebilir, silebilir ve tüm site ayarlarını değiştirebilir." : 
                       "Sınırlı yetki: Sadece içerik ve stüdyo verilerini düzenleyebilir."}
                  </div>
                </div>

                <div className="modal-footer-premium">
                   <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">İPTAL</button>
                   <button type="submit" className="btn-submit">
                     {editingUser ? <CheckCircle size={18} /> : <UserPlus size={18} />}
                     <span>{editingUser ? 'GÜNCELLE' : 'KULLANICIYI OLUŞTUR'}</span>
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
        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 1.5rem; }
        .admin-modal { background: var(--surface); border: 1px solid var(--line); border-radius: 16px; width: 100%; max-width: 550px; padding: 2.5rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2.5rem; }
        .modal-header h3 { font-family: var(--font-display), sans-serif; font-size: 1rem; font-weight: 700; letter-spacing: 0.15em; color: #a68966; margin:0; text-transform: uppercase; }
        .close-modal { background: var(--background); border: 1px solid var(--line); color: var(--text); border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; cursor: pointer; transition: all 0.3s; }
        .close-modal:hover { border-color: #ff4d4d; color: #ff4d4d; transform: rotate(90deg); }
        
        .admin-form { display: flex; flex-direction: column; gap: 1.75rem; }
        .form-group-premium { display: flex; flex-direction: column; gap: 0.75rem; }
        .form-group-premium label { font-size: 0.65rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--text-soft); font-weight: 800; display: flex; align-items: center; gap: 0.6rem; }
        
        .input-with-icn { position: relative; }
        .input-with-icn input, .select-wrapper select { width: 100%; background: var(--background); border: 1px solid var(--line); border-radius: 8px; padding: 1rem 1.25rem; color: var(--text); font-family: inherit; font-size: 0.9rem; transition: all 0.3s; }
        .input-with-icn input:focus, .select-wrapper select:focus { outline: none; border-color: #a68966; box-shadow: 0 0 0 4px rgba(166,137,102,0.1); }
        
        .field-hint { font-size: 0.7rem; color: var(--text-muted); margin-top: 0.4rem; font-style: italic; }
        
        .role-description { font-size: 0.75rem; color: var(--text-muted); background: var(--background); padding: 0.75rem 1rem; border-radius: 6px; border-left: 3px solid #a68966; line-height: 1.5; }
        
        .modal-footer-premium { display: flex; gap: 1.25rem; margin-top: 1rem; }
        .btn-submit { flex: 2; background: #a68966; color: #000; border: none; padding: 1.1rem; border-radius: 8px; font-weight: 900; cursor: pointer; letter-spacing: 0.1em; display: flex; align-items: center; justify-content: center; gap: 0.75rem; transition: all 0.3s; }
        .btn-submit:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(166,137,102,0.3); }
        .btn-cancel { flex: 1; background: transparent; color: var(--text-muted); border: 1px solid var(--line); padding: 1rem; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.3s; }
        .btn-cancel:hover { background: var(--line); color: var(--text); }
        
        .premium-btn { background: #fff; border: 1px solid var(--line); color: #000; padding: 0.75rem 1.75rem; border-radius: 8px; display: flex; align-items: center; gap: 0.75rem; font-weight: 800; cursor: pointer; transition: all 0.3s; letter-spacing: 0.05em; font-size: 0.75rem; }
        .premium-btn.primary { background: #a68966; color: #000; border-color: #a68966; }
        .premium-btn:hover { transform: translateY(-2px); box-shadow: 0 5px 15px rgba(166,137,102,0.3); }
      `}</style>
    </div>
  );
}

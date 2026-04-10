'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Settings, 
  Users, 
  FolderKanban, 
  LogOut,
  ChevronLeft,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSubmenu = (item: any) => {
    if (!isSidebarOpen) setIsSidebarOpen(true);
    setOpenSubmenus(prev => 
      prev.includes(item.name) ? prev.filter(n => n !== item.name) : [...prev, item.name]
    );
  };

  const menuGroups = [
    {
      group: 'GENEL',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      ]
    },
    {
      group: 'SAYFA İÇERİĞİ',
      items: [
        { name: 'Ana Sayfa', icon: ImageIcon, path: '/admin/content/home' },
        { name: 'Hakkımızda', icon: ImageIcon, path: '/admin/content/about' },
        { name: 'Galeri Sayfası', icon: ImageIcon, path: '/admin/content/gallery' },
        { 
          name: 'Hizmetler', 
          icon: ImageIcon, 
          path: '/admin/content/services',
          subItems: [
            { name: 'Mimari Stüdyo', path: '/admin/content/services/mimari' },
            { name: 'Materyal Stüdyo', path: '/admin/content/services/materyal' },
            { name: 'Uygulama Stüdyosu', path: '/admin/content/services/uygulama' },
          ]
        },
      ]
    },
    {
      group: 'YÖNETİM',
      items: [
        { name: 'Portfolyo', icon: FolderKanban, path: '/admin/projects' },
        { name: 'Ekip Üyeleri', icon: Users, path: '/admin/team' },
      ]
    },
    {
      group: 'YAPILANDIRMA',
      items: [
        { name: 'Site Ayarları', icon: Settings, path: '/admin/settings' },
      ]
    }
  ];

  const allItems = menuGroups.flatMap(g => g.items);
  const allSubItems = allItems.flatMap(i => i.subItems || []);
  const currentPathItem = allItems.find(item => item.path === pathname) || allSubItems.find(s => s.path === pathname);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
      }
    } catch (err) {
      console.error("Logout error:", err);
      // Fallback
      router.push('/admin/login');
    }
  };

  // Hide Sidebar on Login page
  if (pathname === '/admin/login') {
    return <div className="admin-layout">{children}</div>;
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <img src="/images/logo-new.jpeg" alt="DEQOIN" />
            {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>MASTER ADMIN</motion.span>}
          </div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="sidebar-toggle">
            {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuGroups.map((group) => (
            <div key={group.group} className="sidebar-group">
              {isSidebarOpen && <span className="group-label">{group.group}</span>}
              <div className="group-items">
                {group.items.map((item) => {
                  const hasSubItems = item.subItems && item.subItems.length > 0;
                  const isOpen = openSubmenus.includes(item.name);
                  const isActive = pathname === item.path || item.subItems?.some(s => s.path === pathname);

                  return (
                    <div key={item.name} className="nav-wrapper">
                      {hasSubItems ? (
                        <div 
                          className={`nav-item ${isActive ? 'active' : ''}`}
                          onClick={() => toggleSubmenu(item)}
                          style={{ cursor: 'pointer' }}
                        >
                          <item.icon size={20} className="nav-icon" />
                          {isSidebarOpen && (
                            <>
                              <span>{item.name}</span>
                              <ChevronLeft 
                                size={14} 
                                style={{ 
                                  marginLeft: 'auto', 
                                  transform: isOpen ? 'rotate(-90deg)' : 'none',
                                  transition: 'transform 0.3s ease',
                                  opacity: 0.5
                                }} 
                              />
                            </>
                          )}
                        </div>
                      ) : (
                        <Link 
                          href={item.path}
                          className={`nav-item ${pathname === item.path ? 'active' : ''}`}
                        >
                          <item.icon size={20} className="nav-icon" />
                          {isSidebarOpen && <span>{item.name}</span>}
                          {pathname === item.path && <motion.div layoutId="nav-active" className="nav-active-indicator" />}
                        </Link>
                      )}

                      {/* SUB ITEMS */}
                      <AnimatePresence>
                        {hasSubItems && isOpen && isSidebarOpen && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="sub-items-container"
                          >
                            {item.subItems?.map(sub => (
                              <Link 
                                key={sub.path} 
                                href={sub.path}
                                className={`sub-nav-item ${pathname === sub.path ? 'active' : ''}`}
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-item logout-btn">
            <LogOut size={20} />
            {isSidebarOpen && <span>Çıkış Yap</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-top-bar">
          <div className="page-info">
            <h1>{allItems.find(item => item.path === pathname)?.name || 'Dashboard'}</h1>
          </div>
          <div className="user-profile">
            <span>Admin</span>
            <div className="avatar">A</div>
          </div>
        </header>
        
        <div className="admin-content-inner">
          {children}
        </div>
      </main>
    </div>
  );
}

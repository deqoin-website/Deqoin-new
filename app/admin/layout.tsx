'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Settings, 
  FolderKanban, 
  LogOut,
  ChevronLeft,
  Menu,
  Briefcase,
  Users,
  MessageSquare,
  Aperture
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
      group: 'OVERVIEW',
      items: [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
        { name: 'Randevu & CRM', icon: MessageSquare, path: '/admin/crm' }
      ]
    },
    {
      group: 'DEPARTMANLAR & STÜDYO',
      items: [
        { name: 'Tüm Projeler (Havuz)', icon: FolderKanban, path: '/admin/projects' },
        { 
          name: 'Stüdyo Yönetimi', 
          icon: Aperture, 
          path: '/admin/studios',
          subItems: [
            { name: 'Mimari Stüdyo', path: '/admin/studios/design' },
            { name: 'Materyal Stüdyo', path: '/admin/studios/material' },
            { name: 'Uygulama Birimi', path: '/admin/studios/execution' },
          ]
        },
      ]
    },
    {
      group: 'SAYFA YÖNETİMİ',
      items: [
        { name: 'Sinematik Slider', icon: ImageIcon, path: '/admin/content/slider' },
        { name: 'İş Akışı & Kurumsal', icon: Briefcase, path: '/admin/content/workflow' },
        { name: 'Ekip Üyeleri', icon: Users, path: '/admin/team' },
      ]
    },
    {
      group: 'SİSTEM',
      items: [
        { name: 'Genel Ayarlar', icon: Settings, path: '/admin/settings' },
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
      router.push('/admin/login');
    }
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="admin-logo">
            <img src="/images/logo-new.jpeg" alt="DEQOIN" />
            {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>STUDIO ADMIN</motion.span>}
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
                                  transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
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
            <LogOut size={20} className="nav-icon" />
            {isSidebarOpen && <span>Sistemi Kapat</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main">
        <header className="admin-top-bar">
          <div className="page-info">
            <span className="page-breadcrumb">Yönetim Paneli / {currentPathItem?.name || 'Dashboard'}</span>
            <h1>{currentPathItem?.name || 'Dashboard'}</h1>
          </div>
          <div className="user-profile">
            <span>SİSTEM YÖNETİCİSİ</span>
            <div className="avatar">DQ</div>
          </div>
        </header>
        
        <div className="admin-content-inner">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

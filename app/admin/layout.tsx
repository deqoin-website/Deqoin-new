'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
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
  Aperture,
  Workflow,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '@/components/ThemeToggle';
import { AdminNotificationProvider } from '@/components/admin/AdminNotificationProvider';
import './admin.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const pathname = usePathname();
  const searchParams = useSearchParams();
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
          name: 'Mimari Stüdyo', 
          icon: Aperture, 
          path: '/admin/studios-mimari', // Not a real router, just for active state
          subItems: [
            { name: 'Genel Sayfa Ayarları', path: '/admin/content/services/mimari' },
            { name: 'Mimarlık', path: '/admin/studios/mimarlik' },
            { name: 'İç Mimarlık', path: '/admin/studios/ic-mimarlik' },
            { name: 'Restorasyon', path: '/admin/studios/restorasyon' },
            { name: 'Peyzaj', path: '/admin/studios/peyzaj-mimarligi' },
            { name: 'Mühendislik', path: '/admin/studios/insaat-muhendisligi' },
            { name: 'Mekanik', path: '/admin/studios/elektrik-elektronik-muhendisligi' },
          ]
        },
        { 
          name: 'Materyal Stüdyo', 
          icon: Aperture, 
          path: '/admin/studios-materyal',
          subItems: [
            { name: 'Genel Sayfa Ayarları', path: '/admin/content/services/material' },
            { name: 'Mobilya', path: '/admin/studios/mobilya' },
            { name: 'Aydınlatma', path: '/admin/studios/aydinlatma' },
            { name: 'İtalyan Sıvalar', path: '/admin/studios/italyan-sivalar' },
            { name: 'Sanatsal Çalışmalar', path: '/admin/studios/sanatsal-calismalar' },
            { name: 'Tuğla ve Taş', path: '/admin/studios/tugla-ve-tas' },
          ]
        },
        { 
          name: 'Uygulama Birimi', 
          icon: Aperture, 
          path: '/admin/studios-uygulama',
          subItems: [
            { name: 'Genel Sayfa Ayarları', path: '/admin/content/services/execution' },
            { name: 'İnşaat', path: '/admin/studios/insaat-ekipleri' },
            { name: 'Sıva & Alçı', path: '/admin/studios/siva-ve-alci-ekipleri' },
            { name: 'Boya', path: '/admin/studios/boya-ekipleri' },
            { name: 'Duvar', path: '/admin/studios/duvar-sanatcilari' },
            { name: 'Resim', path: '/admin/studios/ressamlar' },
            { name: 'Heykel', path: '/admin/studios/heykeltiraslar' },
          ]
        },
      ]
    },
    {
      group: 'SAYFA YÖNETİMİ',
      items: [
        { name: 'Sinematik Medya & Slider', icon: ImageIcon, path: '/admin/content/slider' },
        { name: 'Ana Sayfa Slider Hero', icon: ImageIcon, path: '/admin/content/home/gallery' },
        { name: 'Hizmet Kartları (Ana Sayfa)', icon: Aperture, path: '/admin/content/home/services' },
        { name: 'Hakkımızda', icon: Briefcase, path: '/admin/content/corporate' },
        { name: 'Ekip Üyeleri', icon: Users, path: '/admin/team' },
      ]
    },
    {
      group: 'İŞ AKIŞLARI',
      items: [
        {
          name: 'Workflow Yönetimi',
          icon: Workflow,
          path: '/admin/content/workflow',
          subItems: [
            { name: 'Keşif Genel Akış', path: '/admin/content/workflow?scope=page:kesif' },
            { name: 'Mimari Genel Akış', path: '/admin/content/workflow?scope=page:mimari' },
            { name: 'Materyal Genel Akış', path: '/admin/content/workflow?scope=page:material' },
            { name: 'Uygulama Genel Akış', path: '/admin/content/workflow?scope=page:execution' },
          ],
        },
      ],
    },
    {
      group: 'SİSTEM',
      items: [
        { name: 'Kullanıcı Yönetimi', icon: Users, path: '/admin/users' },
        { name: 'Genel Ayarlar', icon: Settings, path: '/admin/settings' },
      ]
    }
  ];

  const allItems = menuGroups.flatMap(g => g.items);
  const allSubItems = allItems.flatMap(i => i.subItems || []);
  const currentPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;
  const currentPathItem = allItems.find(item => item.path === currentPath || item.path === pathname) || allSubItems.find(s => s.path === currentPath || s.path === pathname);

  useEffect(() => {
    if (pathname.startsWith('/admin/content/workflow')) {
      setOpenSubmenus((prev) => (prev.includes('Workflow Yönetimi') ? prev : [...prev, 'Workflow Yönetimi']));
    }
  }, [pathname]);

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
    <AdminNotificationProvider>
      <div className="admin-layout">
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${isSidebarOpen ? 'open' : 'closed'} ${isMobileMenuOpen ? 'mobile-show' : ''}`}>
          <div className="sidebar-header">
            <div className="admin-logo">
              <Image src="/images/logo-new.jpeg" alt="DEQOIN" width={36} height={36} />
              {isSidebarOpen && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>STUDIO ADMIN</motion.span>}
            </div>
            <button onClick={() => {
              if (window.innerWidth <= 900) {
                  setIsMobileMenuOpen(false);
              } else {
                  setIsSidebarOpen(!isSidebarOpen);
              }
            }} className="sidebar-toggle">
              {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="sidebar-nav">
            {menuGroups.map((group) => (
              <div key={group.group} className="sidebar-group">
                {(isSidebarOpen || window.innerWidth <= 900) && <span className="group-label">{group.group}</span>}
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
                            {(isSidebarOpen || window.innerWidth <= 900) && (
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
                            onClick={() => {
                              if (window.innerWidth <= 900) setIsMobileMenuOpen(false);
                            }}
                          >
                            <item.icon size={20} className="nav-icon" />
                            {(isSidebarOpen || window.innerWidth <= 900) && <span>{item.name}</span>}
                            {pathname === item.path && (isSidebarOpen || window.innerWidth <= 900) && <motion.div layoutId="nav-active" className="nav-active-indicator" />}
                          </Link>
                        )}

                        {/* SUB ITEMS */}
                        <AnimatePresence>
                          {hasSubItems && isOpen && (isSidebarOpen || window.innerWidth <= 900) && (
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
                                  onClick={() => {
                                    if (window.innerWidth <= 900) setIsMobileMenuOpen(false);
                                  }}
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
              {(isSidebarOpen || window.innerWidth <= 900) && <span>Sistemi Kapat</span>}
            </button>
          </div>
        </aside>

        {/* OVERLAY FOR MOBILE */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="mobile-sidebar-overlay"
            />
          )}
        </AnimatePresence>

        {/* MAIN CONTENT */}
        <main className="admin-main">
          <header className="admin-top-bar">
            <div className="top-bar-left">
              <button className="mobile-menu-toggle" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} />
              </button>
              <div className="page-info">
                <span className="page-breadcrumb">Yönetim Paneli / {currentPathItem?.name || 'Dashboard'}</span>
                <h1>{currentPathItem?.name || 'Dashboard'}</h1>
              </div>
            </div>
            <div className="top-bar-actions">
              <ThemeToggle />
              <div className="user-profile">
                <span className="user-name-desktop">SİSTEM YÖNETİCİSİ</span>
                <div className="avatar">DQ</div>
              </div>
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
    </AdminNotificationProvider>
  );
}

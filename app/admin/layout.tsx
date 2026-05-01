'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Aperture,
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  FileText,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  Workflow,
  Briefcase,
} from 'lucide-react';

import ThemeToggle from '@/components/ThemeToggle';
import { AdminNotificationProvider } from '@/components/admin/AdminNotificationProvider';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { mimariServices } from '@/data/mimari-hizmetler';
import { materyalKategorileri } from '@/data/materyal-studyo';
import { uygulamaBirimleri } from '@/data/uygulama-birimleri';

import './admin.css';

type SubItem = {
  name: string;
  path: string;
};

type MenuItem = {
  name: string;
  icon: typeof LayoutDashboard;
  path: string;
  hint?: string;
  subItems?: SubItem[];
};

type MenuGroup = {
  group: string;
  description: string;
  items: MenuItem[];
};

const createStudioSubItems = (
  settingsPath: string,
  detailPathBase: string,
  items: Array<{ slug: string; title: string }>,
) => [
  { name: 'Genel Ayarlar', path: settingsPath },
  ...items.map((item) => ({
    name: item.title,
    path: `${detailPathBase}/${item.slug}`,
  })),
];

const menuGroups: MenuGroup[] = [
  {
    group: 'Özet',
    description: 'Hızlı erişim ve operasyon',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin', hint: 'Genel sistem özeti' },
      { name: 'Randevu & CRM', icon: MessageSquare, path: '/admin/crm', hint: 'Yeni talepler ve durumlar' },
    ],
  },
  {
    group: 'İçerik',
    description: 'Sayfa ve medya yönetimi',
    items: [
      { name: 'Tüm Projeler', icon: FolderKanban, path: '/admin/projects', hint: 'Proje havuzu ve düzenleme' },
      { name: 'Slider', icon: ImageIcon, path: '/admin/content/slider', hint: 'Ana vitrin sahneleri' },
      { name: 'Ana Sayfa Medya', icon: ImageIcon, path: '/admin/content/home/gallery', hint: 'Hero ve galeri akışı' },
      { name: 'Servis Kartları', icon: Aperture, path: '/admin/content/home/services', hint: 'Ana sayfa hizmet blokları' },
      { name: 'Galeri', icon: FolderKanban, path: '/admin/content/gallery', hint: 'Galeri sayfası ve modal' },
      { name: 'Journal', icon: FileText, path: '/admin/content/journal', hint: 'Editoryal içerikler' },
      { name: 'Hakkımızda', icon: Briefcase, path: '/admin/content/corporate', hint: 'Kurumsal sayfalar' },
      { name: 'Ekip', icon: Users, path: '/admin/team', hint: 'Yönetim kadrosu' },
    ],
  },
  {
    group: 'Akışlar',
    description: 'Departman ve workflow',
    items: [
      {
        name: 'Workflow',
        icon: Workflow,
        path: '/admin/content/workflow',
        hint: 'Akış ve senaryo yönetimi',
        subItems: [
          { name: 'Keşif', path: '/admin/content/workflow?scope=page:kesif' },
          { name: 'Mimari', path: '/admin/content/workflow?scope=page:mimari' },
          { name: 'Materyal', path: '/admin/content/workflow?scope=page:material' },
          { name: 'Uygulama', path: '/admin/content/workflow?scope=page:execution' },
        ],
      },
      {
        name: 'Mimari Stüdyo',
        icon: Aperture,
        path: '/admin/content/services/mimari',
        hint: 'Mimarlık servis katmanı',
        subItems: createStudioSubItems('/admin/content/services/mimari', '/admin/studios', mimariServices),
      },
      {
        name: 'Materyal Stüdyo',
        icon: Aperture,
        path: '/admin/content/services/material',
        hint: 'Materyal katalogları',
        subItems: createStudioSubItems('/admin/content/services/material', '/admin/studios', materyalKategorileri),
      },
      {
        name: 'Uygulama Stüdyo',
        icon: Aperture,
        path: '/admin/content/services/execution',
        hint: 'Uygulama akışları',
        subItems: createStudioSubItems('/admin/content/services/execution', '/admin/studios', uygulamaBirimleri),
      },
    ],
  },
  {
    group: 'Sistem',
    description: 'Kullanıcı ve ayar yönetimi',
    items: [
      { name: 'Kullanıcılar', icon: Users, path: '/admin/users', hint: 'Rol ve erişim yönetimi' },
      { name: 'Ayarlar', icon: Settings, path: '/admin/settings', hint: 'SEO ve sistem ayarları' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPath = searchParams.toString() ? `${pathname}?${searchParams.toString()}` : pathname;

  useEffect(() => {
    const updateMode = () => setIsMobile(window.innerWidth < 1024);
    updateMode();
    window.addEventListener('resize', updateMode);
    return () => window.removeEventListener('resize', updateMode);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setIsSidebarCollapsed(false);
    } else {
      setIsMobileOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (pathname.startsWith('/admin/content/workflow')) {
      setOpenSubmenus((current) => (current.includes('Workflow') ? current : [...current, 'Workflow']));
    }
  }, [pathname]);

  useEffect(() => {
    const matchedSubmenus = menuGroups
      .flatMap((group) =>
        group.items.filter((item) =>
          item.subItems?.some((sub) => sub.path === pathname || sub.path === currentPath),
        ),
      )
      .map((item) => item.name);

    if (matchedSubmenus.length === 0) {
      return;
    }

    setOpenSubmenus((current) => {
      const next = new Set(current);
      matchedSubmenus.forEach((name) => next.add(name));
      return Array.from(next);
    });
  }, [currentPath, pathname]);

  const flatItems = useMemo(() => menuGroups.flatMap((group) => group.items), []);
  const allSubItems = useMemo(() => flatItems.flatMap((item) => item.subItems || []), [flatItems]);
  const activeItem =
    flatItems.find((item) => item.path === pathname || item.path === currentPath) ||
    allSubItems.find((item) => item.path === pathname || item.path === currentPath);

  const activeGroup = menuGroups.find((group) =>
    group.items.some((item) => item.path === pathname || item.path === currentPath || item.subItems?.some((sub) => sub.path === pathname || sub.path === currentPath)),
  );

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        router.push('/admin/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      router.push('/admin/login');
    }
  };

  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AdminNotificationProvider>
      <div className="admin-shell">
        <AnimatePresence>
          {isMobile && isMobileOpen && (
            <motion.button
              type="button"
              className="admin-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              aria-label="Menüyü kapat"
            />
          )}
        </AnimatePresence>

        <aside
          className={`admin-sidebar ${isSidebarCollapsed && !isMobile ? 'is-collapsed' : ''} ${isMobile && isMobileOpen ? 'is-mobile-open' : ''}`}
        >
          <div className="admin-sidebar__header">
            <Link href="/admin" className="admin-brand" onClick={() => setIsMobileOpen(false)}>
              <Image src="/images/logo-new.jpeg" alt="DEQOIN" width={40} height={40} className="admin-brand__logo" />
              <span className="admin-brand__copy">
                <strong>DEQOIN</strong>
                <small>Studio Admin</small>
              </span>
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="admin-sidebar__toggle"
              onClick={() => {
                if (isMobile) {
                  setIsMobileOpen(false);
                } else {
                  setIsSidebarCollapsed((current) => !current);
                }
              }}
              aria-label={isMobile ? 'Menüyü kapat' : 'Menüyü daralt'}
            >
              {isMobile ? <ChevronLeft className="h-4 w-4" /> : isSidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>
          </div>

          <div className="admin-sidebar__meta">
            <div className="admin-sidebar__meta-copy">
              <p>{activeGroup?.group || 'Özet'}</p>
              <span>{activeItem?.hint || 'Hızlı erişim ve kontrol'}</span>
            </div>
          </div>

          <nav className="admin-nav">
            {menuGroups.map((group) => {
              const groupOpen = openSubmenus.includes(group.group);
              return (
                <section key={group.group} className="admin-nav__group">
                  <button
                    type="button"
                    className="admin-nav__group-header"
                    onClick={() => {
                      if (group.items.some((item) => item.subItems?.length)) {
                        setOpenSubmenus((current) =>
                          current.includes(group.group)
                            ? current.filter((item) => item !== group.group)
                            : [...current, group.group],
                        );
                      }
                    }}
                  >
                    <span className="admin-nav__group-copy">
                      <strong>{group.group}</strong>
                      <small>{group.description}</small>
                    </span>
                    <ChevronDown className={`h-4 w-4 transition-transform ${groupOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <div className="admin-nav__items">
                    {group.items.map((item) => {
                      const hasSubItems = Boolean(item.subItems?.length);
                      const isOpen = openSubmenus.includes(item.name);
                      const isActive =
                        pathname === item.path ||
                        currentPath === item.path ||
                        item.subItems?.some((sub) => sub.path === pathname || sub.path === currentPath);

                      return (
                        <div key={item.name} className="admin-nav__item-wrap">
                          {hasSubItems ? (
                            <button
                              type="button"
                              className={`admin-nav__item ${isActive ? 'is-active' : ''}`}
                              onClick={() => {
                                if (isMobile) {
                                  setIsMobileOpen(true);
                                } else {
                                  setIsSidebarCollapsed(false);
                                }

                                setOpenSubmenus((current) =>
                                  current.includes(item.name)
                                    ? current.filter((entry) => entry !== item.name)
                                    : [...current, item.name],
                                );
                              }}
                            >
                              <item.icon className="admin-nav__icon" />
                              {!isSidebarCollapsed && <span className="admin-nav__label">{item.name}</span>}
                              {!isSidebarCollapsed && <ChevronDown className={`admin-nav__chevron ${isOpen ? 'is-open' : ''}`} />}
                            </button>
                          ) : (
                            <Link
                              href={item.path}
                              className={`admin-nav__item ${isActive ? 'is-active' : ''}`}
                              onClick={() => setIsMobileOpen(false)}
                            >
                              <item.icon className="admin-nav__icon" />
                              {!isSidebarCollapsed && <span className="admin-nav__label">{item.name}</span>}
                              {!isSidebarCollapsed && isActive && <ArrowUpRight className="admin-nav__chevron" />}
                            </Link>
                          )}

                          <AnimatePresence>
                            {hasSubItems && isOpen && !isSidebarCollapsed && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="admin-nav__subitems"
                              >
                                {item.subItems?.map((sub) => (
                                  <Link
                                    key={sub.path}
                                    href={sub.path}
                                    className={`admin-nav__subitem ${pathname === sub.path || currentPath === sub.path ? 'is-active' : ''}`}
                                    onClick={() => setIsMobileOpen(false)}
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
                </section>
              );
            })}
          </nav>

          <div className="admin-sidebar__footer">
            <div className="admin-sidebar__footer-copy">
              <span>Sistem yöneticisi</span>
              <small>{activeItem?.name || 'Dashboard'}</small>
            </div>
            <Button
              type="button"
              variant="outline"
              className="admin-sidebar__logout"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {!isSidebarCollapsed && 'Sistemi Kapat'}
            </Button>
          </div>
        </aside>

        <main className="admin-main">
          <header className="admin-topbar">
            <div className="admin-topbar__left">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="admin-mobile-trigger"
                onClick={() => setIsMobileOpen(true)}
                aria-label="Menüyü aç"
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="admin-page-meta">
                <div className="admin-page-meta__breadcrumb">
                  <span>Yönetim Paneli</span>
                  <Separator orientation="vertical" className="hidden h-4 w-px sm:block" />
                  <span>{activeGroup?.group || 'Özet'}</span>
                </div>
                <h1>{activeItem?.name || 'Dashboard'}</h1>
                <p>{activeItem?.hint || 'Kritik veriler, içerik ve sistem ayarları'}</p>
              </div>
            </div>

            <div className="admin-topbar__actions">
              <Button
                asChild
                variant="outline"
                className="admin-topbar__action-link"
              >
                <Link href="/admin/crm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  CRM
                </Link>
              </Button>

              <ThemeToggle />
            </div>
          </header>

          <div className="admin-content">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPath}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
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

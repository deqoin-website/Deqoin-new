'use client';

import { useEffect, useMemo, useState, type ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Aperture,
  ChevronLeft,
  ChevronRight,
  FolderKanban,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  Briefcase,
  Users,
} from 'lucide-react';

import ThemeToggle from '@/components/ThemeToggle';
import { AdminNotificationProvider } from '@/components/admin/AdminNotificationProvider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import './admin.css';

type MenuItem = {
  name: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  path: string;
  subItems?: { name: string; path: string }[];
};

type MenuGroup = {
  group: string;
  items: MenuItem[];
};

const menuGroups: MenuGroup[] = [
  {
    group: 'OVERVIEW',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
      { name: 'Randevu & CRM', icon: MessageSquare, path: '/admin/crm' },
    ],
  },
  {
    group: 'DEPARTMANLAR & STÜDYO',
    items: [
      { name: 'Tüm Projeler (Havuz)', icon: FolderKanban, path: '/admin/projects' },
      {
        name: 'Mimari Stüdyo',
        icon: Aperture,
        path: '/admin/studios-mimari',
        subItems: [
          { name: 'Genel Sayfa Ayarları', path: '/admin/content/services/mimari' },
          { name: 'Mimarlık', path: '/admin/studios/mimarlik' },
          { name: 'İç Mimarlık', path: '/admin/studios/ic-mimarlik' },
          { name: 'Restorasyon', path: '/admin/studios/restorasyon' },
          { name: 'Peyzaj', path: '/admin/studios/peyzaj-mimarligi' },
          { name: 'Mühendislik', path: '/admin/studios/insaat-muhendisligi' },
          { name: 'Mekanik', path: '/admin/studios/elektrik-elektronik-muhendisligi' },
        ],
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
        ],
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
        ],
      },
    ],
  },
  {
    group: 'SAYFA YÖNETİMİ',
    items: [
      { name: 'Sinematik Medya & Slider', icon: ImageIcon, path: '/admin/content/slider' },
      { name: 'Ana Sayfa Slider Hero', icon: ImageIcon, path: '/admin/content/home/gallery' },
      { name: 'Hizmet Kartları (Ana Sayfa)', icon: Aperture, path: '/admin/content/home/services' },
      { name: 'Kurumsal Felsefe', icon: Briefcase, path: '/admin/content/corporate' },
      { name: 'Ekip Üyeleri', icon: Users, path: '/admin/team' },
    ],
  },
  {
    group: 'SİSTEM',
    items: [
      { name: 'Kullanıcı Yönetimi', icon: Users, path: '/admin/users' },
      { name: 'Genel Ayarlar', icon: Settings, path: '/admin/settings' },
    ],
  },
];

const navLinkClass =
  'flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const savedSidebarState = window.localStorage.getItem('deqoin_admin_sidebar');
    if (savedSidebarState === 'collapsed') {
      setIsSidebarCollapsed(true);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      'deqoin_admin_sidebar',
      isSidebarCollapsed ? 'collapsed' : 'expanded',
    );
  }, [isSidebarCollapsed]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const activeEntry = useMemo(() => {
    for (const group of menuGroups) {
      for (const item of group.items) {
        if (item.path === pathname) {
          return { group: group.group, item };
        }
        const subItem = item.subItems?.find((candidate) => candidate.path === pathname);
        if (subItem) {
          return { group: group.group, item, subItem };
        }
      }
    }
    return null;
  }, [pathname]);

  const visibleLabels = !isSidebarCollapsed;

  const toggleSubmenu = (item: MenuItem) => {
    if (isSidebarCollapsed) {
      setIsSidebarCollapsed(false);
    }

    setOpenSubmenus((prev) =>
      prev.includes(item.name) ? prev.filter((name) => name !== item.name) : [...prev, item.name],
    );
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/admin/logout', { method: 'POST' });
      if (response.ok) {
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
      <div className="admin-shell min-h-dvh bg-[color:var(--background)] text-[color:var(--text)]">
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/55 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Menüyü kapat"
            />
          )}
        </AnimatePresence>

        <aside
          className={[
            'fixed inset-y-0 left-0 z-40 flex h-dvh w-[300px] flex-col border-r border-[color:var(--line)] bg-[color:var(--surface)] shadow-[0_20px_60px_rgba(0,0,0,0.14)] transition-transform duration-300 md:static md:translate-x-0 md:h-dvh md:flex-shrink-0',
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
            isSidebarCollapsed ? 'md:w-[92px]' : 'md:w-[300px]',
          ].join(' ')}
        >
          <div className="flex items-center justify-between gap-3 border-b border-[color:var(--line)] px-4 py-4">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-muted)] shadow-sm">
                <Image
                  src="/images/logo-new.jpeg"
                  alt="DEQOIN"
                  width={28}
                  height={28}
                  className="h-7 w-7 rounded-md object-cover"
                />
              </div>
              <div className={visibleLabels ? 'block min-w-0' : 'hidden'}>
                <p className="text-[0.65rem] uppercase tracking-[0.34em] text-[color:var(--accent)]">
                  Studio Admin
                </p>
                <p className="truncate text-sm font-semibold text-[color:var(--text)]">
                  Deqoin Yönetim
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-10 w-10 rounded-full text-[color:var(--text-muted)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)] md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="hidden h-10 w-10 rounded-full text-[color:var(--text-muted)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)] md:flex"
                onClick={() => setIsSidebarCollapsed((value) => !value)}
                aria-label="Sidebar genişliğini değiştir"
              >
                <ChevronLeft
                  className={[
                    'h-4 w-4 transition-transform',
                    isSidebarCollapsed ? 'rotate-180' : '',
                  ].join(' ')}
                />
              </Button>
            </div>
          </div>

          <div className="px-3 pt-4">
            <div className="space-y-2 rounded-[1.5rem] border border-[color:var(--line)] bg-[color:var(--surface-muted)] p-3">
              {menuGroups[0].items.map((item) => {
                const isActive = pathname === item.path;

                return (
                  <Button
                    key={item.name}
                    asChild
                    variant="ghost"
                    className={[
                      navLinkClass,
                      'justify-start text-[color:var(--text-muted)] hover:bg-[color:var(--surface)] hover:text-[color:var(--text)]',
                      isActive ? 'bg-[color:var(--surface)] text-[color:var(--text)]' : '',
                    ].join(' ')}
                  >
                    <Link href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                      <item.icon size={18} className="shrink-0" />
                      {visibleLabels && (
                        <>
                          <span className="truncate">{item.name}</span>
                          {isActive && (
                            <Badge
                              variant="outline"
                              className="ml-auto border-[color:var(--line)] bg-[color:var(--surface)] text-[0.58rem] uppercase tracking-[0.28em] text-[color:var(--accent)]"
                            >
                              Ana
                            </Badge>
                          )}
                        </>
                      )}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-3">
            <div className="space-y-4">
              {menuGroups.slice(1).map((group) => (
                <div key={group.group} className="space-y-2">
                  {visibleLabels && (
                    <p className="px-3 text-[0.62rem] font-semibold uppercase tracking-[0.34em] text-[color:var(--text-muted)]">
                      {group.group}
                    </p>
                  )}

                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const hasSubItems = Boolean(item.subItems?.length);
                      const isOpen = openSubmenus.includes(item.name);
                      const isActive =
                        pathname === item.path || item.subItems?.some((subItem) => subItem.path === pathname);

                      if (hasSubItems) {
                        return (
                          <div key={item.name} className="space-y-1">
                            <Button
                              type="button"
                              variant="ghost"
                              className={[
                                navLinkClass,
                                'justify-start text-[color:var(--text-muted)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)]',
                                isActive
                                  ? 'bg-[color:var(--surface-muted)] text-[color:var(--text)]'
                                  : '',
                              ].join(' ')}
                              onClick={() => toggleSubmenu(item)}
                            >
                              <item.icon size={18} className="shrink-0" />
                              {visibleLabels && (
                                <>
                                  <span className="truncate">{item.name}</span>
                                  <ChevronRight
                                    size={14}
                                    className={[
                                      'ml-auto shrink-0 transition-transform',
                                      isOpen ? 'rotate-90' : '',
                                    ].join(' ')}
                                  />
                                </>
                              )}
                            </Button>

                            <AnimatePresence>
                              {isOpen && visibleLabels && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="space-y-1 pl-4"
                                >
                                  {item.subItems?.map((subItem) => {
                                    const isSubActive = pathname === subItem.path;
                                    return (
                                      <Button
                                        key={subItem.path}
                                        asChild
                                        variant="ghost"
                                        className={[
                                          navLinkClass,
                                          'h-11 justify-start text-[0.8rem] text-[color:var(--text-muted)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)]',
                                          isSubActive
                                            ? 'bg-[color:var(--surface-muted)] text-[color:var(--text)]'
                                            : '',
                                        ].join(' ')}
                                      >
                                        <Link
                                          href={subItem.path}
                                          onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                          <span className="truncate">{subItem.name}</span>
                                        </Link>
                                      </Button>
                                    );
                                  })}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      }

                      return (
                        <Button
                          key={item.name}
                          asChild
                          variant="ghost"
                          className={[
                            navLinkClass,
                            'text-[color:var(--text-muted)] hover:bg-[color:var(--surface-muted)] hover:text-[color:var(--text)]',
                            isActive
                              ? 'bg-[color:var(--surface-muted)] text-[color:var(--text)]'
                              : '',
                          ].join(' ')}
                        >
                          <Link href={item.path} onClick={() => setIsMobileMenuOpen(false)}>
                            <item.icon size={18} className="shrink-0" />
                            {visibleLabels && (
                              <>
                                <span className="truncate">{item.name}</span>
                                {isActive && (
                                  <Badge
                                    variant="outline"
                                    className="ml-auto border-[color:var(--line)] bg-[color:var(--surface)] text-[0.6rem] uppercase tracking-[0.28em] text-[color:var(--accent)]"
                                  >
                                    Aktif
                                  </Badge>
                                )}
                              </>
                            )}
                          </Link>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          <div className="border-t border-[color:var(--line)] p-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className={[
                'w-full rounded-2xl border-[color:var(--line)] bg-[color:var(--surface-muted)] text-[color:var(--text)] hover:bg-[color:var(--surface-hover)]',
                visibleLabels ? 'justify-start' : 'justify-center',
              ].join(' ')}
            >
              <LogOut className="mr-2 h-4 w-4" />
              {visibleLabels && <span>Sistemi Kapat</span>}
            </Button>
          </div>
        </aside>

        <main className="min-h-dvh flex-1 overflow-x-hidden bg-[color:var(--background)]">
          <header className="sticky top-0 z-20 border-b border-[color:var(--line)] bg-[color:var(--background)] backdrop-blur-xl">
            <div className="flex min-h-[84px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full text-[color:var(--text)] hover:bg-[color:var(--surface-muted)] md:hidden"
                  onClick={() => setIsMobileMenuOpen(true)}
                  aria-label="Menüyü aç"
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="hidden h-10 w-10 rounded-full text-[color:var(--text)] hover:bg-[color:var(--surface-muted)] md:flex"
                  onClick={() => setIsSidebarCollapsed((value) => !value)}
                  aria-label="Sidebar daralt"
                >
                  <ChevronLeft
                    className={[
                      'h-4 w-4 transition-transform',
                      isSidebarCollapsed ? 'rotate-180' : '',
                    ].join(' ')}
                  />
                </Button>

                <div className="min-w-0 space-y-1">
                  <p className="truncate text-[0.65rem] uppercase tracking-[0.34em] text-[color:var(--accent)]">
                    Yönetim Paneli / {activeEntry?.group ?? 'OVERVIEW'}
                  </p>
                  <h1 className="truncate text-xl font-semibold tracking-tight text-[color:var(--text)] sm:text-2xl">
                    {activeEntry?.item?.name ?? 'Dashboard'}
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />

                <div className="hidden items-center gap-3 rounded-full border border-[color:var(--line)] bg-[color:var(--surface)] px-4 py-2 sm:flex">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-sm font-bold text-zinc-950">
                    DQ
                  </div>
                  <div className="hidden min-w-0 lg:block">
                    <p className="text-[0.65rem] uppercase tracking-[0.28em] text-[color:var(--text-muted)]">
                      Oturum
                    </p>
                    <p className="truncate text-sm font-medium text-[color:var(--text)]">
                      Sistem Yöneticisi
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
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

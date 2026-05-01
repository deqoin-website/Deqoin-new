'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  CheckCircle,
  Edit3,
  Loader2,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Shield,
  Trash2,
  UserCircle,
  UserPlus,
  Users,
  XCircle,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useNotification } from '@/components/admin/AdminNotificationProvider';
import { cn } from '@/lib/utils';

type UserRole = 'admin' | 'editor';

type UserRecord = {
  _id: string;
  username: string;
  password?: string;
  name: string;
  role: UserRole;
  lastLogin?: string | null;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

type UserFormState = {
  username: string;
  password: string;
  name: string;
  role: UserRole;
  isActive: boolean;
};

const DEFAULT_FORM: UserFormState = {
  username: '',
  password: '',
  name: '',
  role: 'editor',
  isActive: true,
};

function cloneForm(value: UserFormState) {
  return JSON.parse(JSON.stringify(value)) as UserFormState;
}

function normalizeUser(user: any): UserRecord {
  return {
    _id: String(user?._id || ''),
    username: String(user?.username || ''),
    name: String(user?.name || ''),
    role: user?.role === 'admin' ? 'admin' : 'editor',
    lastLogin: user?.lastLogin ?? null,
    isActive: user?.isActive !== false,
    createdAt: user?.createdAt ?? undefined,
    updatedAt: user?.updatedAt ?? undefined,
  };
}

function roleMeta(role: UserRole) {
  return role === 'admin'
    ? {
        label: 'Admin',
        className: 'border-amber-500/20 bg-amber-500/10 text-amber-100',
        icon: Shield,
        description: 'Tam yetki',
      }
    : {
        label: 'Editör',
        className: 'border-white/10 bg-white/[0.04] text-white/70',
        icon: UserCircle,
        description: 'İçerik yetkisi',
      };
}

function formatDate(value?: string | null) {
  if (!value) return 'Yok';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return 'Yok';

  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(parsed);
}

function UserSkeletonCard() {
  return (
    <Card className="border-white/10 bg-white/[0.04] shadow-none">
      <CardContent className="space-y-4 p-5">
        <div className="h-4 w-32 animate-pulse rounded-full bg-white/10" />
        <div className="h-4 w-48 animate-pulse rounded-full bg-white/10" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="h-20 animate-pulse rounded-[1.2rem] bg-white/10" />
          <div className="h-20 animate-pulse rounded-[1.2rem] bg-white/10" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function UsersPage() {
  const { showToast } = useNotification();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [formData, setFormData] = useState<UserFormState>(cloneForm(DEFAULT_FORM));

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      const data = await res.json().catch(() => null);
      const normalized = Array.isArray(data) ? data.map(normalizeUser) : [];
      setUsers(normalized);

      if (!res.ok) {
        showToast('Kullanıcı listesi varsayılan olarak yüklendi.', 'warning');
      }
    } catch (error) {
      console.error('Fetch users error:', error);
      setUsers([]);
      showToast('Kullanıcılar yüklenemedi.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    void fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        [user.username, user.name, user.role, user.lastLogin || '']
          .join(' ')
          .toLowerCase()
          .includes(query);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? user.isActive !== false : user.isActive === false);

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [roleFilter, searchTerm, statusFilter, users]);

  const stats = useMemo(() => {
    const adminCount = users.filter((user) => user.role === 'admin').length;
    const editorCount = users.filter((user) => user.role === 'editor').length;
    const activeCount = users.filter((user) => user.isActive !== false).length;

    return [
      { label: 'Toplam Kullanıcı', value: String(users.length), hint: 'Kayıtlı tüm hesaplar' },
      { label: 'Admin', value: String(adminCount), hint: 'Tam yetkili hesaplar' },
      { label: 'Editör', value: String(editorCount), hint: 'İçerik rolü' },
      { label: 'Aktif', value: String(activeCount), hint: 'Erişime açık hesaplar' },
    ];
  }, [users]);

  const openCreate = () => {
    setEditingUser(null);
    setFormData(cloneForm(DEFAULT_FORM));
    setIsModalOpen(true);
  };

  const openEdit = (user: UserRecord) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: '',
      name: user.name,
      role: user.role,
      isActive: user.isActive !== false,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData(cloneForm(DEFAULT_FORM));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = editingUser
        ? {
            userId: editingUser._id,
            username: formData.username,
            name: formData.name,
            role: formData.role,
            isActive: formData.isActive,
            ...(formData.password ? { password: formData.password } : {}),
          }
        : formData;

      const res = await fetch('/api/admin/users', {
        method: editingUser ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || 'İşlem başarısız');
      }

      showToast(editingUser ? 'Kullanıcı güncellendi.' : 'Kullanıcı oluşturuldu.', 'success');
      closeModal();
      await fetchUsers();
    } catch (error) {
      console.error('User save error:', error);
      showToast(error instanceof Error ? error.message : 'Bir hata oluştu.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kullanıcıyı silmek istediğinize emin misiniz?')) return;

    try {
      const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || 'Silme işlemi başarısız');
      }

      showToast('Kullanıcı silindi.', 'success');
      await fetchUsers();
    } catch (error) {
      console.error('User delete error:', error);
      showToast(error instanceof Error ? error.message : 'Bir hata oluştu.', 'error');
    }
  };

  const toggleFilters = useMemo(
    () => [
      { label: 'Tümü', value: 'all' as const },
      { label: 'Aktif', value: 'active' as const },
      { label: 'Pasif', value: 'inactive' as const },
    ],
    [],
  );

  return (
    <div className="space-y-6 pb-12">
      <Card className="relative overflow-hidden border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(166,137,102,0.2),transparent_36%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_35px_120px_rgba(0,0,0,0.28)]">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.22)_1px,transparent_0)] [background-size:24px_24px]" />
        <CardContent className="relative flex flex-col gap-6 p-6 md:p-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-4xl space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="outline" className="border-white/10 bg-white/5 text-white/80">
                USERS CMS
              </Badge>
              <Badge variant="outline" className="border-amber-500/20 bg-amber-500/10 text-amber-100">
                API BAĞLI
              </Badge>
            </div>

            <div className="space-y-3">
              <p className="text-[0.62rem] uppercase tracking-[0.5em] text-white/42">YÖNETİM PANELİ</p>
              <h1
                className="max-w-4xl text-[clamp(2.3rem,5vw,4.8rem)] font-thin uppercase leading-[0.86] tracking-[0.1em] text-white"
                style={{ fontFamily: 'Smooch Sans, sans-serif' }}
              >
                KULLANICI YÖNETİMİ
              </h1>
              <p className="max-w-3xl text-sm uppercase tracking-[0.28em] text-white/62 md:text-[0.85rem]">
                Yetkileri, aktiflik durumunu ve erişim kimliklerini tek ekranda yönetin.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div key={item.label} className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-[0.55rem] uppercase tracking-[0.45em] text-white/35">{item.label}</p>
                  <p className="mt-3 text-2xl font-thin uppercase tracking-[0.2em] text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-white/55">{item.hint}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950"
              onClick={() => void fetchUsers()}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              YENİLE
            </Button>
            <Button
              type="button"
              className="border border-white/10 bg-white text-zinc-950 hover:bg-white/90"
              onClick={openCreate}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              YENİ KULLANICI
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-6 xl:self-start">
          <Card className="border-white/10 bg-white/[0.04] shadow-none">
            <CardHeader className="space-y-3">
              <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Filtreler</CardTitle>
              <CardDescription className="text-white/55">Kullanıcıları hızlıca ayıklayın.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">KULLANICI ARA</p>
                <div className="relative">
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="İsim, kullanıcı adı, rol"
                    className="bg-white/[0.03] pl-10"
                  />
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">ROL FİLTRESİ</p>
                <Select
                  value={roleFilter}
                  onChange={(event) => setRoleFilter(event.target.value as 'all' | UserRole)}
                >
                  <option value="all">Tümü</option>
                  <option value="admin">Admin</option>
                  <option value="editor">Editör</option>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">DURUM</p>
                <div className="grid grid-cols-3 gap-2">
                  {toggleFilters.map((item) => (
                    <Button
                      key={item.value}
                      type="button"
                      variant="ghost"
                      onClick={() => setStatusFilter(item.value)}
                      className={cn(
                        'rounded-[1rem] border px-3 py-2 text-[0.62rem] uppercase tracking-[0.35em]',
                        statusFilter === item.value
                          ? 'border-white/20 bg-white text-zinc-950'
                          : 'border-white/10 bg-white/[0.03] text-white/60 hover:bg-white/[0.06] hover:text-white',
                      )}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-white/10" />

              <div className="rounded-[1.2rem] border border-white/10 bg-white/[0.03] p-4 text-sm leading-7 text-white/60">
                <p className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">API DURUMU</p>
                <p className="mt-2">Listeleme, oluşturma, güncelleme ve silme işlemleri `/api/admin/users` ile çalışır.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-white/[0.04] shadow-none">
            <CardHeader className="space-y-3">
              <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Hızlı Bilgi</CardTitle>
              <CardDescription className="text-white/55">Kullanıcı yönetiminde güvenli akış.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm leading-7 text-white/65">
              <p>Şifre düzenleme, alan boş bırakılırsa mevcut değeri bozmaz.</p>
              <p>Admin kullanıcılar silinmeden önce backend tarafından korunur.</p>
              <p>Aktif/pasif bayrağı hem listede hem kart görünümünde net gösterilir.</p>
            </CardContent>
          </Card>
        </aside>

        <section className="space-y-6">
          <Card className="border-white/10 bg-white/[0.04] shadow-none">
            <CardHeader className="space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-sm uppercase tracking-[0.32em] text-white/90">Kullanıcı Listesi</CardTitle>
                  <CardDescription className="mt-2 text-white/55">
                    Masaüstünde tablo, mobilde kart görünümü ile yönetim.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="border-white/10 bg-white/[0.03] text-white/70">
                  {filteredUsers.length} sonuç
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isLoading ? (
                <div className="grid gap-4">
                  <UserSkeletonCard />
                  <UserSkeletonCard />
                  <UserSkeletonCard />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="flex min-h-[28vh] items-center justify-center rounded-[1.5rem] border border-dashed border-white/10 bg-white/[0.02] p-10 text-center">
                  <div className="max-w-2xl space-y-4">
                    <Users className="mx-auto h-10 w-10 text-white/35" />
                    <h2 className="text-3xl font-thin uppercase tracking-[0.18em] text-white" style={{ fontFamily: 'Smooch Sans, sans-serif' }}>
                      KULLANICI BULUNAMADI
                    </h2>
                    <p className="text-sm leading-7 text-white/60">
                      Filtreleri değiştirin veya yeni bir kullanıcı oluşturun.
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="hidden overflow-hidden rounded-[1.5rem] border border-white/10 xl:block">
                    <table className="w-full border-collapse text-left">
                      <thead className="bg-white/[0.03]">
                        <tr className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">
                          <th className="px-5 py-4">Kullanıcı</th>
                          <th className="px-5 py-4">Kullanıcı Adı</th>
                          <th className="px-5 py-4">Rol</th>
                          <th className="px-5 py-4">Durum</th>
                          <th className="px-5 py-4">Son Giriş</th>
                          <th className="px-5 py-4 text-right">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => {
                          const meta = roleMeta(user.role);
                          const RoleIcon = meta.icon;

                          return (
                            <tr key={user._id} className="border-t border-white/10 transition-colors hover:bg-white/[0.03]">
                              <td className="px-5 py-4 align-middle">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-white">
                                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </div>
                                  <div>
                                    <p className="text-sm uppercase tracking-[0.24em] text-white">{user.name}</p>
                                    <p className="mt-1 text-xs text-white/45">Oluşturulma: {formatDate(user.createdAt)}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <code className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[0.72rem] uppercase tracking-[0.2em] text-white/75">
                                  {user.username}
                                </code>
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <Badge variant="outline" className={cn('gap-2 rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em]', meta.className)}>
                                  <RoleIcon className="h-3.5 w-3.5" />
                                  {meta.label}
                                </Badge>
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'gap-2 rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em]',
                                    user.isActive !== false
                                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
                                      : 'border-rose-500/20 bg-rose-500/10 text-rose-100',
                                  )}
                                >
                                  {user.isActive !== false ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                  {user.isActive !== false ? 'Aktif' : 'Pasif'}
                                </Badge>
                              </td>
                              <td className="px-5 py-4 align-middle text-sm text-white/65">
                                {formatDate(user.lastLogin)}
                              </td>
                              <td className="px-5 py-4 align-middle">
                                <div className="flex justify-end gap-2">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950"
                                    onClick={() => openEdit(user)}
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500 hover:text-white"
                                    onClick={() => void handleDelete(user._id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  <div className="grid gap-4 xl:hidden">
                    {filteredUsers.map((user) => {
                      const meta = roleMeta(user.role);
                      const RoleIcon = meta.icon;

                      return (
                        <Card key={user._id} className="border-white/10 bg-white/[0.04] shadow-none">
                          <CardContent className="space-y-4 p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-sm font-semibold text-white">
                                  {user.name?.charAt(0)?.toUpperCase() || 'U'}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-sm uppercase tracking-[0.24em] text-white">{user.name}</p>
                                  <code className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.18em] text-white/75">
                                    {user.username}
                                  </code>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-10 w-10 rounded-2xl border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950"
                                  onClick={() => openEdit(user)}
                                >
                                  <Edit3 className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-10 w-10 rounded-2xl border border-rose-500/20 bg-rose-500/10 text-rose-100 hover:bg-rose-500 hover:text-white"
                                  onClick={() => void handleDelete(user._id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] p-3">
                                <p className="text-[0.55rem] uppercase tracking-[0.45em] text-white/35">ROL</p>
                                <Badge variant="outline" className={cn('mt-2 gap-2 rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em]', meta.className)}>
                                  <RoleIcon className="h-3.5 w-3.5" />
                                  {meta.description}
                                </Badge>
                              </div>
                              <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] p-3">
                                <p className="text-[0.55rem] uppercase tracking-[0.45em] text-white/35">DURUM</p>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    'mt-2 gap-2 rounded-full px-3 py-1 text-[0.62rem] uppercase tracking-[0.28em]',
                                    user.isActive !== false
                                      ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100'
                                      : 'border-rose-500/20 bg-rose-500/10 text-rose-100',
                                  )}
                                >
                                  {user.isActive !== false ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                                  {user.isActive !== false ? 'Aktif' : 'Pasif'}
                                </Badge>
                              </div>
                              <div className="rounded-[1.1rem] border border-white/10 bg-white/[0.03] p-3 sm:col-span-2">
                                <p className="text-[0.55rem] uppercase tracking-[0.45em] text-white/35">SON GİRİŞ</p>
                                <p className="mt-2 text-sm uppercase tracking-[0.2em] text-white/75">{formatDate(user.lastLogin)}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </section>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-[24px]">
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.98 }}
              transition={{ duration: 0.22 }}
              className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#111111] shadow-[0_35px_120px_rgba(0,0,0,0.45)]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5 md:px-8">
                <div className="space-y-2">
                  <p className="text-[0.58rem] uppercase tracking-[0.45em] text-white/35">
                    KULLANICI FORMU
                  </p>
                  <h3
                    className="text-2xl font-thin uppercase tracking-[0.16em] text-white"
                    style={{ fontFamily: 'Smooch Sans, sans-serif' }}
                  >
                    {editingUser ? 'KULLANICIYI DÜZENLE' : 'YENİ KULLANICI OLUŞTUR'}
                  </h3>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-11 w-11 rounded-2xl border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950"
                  onClick={closeModal}
                >
                  <Plus className="h-4 w-4 rotate-45" />
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="max-h-[calc(92vh-92px)] overflow-y-auto p-6 md:p-8">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">AD SOYAD</p>
                    <Input
                      value={formData.name}
                      onChange={(event) => setFormData((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Tam isim"
                      className="bg-white/[0.03]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">KULLANICI ADI</p>
                    <Input
                      value={formData.username}
                      onChange={(event) => setFormData((current) => ({ ...current, username: event.target.value }))}
                      placeholder="Giriş adı"
                      className="bg-white/[0.03]"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">ŞİFRE</p>
                    <Input
                      type="password"
                      value={formData.password}
                      onChange={(event) => setFormData((current) => ({ ...current, password: event.target.value }))}
                      placeholder={editingUser ? 'Boş bırakılırsa değişmez' : 'Yeni şifre'}
                      className="bg-white/[0.03]"
                      required={!editingUser}
                    />
                    {editingUser ? (
                      <p className="text-xs leading-6 text-white/50">Güvenlik için şifreyi yalnızca gerektiğinde güncelleyin.</p>
                    ) : null}
                  </div>
                  <div className="space-y-2">
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">YETKİ</p>
                    <Select
                      value={formData.role}
                      onChange={(event) => setFormData((current) => ({ ...current, role: event.target.value as UserRole }))}
                    >
                      <option value="editor">Editör</option>
                      <option value="admin">Admin</option>
                    </Select>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
                  <div className="space-y-3 rounded-[1.4rem] border border-white/10 bg-white/[0.03] p-4">
                    <p className="text-[0.6rem] uppercase tracking-[0.45em] text-white/35">YETKİ AÇIKLAMASI</p>
                    <p className="text-sm leading-7 text-white/65">
                      {formData.role === 'admin'
                        ? 'Admin hesabı tüm yönetim modüllerine erişebilir, kullanıcı ekleyip silebilir.'
                        : 'Editör hesabı içerik ve sayfa yönetiminde sınırlı erişime sahiptir.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    className={cn(
                      'flex items-center justify-between rounded-[1.4rem] border p-4 text-left transition-all',
                      formData.isActive
                        ? 'border-emerald-500/20 bg-emerald-500/10'
                        : 'border-white/10 bg-white/[0.03]',
                    )}
                    onClick={() => setFormData((current) => ({ ...current, isActive: !current.isActive }))}
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={cn(
                          'flex h-11 w-11 items-center justify-center rounded-full border',
                          formData.isActive
                            ? 'border-emerald-500/20 bg-emerald-500/15 text-emerald-100'
                            : 'border-white/10 bg-white/[0.04] text-white/55',
                        )}
                      >
                        {formData.isActive ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                      </span>
                      <span className="flex flex-col">
                        <span className="text-[0.68rem] uppercase tracking-[0.35em] text-white/75">Hesap Durumu</span>
                        <span className="mt-1 text-sm text-white/55">
                          {formData.isActive ? 'Aktif erişim açık' : 'Hesap geçici olarak pasif'}
                        </span>
                      </span>
                    </span>
                    <span
                      className={cn(
                        'flex h-8 w-14 items-center rounded-full border p-1 transition-colors',
                        formData.isActive ? 'justify-end border-emerald-500/20 bg-emerald-500/20' : 'justify-start border-white/10 bg-white/[0.03]',
                      )}
                    >
                      <span className={cn('h-6 w-6 rounded-full', formData.isActive ? 'bg-emerald-100' : 'bg-white/70')} />
                    </span>
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    variant="ghost"
                    className="border border-white/10 bg-white/[0.03] text-white hover:bg-white hover:text-zinc-950 sm:flex-1"
                    onClick={closeModal}
                  >
                    İPTAL
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="border border-white/10 bg-white text-zinc-950 hover:bg-white/90 sm:flex-[1.2]"
                  >
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : editingUser ? <CheckCircle className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
                    {editingUser ? 'GÜNCELLE' : 'KULLANICI OLUŞTUR'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Layers3, Workflow } from "lucide-react";

import { WorkflowSidebar, WorkflowWorkspace } from "@/components/admin/workflow";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchWorkflow, saveWorkflow } from "@/lib/workflow-api";
import { getWorkflowPageNode, normalizeWorkflowScope, WORKFLOW_PAGE_GROUPS } from "@/lib/workflow-pages";

export default function WorkflowAdminPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [refreshToken, setRefreshToken] = useState(0);

  const selectedScope = useMemo(
    () => normalizeWorkflowScope(searchParams.get("scope") || "/"),
    [searchParams],
  );
  const selectedPage = useMemo(() => getWorkflowPageNode(selectedScope), [selectedScope]);

  const handleSelectRoute = (route: string) => {
    const nextScope = normalizeWorkflowScope(route);
    const nextUrl = `${pathname}?scope=${encodeURIComponent(nextScope)}`;
    router.replace(nextUrl, { scroll: false });
  };

  return (
    <div className="relative min-h-[100dvh] overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.12),transparent_22%),radial-gradient(circle_at_top_right,rgba(59,130,246,0.12),transparent_24%),linear-gradient(180deg,rgba(2,6,23,1),rgba(15,23,42,0.98))] px-4 py-4 md:px-6 md:py-6">
      <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.16),transparent_58%)] blur-3xl" />

      <div className="mx-auto grid w-full max-w-7xl gap-5 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="xl:sticky xl:top-6 xl:self-start">
          <WorkflowSidebar
            groups={WORKFLOW_PAGE_GROUPS}
            activeRoute={selectedPage.route}
            onSelectRoute={handleSelectRoute}
            onRefresh={() => setRefreshToken((current) => current + 1)}
            searchValue={searchValue}
            onSearchChange={setSearchValue}
          />
        </div>

        <div className="space-y-5">
          <Card className="border-white/10 bg-white/[0.04]">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-[color:rgba(245,158,11,0.12)] text-[color:var(--admin-accent)]">Admin Workflow</Badge>
                <Badge variant="secondary">Route bazlı bağımsız yönetim</Badge>
              </div>
              <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(320px,0.8fr)] lg:items-end">
                <div className="space-y-3">
                  <CardTitle className="text-3xl tracking-[0.06em] text-white md:text-5xl">Workflow Yönetim Modülü</CardTitle>
                  <CardDescription className="max-w-3xl text-base text-zinc-400">
                    Her sayfanın iş akışını ayrı bir route olarak yönetin. Sidebar’daki tree yapısı ana sayfalar ve alt
                    sayfaları hiyerarşik olarak gösterir.
                  </CardDescription>
                </div>
                <div className="rounded-3xl border border-white/10 bg-black/20 p-4 text-xs uppercase tracking-[0.22em] text-zinc-400">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono text-zinc-200">{selectedPage.route}</span>
                    <Workflow className="h-4 w-4 text-[color:var(--admin-accent)]" />
                  </div>
                  <Separator className="my-3 bg-white/10" />
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-mono">{selectedPage.label}</span>
                    <span className="text-[0.62rem] tracking-[0.26em] text-zinc-500">{selectedPage.children?.length || 0} alt sayfa</span>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <WorkflowWorkspace
            key={`${selectedPage.route}-${refreshToken}`}
            scope={selectedPage.route}
            refreshToken={refreshToken}
            onLoad={fetchWorkflow}
            onSave={saveWorkflow}
          />

          <Card className="border-white/10 bg-white/[0.03]">
            <CardContent className="flex items-start gap-3 p-5 text-sm text-zinc-400">
              <div className="mt-0.5 rounded-full border border-white/10 bg-white/[0.04] p-2 text-[color:var(--admin-accent)]">
                <Layers3 className="h-4 w-4" />
              </div>
              <p>
                Bu modül, canonical route yapısını kullanır. Eski <span className="font-mono text-zinc-200">page:</span> ve
                <span className="font-mono text-zinc-200">department:</span> kayıtları otomatik olarak yeni route’a
                çevrilir; böylece mevcut içerik bozulmadan yönetim kademeli olarak modernize edilir.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

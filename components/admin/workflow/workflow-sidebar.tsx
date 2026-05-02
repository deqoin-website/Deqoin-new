"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  filterWorkflowTree,
  type WorkflowPageGroup,
  type WorkflowPageNode,
} from "@/lib/workflow-pages";

type WorkflowSidebarProps = {
  groups: WorkflowPageGroup[];
  activeRoute: string;
  onSelectRoute: (route: string) => void;
  onRefresh?: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
};

const findPathToRoute = (items: WorkflowPageNode[], targetRoute: string, trail: string[] = []): string[] | null => {
  for (const item of items) {
    const nextTrail = [...trail, item.route];
    if (item.route === targetRoute) {
      return nextTrail;
    }
    if (item.children?.length) {
      const childPath = findPathToRoute(item.children, targetRoute, nextTrail);
      if (childPath) {
        return childPath;
      }
    }
  }
  return null;
};

type TreeItemProps = {
  item: WorkflowPageNode;
  depth: number;
  activeRoute: string;
  expandedRoutes: Set<string>;
  onToggleRoute: (route: string) => void;
  onSelectRoute: (route: string) => void;
};

function TreeItem({
  item,
  depth,
  activeRoute,
  expandedRoutes,
  onToggleRoute,
  onSelectRoute,
}: TreeItemProps) {
  const hasChildren = Boolean(item.children?.length);
  const isExpanded = expandedRoutes.has(item.route);
  const isActive = activeRoute === item.route;

  return (
    <SidebarMenuItem>
      <div className="space-y-1">
        <div className="flex items-stretch gap-2">
          {hasChildren ? (
            <button
              type="button"
              onClick={() => onToggleRoute(item.route)}
              className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-black/20 text-zinc-400 transition hover:text-white"
              aria-label={isExpanded ? `${item.label} alt öğelerini daralt` : `${item.label} alt öğelerini aç`}
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          ) : (
            <span className="mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-2xl border border-white/10 bg-black/10 text-[0.55rem] uppercase tracking-[0.2em] text-zinc-500">
              {String(depth + 1).padStart(2, "0")}
            </span>
          )}

          <SidebarMenuButton
            type="button"
            isActive={isActive}
            onClick={() => onSelectRoute(item.route)}
            className={cn(
              "group relative h-auto min-h-12 flex-1 justify-start overflow-hidden rounded-2xl border border-transparent py-3",
              depth > 0 && "bg-white/[0.02]",
              isActive
                ? "border-[color:rgba(245,158,11,0.24)] bg-[color:rgba(245,158,11,0.08)] text-white"
                : "hover:border-white/10 hover:bg-white/[0.04]",
            )}
            style={{ paddingLeft: `${0.9 + depth * 1.1}rem` }}
          >
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold tracking-[0.04em]">{item.label}</span>
                {depth === 0 ? (
                  <Badge variant="secondary" className="h-5 border-white/10 bg-white/[0.03] text-[0.62rem] uppercase tracking-[0.18em] text-zinc-400">
                    {hasChildren ? "group" : "page"}
                  </Badge>
                ) : null}
              </div>
              <p className="truncate text-xs leading-5 text-zinc-500">{item.description}</p>
            </div>
          </SidebarMenuButton>
        </div>

        {hasChildren && isExpanded ? (
          <div className="border-l border-white/10 pl-3">
            <SidebarMenu className="gap-1">
              {item.children?.map((child) => (
                <TreeItem
                  key={child.route}
                  item={child}
                  depth={depth + 1}
                  activeRoute={activeRoute}
                  expandedRoutes={expandedRoutes}
                  onToggleRoute={onToggleRoute}
                  onSelectRoute={onSelectRoute}
                />
              ))}
            </SidebarMenu>
          </div>
        ) : null}
      </div>
    </SidebarMenuItem>
  );
}

export function WorkflowSidebar({
  groups,
  activeRoute,
  onSelectRoute,
  onRefresh,
  searchValue,
  onSearchChange,
}: WorkflowSidebarProps) {
  const filteredGroups = useMemo(() => filterWorkflowTree(searchValue, groups), [groups, searchValue]);
  const ancestorRoutes = useMemo(
    () =>
      groups.flatMap((group) => {
        const path = findPathToRoute(group.items, activeRoute);
        return path ? path.slice(0, -1) : [];
      }),
    [activeRoute, groups],
  );
  const [manualExpandedRoutes, setManualExpandedRoutes] = useState<string[]>([]);

  useEffect(() => {
    setManualExpandedRoutes((current) => Array.from(new Set([...current, ...ancestorRoutes])));
  }, [ancestorRoutes]);

  const expandedRoutes = useMemo(
    () => new Set([...manualExpandedRoutes, ...ancestorRoutes]),
    [ancestorRoutes, manualExpandedRoutes],
  );

  const toggleRoute = (route: string) => {
    setManualExpandedRoutes((current) =>
      current.includes(route) ? current.filter((item) => item !== route) : [...current, route],
    );
  };

  return (
    <SidebarProvider defaultOpen>
      <Sidebar className="w-full border-none bg-transparent text-zinc-100 shadow-none">
        <SidebarContent className="sticky top-6 max-h-[calc(100dvh-3rem)] overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,23,42,0.92),rgba(2,6,23,0.86))] p-4 shadow-[0_30px_70px_rgba(2,6,23,0.35)] backdrop-blur-2xl">
          <div className="space-y-4 border-b border-white/10 pb-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[0.65rem] uppercase tracking-[0.42em] text-[color:var(--admin-accent)]">Workflow Ağacı</p>
                <h2 className="mt-2 text-lg font-semibold tracking-[0.08em] text-white">Sayfa hiyerarşisi</h2>
              </div>
              {onRefresh ? (
                <button
                  type="button"
                  onClick={onRefresh}
                  className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-xs text-zinc-300 transition hover:bg-white/[0.08] hover:text-white"
                >
                  Yenile
                </button>
              ) : null}
            </div>

            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <SidebarInput
                value={searchValue}
                onChange={(event) => onSearchChange(event.target.value)}
                placeholder="Sayfa veya yol ara..."
                className="h-11 rounded-2xl border-white/10 bg-black/20 pl-9 text-zinc-100 placeholder:text-zinc-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-4">
            {filteredGroups.length > 0 ? (
              <div className="space-y-5">
                {filteredGroups.map((group) => (
                  <SidebarGroup key={group.title} className="gap-2">
                    <SidebarGroupLabel className="px-1 text-[0.65rem] uppercase tracking-[0.34em] text-zinc-500">
                      {group.title}
                      <span className="ml-2 text-[0.58rem] tracking-[0.24em] text-zinc-600">{group.description}</span>
                    </SidebarGroupLabel>
                    <SidebarMenu className="gap-2">
                      {group.items.map((item) => (
                        <TreeItem
                          key={item.route}
                          item={item}
                          depth={0}
                          activeRoute={activeRoute}
                          expandedRoutes={expandedRoutes}
                          onToggleRoute={toggleRoute}
                          onSelectRoute={onSelectRoute}
                        />
                      ))}
                    </SidebarMenu>
                  </SidebarGroup>
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-4 py-10 text-center text-sm text-zinc-500">
                Eşleşen sayfa bulunamadı.
              </div>
            )}
          </div>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}

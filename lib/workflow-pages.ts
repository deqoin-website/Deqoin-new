import { Aperture, FileText, FolderKanban, Workflow } from "lucide-react";

import { mimariServices } from "@/data/mimari-hizmetler";
import { materyalKategorileri } from "@/data/materyal-studyo";
import { uygulamaBirimleri } from "@/data/uygulama-birimleri";

export type WorkflowPageNode = {
  id: string;
  label: string;
  route: string;
  description: string;
  legacyScopes?: string[];
  icon?: typeof Workflow;
  children?: WorkflowPageNode[];
};

export type WorkflowPageGroup = {
  title: string;
  description: string;
  items: WorkflowPageNode[];
};

export type WorkflowPageFlatItem = WorkflowPageNode & {
  depth: number;
  parentRoutes: string[];
};

const canonicalRoute = (route: string) => {
  const trimmed = route.trim();
  if (!trimmed || trimmed === "home" || trimmed === "/") return "/";
  return trimmed.startsWith("/") ? trimmed.replace(/\/+$/, "") || "/" : `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
};

const slugFromRoute = (route: string) => canonicalRoute(route).split("/").filter(Boolean).at(-1) || "home";

const node = (
  id: string,
  label: string,
  route: string,
  description: string,
  options: Partial<Pick<WorkflowPageNode, "legacyScopes" | "icon" | "children">> = {},
): WorkflowPageNode => ({
  id,
  label,
  route: canonicalRoute(route),
  description,
  legacyScopes: options.legacyScopes,
  icon: options.icon,
  children: options.children,
});

const makeChildren = (
  parentRoute: string,
  items: Array<{ slug: string; title: string; sideLabel: string; description: string }>,
) =>
  items.map((item) =>
    node(
      `${slugFromRoute(parentRoute)}:${item.slug}`,
      item.title,
      `${canonicalRoute(parentRoute)}/${item.slug}`,
      item.description,
      { legacyScopes: [`department:${item.slug}`] },
    ),
  );

export const WORKFLOW_PAGE_GROUPS: WorkflowPageGroup[] = [
  {
    title: "Temel Sayfalar",
    description: "Ana site sayfaları",
    items: [
      node("home", "Ana Sayfa", "/", "Sitenin giriş ve genel iş akışı."),
      node("hakkimizda", "Hakkımızda", "/hakkimizda", "Kurumsal anlatı ve marka yaklaşımı."),
      node("kesif", "Keşif", "/kesif", "Keşif ve analiz sayfası."),
      node("galeri", "Galeri", "/galeri", "Proje galeri akışı."),
      node("journal", "Journal", "/journal", "Editoryal içerik ve yayın akışı."),
      node("iletisim", "İletişim", "/iletisim", "İletişim ve talep sayfası."),
      node("tasarim", "Tasarım", "/tasarim", "İç mimari ve tasarım sayfası."),
    ],
  },
  {
    title: "Mimari",
    description: "Mimari sayfa ağacı",
    items: [
      node(
        "mimari",
        "Mimari",
        "/mimari",
        "Mimari ana sayfası ve üst akış.",
        {
          legacyScopes: ["page:mimari"],
          icon: Workflow,
          children: makeChildren("/mimari", [
            {
              slug: "insaat-muhendisligi",
              title: "İnşaat Mühendisliği",
              sideLabel: "Structural Integrity",
              description: "Yapısal analiz ve statik projelendirme akışı.",
            },
            {
              slug: "mimarlik",
              title: "Mimarlık",
              sideLabel: "Structural Form",
              description: "Mimari konsept ve tasarım akışı.",
            },
            {
              slug: "elektrik-elektronik-muhendisligi",
              title: "Mekanik",
              sideLabel: "Smart Integration",
              description: "Teknik altyapı ve entegrasyon akışı.",
            },
            {
              slug: "ic-mimarlik",
              title: "İç Mimarlık",
              sideLabel: "Interior Essence",
              description: "İç mekan kurgusu ve detay akışı.",
            },
            {
              slug: "restorasyon",
              title: "Restorasyon",
              sideLabel: "Heritage Revival",
              description: "Tarihi doku ve dönüşüm akışı.",
            },
            {
              slug: "peyzaj-mimarligi",
              title: "Peyzaj",
              sideLabel: "Natural Canvas",
              description: "Dış mekan ve peyzaj akışı.",
            },
            {
              slug: "plan-proje",
              title: "Plan ve Proje",
              sideLabel: "Detail & Vision",
              description: "Teknik planlama ve proje akışı.",
            },
          ]),
        },
      ),
    ],
  },
  {
    title: "Materyal Stüdyo",
    description: "Malzeme ve yüzey sayfaları",
    items: [
      node(
        "materyal-studyo",
        "Materyal Stüdyo",
        "/materyal-studyo",
        "Materyal ana sayfası ve üst akış.",
        {
          legacyScopes: ["page:material"],
          icon: Aperture,
          children: makeChildren("/materyal-studyo", materyalKategorileri.map((item) => ({
            slug: item.slug,
            title: item.title,
            sideLabel: item.sideLabel,
            description: item.description,
          }))),
        },
      ),
    ],
  },
  {
    title: "Detay Sayfaları",
    description: "Tekil içerik ve ürün sayfaları",
    items: [
      node("galeri-detay", "Galeri Detay", "/galeri/[slug]", "Tek proje detay sayfası."),
      node("journal-detay", "Journal Detay", "/journal/[slug]", "Tek yazı detay sayfası."),
      node("materyal-kategori", "Materyal Kategori", "/materyal-studyo/[slug]", "Kategori listeleme sayfası."),
      node("materyal-urun", "Materyal Ürün", "/materyal-studyo/[slug]/[urun-slug]", "Ürün detay sayfası."),
    ],
  },
  {
    title: "Uygulama",
    description: "Saha ve üretim sayfaları",
    items: [
      node(
        "uygulama",
        "Uygulama",
        "/uygulama",
        "Uygulama ana sayfası ve üst akış.",
        {
          legacyScopes: ["page:execution"],
          icon: FolderKanban,
          children: makeChildren("/uygulama", uygulamaBirimleri.map((item) => ({
            slug: item.slug,
            title: item.title,
            sideLabel: item.sideLabel,
            description: item.description,
          }))),
        },
      ),
    ],
  },
  {
    title: "Departmanlar",
    description: "Ek sayfa ve alt akışlar",
    items: [
      node("departman-ekipleri", "Departman Ekipleri", "/departman-ekipleri", "Ekip ve departman akışı."),
    ],
  },
];

const flattenTree = (nodes: WorkflowPageNode[], depth = 0, parentRoutes: string[] = []): WorkflowPageFlatItem[] =>
  nodes.flatMap((item) => {
    const entry: WorkflowPageFlatItem = {
      ...item,
      depth,
      parentRoutes,
    };
    const children = item.children ? flattenTree(item.children, depth + 1, [...parentRoutes, item.route]) : [];
    return [entry, ...children];
  });

export const WORKFLOW_PAGE_FLAT_ITEMS = flattenTree(WORKFLOW_PAGE_GROUPS.flatMap((group) => group.items));

const ROUTE_LOOKUP = new Map(WORKFLOW_PAGE_FLAT_ITEMS.map((item) => [item.route, item]));
const LEGACY_LOOKUP = new Map<string, string>();

WORKFLOW_PAGE_FLAT_ITEMS.forEach((item) => {
  item.legacyScopes?.forEach((legacyScope) => {
    LEGACY_LOOKUP.set(legacyScope, item.route);
  });
  const slug = slugFromRoute(item.route);
  if (!LEGACY_LOOKUP.has(slug)) {
    LEGACY_LOOKUP.set(slug, item.route);
  }
});

export const normalizeWorkflowScope = (scope?: string | null) => {
  const candidate = scope?.trim();
  if (!candidate) return "/";
  if (candidate === "home") return "/";
  if (candidate === "/") return "/";
  if (candidate.startsWith("/")) return canonicalRoute(candidate);
  if (LEGACY_LOOKUP.has(candidate)) return LEGACY_LOOKUP.get(candidate) || "/";
  if (candidate.startsWith("page:")) {
    const suffix = candidate.slice("page:".length);
    return LEGACY_LOOKUP.get(candidate) || LEGACY_LOOKUP.get(suffix) || "/";
  }
  if (candidate.startsWith("department:")) {
    const suffix = candidate.slice("department:".length);
    return LEGACY_LOOKUP.get(candidate) || LEGACY_LOOKUP.get(suffix) || "/";
  }
  return LEGACY_LOOKUP.get(candidate) || canonicalRoute(candidate);
};

export const getWorkflowPageNode = (scope?: string | null) => {
  const normalized = normalizeWorkflowScope(scope);
  return ROUTE_LOOKUP.get(normalized) || ROUTE_LOOKUP.get("/") || WORKFLOW_PAGE_FLAT_ITEMS[0];
};

export const getWorkflowPageAncestors = (scope?: string | null) => {
  const node = getWorkflowPageNode(scope);
  return node.parentRoutes
    .map((route) => ROUTE_LOOKUP.get(route))
    .filter(Boolean) as WorkflowPageFlatItem[];
};

export const filterWorkflowTree = (query: string, groups = WORKFLOW_PAGE_GROUPS): WorkflowPageGroup[] => {
  const term = query.trim().toLowerCase();
  if (!term) return groups;

  const matches = (item: WorkflowPageNode) =>
    [item.label, item.route, item.description, item.legacyScopes?.join(" ") || ""]
      .join(" ")
      .toLowerCase()
      .includes(term);

  const filterNode = (item: WorkflowPageNode): WorkflowPageNode | null => {
    const children = item.children?.map(filterNode).filter(Boolean) as WorkflowPageNode[] | undefined;
    if (matches(item) || (children && children.length > 0)) {
      return { ...item, children };
    }
    return null;
  };

  return groups
    .map((group) => ({
      ...group,
      items: group.items.map(filterNode).filter(Boolean) as WorkflowPageNode[],
    }))
    .filter((group) => group.items.length > 0);
};

import Link from "next/link";
import { notFound } from "next/navigation";

import PageNumberNavigator from "@/components/PageNumberNavigator";
import { projectsData } from "@/data/projects";

type ProjectParams = {
  slug: string;
};

function getCategoryLabel(category: string) {
  const labels: Record<string, string> = {
    "luks-konut": "LÜKS KONUT",
    "ticari-yapi": "TİCARİ YAPI",
    "karma-kullanim": "KARMA KULLANIM",
    "kurumsal-alan": "KURUMSAL ALAN",
    "butik-otel": "BUTİK OTEL",
    "kultur-yapisi": "KÜLTÜR YAPISI",
    mimarlik: "MİMARLIK",
    "ic-mimarlik": "İÇ MİMARLIK",
    restorasyon: "RESTORASYON",
    peyzaj: "PEYZAJ",
  };

  return labels[category] ?? category.toUpperCase();
}

export default async function ProjectDetail({ params }: { params: Promise<ProjectParams> }) {
  const { slug } = await params;
  const project = projectsData.find((item) => item.slug === slug);

  if (!project) return notFound();

  return (
    <main className="min-h-screen w-full bg-zinc-950 pb-24 text-white">
      <section className="mx-auto w-full max-w-[1600px] px-6 md:px-16 pt-28">
        <div className="mb-8 flex items-center justify-between gap-6">
          <Link
            href="/galeri"
            className="text-[10px] md:text-xs tracking-[0.4em] text-zinc-400 uppercase transition-colors hover:text-white"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            GALERİYE DÖN
          </Link>
          <p
            className="text-[10px] md:text-xs tracking-[0.4em] text-zinc-500 uppercase"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            {getCategoryLabel(project.category)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div id="gallery-hero" className="lg:col-span-4">
            <div className="relative w-full aspect-[4/3] md:aspect-[16/9] overflow-hidden rounded-2xl">
              <img
                src={project.coverImage}
                alt={project.title}
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

              <div className="absolute bottom-0 left-0 w-full p-6 md:p-10">
                <p
                  className="mb-3 text-[10px] md:text-xs tracking-[0.3em] text-zinc-400 uppercase"
                  style={{ fontFamily: "Smooch Sans, sans-serif" }}
                >
                  {getCategoryLabel(project.category)}
                </p>
                <h1
                  className="text-5xl md:text-7xl lg:text-8xl font-thin tracking-[0.22em] uppercase text-white leading-none"
                  style={{ fontFamily: "Smooch Sans, sans-serif" }}
                >
                  {project.title}
                </h1>
              </div>
            </div>
          </div>

          <aside id="gallery-meta" className="lg:col-span-1 lg:sticky lg:top-32 h-fit">
            <div className="flex flex-col gap-6 border border-zinc-900/80 bg-black/20 p-6 md:p-8 rounded-2xl">
              <div>
                <p
                  className="mb-2 text-[10px] tracking-[0.35em] text-zinc-500 uppercase"
                  style={{ fontFamily: "Smooch Sans, sans-serif" }}
                >
                  İŞVEREN
                </p>
                <p className="text-base md:text-lg text-white/90" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                  {project.client || "-"}
                </p>
              </div>

              <div>
                <p
                  className="mb-2 text-[10px] tracking-[0.35em] text-zinc-500 uppercase"
                  style={{ fontFamily: "Smooch Sans, sans-serif" }}
                >
                  YIL
                </p>
                <p className="text-base md:text-lg text-white/90" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                  {project.year || "-"}
                </p>
              </div>

              <div>
                <p
                  className="mb-2 text-[10px] tracking-[0.35em] text-zinc-500 uppercase"
                  style={{ fontFamily: "Smooch Sans, sans-serif" }}
                >
                  ALAN
                </p>
                <p className="text-base md:text-lg text-white/90" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                  {project.area || "-"}
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div id="gallery-details" className="lg:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-zinc-900/80 bg-black/20 p-6 md:p-8">
              <p className="mb-4 text-[10px] tracking-[0.35em] text-zinc-500 uppercase" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                ÇALIŞMA BİLGİSİ
              </p>
              <p className="text-base md:text-lg leading-relaxed text-zinc-200" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                {project.description}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-900/80 bg-black/20 p-6 md:p-8">
              <p className="mb-4 text-[10px] tracking-[0.35em] text-zinc-500 uppercase" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                VİZYON
              </p>
              <p className="text-base md:text-lg leading-relaxed text-zinc-200" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                {project.vision}
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-900/80 bg-black/20 p-6 md:p-8">
              <p className="mb-4 text-[10px] tracking-[0.35em] text-zinc-500 uppercase" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                TEKNİK DETAY
              </p>
              <p className="text-base md:text-lg leading-relaxed text-zinc-200" style={{ fontFamily: "Smooch Sans, sans-serif" }}>
                {project.techDetails}
              </p>
            </div>
          </div>
        </div>

        <div id="gallery-images" className="mt-16">
          <div className="flex items-end justify-between gap-4 mb-8">
            <h2
              className="text-3xl md:text-5xl font-thin tracking-[0.22em] uppercase text-white"
              style={{ fontFamily: "Smooch Sans, sans-serif" }}
            >
              GALERİ DETAYLARI
            </h2>
            <p
              className="text-[10px] md:text-xs tracking-[0.35em] text-zinc-500 uppercase"
              style={{ fontFamily: "Smooch Sans, sans-serif" }}
            >
              {project.gallery.length} GÖRSEL
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.gallery.map((imgSrc, index) => (
              <div
                key={`${project.slug}-${index}`}
                className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-zinc-900/80"
              >
                <img
                  src={imgSrc}
                  alt={`${project.title} detayı ${index + 1}`}
                  className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            ))}
          </div>
        </div>

        <div id="gallery-story" className="mt-16 border-t border-zinc-900/80 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p
            className="text-[10px] md:text-xs tracking-[0.35em] text-zinc-500 uppercase"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            {project.story}
          </p>
          <p
            className="text-[10px] md:text-xs tracking-[0.35em] text-zinc-500 uppercase"
            style={{ fontFamily: "Smooch Sans, sans-serif" }}
          >
            {project.label}
          </p>
        </div>

        <PageNumberNavigator
          label="SAYFA"
          items={[
            { id: "gallery-hero", label: "01", title: "HERO" },
            { id: "gallery-meta", label: "02", title: "META" },
            { id: "gallery-details", label: "03", title: "DETAILS" },
            { id: "gallery-images", label: "04", title: "GALLERY" },
            { id: "gallery-story", label: "05", title: "STORY" },
          ]}
          className="pt-12"
        />
      </section>
    </main>
  );
}

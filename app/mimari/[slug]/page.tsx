"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { mimariServices } from "../../../data/mimari-hizmetler";
import { projectsData } from "../../../data/projects";
import DepartmentStudio from "../../../components/DepartmentStudio";
import { Loader2 } from "lucide-react";

type ServiceParams = {
  slug: string;
};

export default function MimariDetail({ params }: { params: Promise<ServiceParams> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/content?page=service-${slug}`);
        const data = await res.json();
        if (data && data.sections && data.sections.length > 0) {
          setContent(data.sections[0]);
        }
      } catch (err) {
        console.error("Failed to fetch service detail:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [slug]);

  const service = mimariServices.find((s) => s.slug === slug);

  if (isLoading) {
    return (
      <div className="site-shell" style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="#a68966" />
      </div>
    );
  }

  if (!service && !content) return notFound();

  // Prefer DB content (sections[0]), fallback to static service data
  const title = content?.title || service?.title || slug;
  const subtitle = content?.subtitle || service?.sideLabel || "";
  const description = content?.description || service?.description || "";
  const heroImage = content?.heroImage || service?.image || "";
  const gallery = content?.gallery || service?.sliderImages || [];
  const categories = content?.categories || service?.categories || [];
  const process = content?.process || (service as any)?.process || [];
  const focusAreas = content?.focusAreas || (service as any)?.focusAreas || [];

  return (
    <main className="site-shell">
      <DepartmentStudio 
        title={title.toUpperCase()}
        subtitle={subtitle.toUpperCase()}
        description={description}
        heroImage={heroImage}
        images={gallery}
        projects={projectsData}
        categories={categories}
        process={process}
        focusAreas={focusAreas}
      />
    </main>
  );
}

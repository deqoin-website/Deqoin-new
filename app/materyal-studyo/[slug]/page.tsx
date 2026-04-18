"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { materyalKategorileri } from "../../../data/materyal-studyo";
import { projectsData } from "../../../data/projects";
import DepartmentStudio from "../../../components/DepartmentStudio";
import Footer from "../../../components/Footer";
import { Loader2 } from "lucide-react";

type ServiceParams = {
  slug: string;
};

export default function MaterialDetail({ params }: { params: Promise<ServiceParams> }) {
  const resolvedParams = use(params);
  const { slug } = resolvedParams;
  
  const [content, setContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch(`/api/departments/${slug}`);
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setContent(data);
      } catch (err) {
        console.error("Failed to fetch material service detail:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [slug]);

  const service = materyalKategorileri.find((s) => s.slug === slug);

  if (isLoading) {
    return (
      <div className="site-shell" style={{ height: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 className="animate-spin" size={48} color="#a68966" />
      </div>
    );
  }

  if (!service && !content) return notFound();

  // Prefer DB content (sections[0]), fallback to static service data
  const title = content?.title || slug;
  const subtitle = content?.sideLabel || "";
  const heroImage = content?.image || "";
  const gallery = content?.sliderImages || [];
  const categories = content?.categories || [];
  const focusAreas = content?.focusAreas || [];
  const products = content?.products || [];

  return (
    <>
      <main className="site-shell">
        <DepartmentStudio 
          title={title.toUpperCase()}
          subtitle={subtitle.toUpperCase()}
          eyebrow="DEQOIN | MATERIAL STUDIO"
          heroImage={heroImage}
          images={gallery}
          projects={projectsData}
          categories={categories}
          focusAreas={focusAreas}
          products={products}
          workflowType="material"
        />
      </main>
      <Footer />
    </>
  );
}

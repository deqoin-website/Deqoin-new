"use client";

import { useState, useEffect, use } from "react";
import { notFound } from "next/navigation";
import { materyalKategorileri } from "../../../data/materyal-studyo";
import { projectsData } from "../../../data/projects";
import DepartmentStudio from "../../../components/DepartmentStudio";
import NextStepCarouselSection from "../../../components/NextStepCarouselSection";
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
  const detailSource = content || service;

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
        {detailSource && (
          <section style={{ padding: "5rem 1.5rem 2rem", background: "#080808", color: "#fff", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "0.65rem", letterSpacing: "0.3em", textTransform: "uppercase", color: "#cca883" }}>
                  {detailSource.cardLabel || "Product detail"}
                </span>
                {detailSource.brand && (
                  <span style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px", padding: "0.45rem 0.8rem", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                    {detailSource.brand}
                  </span>
                )}
                {detailSource.model && (
                  <span style={{ border: "1px solid rgba(255,255,255,0.12)", borderRadius: "999px", padding: "0.45rem 0.8rem", fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase" }}>
                    {detailSource.model}
                  </span>
                )}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
                <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: "1.25rem", borderRadius: "1.25rem" }}>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Kategori</div>
                  <div style={{ marginTop: "0.75rem", fontSize: "1rem", lineHeight: 1.5 }}>{detailSource.sideLabel || "-"}</div>
                </div>
                <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: "1.25rem", borderRadius: "1.25rem" }}>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Seri</div>
                  <div style={{ marginTop: "0.75rem", fontSize: "1rem", lineHeight: 1.5 }}>{detailSource.series || detailSource.highlight || "-"}</div>
                </div>
                <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: "1.25rem", borderRadius: "1.25rem" }}>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Finish</div>
                  <div style={{ marginTop: "0.75rem", fontSize: "1rem", lineHeight: 1.5 }}>{detailSource.finish || "-"}</div>
                </div>
                <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)", padding: "1.25rem", borderRadius: "1.25rem" }}>
                  <div style={{ fontSize: "0.65rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)" }}>Kullanım</div>
                  <div style={{ marginTop: "0.75rem", fontSize: "1rem", lineHeight: 1.5 }}>{detailSource.usage || "-"}</div>
                </div>
              </div>
            </div>
          </section>
        )}
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
          workflowProcess={content?.process || []}
          workflowType="material"
        />
        <NextStepCarouselSection currentStudio="materyal-studyo" />
      </main>
      <Footer />
    </>
  );
}

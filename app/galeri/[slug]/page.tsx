"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Loader2 } from "lucide-react";

type ProjectParams = {
  slug: string;
};

export default function ProjectDetail({ params }: { params: Promise<ProjectParams> }) {
  const resolvedParams = use(params);
  const [project, setProject] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects?slug=${resolvedParams.slug}`);
        if (!res.ok) {
           setProject(null);
        } else {
           const data = await res.json();
           setProject(data);
        }
      } catch (err) {
        console.error("Failed to fetch project:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [resolvedParams.slug]);

  if (isLoading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#a68966' }}>
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  if (!project) return notFound();

  return (
    <main className="site-shell project-detail-shell">
      <header className="detail-topbar">
        <Link href="/galeri" className="back-button">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="back-text">Galeriye Dön</span>
        </Link>
      </header>

      <div className="project-detail-hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${project.coverImage})` }}>
          <div className="hero-overlay-dark" />
        </div>
        <div className="hero-title-container">
          <h1 className="project-title">{project.title}</h1>
          <span className="project-category">{project.category}</span>
        </div>
      </div>

      <div className="project-detail-content">
        <div className="detail-info-block">
          <div className="desc-container">
            <span className="section-small-label">ÇALIŞMA BİLGİSİ</span>
            <p className="desc-text">{project.description}</p>
          </div>
          
          <div className="stats-container">
            <div className="stat-col">
              <span className="stat-label">İŞVEREN</span>
              <span className="stat-value">{project.client || '-'}</span>
            </div>
            <div className="stat-col">
              <span className="stat-label">YIL</span>
              <span className="stat-value">{project.year || '-'}</span>
            </div>
            <div className="stat-col">
              <span className="stat-label">KATEGORİ</span>
              <span className="stat-value" style={{ textTransform: "uppercase" }}>{project.category}</span>
            </div>
            <div className="stat-col">
              <span className="stat-label">ALAN</span>
              <span className="stat-value">{project.area || '-'}</span>
            </div>
          </div>
        </div>

        {project.gallery && project.gallery.length > 0 && (
          <div className="project-gallery">
            {project.gallery.map((imgSrc: string, index: number) => (
              <div key={index} className="gallery-item">
                <img src={imgSrc} alt={`${project.title} detayı ${index + 1}`} />
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

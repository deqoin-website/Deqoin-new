"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ProjectDetail } from "../data/projects";

type ProjectInsightPanelProps = {
  project: ProjectDetail | null;
  onClose: () => void;
  className?: string;
};

export default function ProjectInsightPanel({
  project,
  onClose,
  className = "",
}: ProjectInsightPanelProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {project ? (
        <>
          <motion.button
            type="button"
            className={`project-detail-backdrop ${className}`.trim()}
            aria-label="Proje bilgi ekranını kapat"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.32, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.aside
            className={`project-detail-sheet ${className}`.trim()}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: 36,
                    scale: 0.985,
                  }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: 28,
                    scale: 0.985,
                  }
            }
            transition={{ duration: prefersReducedMotion ? 0.1 : 0.56, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={`${project.title} proje bilgisi`}
          >
            <div className="project-detail-sheet-media">
              <img src={project.coverImage} alt={project.title} />
              <div className="project-detail-sheet-media-overlay" />
            </div>

            <div className="project-detail-sheet-body">
              <div className="project-detail-sheet-head">
                <div>
                  <span className="project-detail-sheet-label">{project.label}</span>
                  <h3>{project.title}</h3>
                </div>
                <button
                  type="button"
                  className="project-detail-close"
                  onClick={onClose}
                  aria-label="Proje bilgisini kapat"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <p className="project-detail-sheet-summary">{project.description}</p>

              <div className="project-detail-facts">
                <div>
                  <span>İŞVEREN</span>
                  <strong>{project.client}</strong>
                </div>
                <div>
                  <span>TESLİM YILI</span>
                  <strong>{project.year}</strong>
                </div>
                <div>
                  <span>ÖLÇEK</span>
                  <strong>{project.area}</strong>
                </div>
              </div>

              <div className="project-detail-sections">
                <section>
                  <span>KISA BRİF</span>
                  <p>{project.description}</p>
                </section>
                <section>
                  <span>TEKNİK OMURGA</span>
                  <p>{project.techDetails}</p>
                </section>
                <section>
                  <span>TESLİM KURGUSU</span>
                  <p>
                    {project.client} için {project.year} teslim programına göre,{" "}
                    {project.label.toLowerCase()} odağında {project.area} ölçeğinde geliştirildi.
                  </p>
                </section>
              </div>

              <div className="project-detail-gallery-strip" aria-hidden="true">
                {(project.gallery ?? []).slice(0, 2).map((image, idx) => (
                  <div key={`${project.slug}-${idx}`} className="project-detail-gallery-frame">
                    <img src={image} alt="" />
                  </div>
                ))}
              </div>

              <div className="project-detail-sheet-footer">
                <Link href={`/galeri/${project.slug}`} className="inline-link">
                  <span>GALERİ DOSYASINI AÇ</span>
                  <span className="inline-link-rail">
                    <span />
                  </span>
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

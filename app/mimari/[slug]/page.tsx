"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { mimariServices } from "../../../data/mimari-hizmetler";
import { projectsData } from "../../../data/projects";
import DepartmentStudio from "../../../components/DepartmentStudio";

type ServiceParams = {
  slug: string;
};

export default function MimariDetail({ params }: { params: Promise<ServiceParams> }) {
  const resolvedParams = use(params);
  const service = mimariServices.find((s) => s.slug === resolvedParams.slug);

  if (!service) return notFound();

  // Filter projects for this specific service type if needed, 
  // or show all high-end projects related to Design Studio.
  // The user wanted categories like Lüks Konut, Ticari Yapı etc.
  
  return (
    <main className="site-shell">
      <DepartmentStudio 
        title={service.title.toUpperCase()}
        subtitle={service.sideLabel.toUpperCase()}
        heroImage={service.image}
        images={service.sliderImages}
        projects={projectsData}
        categories={service.categories}
      />
    </main>
  );
}

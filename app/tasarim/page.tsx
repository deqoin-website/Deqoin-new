"use client";

import { projectsData } from "../../data/projects";
import DepartmentStudio from "../../components/DepartmentStudio";
import { useWorkflowContent } from "@/components/useWorkflowContent";

export default function TasarimPage() {
  const { draft } = useWorkflowContent("/tasarim");

  return (
    <main className="site-shell">
      <DepartmentStudio 
        title="DESIGN STUDIO"
        subtitle="İÇ MİMARİ VE TASARIM"
        heroImage="https://lh3.googleusercontent.com/aida-public/AB6AXuCVUCHLvB4gqKIu87ZlNcr3oZLDY1XgwMEMQcp-pzAUlFS1Nn-nmjan1oheeXLiJ94VJmZA_oBfMSPF7jZZuVG47cEkP7h1goKj5Y9WgqVshN-x4CHN0Cdm1zFfAK5KszWNO6pl8w1-gfW6Wb3njqQOsjkQ8-pCuF6dDd8ggmvjFL-N9m4Fe4Lj-pi8WbEEAKONv-Sz-Yl9wNOSPvazMnMZ5Gjdm2myTHVi_vIL4aoeENqkME8bn_RKrHn4r6XvpVXXxsRugi5gKPU"
        projects={projectsData}
        workflowProcess={draft.steps.map((step) => ({
          title: step.title,
          desc: step.description,
          icon: step.icon,
        }))}
      />
    </main>
  );
}

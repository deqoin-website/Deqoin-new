import connectToDatabase from "@/lib/mongodb";
import Project from "@/models/Project";
import { projectsData } from "@/data/projects";
import { normalizeGalleryProject, type GalleryProjectRecord } from "@/lib/gallery-shared";

export { getGalleryCategoryLabel, getGalleryDepartmentOptions, normalizeGalleryProject } from "@/lib/gallery-shared";
export type { GalleryProjectRecord } from "@/lib/gallery-shared";

export async function getGalleryProjects() {
  try {
    await connectToDatabase();
    const docs = await Project.find({}).sort({ updatedAt: -1, createdAt: -1 }).lean();
    if (Array.isArray(docs) && docs.length > 0) {
      return docs.map((doc) => normalizeGalleryProject(doc as GalleryProjectRecord));
    }
  } catch (error) {
    console.error("Gallery project load error:", error);
  }

  return projectsData.map((project) => normalizeGalleryProject(project));
}

export async function getGalleryProjectBySlug(slug: string) {
  try {
    await connectToDatabase();
    const doc = await Project.findOne({ slug }).lean();
    if (doc) {
      return normalizeGalleryProject(doc as GalleryProjectRecord);
    }
  } catch (error) {
    console.error("Gallery project lookup error:", error);
  }

  const fallback = projectsData.find((project) => project.slug === slug);
  return fallback ? normalizeGalleryProject(fallback) : null;
}

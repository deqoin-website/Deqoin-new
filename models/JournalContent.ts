import mongoose from "mongoose";

const JournalSectionSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, enum: ["paragraph", "image", "technical", "related"] },
    body: { type: String },
    src: { type: String },
    alt: { type: String },
    caption: { type: String },
    title: { type: String },
    items: { type: [mongoose.Schema.Types.Mixed], default: [] },
  },
  { _id: false },
);

const JournalArticleSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true },
    title: { type: String, required: true },
    deck: { type: String, required: true },
    coverImage: { type: String, required: true },
    publishedAt: { type: String, required: true },
    readTime: { type: String, required: true },
    articleType: { type: String, required: true },
    departments: { type: [String], default: [] },
    projectTypes: { type: [String], default: [] },
    contentTypes: { type: [String], default: [] },
    relatedProjectSlugs: { type: [String], default: [] },
    intro: { type: String, required: true },
    sections: { type: [JournalSectionSchema], default: [] },
  },
  { _id: false },
);

const JournalContentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true, default: "journal" },
    title: { type: String, default: "JOURNAL" },
    hero: {
      title: { type: String, default: "JOURNAL" },
      subtitle: { type: String, default: "QUIET LUXURY / EDITORIAL ARCHIVE" },
      description: { type: String, default: "" },
      featuredArticleSlug: { type: String, default: "" },
    },
    articles: { type: [JournalArticleSchema], default: [] },
    metadata: {
      lastUpdatedBy: { type: String },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true },
);

export default mongoose.models.JournalContent || mongoose.model("JournalContent", JournalContentSchema);

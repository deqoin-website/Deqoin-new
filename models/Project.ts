import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    label: { type: String, required: true },
    category: { type: String, required: true },
    coverImage: { type: String, required: true },
    client: { type: String },
    year: { type: String },
    area: { type: String },
    description: { type: String },
    vision: { type: String },
    techDetails: { type: String },
    story: { type: String },
    gallery: [{ type: String }],
    materials: [{ type: String }],
    executionUnits: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);

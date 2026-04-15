import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true }, // e.g., 'design', 'material', 'execution', 'mimarlik', 'ic-mimarlik'
    title: { type: String, required: true },
    sideLabel: { type: String, required: true }, // e.g., 'Structural Form'
    description: { type: String, required: true }, // Main text
    image: { type: String }, // Hero/Cover image
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    heroBlur: { type: Number, default: 0 },
    heroOverlay: { type: Number, default: 30 },
    sliderImages: [{ type: String }],
    
    // Arrays for dynamic tabs
    process: [
      {
        title: { type: String },
        desc: { type: String }
      }
    ],
    focusAreas: [
      {
        title: { type: String },
        icon: { type: String }, // e.g. 'architecture', 'diamond', or Lucide name
        desc: { type: String }
      }
    ],
    categories: [
      {
        label: { type: String }, // "TÜM PROJELER"
        value: { type: String }  // "ALL"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

import mongoose from "mongoose";

const StudioCardSchema = new mongoose.Schema(
  {
    studioType: { 
      type: String, 
      required: true, 
      enum: ["design", "material", "execution"],
      index: true
    },
    title: { type: String, required: true },
    description: { type: String },
    icon: { type: String }, // e.g. "PenTool", "Layers", "Hammer" for Lucide integration
    image: { type: String }, // Optional image instead of icon
    order: { type: Number, default: 0 }, // Sürükle bırak (Drag&Drop) sıralama için
  },
  { timestamps: true }
);

export default mongoose.models.StudioCard || mongoose.model("StudioCard", StudioCardSchema);

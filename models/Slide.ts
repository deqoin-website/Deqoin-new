import mongoose from "mongoose";

const SlideSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String },
    mediaUrl: { type: String, required: true }, // Image or Video URL
    mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
    blur: { type: Number, default: 0 }, // 0 to 50
    overlay: { type: Number, default: 30 }, // 0 to 100 (percentage)
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Slide || mongoose.model("Slide", SlideSchema);

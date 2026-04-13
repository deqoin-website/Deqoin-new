import mongoose from "mongoose";

const TeamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    category: { type: String, required: true }, // e.g., 'mimarlik', 'ic-mimarlik'
    image: { type: String },
    order: { type: Number, default: 99 },
    socials: {
      linkedin: { type: String },
      instagram: { type: String }
    }
  },
  { timestamps: true }
);

export default mongoose.models.TeamMember || mongoose.model("TeamMember", TeamMemberSchema);

import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "site-settings" },
    logoUrl: { type: String, default: "/images/logo-new.jpeg" },
    studioName: { type: String, default: "DEQOIN | Architectural Studio" },
    contactEmail: { type: String, default: "randevu@deqoin.com" },
    socialLinks: {
      instagram: { type: String },
      linkedin: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

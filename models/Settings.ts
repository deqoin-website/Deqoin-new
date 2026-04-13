import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "site-settings" },
    logoUrl: { type: String, default: "/images/logo-new.jpeg" },
    faviconUrl: { type: String },
    studioName: { type: String, default: "DEQOIN | Architectural Studio" },
    contactEmail: { type: String, default: "randevu@deqoin.com" },
    
    // NEW FIELDS
    maintenanceMode: { type: Boolean, default: false },
    metaTitle: { type: String },
    metaDescription: { type: String },
    keywords: { type: String },
    googleAnalyticsId: { type: String },
    metaPixelId: { type: String },
    
    phone: { type: String },
    whatsapp: { type: String },
    address: { type: String },
    googleMapsUrl: { type: String },

    socialLinks: {
      instagram: { type: String },
      linkedin: { type: String },
      facebook: { type: String },
      x: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

import mongoose from "mongoose";

const GalleryItemSchema = new mongoose.Schema({
  url: { type: String, required: true },
  imageAlt: { type: String, default: "" }, // SEO optimizasyonu için
  caption: { type: String, default: "" }    // Fotoğraf altında görünecek metin
}, { _id: false });

const ProjectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    label: { type: String, required: true }, // "VİLLA", "MAĞAZA" vs.
    department: { type: String },
    
    // Çapraz Filtreler (Lüks Konut, Ticari vb.)
    categories: [{ type: String }],
    
    // Merkezî Portfolyo Paylaşım Ayarları (Hangi stüdyolarda yayınlanacak?)
    publishTargets: {
      designStudio: { type: Boolean, default: true },
      materialStudio: { type: Boolean, default: false },
      executionStudio: { type: Boolean, default: false },
    },

    coverImage: { type: String, required: true },
    
    // Proje Bilgileri
    client: { type: String },
    year: { type: String },
    area: { type: String },
    
    // Uzun Metinler
    description: { type: String },
    vision: { type: String },
    techDetails: { type: String },
    story: { type: String },
    
    // SEO Meta
    seoMeta: {
      title: { type: String },
      description: { type: String },
      keywords: { type: String }
    },

    // Yeni Gelişmiş Galeri Yapısı
    gallery: [GalleryItemSchema],
    
    // Bağlı Malzeme / Uygulama etiketleri (Legacy support için tutulabilir)
    materials: [{ type: String }],
    executionUnits: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Project || mongoose.model("Project", ProjectSchema);

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
    seoMeta: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      keywords: { type: String, default: "" },
      ogImage: { type: String, default: "" },
      canonicalPath: { type: String, default: "" },
      noIndex: { type: Boolean, default: false },
      schemaType: { type: String, default: "" },
    },
    
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
    ],
    products: [
      {
        slug: { type: String },
        categorySlug: { type: String },
        title: { type: String },
        brandName: { type: String },
        image: { type: String },
        heroImage: { type: String },
        heroCrop: {
          x: { type: Number, default: 50 },
          y: { type: Number, default: 50 },
          zoom: { type: Number, default: 1 },
        },
        gallery: [{ type: String }],
        galleryCrops: [
          {
            x: { type: Number, default: 50 },
            y: { type: Number, default: 50 },
            zoom: { type: Number, default: 1 },
          }
        ],
        shortInfo: { type: String },
        sku: { type: String },
        description: { type: String },
        category: { type: String },
        desc: { type: String },
        price: { type: String },
        link: { type: String },
        stockStatus: { type: String, enum: ["available", "limited", "made-to-order"] },
        stockLabel: { type: String },
        techTags: [{ type: String }],
        ctaVariant: { type: String, enum: ["request-sample", "get-info", "request-quote"] },
        ctaLabel: { type: String },
        details: [
          {
            label: { type: String },
            value: { type: String },
          }
        ],
        filterValues: { type: mongoose.Schema.Types.Mixed },
        technicalDetails: [
          {
            label: { type: String },
            value: { type: String },
          }
        ],
        applicationAreas: [{ type: String }],
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.models.Department || mongoose.model("Department", DepartmentSchema);

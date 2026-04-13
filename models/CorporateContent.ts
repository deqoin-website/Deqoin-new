import mongoose from "mongoose";

const CorporateContentSchema = new mongoose.Schema(
  {
    page: { type: String, required: true, unique: true }, // 'about', 'workflow'
    title: { type: String },
    subtitle: { type: String },
    description: { type: String },
    image: { type: String },
    
    // Specifically for About Us stats
    stats: [
      {
        label: { type: String }, // e.g., 'DENEYİM'
        value: { type: String }  // e.g., '10+ YIL'
      }
    ],

    // For Workflow or long descriptions
    sections: [
      {
        title: { type: String },
        content: { type: String },
        image: { type: String }
      }
    ],

    metadata: {
      lastUpdatedBy: { type: String },
      updatedAt: { type: Date, default: Date.now }
    }
  },
  { timestamps: true }
);

export default mongoose.models.CorporateContent || mongoose.model("CorporateContent", CorporateContentSchema);

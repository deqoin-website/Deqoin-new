import mongoose from 'mongoose';

const PageContentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    required: true, 
    unique: true
  },
  title: String,
  sections: [
    {
      id: String,
      title: String,
      subtitle: String,
      description: String,
      heroImage: String,
      image: String,
      slides: [mongoose.Schema.Types.Mixed],
      gallery: [String],
      items: [mongoose.Schema.Types.Mixed],
      process: [mongoose.Schema.Types.Mixed],
      focusAreas: [mongoose.Schema.Types.Mixed],
      categories: [mongoose.Schema.Types.Mixed],
      content: mongoose.Schema.Types.Mixed,
      type: String
    }
  ],
  metadata: {
    lastUpdatedBy: String,
    updatedAt: { type: Date, default: Date.now }
  }
}, { timestamps: true });

export default mongoose.models.PageContent || mongoose.model('PageContent', PageContentSchema);

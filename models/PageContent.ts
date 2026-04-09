import mongoose from 'mongoose';

const PageContentSchema = new mongoose.Schema({
  page: { 
    type: String, 
    required: true, 
    unique: true,
    enum: ['home', 'about', 'services'] 
  },
  title: String,
  sections: [
    {
      id: String,
      title: String,
      content: mongoose.Schema.Types.Mixed,
      type: { type: String, enum: ['text', 'image', 'hero', 'stats', 'list'] }
    }
  ],
  metadata: {
    lastUpdatedBy: String,
    updatedAt: { type: Date, default: Date.now }
  }
}, { timestamps: true });

export default mongoose.models.PageContent || mongoose.model('PageContent', PageContentSchema);

import mongoose from "mongoose";

const WorkflowContentSchema = new mongoose.Schema(
  {
    scope: { type: String, required: true, unique: true }, // e.g. "home", "page:kesif", "department:mimari"
    kind: { type: String, enum: ["home", "page", "department"], required: true },
    title: { type: String, required: true },
    steps: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        icon: { type: String, required: true },
      },
    ],
    metadata: {
      lastUpdatedBy: { type: String },
      updatedAt: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export default mongoose.models.WorkflowContent || mongoose.model("WorkflowContent", WorkflowContentSchema);

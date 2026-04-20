import mongoose from "mongoose";

const WorkflowContentSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true, default: "home-workflow" },
    title: { type: String, default: "İŞ AKIŞI" },
    steps: [
      {
        id: { type: String, required: true },
        title: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
      },
    ],
    metadata: {
      updatedAt: { type: Date, default: Date.now },
      lastUpdatedBy: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.models.WorkflowContent ||
  mongoose.model("WorkflowContent", WorkflowContentSchema);

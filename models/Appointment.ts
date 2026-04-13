import mongoose from "mongoose";

const AppointmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    city: { type: String, required: true },
    interestedDepartment: { type: String, required: true }, // e.g. "Mimari Tasarım", "Mobilya & Materyal", "İnşaat & Uygulama"
    projectDetails: { type: String },
    status: { 
      type: String, 
      enum: ["Yeni", "İncelendi", "İletişime Geçildi", "Arşivlendi"], 
      default: "Yeni" 
    },
    notes: { type: String } // Admin'in kendi alacağı notlar
  },
  { timestamps: true }
);

export default mongoose.models.Appointment || mongoose.model("Appointment", AppointmentSchema);

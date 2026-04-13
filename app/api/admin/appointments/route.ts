import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Appointment from "@/models/Appointment";

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    
    // Sort logic
    const appointments = await Appointment.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(appointments);
  } catch (error) {
    console.error("Appointments fetch error", error);
    return NextResponse.json({ error: "Veri alınamadı." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    
    // Public randevu formu bu endpointe de istek atabilir
    const newDoc = await Appointment.create(body);
    
    return NextResponse.json(newDoc, { status: 201 });
  } catch (error) {
    console.error("Appointment create error:", error);
    return NextResponse.json({ error: "Talep oluşturulamadı." }, { status: 500 });
  }
}

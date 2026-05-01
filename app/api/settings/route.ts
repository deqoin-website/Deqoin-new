import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import Settings from "@/models/Settings";

const DEFAULT_SETTINGS = {
  key: "site-settings",
  logoUrl: "/images/logo-new.jpeg",
  faviconUrl: "",
  studioName: "DEQOIN | Architectural Studio",
  contactEmail: "randevu@deqoin.com",
  maintenanceMode: false,
  metaTitle: "",
  metaDescription: "",
  keywords: "",
  googleAnalyticsId: "",
  metaPixelId: "",
  phone: "",
  whatsapp: "",
  address: "",
  googleMapsUrl: "",
  socialLinks: {
    instagram: "",
    linkedin: "",
    facebook: "",
    x: "",
  },
};

function normalizeSettings(payload: any = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...payload,
    socialLinks: {
      ...DEFAULT_SETTINGS.socialLinks,
      ...(payload?.socialLinks || {}),
    },
  };
}

export async function GET() {
  try {
    await connectToDatabase();
    let settings = await Settings.findOne({ key: "site-settings" });
    
    // Default settings if none exist
    if (!settings) {
      settings = await Settings.create(DEFAULT_SETTINGS);
    }
    
    return NextResponse.json(normalizeSettings(settings?.toObject?.() ?? settings));
  } catch (error) {
    return NextResponse.json(normalizeSettings(), { status: 200 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const nextSettings = normalizeSettings(data);
    
    const settings = await Settings.findOneAndUpdate(
      { key: "site-settings" },
      nextSettings,
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    
    return NextResponse.json(normalizeSettings(settings?.toObject?.() ?? settings));
  } catch (error) {
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

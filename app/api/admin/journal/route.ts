import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/mongodb";
import JournalContent from "@/models/JournalContent";
import { createDefaultJournalDraft, normalizeJournalDraft, serializeJournalDraft } from "@/lib/journal-content";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function stripMongoFields(value: any): any {
  if (Array.isArray(value)) {
    return value.map(stripMongoFields);
  }

  if (value && typeof value === "object") {
    const cleaned: Record<string, any> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      if (key === "_id" || key === "__v" || key === "createdAt" || key === "updatedAt") {
        continue;
      }
      cleaned[key] = stripMongoFields(nestedValue);
    }
    return cleaned;
  }

  return value;
}

async function loadJournalDocument() {
  await connectToDatabase();
  const document = await JournalContent.findOne({ page: "journal" }).lean();
  return document ? stripMongoFields(document) : null;
}

export async function GET() {
  try {
    const document = await loadJournalDocument();
    const draft = normalizeJournalDraft(document || createDefaultJournalDraft());
    return NextResponse.json(stripMongoFields(serializeJournalDraft(draft)), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Failed to fetch journal admin data:", error);
    const draft = createDefaultJournalDraft();
    return NextResponse.json(serializeJournalDraft(draft), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const normalized = normalizeJournalDraft(data);
    const payload = serializeJournalDraft(normalized);
    const now = new Date();

    const updated = await JournalContent.findOneAndUpdate(
      { page: "journal" },
      {
        ...stripMongoFields(payload),
        metadata: { updatedAt: now },
        updatedAt: now,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return NextResponse.json(stripMongoFields(updated || payload), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    });
  } catch (error) {
    console.error("Failed to save journal admin data:", error);
    return NextResponse.json({ error: "Failed to save journal content" }, { status: 500 });
  }
}

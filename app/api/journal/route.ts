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

export async function GET() {
  try {
    await connectToDatabase();
    const document = await JournalContent.findOne({ page: "journal" }).lean();
    const draft = normalizeJournalDraft(document || createDefaultJournalDraft());
    return NextResponse.json(stripMongoFields(serializeJournalDraft(draft)), {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
  } catch (error) {
    console.error("Failed to fetch journal data:", error);
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

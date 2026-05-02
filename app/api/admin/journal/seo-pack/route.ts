import { NextResponse } from "next/server";

import { journalSeoPackDraft } from "@/data/journal-seo-pack";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  return NextResponse.json(journalSeoPackDraft, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}


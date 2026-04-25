import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const EMPTY_WORKFLOW = {
  key: "home-workflow",
  title: "İş Akış Süreci",
  steps: [],
};

function responseWithDefaults() {
  return NextResponse.json(
    EMPTY_WORKFLOW,
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      },
    }
  );
}

async function clearWorkflowDocuments() {
  const connection = await connectToDatabase();
  const db = connection?.connection?.db;

  if (!db) return;

  await db.collection("workflowcontents").deleteMany({ key: "home-workflow" });
}

export async function GET() {
  try {
    await clearWorkflowDocuments();
    return responseWithDefaults();
  } catch (error: any) {
    console.error("Workflow GET failed:", error);
    return responseWithDefaults();
  }
}

export async function PUT(request: Request) {
  try {
    await request.json().catch(() => null);
    await clearWorkflowDocuments();
    return responseWithDefaults();
  } catch (error: any) {
    console.error("Workflow PUT failed:", error);
    return responseWithDefaults();
  }
}

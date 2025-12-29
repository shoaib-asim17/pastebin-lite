import { NextResponse } from "next/server";
import kv from "@/lib/kv";

export async function GET() {
  try {
    await kv.ping(); // verifies persistence access
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

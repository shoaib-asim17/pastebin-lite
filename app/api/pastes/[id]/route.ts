import { NextResponse } from "next/server";
import kv from "@/lib/kv";
import { nowMs } from "@/lib/time";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) {
    return NextResponse.json(
      { error: "Paste not found" },
      { status: 404 }
    );
  }

  // TTL check (deterministic)
  const now = nowMs(req);
  if (paste.expires_at && now >= paste.expires_at) {
    return NextResponse.json(
      { error: "Paste expired" },
      { status: 404 }
    );
  }

  // Increment views atomically
  const views = await kv.hincrby(key, "views", 1);

  // View limit check
  if (paste.max_views !== null && views > paste.max_views) {
    return NextResponse.json(
      { error: "View limit exceeded" },
      { status: 404 }
    );
  }

  const remaining_views =
    paste.max_views === null
      ? null
      : Math.max(paste.max_views - views, 0);

  return NextResponse.json({
    content: paste.content,
    remaining_views,
    expires_at: paste.expires_at
      ? new Date(paste.expires_at).toISOString()
      : null,
  });
}

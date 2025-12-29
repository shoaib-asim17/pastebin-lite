import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import kv from "@/lib/kv";
import { validateCreatePaste } from "@/lib/validation";

export async function POST(req: Request) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const errors = validateCreatePaste(body);
  if (errors.length > 0) {
    return NextResponse.json(
      { error: errors.join(", ") },
      { status: 400 }
    );
  }

  const id = nanoid(10);
  const now = Date.now();

  const expires_at =
    body.ttl_seconds !== undefined
      ? now + body.ttl_seconds * 1000
      : null;

  const paste = {
    id,
    content: body.content,
    created_at: now,
    expires_at,
    max_views: body.max_views ?? null,
    views: 0,
  };

  await kv.set(`paste:${id}`, paste);

  const baseUrl = req.headers.get("origin")!;
  const url = `${baseUrl}/p/${id}`;

  return NextResponse.json(
    {
      id,
      url,
    },
    { status: 201 }
  );
}

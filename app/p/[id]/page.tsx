import kv from "@/lib/kv";
import { nowMs } from "@/lib/time";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PastePage({ params }: PageProps) {
  const { id } = await params;
  const key = `paste:${id}`;
  const viewsKey = `paste:${id}:views`;
  const paste = await kv.get<any>(key);

  if (!paste) {
    notFound();
  }

  // TTL check
  const now = nowMs();
  if (paste.expires_at && now >= paste.expires_at) {
    notFound();
  }

  // View limit check using separate views counter
  const views = await kv.get<number>(viewsKey) || 0;
  if (
    paste.max_views !== null &&
    views >= paste.max_views
  ) {
    notFound();
  }

  return (
    <main style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Paste</h1>
      <pre
        style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          background: "#f4f4f4",
          padding: "1rem",
          borderRadius: "6px",
        }}
      >
        {paste.content}
      </pre>
    </main>
  );
}

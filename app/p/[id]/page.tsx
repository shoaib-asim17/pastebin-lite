import kv from "@/lib/kv";
import { nowMs } from "@/lib/time";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export default async function PastePage({ params }: PageProps) {
  const key = `paste:${params.id}`;
  const paste = await kv.get<any>(key);

  if (!paste) {
    notFound();
  }

  // TTL check
  const now = nowMs();
  if (paste.expires_at && now >= paste.expires_at) {
    notFound();
  }

  // View limit check (no increment here)
  if (
    paste.max_views !== null &&
    paste.views >= paste.max_views
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

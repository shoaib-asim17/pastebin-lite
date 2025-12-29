
"use client";

import { useState } from "react";
import { Copy, Check, Clock, Eye, Link2 } from "lucide-react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleSubmit() {
    setError(null);
    setResultUrl(null);
    setLoading(true);

    const payload: any = { content };

    if (ttl) payload.ttl_seconds = Number(ttl);
    if (maxViews) payload.max_views = Number(maxViews);

    try {
      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to create paste");
      } else {
        setResultUrl(data.url);
        setContent("");
        setTtl("");
        setMaxViews("");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (resultUrl) {
      navigator.clipboard.writeText(resultUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-12">
         <img src="/pastebin.png" alt="Pastebin Lite Logo" className="mx-auto mb-4 w-48 h-32" />
          <p className="text-slate-600">Share text snippets securely with expiration options</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="space-y-6">
            {/* Content Area */}
            <div>
              <label className="block text-sm font-Mobile text-slate-700 mb-2">
                Your Content
              </label>
              <textarea
                placeholder="Paste your text, code, or any content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={handleKeyPress}
                rows={10}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none resize-none font-mono text-sm"
                required
              />
            </div>

            {/* Options Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-Mobile text-slate-700 mb-2">
                  <Clock className="w-4 h-4 mr-2 text-slate-500" />
                  Time to Live (seconds)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 3600 for 1 hour"
                  value={ttl}
                  onChange={(e) => setTtl(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-Mobile text-slate-700 mb-2">
                  <Eye className="w-4 h-4 mr-2 text-slate-500" />
                  Max Views
                </label>
                <input
                  type="number"
                  placeholder="e.g., 10 views"
                  value={maxViews}
                  onChange={(e) => setMaxViews(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading || !content.trim()}
              className="w-full bg-slate-950 hover:bg-slate-700 disabled:bg-slate-300 text-white font-Mobile py-4 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:hover:shadow-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Paste...
                </span>
              ) : (
                "Create Paste"
              )}
            </button>
            <p className="text-xs text-slate-500 text-center">Tip: Press Ctrl+Enter (Cmd+Enter on Mac) to submit</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border-2 border-red-200 rounded-xl">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Success Result */}
          {resultUrl && (
            <div className="mt-6 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-green-800 font-Mobile mb-3">✓ Paste created successfully!</p>
              <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-green-200">
                <a
                  href={resultUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 text-blue-600 hover:text-blue-700 font-medium truncate"
                >
                  {resultUrl}
                </a>
                <button
                  onClick={copyToClipboard}
                  className="flex-shrink-0 p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-slate-600" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-slate-500">
          <p>Your pastes are temporary and can expire based on your settings</p>
        </div>
      </div>
    </div>
  );
}
import { type NextRequest, NextResponse } from "next/server";

/**
 * Chat API route.
 *
 * If CHAT_API_URL is set, proxies the request to that backend and streams the response back.
 * Otherwise returns a minimal SSE stream_end event so the UI doesn't hang.
 *
 * Set CHAT_API_URL in .env.local to point at your backend, e.g.:
 *   CHAT_API_URL=http://localhost:50505/chat
 */
export async function POST(request: NextRequest) {
  const chatApiUrl = process.env.CHAT_API_URL;

  if (!chatApiUrl) {
    // Stub response — no backend configured
    const body = 'data: {"type":"stream_end"}\n\n';
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  }

  // Proxy to the configured backend
  const upstream = await fetch(chatApiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: await request.text(),
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: {
      "Content-Type":
        upstream.headers.get("Content-Type") ?? "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

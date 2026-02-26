import { type NextRequest, NextResponse } from "next/server";

/**
 * Chat API route.
 *
 * If CHAT_API_URL is set, proxies the request to that backend and streams the response back.
 * Otherwise returns a minimal SSE stream_end event so the UI doesn't hang.
 *
 * Set CHAT_API_URL in .env.local to point at your backend, e.g.:
 *   CHAT_API_URL=http://localhost:5000/api/chat
 */
export async function POST(request: NextRequest) {
  const chatApiUrl = process.env.CHAT_API_URL;

  console.log("[proxy] CHAT_API_URL =", chatApiUrl ?? "(not set — using stub)");

  if (!chatApiUrl) {
    console.log("[proxy] No CHAT_API_URL configured, returning stub response.");
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

  const token = process.env.CHAT_API_TOKEN;

  // Read and log the body before forwarding
  const requestBody = await request.text();
  console.log("[proxy] Forwarding to:", chatApiUrl);
  console.log("[proxy] Request body:", requestBody);

  let upstream: Response;
  try {
    upstream = await fetch(chatApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: requestBody,
    });
  } catch (err) {
    console.error("[proxy] Failed to reach backend:", err);
    return new NextResponse(JSON.stringify({ error: "Backend unreachable", detail: String(err) }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  console.log("[proxy] Backend responded with status:", upstream.status, upstream.statusText);
  console.log("[proxy] Backend Content-Type:", upstream.headers.get("Content-Type"));

  if (!upstream.ok) {
    const errorBody = await upstream.text();
    console.error("[proxy] Backend error body:", errorBody);
    return new NextResponse(errorBody, {
      status: upstream.status,
      headers: { "Content-Type": upstream.headers.get("Content-Type") ?? "application/json" },
    });
  }

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

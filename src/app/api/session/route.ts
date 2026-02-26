import { NextResponse } from "next/server";

/**
 * Session creation API route.
 *
 * POSTs to CHAT_SESSION_URL with the server-side CHAT_API_TOKEN in the
 * Authorization header. The backend returns a session ID which is forwarded
 * to the browser. The token is never exposed to the client.
 *
 * Set both variables in .env.local:
 *   CHAT_SESSION_URL=http://localhost:5000/api/session
 *   CHAT_API_TOKEN=my-secret-token
 */
export async function POST() {
  const sessionUrl = process.env.CHAT_SESSION_URL;
  const token = process.env.CHAT_API_TOKEN;

  console.log("[session] CHAT_SESSION_URL =", sessionUrl ?? "(not set)");

  if (!sessionUrl) {
    console.error("[session] CHAT_SESSION_URL is not configured.");
    return NextResponse.json(
      { error: "CHAT_SESSION_URL is not configured on the server." },
      { status: 500 }
    );
  }

  let response: Response;
  try {
    response = await fetch(sessionUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
  } catch (err) {
    console.error("[session] Failed to reach session endpoint:", err);
    return NextResponse.json(
      { error: "Session endpoint unreachable", detail: String(err) },
      { status: 502 }
    );
  }

  // Log status + all response headers for easier diagnosis
  const responseHeaders: Record<string, string> = {};
  response.headers.forEach((value, key) => { responseHeaders[key] = value; });
  console.log("[session] Backend responded with status:", response.status, response.statusText);
  console.log("[session] Backend response headers:", JSON.stringify(responseHeaders, null, 2));

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("[session] Backend error body:", errorBody || "(empty)");
    console.error("[session] Diagnosis: backend returned", response.status, "—",
      response.status === 404
        ? `route not found at ${sessionUrl}. Check the URL or that the C# endpoint is implemented.`
        : response.status === 401 || response.status === 403
        ? "authorization rejected. Check CHAT_API_TOKEN value."
        : response.status === 405
        ? "method not allowed. The endpoint may only accept GET, not POST."
        : "see error body above."
    );
    return NextResponse.json(
      {
        error: "Failed to create session",
        status: response.status,
        statusText: response.statusText,
        detail: errorBody || "(empty response body)",
        url: sessionUrl,
      },
      { status: response.status }
    );
  }

  const data = await response.json();
  console.log("[session] Session created:", data);

  return NextResponse.json(data);
}

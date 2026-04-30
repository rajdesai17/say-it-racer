import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Missing API key" }, { status: 500 });
  }
  const res = await fetch(
    "https://api.elevenlabs.io/v1/single-use-token/realtime_scribe",
    {
      method: "POST",
      headers: { "xi-api-key": apiKey },
    },
  );
  if (!res.ok) {
    const detail = await res.text();
    console.error("Scribe token mint failed:", res.status, detail);
    return NextResponse.json(
      { error: "Token mint failed", status: res.status },
      { status: 500 },
    );
  }
  const data = await res.json();
  return NextResponse.json({ token: data.token });
}

import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";
import { pronunciationMatch } from "@/lib/phonetic";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const audioBlob = formData.get("audio") as File | null;
  const targetWord = formData.get("word") as string | null;
  const languageCode = formData.get("languageCode") as string | null;

  if (!audioBlob || !targetWord || !languageCode) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  try {
    const transcription = await client.speechToText.convert({
      file: audioBlob,
      model_id: "scribe_v2",
      language_code: languageCode,
    });

    const text = transcription.text ?? "";
    const pass = pronunciationMatch(text, targetWord);

    return NextResponse.json({ transcript: text, pass });
  } catch (err) {
    console.error("STT error:", err);
    return NextResponse.json({ error: "STT failed" }, { status: 500 });
  }
}

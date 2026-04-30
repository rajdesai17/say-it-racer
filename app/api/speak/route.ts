import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "elevenlabs";

const client = new ElevenLabsClient({ apiKey: process.env.ELEVENLABS_API_KEY });

export async function POST(req: NextRequest) {
  const { word, voiceId } = await req.json();
  if (!word || !voiceId) {
    return NextResponse.json({ error: "Missing word or voiceId" }, { status: 400 });
  }

  try {
    const audioStream = await client.textToSpeech.convert(voiceId, {
      text: word,
      model_id: "eleven_v3",
      output_format: "mp3_44100_128",
    });

    // Collect stream into buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of audioStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("TTS error:", err);
    return NextResponse.json({ error: "TTS failed" }, { status: 500 });
  }
}

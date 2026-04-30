"use client";

import { useState } from "react";

type Props = {
  word: string;
  voiceId: string;
  onUsed: () => void;
  used: boolean;
};

export default function HearItButton({ word, voiceId, onUsed, used }: Props) {
  const [loading, setLoading] = useState(false);

  const play = async () => {
    if (used || loading) return;
    setLoading(true);
    onUsed();
    try {
      const res = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ word, voiceId }),
      });
      if (!res.ok) throw new Error("TTS failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);
      audio.onended = () => URL.revokeObjectURL(url);
      await audio.play();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={play}
      disabled={used || loading}
      className={`px-5 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all
        ${used
          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          : "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
        }
        disabled:opacity-50`}
      aria-label="Hear correct pronunciation"
    >
      {loading ? "Loading\u2026" : used ? "Heard It" : "\uD83D\uDD0A Hear It"}
    </button>
  );
}

"use client";

import { useRef, useState } from "react";

type Props = {
  targetWord: string;
  languageCode: string;
  onResult: (pass: boolean, transcript: string) => void;
  disabled?: boolean;
};

export default function MicButton({ targetWord, languageCode, onResult, disabled }: Props) {
  const [recording, setRecording] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const start = async () => {
    if (recording || disabled) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    chunksRef.current = [];
    mr.ondataavailable = (e) => chunksRef.current.push(e.data);
    mr.onstop = async () => {
      stream.getTracks().forEach((t) => t.stop());
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const fd = new FormData();
      fd.append("audio", blob, "recording.webm");
      fd.append("word", targetWord);
      fd.append("languageCode", languageCode);
      const res = await fetch("/api/transcribe", { method: "POST", body: fd });
      const data = await res.json();
      onResult(data.pass ?? false, data.transcript ?? "");
    };
    mediaRef.current = mr;
    mr.start();
    setRecording(true);
  };

  const stop = () => {
    mediaRef.current?.stop();
    setRecording(false);
  };

  return (
    <button
      onMouseDown={start}
      onMouseUp={stop}
      onTouchStart={start}
      onTouchEnd={stop}
      disabled={disabled}
      className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all
        ${recording ? "bg-red-600 scale-110" : "bg-zinc-800 hover:bg-zinc-700"}
        ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
        disabled:pointer-events-none`}
      aria-label="Hold to speak"
    >
      {recording && (
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-60" />
      )}
      <svg className="w-7 h-7 text-white relative z-10" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 1a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V5a4 4 0 0 1 4-4zm6.5 9.5A6.5 6.5 0 0 1 5.5 10.5H4a8 8 0 0 0 7 7.93V21h2v-2.57A8 8 0 0 0 20 10.5h-1.5z"/>
      </svg>
    </button>
  );
}

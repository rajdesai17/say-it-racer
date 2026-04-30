"use client";

import { Word } from "@/lib/words";

const cardCSS = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%     { transform: translateX(-10px); }
    40%     { transform: translateX(10px); }
    60%     { transform: translateX(-8px); }
    80%     { transform: translateX(8px); }
  }
  .card-shake {
    animation: shake 0.3s ease-in-out;
  }
`;

type Props = {
  word: Word;
  state: "idle" | "correct" | "wrong";
};

export default function WordCard({ word, state }: Props) {
  const shakeClass = state === "wrong" ? "card-shake" : "";
  const ringClass =
    state === "correct"
      ? "ring-4 ring-green-400"
      : state === "wrong"
        ? "ring-4 ring-red-500"
        : "ring-1 ring-white/10";

  return (
    <div
      className={`relative z-10 flex flex-col items-center gap-3 px-10 py-8 rounded-2xl bg-white/5 backdrop-blur-sm transition-all duration-300 ${ringClass} ${shakeClass}`}
    >
      <style dangerouslySetInnerHTML={{ __html: cardCSS }} />
      <span className="text-xs font-medium tracking-widest text-zinc-400 uppercase">
        {word.language}
      </span>
      <span className="text-5xl font-bold text-white text-center leading-tight">
        {word.word}
      </span>
      <span className="text-sm text-zinc-500 text-center">
        {word.englishMeaning}
      </span>
    </div>
  );
}

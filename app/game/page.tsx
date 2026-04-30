"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { pickRandomWords, Word } from "@/lib/words";
import Road from "@/components/Road";
import WordCard from "@/components/WordCard";
import MicButton from "@/components/MicButton";
import HearItButton from "@/components/HearItButton";

type CardState = "idle" | "correct" | "wrong";
type WordResult = { word: Word; passed: boolean; usedHearIt: boolean };

export default function GamePage() {
  const [words, setWords] = useState<Word[]>([]);
  useEffect(() => {
    setWords(pickRandomWords(10));
  }, []);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [cardState, setCardState] = useState<CardState>("idle");
  const [usedHearIt, setUsedHearIt] = useState(false);
  const [results, setResults] = useState<WordResult[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [flashGreen, setFlashGreen] = useState(false);
  const [micDisabled, setMicDisabled] = useState(false);
  const streakRef = useRef(0);

  const currentWord = words[index];

  const advance = useCallback(
    (passed: boolean, usedHear: boolean) => {
      const word = currentWord;
      if (!word) return;
      const points = usedHear ? 1 : 3;
      let bonus = 0;
      if (!usedHear) {
        streakRef.current += 1;
        if (streakRef.current % 3 === 0) bonus = 2;
        setStreak(streakRef.current);
      } else {
        streakRef.current = 0;
        setStreak(0);
      }

      setScore((s) => s + points + bonus);
      setResults((r) => [
        ...r,
        { word, passed, usedHearIt: usedHear },
      ]);
      setFlashGreen(true);

      setTimeout(() => {
        setFlashGreen(false);
        setCardState("idle");
        setUsedHearIt(false);
        setMicDisabled(false);
        if (index + 1 >= words.length) {
          setGameOver(true);
        } else {
          setIndex((i) => i + 1);
        }
      }, 600);
    },
    [currentWord, index, words.length],
  );

  const handleResult = useCallback(
    (pass: boolean) => {
      if (pass) {
        setCardState("correct");
        setMicDisabled(true);
        advance(true, usedHearIt);
      } else {
        setCardState("wrong");
        setTimeout(() => setCardState("idle"), 400);
      }
    },
    [advance, usedHearIt],
  );

  if (!currentWord && !gameOver) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="text-zinc-500 text-sm">Loading…</span>
      </div>
    );
  }

  const copyScore = () => {
    const lines = results.map(
      (r, i) =>
        `${i + 1}. ${r.word.word} (${r.word.language}) — ${r.passed ? "✅" : "❌"}${r.usedHearIt ? " 🔊" : ""}`,
    );
    const text = `Say It Score: ${score}/36\n\n${lines.join("\n")}`;
    navigator.clipboard.writeText(text);
  };

  if (gameOver) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center gap-6 px-6">
        <h1 className="text-4xl font-bold text-white">Game Over!</h1>
        <p className="text-6xl font-black text-indigo-400">
          {score} <span className="text-2xl text-zinc-400">/ 36 pts</span>
        </p>
        <div className="w-full max-w-md flex flex-col gap-2">
          {results.map((r, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2 rounded-lg bg-white/5 text-sm"
            >
              <span className="text-white font-semibold">{r.word.word}</span>
              <span className="text-zinc-400">{r.word.language}</span>
              <span>
                {r.passed ? "✅" : "❌"}
                {r.usedHearIt ? " 🔊" : ""}
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-4 mt-2">
          <button
            onClick={copyScore}
            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-all"
          >
            📋 Copy Score Card
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600 text-white font-semibold transition-all"
          >
            🔄 Play Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Road />

      {/* Green flash overlay */}
      {flashGreen && (
        <div className="fixed inset-0 z-50 bg-green-500/30 pointer-events-none animate-pulse" />
      )}

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-2">
        <span className="text-white font-bold text-lg">{score} pts</span>
        <span className="text-2xl">
          {streak >= 3 ? `🔥 ${streak}` : streak > 0 ? `⚡ ${streak}` : ""}
        </span>
        <span className="text-zinc-400 text-sm font-medium">
          {index + 1} / {words.length}
        </span>
      </div>

      {/* Center word card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <WordCard word={currentWord} state={cardState} />
      </div>

      {/* Bottom controls */}
      <div className="relative z-10 flex items-center justify-between px-10 pb-10">
        <MicButton
          targetWord={currentWord.word}
          languageCode={currentWord.languageCode}
          onResult={handleResult}
          disabled={micDisabled}
        />
        <HearItButton
          word={currentWord.word}
          voiceId={currentWord.voiceId}
          used={usedHearIt}
          onUsed={() => setUsedHearIt(true)}
        />
      </div>
    </div>
  );
}

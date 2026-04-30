"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScribe, CommitStrategy } from "@elevenlabs/react";
import { AnimatePresence, motion } from "motion/react";
import { pickRandomWords, Word } from "@/lib/words";
import { pronunciationMatch } from "@/lib/phonetic";
import Road from "@/components/Road";
import WordCard from "@/components/WordCard";
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
  const [partial, setPartial] = useState("");
  const [micError, setMicError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const streakRef = useRef(0);
  const lockRef = useRef(false);
  const audioUrlRef = useRef<string | null>(null);

  const currentWord = words[index];
  const currentWordRef = useRef(currentWord);
  useEffect(() => {
    currentWordRef.current = currentWord;
  }, [currentWord]);
  const usedHearItRef = useRef(usedHearIt);
  useEffect(() => {
    usedHearItRef.current = usedHearIt;
  }, [usedHearIt]);
  const indexRef = useRef(index);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);
  const wordsLenRef = useRef(words.length);
  useEffect(() => {
    wordsLenRef.current = words.length;
  }, [words.length]);

  const advance = useCallback((passed: boolean, usedHear: boolean) => {
    const word = currentWordRef.current;
    if (!word || lockRef.current) return;
    lockRef.current = true;

    let points = 0;
    let bonus = 0;
    if (passed) {
      points = usedHear ? 1 : 3;
      if (!usedHear) {
        streakRef.current += 1;
        if (streakRef.current % 3 === 0) bonus = 2;
        setStreak(streakRef.current);
      } else {
        streakRef.current = 0;
        setStreak(0);
      }
    } else {
      streakRef.current = 0;
      setStreak(0);
    }

    setScore((s) => s + points + bonus);
    setResults((r) => [...r, { word, passed, usedHearIt: usedHear }]);
    setCardState(passed ? "correct" : "idle");
    if (passed) setFlashGreen(true);
    setPartial("");

    const delay = passed ? 600 : 250;
    setTimeout(() => {
      setFlashGreen(false);
      setCardState("idle");
      setUsedHearIt(false);
      const nextIdx = indexRef.current + 1;
      if (nextIdx >= wordsLenRef.current) {
        setGameOver(true);
      } else {
        setIndex(nextIdx);
      }
      lockRef.current = false;
    }, delay);
  }, []);

  const handleSkip = useCallback(() => {
    if (lockRef.current) return;
    advance(false, usedHearItRef.current);
  }, [advance]);

  const handleCommitted = useCallback(
    (text: string) => {
      if (lockRef.current) return;
      const word = currentWordRef.current;
      if (!word || !text.trim()) return;
      if (pronunciationMatch(text, word.word)) {
        advance(true, usedHearItRef.current);
      } else {
        setCardState("wrong");
        setTimeout(
          () => setCardState((s) => (s === "wrong" ? "idle" : s)),
          400,
        );
      }
    },
    [advance],
  );

  const onPartialTranscript = useCallback(
    (d: { text: string }) => setPartial(d.text),
    [],
  );
  const onCommittedTranscript = useCallback(
    (d: { text: string }) => handleCommitted(d.text),
    [handleCommitted],
  );
  const onScribeError = useCallback((e: Error | Event) => {
    const msg =
      typeof e === "object" && e && "message" in e
        ? (e as Error).message
        : "Mic error";
    setMicError(msg);
  }, []);
  const onAuthError = useCallback(
    () => setMicError("Auth failed — check API key"),
    [],
  );

  const scribe = useScribe({
    modelId: "scribe_v2_realtime",
    commitStrategy: CommitStrategy.VAD,
    vadSilenceThresholdSecs: 0.4,
    minSpeechDurationMs: 150,
    onPartialTranscript,
    onCommittedTranscript,
    onError: onScribeError,
    onAuthError,
  });

  useEffect(() => {
    if (words.length === 0) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/scribe-token");
        if (!res.ok) throw new Error("Token mint failed");
        const { token } = await res.json();
        if (cancelled) return;
        await scribe.connect({
          token,
          microphone: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
        });
      } catch (e) {
        setMicError((e as Error).message);
      }
    })();
    return () => {
      cancelled = true;
      scribe.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [words.length]);

  const copyScore = () => {
    const lines = results.map(
      (r, i) =>
        `${i + 1}. ${r.word.word} (${r.word.language}) — ${r.passed ? "✅" : "⏭️"}${r.usedHearIt ? " 🔊" : ""}`,
    );
    const text = `Say It Score: ${score}/36\n\n${lines.join("\n")}`;
    navigator.clipboard.writeText(text);
  };

  const onPlayStart = useCallback(() => {
    lockRef.current = true;
  }, []);
  const onPlayEnd = useCallback(() => {
    setTimeout(() => {
      lockRef.current = false;
    }, 1500);
  }, []);

  useEffect(() => {
    if (!currentWord) return;
    let cancelled = false;
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
    setAudioUrl(null);
    (async () => {
      try {
        const res = await fetch("/api/speak", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            word: currentWord.word,
            voiceId: currentWord.voiceId,
          }),
        });
        if (cancelled || !res.ok) return;
        const blob = await res.blob();
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        setAudioUrl(url);
      } catch (e) {
        if (!cancelled) {
          console.error("Audio preload failed:", e);
          setMicError("Audio preload failed — Hear It unavailable for this word");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [currentWord]);

  useEffect(() => {
    return () => {
      if (audioUrlRef.current) URL.revokeObjectURL(audioUrlRef.current);
    };
  }, []);

  if (!currentWord && !gameOver) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="text-zinc-500 text-sm">Loading…</span>
      </div>
    );
  }

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
                {r.passed ? "✅" : "⏭️"}
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

  const statusLabel =
    scribe.status === "transcribing"
      ? "Listening…"
      : scribe.status === "connected"
        ? "Ready"
        : scribe.status === "connecting"
          ? "Connecting…"
          : scribe.status === "error"
            ? "Error"
            : "Idle";

  return (
    <div className="min-h-screen flex flex-col overflow-hidden">
      <Road />
      {flashGreen && (
        <div className="fixed inset-0 z-50 bg-green-500/30 pointer-events-none animate-pulse" />
      )}

      <div className="relative z-10 flex items-center justify-between px-6 pt-5 pb-2">
        <span className="text-white font-bold text-lg">{score} pts</span>
        <span className="text-2xl">
          {streak >= 3 ? `🔥 ${streak}` : streak > 0 ? `⚡ ${streak}` : ""}
        </span>
        <span className="text-zinc-400 text-sm font-medium">
          {index + 1} / {words.length}
        </span>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 gap-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ y: -240, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 240, opacity: 0, scale: 0.85 }}
            transition={{ type: "spring", stiffness: 220, damping: 24 }}
          >
            <WordCard word={currentWord!} state={cardState} />
          </motion.div>
        </AnimatePresence>
        <div className="text-zinc-400 text-sm h-6 italic">
          {partial && `🎤 ${partial}`}
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between px-10 pb-10">
        <div className="flex items-center gap-3">
          <span
            className={`relative w-3 h-3 rounded-full ${
              scribe.isTranscribing
                ? "bg-red-500"
                : scribe.isConnected
                  ? "bg-green-500"
                  : "bg-zinc-700"
            }`}
          >
            {scribe.isTranscribing && (
              <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75" />
            )}
          </span>
          <span className="text-xs text-zinc-400 font-medium">
            {statusLabel}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <HearItButton
            audioUrl={audioUrl}
            used={usedHearIt}
            onUsed={() => setUsedHearIt(true)}
            onPlayStart={onPlayStart}
            onPlayEnd={onPlayEnd}
          />
          <button
            onClick={handleSkip}
            className="px-4 py-3 rounded-xl text-sm font-semibold tracking-wide bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all"
            aria-label="Skip this word"
          >
            ⏭️ Skip
          </button>
        </div>
      </div>

      {micError && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-500/90 text-white text-xs px-3 py-2 rounded-lg max-w-xs">
          {micError}
        </div>
      )}
    </div>
  );
}

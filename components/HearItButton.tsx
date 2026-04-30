"use client";

type Props = {
  audioUrl: string | null;
  onUsed: () => void;
  used: boolean;
  onPlayStart?: () => void;
  onPlayEnd?: () => void;
};

export default function HearItButton({
  audioUrl,
  onUsed,
  used,
  onPlayStart,
  onPlayEnd,
}: Props) {
  const ready = !!audioUrl;

  const play = () => {
    if (used || !audioUrl) return;
    onUsed();
    const audio = new Audio(audioUrl);
    audio.onended = () => onPlayEnd?.();
    audio.onerror = () => onPlayEnd?.();
    onPlayStart?.();
    audio.play().catch(() => onPlayEnd?.());
  };

  const label = !ready ? "Loading…" : used ? "Heard It" : "🔊 Hear It";

  return (
    <button
      onClick={play}
      disabled={used || !ready}
      className={`px-5 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all
        ${used
          ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
          : ready
            ? "bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer"
            : "bg-zinc-800 text-zinc-500 cursor-wait"
        }
        disabled:opacity-50`}
      aria-label="Hear correct pronunciation"
    >
      {label}
    </button>
  );
}

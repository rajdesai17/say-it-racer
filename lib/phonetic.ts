function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, " ");
}

function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let prev = i - 1;
    dp[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = dp[j];
      dp[j] =
        a[i - 1] === b[j - 1]
          ? prev
          : 1 + Math.min(prev, dp[j], dp[j - 1]);
      prev = tmp;
    }
  }
  return dp[b.length];
}

export function pronunciationMatch(
  transcript: string,
  target: string,
): boolean {
  const t = normalize(transcript);
  const w = normalize(target);
  if (!t || !w) return false;
  if (t === w) return true;
  if (t.includes(w) || w.includes(t)) return true;
  const dist = levenshtein(t, w);
  const threshold = Math.max(1, Math.floor(w.length * 0.25));
  return dist <= threshold;
}

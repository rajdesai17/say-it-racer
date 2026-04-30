import { DoubleMetaphone } from "natural";

const dm = new DoubleMetaphone();

export function pronunciationMatch(transcript: string, target: string): boolean {
  const normalize = (s: string) =>
    s.toLowerCase().trim().replace(/[^a-z\s]/g, "");

  const t = normalize(transcript);
  const w = normalize(target);

  if (t === w) return true;
  if (t.includes(w) || w.includes(t)) return true;

  // Phonetic fallback — only works well for Latin-script words
  try {
    const tCodes = dm.process(t) as [string, string];
    const wCodes = dm.process(w) as [string, string];
    const tSet = new Set(tCodes.filter(Boolean));
    const wSet = new Set(wCodes.filter(Boolean));
    for (const code of tSet) {
      if (wSet.has(code)) return true;
    }
  } catch {
    // ignore phonetic errors for non-Latin scripts
  }

  return false;
}

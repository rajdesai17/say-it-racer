export type Word = {
  word: string;
  language: string;
  languageCode: string;
  voiceId: string;
  englishMeaning: string;
};

const GEORGE = "JBFqnCBsd6RMkjVDRZzb";
const JESSICA = "cgSgspJ2msm6clMCkdW9";

export const ALL_WORDS: Word[] = [
  { word: "Bonjour", language: "French", languageCode: "fra", voiceId: GEORGE, englishMeaning: "Hello / Good day" },
  { word: "Merci", language: "French", languageCode: "fra", voiceId: GEORGE, englishMeaning: "Thank you" },
  { word: "Au revoir", language: "French", languageCode: "fra", voiceId: GEORGE, englishMeaning: "Goodbye" },
  { word: "Boulangerie", language: "French", languageCode: "fra", voiceId: GEORGE, englishMeaning: "Bakery" },
  { word: "Grenouille", language: "French", languageCode: "fra", voiceId: GEORGE, englishMeaning: "Frog" },
  { word: "Schadenfreude", language: "German", languageCode: "deu", voiceId: GEORGE, englishMeaning: "Joy at others' misfortune" },
  { word: "Weltanschauung", language: "German", languageCode: "deu", voiceId: GEORGE, englishMeaning: "World view / philosophy of life" },
  { word: "Fingerspitzengefühl", language: "German", languageCode: "deu", voiceId: GEORGE, englishMeaning: "Tactful sensitivity / finesse" },
  { word: "Donaudampfschifffahrt", language: "German", languageCode: "deu", voiceId: GEORGE, englishMeaning: "Danube steamship shipping" },
  { word: "Murciélago", language: "Spanish", languageCode: "spa", voiceId: JESSICA, englishMeaning: "Bat (the animal)" },
  { word: "Ferrocarril", language: "Spanish", languageCode: "spa", voiceId: JESSICA, englishMeaning: "Railway / railroad" },
  { word: "Mariposa", language: "Spanish", languageCode: "spa", voiceId: JESSICA, englishMeaning: "Butterfly" },
  { word: "Paraguas", language: "Spanish", languageCode: "spa", voiceId: JESSICA, englishMeaning: "Umbrella" },
  { word: "Hajimemashite", language: "Japanese", languageCode: "jpn", voiceId: JESSICA, englishMeaning: "Nice to meet you (first meeting)" },
  { word: "Yoroshiku", language: "Japanese", languageCode: "jpn", voiceId: JESSICA, englishMeaning: "Please treat me well" },
  { word: "Otsukaresama", language: "Japanese", languageCode: "jpn", voiceId: JESSICA, englishMeaning: "Thank you for your hard work" },
  { word: "Marhaba", language: "Arabic", languageCode: "ara", voiceId: JESSICA, englishMeaning: "Welcome / Hello" },
  { word: "Shukran", language: "Arabic", languageCode: "ara", voiceId: JESSICA, englishMeaning: "Thank you" },
  { word: "Inshallah", language: "Arabic", languageCode: "ara", voiceId: JESSICA, englishMeaning: "If God wills it" },
  { word: "Worcestershire", language: "English", languageCode: "eng", voiceId: GEORGE, englishMeaning: "A county / famous sauce (pronounced 'Wooster-sher')" },
  { word: "Squirrel", language: "English", languageCode: "eng", voiceId: GEORGE, englishMeaning: "A bushy-tailed rodent that collects nuts" },
  { word: "Defibrillator", language: "English", languageCode: "eng", voiceId: GEORGE, englishMeaning: "Device that restores heart rhythm with a shock" },
  { word: "Otorhinolaryngologist", language: "English", languageCode: "eng", voiceId: GEORGE, englishMeaning: "Ear, nose, and throat doctor (ENT)" },
  { word: "Quinoa", language: "English", languageCode: "eng", voiceId: GEORGE, englishMeaning: "A grain-like seed, pronounced 'keen-wah'" },
  { word: "Phenomenon", language: "English", languageCode: "eng", voiceId: GEORGE, englishMeaning: "An observable event or fact" },
  { word: "Anästhesie", language: "German", languageCode: "deu", voiceId: GEORGE, englishMeaning: "Anesthesia" },
  { word: "Bureaucratie", language: "French", languageCode: "fra", voiceId: GEORGE, englishMeaning: "Bureaucracy / red tape" },
  { word: "Electroencefalograma", language: "Spanish", languageCode: "spa", voiceId: JESSICA, englishMeaning: "Electroencephalogram (EEG)" },
  { word: "Nakamura", language: "Japanese", languageCode: "jpn", voiceId: JESSICA, englishMeaning: "A common Japanese surname" },
  { word: "Habibi", language: "Arabic", languageCode: "ara", voiceId: JESSICA, englishMeaning: "My dear / my love (term of endearment)" },
];

export function pickRandomWords(count = 10): Word[] {
  const shuffled = [...ALL_WORDS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

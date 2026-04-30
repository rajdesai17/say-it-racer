# Say It Racer

**Say It Racer** is a fast, arcade-style pronunciation game built for the **Zed × ElevenLabs game challenge / #ElevenHacks**. The player races through a 10-word multilingual pronunciation course, speaks each word into the microphone, and gets instant AI-powered feedback.

The twist: you can tap **Hear It** to hear the correct pronunciation, but using the hint lowers your score. Clean pronunciation, quick reactions, and no-hint streaks are the fastest way to reach the perfect score.

## Hackathon Pitch

This project was built for the challenge to create a polished game experience with **Zed** and **ElevenLabs APIs**.

- **Zed** was used as the high-performance, AI-assisted development environment for rapidly building and refining the game.
- **ElevenLabs Speech-to-Text** powers the pronunciation check after each spoken attempt.
- **ElevenLabs Text-to-Speech** powers the optional pronunciation hint so the player can hear the target word before trying again.

The result is a compact, replayable game where audio is not just decoration — it is the core mechanic.

## What You Do

1. A word appears on the road.
2. Hold the mic button and say it out loud.
3. ElevenLabs transcribes your speech.
4. The game checks whether your pronunciation matches the target word.
5. If you get stuck, use **Hear It** to hear the correct pronunciation.
6. Chase a perfect no-hint score before the round ends.

## Why It Fits the Challenge

The challenge asks for smaller, polished game experiences where audio creates emotion, immersion, or delight. **Say It Racer** keeps the scope focused and makes voice interaction the heart of the game:

- The player has to speak to progress.
- The game gives immediate feedback through speech recognition.
- TTS hints make the game more approachable while creating a meaningful scoring tradeoff.
- The moving-road visual style gives a simple arcade rhythm that works well for a short viral gameplay clip.

## Features

- 10-word randomized pronunciation rounds
- Words from French, German, Spanish, Japanese, Arabic, and English
- Browser microphone recording
- ElevenLabs speech-to-text pronunciation checks
- ElevenLabs text-to-speech pronunciation hints
- Streaks, bonus points, and perfect-score chasing
- Animated road background for an arcade feel
- Copyable end-of-game scorecard

## Scoring

- Correct without using **Hear It**: **3 points**
- Correct after using **Hear It**: **1 point**
- Every 3-answer no-hint streak: **+2 bonus points**
- Perfect score: **36 points**

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [ElevenLabs](https://elevenlabs.io/) API
- [natural](https://www.npmjs.com/package/natural) for phonetic fallback matching
- TypeScript

## ElevenLabs Integration

### Speech-to-Text

`/api/transcribe` accepts browser-recorded audio and sends it to ElevenLabs speech-to-text. The returned transcript is compared against the target word using exact, partial, and phonetic matching.

### Text-to-Speech

`/api/speak` generates an audio pronunciation of the displayed word using ElevenLabs text-to-speech. This powers the **Hear It** hint button.

## Project Structure

```text
app/
  api/
    speak/route.ts       # ElevenLabs text-to-speech endpoint
    transcribe/route.ts  # ElevenLabs speech-to-text endpoint
  game/page.tsx          # Main game UI and state
components/
  HearItButton.tsx       # Plays correct pronunciation
  MicButton.tsx          # Records and submits microphone audio
  Road.tsx               # Animated road background
  WordCard.tsx           # Displays the current word
lib/
  phonetic.ts            # Transcript/word matching logic
  words.ts               # Word list and random selection
```

## Requirements

- Node.js compatible with Next.js 16
- npm
- An ElevenLabs API key
- A browser with microphone support

## Environment Variables

Create a local environment file:

```bash
.env.local
```

Add your ElevenLabs API key:

```bash
ELEVENLABS_API_KEY=your_api_key_here
```

Do not commit `.env.local` or any real API keys. This repo's `.gitignore` ignores `.env*` files.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The home page redirects to `/game`.

## Available Scripts

```bash
npm run dev
```

Starts the Next.js development server.

```bash
npm run build
```

Builds the app for production.

```bash
npm run start
```

Starts the production server after a production build.

```bash
npm run lint
```

Runs ESLint.

## Submission Notes

For the Zed × ElevenLabs challenge, the gameplay video should focus on:

- The mic interaction: hold, speak, release
- The ElevenLabs transcription feedback loop
- The **Hear It** TTS hint and score tradeoff
- The tension of maintaining a no-hint streak
- The final scorecard

When posting the submission, tag **@zeddotdev** and **@elevenlabsio** and use **#ElevenHacks**.

## Important Deployment Notes

The ElevenLabs API key is used only on the server side, but the app exposes API routes that call paid ElevenLabs services:

- `/api/speak`
- `/api/transcribe`

Before deploying publicly, consider adding:

- Rate limiting
- Request size limits for audio uploads
- Validation that submitted words, voice IDs, and language codes are from the known word list
- Abuse protection such as sessions, CAPTCHA, or authentication
- More detailed API error handling

Without those protections, a public deployment could allow others to consume your ElevenLabs quota.

## Known Limitations

- Failed pronunciations currently keep the player on the same word rather than recording a failed result.
- Microphone permission or network failures may not show detailed user-facing errors.
- Scores are client-side and should not be treated as tamper-proof.
- The pronunciation matcher is intentionally lightweight and may be imperfect for non-Latin or accented words.

## Troubleshooting

### Microphone does not work

- Make sure the browser has microphone permission.
- Use `localhost` or HTTPS; most browsers restrict microphone access on insecure origins.
- Check the browser console and server logs for errors.

### ElevenLabs requests fail

- Confirm `ELEVENLABS_API_KEY` is set in `.env.local`.
- Restart the dev server after changing environment variables.
- Check your ElevenLabs account quota and API access.

### Linting fails because of missing modules

If `npm run lint` fails with a dependency resolution error, try a clean reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

On Windows PowerShell, use:

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

## License

Private project / hackathon submission.

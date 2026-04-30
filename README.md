# Say It — Pronunciation Game

A browser-based pronunciation game built with Next.js. Players are shown words from several languages, hold the microphone button to say the word aloud, and receive pronunciation feedback using ElevenLabs speech-to-text. A "Hear It" button can play the correct pronunciation using ElevenLabs text-to-speech.

## Features

- Random 10-word pronunciation rounds
- Words across French, German, Spanish, Japanese, Arabic, and English
- Microphone recording from the browser
- ElevenLabs speech-to-text pronunciation checks
- ElevenLabs text-to-speech pronunciation hints
- Score, streak, and bonus-point tracking
- Copyable end-of-game scorecard

## Tech Stack

- [Next.js](https://nextjs.org/) 16
- [React](https://react.dev/) 19
- [Tailwind CSS](https://tailwindcss.com/) 4
- [ElevenLabs](https://elevenlabs.io/) API
- [natural](https://www.npmjs.com/package/natural) for phonetic fallback matching
- TypeScript

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

Do not commit `.env.local` or any real API keys. The project `.gitignore` already ignores `.env*` files.

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

Starts the production server after a build.

```bash
npm run lint
```

Runs ESLint.

## How the Game Works

1. The app randomly selects 10 words from `lib/words.ts`.
2. The player holds the microphone button and says the displayed word.
3. The recording is sent to `/api/transcribe`.
4. The server sends the audio to ElevenLabs speech-to-text.
5. The returned transcript is compared against the target word in `lib/phonetic.ts`.
6. Correct answers advance to the next word and award points.
7. The player can use "Hear It" to play the correct pronunciation through `/api/speak`.

## Scoring

- Correct without using "Hear It": 3 points
- Correct after using "Hear It": 1 point
- Every 3-answer no-hint streak: +2 bonus points
- Maximum displayed score: 36 points

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
- The pronunciation matcher is simple and may be imperfect for non-Latin or accented words.

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
  Road.tsx               # Animated background
  WordCard.tsx           # Displays the current word
lib/
  phonetic.ts            # Transcript/word matching logic
  words.ts               # Word list and random selection
```

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

Private project.

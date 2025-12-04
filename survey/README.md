# Valicy AI Confidence Pulse

An interactive, multi-step survey built with Next.js and TypeScript that measures employee readiness for AI adoption. The flow combines structured Likert scoring, readiness checkpoints, and rich qualitative prompts, then posts a validated payload to an API for downstream analysis.

## Features
- Five-stage wizard with live progress, guardrail messaging, and responsive neon-inspired UI.
- Modern question set covering role, location, tenure, confidence signals, risk/readiness checks, and narrative feedback.
- Client-side validation with Zod and structured logging on both client and API handler paths.
- Optional JSON export of submitted answers plus readiness snapshot on completion.
- Unit tests for the UI flow and integration tests for the `/api/insights` endpoint.

## Prerequisites
- Node.js 18+
- npm (bundled with Node.js)

## Getting Started

```bash
npm install
npm run dev
```

The survey runs at [http://localhost:3000](http://localhost:3000).

### Production build
```bash
npm run build
npm start
```

### Testing
```bash
npm test
```

### Linting & formatting
```bash
npm run lint
npm run format
```

## API
`POST /api/insights` consumes the validated payload returned by the client. Requests are Zod-validated and return `405` for non-POST calls, `400` on validation failure, and `200` on success.

## Security & Observability
- Client and server validations prevent malformed payloads from being processed.
- Structured JSON logging avoids sensitive data while still recording key events.
- Guidance in the UI discourages sharing confidential details.

## Deployment notes
- Dockerfile uses a multi-stage build (Node 22 slim) and runs as non-root.
- Provide any environment variables through `.env.local` or Compose overrides if needed.

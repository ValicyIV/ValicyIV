# Valicy AI Sentiment Survey

A single-page React experience that captures employee sentiment toward the company's AI strategy and forwards structured insights to the admin dashboard for analysis and visualization.

## Features
- Multi-step survey capturing role, department, five Likert-scale sentiment scores, and three qualitative answers.
- Neon console-inspired UI with animated background, progress indicator, and validation to keep responses consistent.
- Structured payload builder that summarizes sentiment, sends insights to `/api/insights`, and gracefully handles offline/timeout scenarios.
- Downloadable JSON export containing the same structured payload for manual sharing when the dashboard is unavailable.

## Project Structure
- `survey/AI_sentiment.js` — the full React component, including UI elements, payload construction, admin sync workflow, and download helper.

## Running the Survey
1. Add the component to your React/Next.js app (e.g., import it into a page or route and render `<App />`).
2. Ensure Tailwind-compatible styling or global styles are available for the utility classes used throughout the component.
3. Provide an API endpoint at `POST /api/insights` that accepts the payload produced by `buildSubmissionPayload()` and returns a non-error HTTP status on success.

### Payload Shape
```json
{
  "respondent": { "department": "Engineering", "role": "Developer" },
  "sentimentScores": [ { "id": "optimism", "question": "...", "score": 4 } ],
  "qualitative": [ { "id": "useCases", "label": "...", "response": "..." } ],
  "summary": { "avg": "3.8", "text": "MODERATE ALIGNMENT" },
  "capturedAt": "2025-12-03T00:00:00.000Z"
}
```

### Manual Export
If the admin dashboard is unreachable, the success screen offers a **Download Raw Data (.JSON)** button. The exported file includes metadata and the structured payload for manual handoff.

## Testing
Automated tests are not currently defined in this repository. Running `npm test` fails because there is no `package.json` or test harness yet. Integrate the component into your app to exercise it end-to-end.

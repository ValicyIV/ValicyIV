# Valicy AI Sentiment Survey

A single-page React experience that captures employee sentiment toward the company's AI strategy and forwards structured insights to the admin dashboard for analysis and visualization.

## Features
- Multi-step survey capturing role, department, five Likert-scale sentiment scores, and three qualitative answers.
- Neon console-inspired UI with animated background, progress indicator, and validation to keep responses consistent.
- Structured payload builder that summarizes sentiment, sends insights to `/api/insights`, and gracefully handles offline/timeout scenarios.
- Downloadable JSON export containing the same structured payload for manual sharing when the dashboard is unavailable.

## Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn package manager

### Installing Node.js and npm

If you see an error like `npm : The term 'npm' is not recognized`, Node.js is not installed or not in your system PATH.

**Windows:**
1. Download Node.js from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Restart your terminal/PowerShell after installation
4. Verify installation:
   ```powershell
   node --version
   npm --version
   ```

**Alternative (using Chocolatey on Windows):**
```powershell
choco install nodejs
```

**Alternative (using winget on Windows):**
```powershell
winget install OpenJS.NodeJS
```

After installing Node.js, restart your terminal and try `npm install` again.

## Installation

1. Navigate to the survey directory:
```bash
cd survey
```

2. Install dependencies:
```bash
npm install
```

## Running the Survey

### Development Mode

Start the development server:
```bash
npm run dev
```

The survey will be available at `http://localhost:3000` in your browser.

The survey is automatically loaded on the home page (`pages/index.js`), which imports and renders the `AI_sentiment` component.

### Production Build

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The production build will be available at `http://localhost:3000`.

## Project Structure

```
survey/
├── AI_sentiment.js          # Main survey component
├── pages/
│   ├── _app.js              # Next.js app wrapper with global styles
│   ├── index.js             # Home page that renders the survey
│   └── api/
│       └── insights.js      # API endpoint for receiving survey data
├── styles/
│   └── globals.css          # Global styles and Tailwind imports
├── __tests__/
│   ├── survey/
│   │   └── AI_sentiment.test.js  # Component tests
│   └── utils/
│       └── test-utils.js     # Test utilities
├── insights.test.js          # API endpoint tests
├── package.json             # Dependencies and scripts
├── next.config.js           # Next.js configuration
├── jest.config.js           # Jest test configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## API Endpoint

The survey sends data to `POST /api/insights`. The endpoint is located at `pages/api/insights.js` and handles:

- Validation of survey payload
- Storage of survey responses (currently logs to console; database integration needed)
- Returns success/error responses

### Payload Shape

The API expects the following payload structure:

```json
{
  "respondent": {
    "department": "Engineering",
    "role": "Software Engineer"
  },
  "sentimentScores": [
    {
      "id": "optimism",
      "question": "Level of optimism on AI pipeline integration (1=Low, 5=High)",
      "score": 4
    },
    {
      "id": "efficiency",
      "question": "Expected speedup of specific daily tasks (1=None, 5=Significant)",
      "score": 5
    },
    {
      "id": "security",
      "question": "Concern level: AI replacing creative aspects (1=Low, 5=High)",
      "score": 3
    },
    {
      "id": "quality",
      "question": "Confidence level: AI-generated quality standards (1=Low, 5=High)",
      "score": 4
    },
    {
      "id": "ethics",
      "question": "Concern level: Copyright and ethical implications (1=Low, 5=High)",
      "score": 2
    }
  ],
  "qualitative": [
    {
      "id": "useCases",
      "label": "TARGETED ASSISTANCE (TASK)",
      "response": "Code review assistance"
    },
    {
      "id": "roadblocks",
      "label": "HESITATION/ROADBLOCKS",
      "response": "Privacy concerns"
    },
    {
      "id": "blueSky",
      "label": "#1 HYPOTHETICAL ASK",
      "response": "Automate testing workflows"
    }
  ],
  "summary": {
    "avg": "3.6",
    "text": "MODERATE ALIGNMENT"
  },
  "capturedAt": "2025-12-03T00:00:00.000Z"
}
```

## Manual Export

If the admin dashboard is unreachable, the success screen offers a **Download Raw Data (.JSON)** button. The exported file includes metadata and the structured payload for manual handoff.

## Testing

Run the test suite:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Test Files
- `insights.test.js` - Tests for the `/api/insights` endpoint
- `__tests__/survey/AI_sentiment.test.js` - Tests for the survey component
- `__tests__/utils/test-utils.js` - Test utilities and helpers

## Additional Scripts

- `npm run lint` - Run ESLint to check code quality
- `npm run build` - Build the application for production
- `npm start` - Start the production server (after building)

## Styling

The project uses Tailwind CSS with custom neon-themed styling. Global styles are imported in `pages/_app.js` from `styles/globals.css`. The Tailwind configuration includes custom colors, fonts, and box shadows for the neon console aesthetic.

## Troubleshooting

### npm Command Not Found

If you see `npm : The term 'npm' is not recognized`:
- Node.js is not installed or not in your PATH
- See the [Installing Node.js and npm](#installing-nodejs-and-npm) section above
- After installing, restart your terminal/PowerShell

### Port 3000 Already in Use

If you see an error about port 3000 being in use:
```bash
# Windows PowerShell
netstat -ano | findstr :3000
# Then kill the process or use a different port:
npm run dev -- -p 3001
```

### Module Not Found Errors

If you see module not found errors after installation:

**Windows PowerShell:**
```powershell
# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install
```

**Windows CMD:**
```cmd
rmdir /s /q node_modules
npm install
```

**Mac/Linux:**
```bash
rm -r node_modules
npm install
```

### Build Errors

If you encounter build errors:
1. Clear the Next.js cache:

   **Windows PowerShell:**
   ```powershell
   Remove-Item -Recurse -Force .next
   npm run build
   ```

   **Windows CMD:**
   ```cmd
   rmdir /s /q .next
   npm run build
   ```

   **Mac/Linux:**
   ```bash
   rm -r .next
   npm run build
   ```

2. Ensure all dependencies are installed:
   ```bash
   npm install
   ```

## Notes

- The API endpoint currently logs survey data to the console. In production, you should integrate with your database/backend system to store responses.
- The survey component is fully self-contained and can be imported into other Next.js pages if needed.
- All survey-related files are organized in the `survey/` directory for easy portability.

## Running the Project with Docker

This project includes a multi-stage Docker setup for building and running the Next.js application in a production environment. The provided `Dockerfile` and `docker-compose.yml` files are tailored for this project and require no external services.

### Requirements
- **Node.js Version:** The Dockerfile uses `node:22.13.1-slim`. No other versions are supported by default.
- **No external databases or caches** are required or configured.

### Environment Variables
- No required environment variables are specified in the Docker or Compose files by default.
- If you need to add environment variables, uncomment and use the `env_file` section in `docker-compose.yml`.

### Build and Run Instructions
1. **Build and start the app:**
   ```sh
   docker compose up --build
   ```
   This will build the Docker image using the provided Dockerfile and start the Next.js app.

2. **Access the app:**
   - The application will be available at [http://localhost:3000](http://localhost:3000)

### Ports
- **3000:** The Next.js app is exposed on port 3000 (mapped to your host).

### Special Configuration
- The Dockerfile uses a multi-stage build to optimize image size and security:
  - Installs all dependencies, builds the app, then installs only production dependencies for the final image.
  - Runs the app as a non-root user for improved security.
- No persistent volumes or custom networks are configured by default.

---

*This section was updated to reflect the latest Docker-based setup. If you add environment variables or external services (like a database), update the Docker Compose file and this section accordingly.*

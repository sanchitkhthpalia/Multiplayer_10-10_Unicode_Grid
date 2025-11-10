# Multiplayer 10×10 Unicode Grid Web App

A multiplayer real-time web app where all connected players share a global 10×10 grid and can submit a Unicode character to any cell. Built with React (TypeScript) and Node.js + Express + Socket.IO.

## Features

- **Shared 10×10 grid** for all players
- **Real-time updates** via Socket.IO
- **Player count** visible to everyone
- **Submission rule**: a player can submit once; optionally a timed restriction allows re-submission after cooldown
- **Optional timed restriction** (default: enabled, 60s)
- **Optional history mode** storing all updates with timestamps and player IDs
- **Endpoints**: `/grid`, `/history`

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, Socket.IO
- **Frontend**: React, TypeScript, Vite

## Getting Started

### Prerequisites

- Node.js 18+

### 1) Start the Server

```bash
# In a new terminal
npm install --prefix server
npm run dev --prefix server
```

Server runs on http://localhost:3001 by default.

Environment variables (optional):

- `PORT` (default `3001`)
- `CORS_ORIGIN` (default `*`)
- `TIMED_RESTRICTION_ENABLED` (`true`|`false`, default `true`)
- `COOLDOWN_MS` (default `60000`)
- `HISTORY_MODE_ENABLED` (`true`|`false`, default `true`)

### 2) Start the Client

```bash
# In another terminal
npm install --prefix client
npm run dev --prefix client
```

The client runs on http://localhost:5173.

Optional client env:

- Create `client/.env` with `VITE_API_URL=http://localhost:3001` if your server port/origin differs.

## Project Structure

```
server/
  src/
    config.ts
    index.ts
    routes.ts
    sockets.ts
    state.ts
  package.json
  tsconfig.json
client/
  src/
    App.tsx
    main.tsx
    components/
      Grid.tsx
      History.tsx
      PlayerCount.tsx
    services/
      api.ts
      socket.ts
  index.html
  vite.config.ts
  package.json
  tsconfig.json
```

## Notes

- Global state (grid, players, history) is kept in memory for simplicity. Swapping to Redis would involve replacing `state.ts` accesses.
- If `TIMED_RESTRICTION_ENABLED=false`, each player can submit only once for the entire session.
- If `HISTORY_MODE_ENABLED=false`, `/history` returns `{ enabled: false, history: [] }`.

## AI Assistance Disclosure

Parts of this project were scaffolded and implemented with the assistance of an AI coding assistant (Windsurf). All code has been reviewed for clarity and correctness.

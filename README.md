# Ledgerline — AI market co-pilot (3-tier app)

A 3-tier trading assistant: React frontend, Node.js/Express + Socket.io API, MongoDB persistence.

- **Presentation tier**: React (Vite), live ticker tape, watchlist with sparklines, AI chat panel
- **Application tier**: Express REST API + Socket.io for real-time price pushes, calls a local Ollama model for chat replies
- **Data tier**: MongoDB, storing asset prices/history and chat message history per session

Prices are simulated server-side (a random walk) — this is a demo, not connected to real markets.

## 1. Prerequisites

- Node.js 18+
- A MongoDB instance (local `mongod`, Docker, or a free MongoDB Atlas cluster)
- [Ollama](https://ollama.com) installed and running locally, with a model pulled, e.g.:
  ```bash
  ollama pull llama3.1
  ollama serve   # usually starts automatically after install; runs on :11434
  ```

## 2. Backend setup

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI, and OLLAMA_URL/OLLAMA_MODEL if not using the defaults
npm install
npm run seed     # populates the assets collection
npm run dev       # starts the API + websocket server on :5000
```

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env   # defaults to http://localhost:5000, edit if needed
npm install
npm run dev       # starts Vite on :5173
```

Open http://localhost:5173.

## Project layout

```
backend/
  config/db.js          MongoDB connection
  models/Asset.js        price + history schema
  models/Message.js      chat history schema
  services/marketSimulator.js   random-walk price ticker, emits over Socket.io
  services/claude.js     Ollama local API call (function kept as askClaude for compatibility)
  routes/assets.js       GET /api/assets
  routes/chat.js         GET/POST /api/chat
  seed.js                seeds initial assets
  server.js              app entrypoint

frontend/
  src/components/        TickerTape, Watchlist, Sparkline, ChatPanel
  src/lib/                api.js, socket.js, format.js
  src/App.jsx
```

## Notes

- Swap models by changing `OLLAMA_MODEL` in `backend/.env` to any model you've pulled (e.g. `llama3.1`, `mistral`, `qwen2.5`). Larger models give better replies but are slower on CPU-only machines.
- If Ollama runs on a different host/port, update `OLLAMA_URL` accordingly.
- The AI is instructed to explain factors and tradeoffs rather than give direct buy/sell recommendations — it's educational, not financial advice.
- Chat history is keyed by a random `sessionId` stored in the browser's `localStorage`, so it's not tied to a real user account. Add auth if you need per-user accounts.
- To deploy, set `CLIENT_ORIGIN` on the backend to your frontend's real URL, and `VITE_API_URL` on the frontend to your backend's real URL.

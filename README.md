# 🚀 LedgerLine — AI Market Co-Pilot

AI-powered trading assistant. 3-tier full-stack app: **React + Node.js/Express + MongoDB + Ollama**, with real-time updates via Socket.io.

> **Disclaimer:** Educational/demo project. Prices are simulated, not real market data. AI responses are not financial advice.

---

## ✨ Features

- 📈 Simulated real-time market prices
- 📊 Watchlist + price sparklines
- 🔄 Live updates via Socket.io
- 🤖 AI chat assistant (local LLM via Ollama)
- 💬 Persistent chat history in MongoDB
- 🔐 Session-based chat (`localStorage`, no auth)
- ☁️ AWS EC2 deployment ready

---

## 🏗️ Architecture

```text
Browser → React/Vite (:5173) → Node/Express (:5000) → MongoDB (:27017)
                                        │
                                        └──→ Ollama (:11434) — Llama 3.2 1B
```

---

## 📸 Screenshots

> Get a hosted link: drag an image into any GitHub Issue/PR/Discussion comment box → copy the generated `user-attachments` URL → paste below. No need to submit the comment.

| Dashboard | Watchlist | AI Chat |
|---|---|---|
| ![Dashboard](<img width="1163" height="613" alt="image" src="https://github.com/user-attachments/assets/9cc21850-c261-4786-ab4b-bebe9a5cc2b7" />
)

---

## 🎥 Demo Video

> Same trick as above — drag the `.mp4` into a GitHub comment box, copy the generated link, paste it here.

<video src="https://github.com/user-attachments/assets/51e2672d-edde-45c9-aa6b-955490992347" controls width="100%"></video>

▶️ [Or watch directly](REPLACE_WITH_DEMO_VIDEO_URL)

---

## 📁 Project Structure

```text
ledgerline-trading-app-ollama/
├── backend/
│   ├── config/db.js
│   ├── models/       (Asset.js, Message.js)
│   ├── services/     (marketSimulator.js, claude.js)
│   ├── routes/       (assets.js, chat.js)
│   ├── seed.js
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/components/  (TickerTape, Watchlist, Sparkline, ChatPanel)
│   ├── src/lib/          (api.js, socket.js, format.js)
│   ├── src/App.jsx
│   └── .env.example
└── .gitignore
```

---

## 📋 Prerequisites

- Node.js 18+, npm, Git
- MongoDB
- Ollama

Check versions: `node --version` · `npm --version` · `git --version` · `ollama --version`

---

## 🗄️ MongoDB Setup

```bash
docker run -d --name trading_assistant -p 27017:27017 mongo
```

- Default URI: `mongodb://127.0.0.1:27017/trading_assistant`
- Verify: `docker ps` / `sudo ss -lntp | grep :27017`

---

## 🤖 Ollama Setup

```bash
ollama pull llama3.2:1b
ollama serve
```

- Runs on `http://127.0.0.1:11434`
- Test: `curl http://127.0.0.1:11434`
- Check loaded models: `ollama ps`
- Model configured in `backend/.env` → `OLLAMA_MODEL=llama3.2:1b`
- Other options: `llama3.1`, `mistral`, `qwen2.5` (smaller = better for CPU-only EC2)

---

## ⚙️ Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # edit as needed
npm run seed            # seed initial data
npm run dev             # runs on :5000
```

`.env` example:
```env
MONGO_URI=mongodb://127.0.0.1:27017/trading_assistant
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:1b
```

---

## 💻 Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm run dev -- --host 0.0.0.0   # runs on :5173
```

---

## ▶️ Running the App

| Service | Command | Port |
|---|---|---:|
| MongoDB | `docker start trading_assistant` | 27017 |
| Ollama | `ollama serve` | 11434 |
| Backend | `cd backend && npm run dev` | 5000 |
| Frontend | `cd frontend && npm run dev -- --host 0.0.0.0` | 5173 |

Open **http://localhost:5173**

---

## 🔌 API Endpoints

- `GET /api/assets` — list assets
- `GET /api/chat` — chat history
- `POST /api/chat` — send message → `{ "sessionId": "...", "message": "..." }`

---

## ☁️ AWS EC2 Deployment

- Ports: React `5173` · Backend `5000` · MongoDB `27017` (internal only) · Ollama `11434` (internal only)
- Security Group: open only `5173` and `5000` to the internet
- Update `.env` files with `YOUR_EC2_PUBLIC_IP` instead of `localhost`:
  - Backend: `CLIENT_ORIGIN=http://YOUR_EC2_PUBLIC_IP:5173`
  - Frontend: `VITE_API_URL=http://YOUR_EC2_PUBLIC_IP:5000`
- Vite must bind to all interfaces: `server: { host: "0.0.0.0", port: 5173 }`
- Recommended instance: `t3.medium` (4GB) minimum, `t3.large` (8GB+) for better Ollama performance

---

## 🧪 Testing Ollama Performance

```bash
curl -s http://127.0.0.1:11434/api/generate \
  -d '{"model":"llama3.2:1b","prompt":"Say hello in one sentence.","stream":false}'
```

- Check memory: `free -h`
- Check CPU: `nproc` / `lscpu | grep -E 'Model name|CPU\(s\)'`
- Tips: use smaller models, monitor RAM/swap, avoid running unnecessary services alongside Ollama

---

## 🔐 Git & Security

- Never commit: `.env`, API keys, passwords, credentials, secrets
- If `.env` was already committed:
  ```bash
  git rm --cached .env
  git commit -m "Stop tracking environment files"
  git push
  ```
- If a secret was pushed publicly — **rotate/revoke it**, deleting the file isn't enough

---

## 🏭 Production Checklist

1. Build React app, serve via Nginx
2. Run Node.js with PM2
3. Keep MongoDB & Ollama private
4. Use HTTPS + a domain
5. Store secrets securely
6. Restrict Security Group rules
7. Enable logging/monitoring

---

## 🔮 Roadmap

- [ ] Authentication (JWT)
- [ ] Real market data
- [ ] Portfolio management & trading history
- [ ] Price alerts, technical indicators
- [ ] Dockerization + Docker Compose + Kubernetes
- [ ] CI/CD (GitHub Actions)
- [ ] Monitoring (Prometheus/Grafana), centralized logging
- [ ] RAG capabilities, user-specific chat history
- [ ] Database backups

---

## 📌 Notes

- **Market data:** fully simulated, not connected to real exchanges
- **AI assistant:** explains concepts/terminology/risks — does **not** give buy/sell advice
- **Chat sessions:** tied to a random `sessionId` in `localStorage`, not a real account

---

## ⚠️ Disclaimer

Educational project only. Simulated data, AI output may be inaccurate — not financial advice. Consult a professional before making financial decisions.

## 📄 License

Educational and demonstration purposes only.

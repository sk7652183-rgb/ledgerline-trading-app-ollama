# 🚀 LedgerLine — AI Market Co-Pilot

LedgerLine is an AI-powered trading assistant built as a **3-tier full-stack application** using React, Node.js/Express, Socket.io, MongoDB, and Ollama.

The application provides simulated market prices, real-time price updates, watchlists, price sparklines, and an AI-powered chat assistant running through a locally hosted Ollama model.

> **Disclaimer:** This project is for educational and demonstration purposes only. Market prices are simulated and are not connected to real financial markets. AI responses should not be considered financial advice.

---

## 🏗️ Architecture

```text
                         User / Browser
                              │
                              │ HTTP / WebSocket
                              ▼
                    ┌─────────────────────┐
                    │   React + Vite      │
                    │   Frontend :5173    │
                    │                     │
                    │ • Ticker Tape       │
                    │ • Watchlist         │
                    │ • Sparklines        │
                    │ • AI Chat           │
                    └──────────┬──────────┘
                               │
                         REST / Socket.io
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js + Express   │
                    │   Backend :5000     │
                    │                     │
                    │ • REST API          │
                    │ • Socket.io         │
                    │ • Market Simulator  │
                    │ • Ollama Service    │
                    └──────┬────────┬─────┘
                           │        │
                           │        │ Ollama API
                           │        ▼
                           │   ┌──────────────┐
                           │   │   Ollama     │
                           │   │   :11434     │
                           │   │              │
                           │   │ Llama 3.2 1B │
                           │   └──────────────┘
                           │
                           ▼
                    ┌─────────────────────┐
                    │      MongoDB        │
                    │      :27017         │
                    │                     │
                    │ • Assets            │
                    │ • Price History     │
                    │ • Chat Messages     │
                    └─────────────────────┘
```

---

## ✨ Features

- 📈 Real-time simulated market prices
- 📊 Watchlist with price sparklines
- 🔄 Real-time updates using Socket.io
- 🤖 AI-powered trading assistant
- 🧠 Local LLM inference using Ollama
- 💬 Persistent chat history using MongoDB
- 🔐 Session-based chat using browser `localStorage`
- 🌐 REST API
- ⚡ React + Vite frontend
- 🟢 Node.js/Express backend
- 🗄️ MongoDB persistence
- ☁️ AWS EC2 deployment support
- 🐧 Ubuntu/Linux server support

---

## 📁 Project Structure

```text
ledgerline-trading-app-ollama/
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── Asset.js
│   │   └── Message.js
│   │
│   ├── services/
│   │   ├── marketSimulator.js
│   │   └── claude.js
│   │
│   ├── routes/
│   │   ├── assets.js
│   │   └── chat.js
│   │
│   ├── seed.js
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TickerTape.jsx
│   │   │   ├── Watchlist.jsx
│   │   │   ├── Sparkline.jsx
│   │   │   └── ChatPanel.jsx
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   ├── socket.js
│   │   │   └── format.js
│   │   │
│   │   └── App.jsx
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 📋 Prerequisites

Make sure the following are installed:

- Node.js 18+
- npm
- MongoDB
- Ollama
- Git

### Check Node.js

```bash
node --version
```

### Check npm

```bash
npm --version
```

### Check Git

```bash
git --version
```

### Check Ollama

```bash
ollama --version
```

---

## 🗄️ MongoDB Setup

MongoDB can run directly on the EC2 host, inside Docker, or using MongoDB Atlas.

The default MongoDB connection is:

```text
mongodb://127.0.0.1:27017/trading_assistant
```

### Run MongoDB using Docker

```bash
docker run -d \
  --name trading_assistant \
  -p 27017:27017 \
  mongo
```

Check the container:

```bash
docker ps
```

Check the MongoDB port:

```bash
sudo ss -lntp | grep :27017
```

---

## 🤖 Ollama Setup

LedgerLine uses Ollama to run the AI model locally.

Pull the recommended model:

```bash
ollama pull llama3.2:1b
```

Check installed models:

```bash
ollama list
```

Start Ollama:

```bash
ollama serve
```

Ollama normally runs on:

```text
http://127.0.0.1:11434
```

Test Ollama:

```bash
curl http://127.0.0.1:11434
```

Check loaded models:

```bash
ollama ps
```

### Change Ollama Model

The model is configured in:

```text
backend/.env
```

Example:

```env
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:1b
```

Other supported models can be installed:

```bash
ollama pull llama3.1
ollama pull mistral
ollama pull qwen2.5
```

Then update:

```env
OLLAMA_MODEL=qwen2.5
```

> Smaller models are recommended for CPU-only EC2 instances because larger models require more RAM and CPU.

---

## ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Edit the environment file:

```bash
nano .env
```

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/trading_assistant
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:1b
```

### Seed Initial Data

```bash
npm run seed
```

### Start Backend

```bash
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

## 💻 Frontend Setup

Open another terminal and navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Edit the environment file:

```bash
nano .env
```

For local development:

```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev -- --host 0.0.0.0
```

The frontend runs on:

```text
http://localhost:5173
```

---

## ▶️ Running the Application

LedgerLine requires the following services:

| Service | Port |
|---|---:|
| React / Vite | `5173` |
| Node.js / Express | `5000` |
| MongoDB | `27017` |
| Ollama | `11434` |

### Terminal 1 — MongoDB

If MongoDB is running through Docker:

```bash
docker start trading_assistant
```

Verify:

```bash
docker ps
```

### Terminal 2 — Ollama

```bash
ollama serve
```

### Terminal 3 — Backend

```bash
cd backend
npm run dev
```

### Terminal 4 — Frontend

```bash
cd frontend
npm run dev -- --host 0.0.0.0
```

Open:

```text
http://localhost:5173
```

---

## 🔌 API Endpoints

### Get Assets

```http
GET /api/assets
```

Example:

```bash
curl http://localhost:5000/api/assets
```

### Get Chat History

```http
GET /api/chat
```

### Send Chat Message

```http
POST /api/chat
```

Example request:

```json
{
  "sessionId": "example-session-id",
  "message": "Explain the current market trend."
}
```

The backend sends the request to Ollama and returns the AI-generated response.

---

## 🔄 Real-Time Communication

Socket.io provides real-time market updates.

```text
             Market Simulator
                    │
                    │ Price Update
                    ▼
                Socket.io
                    │
                    │ WebSocket
                    ▼
              React Frontend
                    │
          ┌─────────┼─────────┐
          ▼         ▼         ▼
       Ticker    Watchlist  Sparkline
```

Market prices are generated using a server-side random-walk simulation.

> The application is not connected to real financial markets.

---

## ☁️ AWS EC2 Deployment

LedgerLine can be deployed on an AWS EC2 Ubuntu instance.

A simple deployment can run the application components on the same EC2 host.

```text
                         Internet
                            │
                            ▼
                    ┌───────────────┐
                    │    AWS EC2    │
                    │    Ubuntu     │
                    └───────┬───────┘
                            │
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
     React/Vite        Node/Express        MongoDB
       :5173              :5000             :27017
                            │
                            ▼
                          Ollama
                           :11434
```

### Application Ports

| Service | Port | Purpose |
|---|---:|---|
| React/Vite | 5173 | Frontend |
| Node.js/Express | 5000 | Backend API |
| MongoDB | 27017 | Database |
| Ollama | 11434 | Local AI API |

For a development/demo deployment, configure the AWS Security Group as required.

Example:

```text
Custom TCP → 5173
Custom TCP → 5000
```

> MongoDB and Ollama should normally remain accessible only from the EC2 host.

---

## 🌍 EC2 Environment Configuration

### Backend `.env`

```env
MONGO_URI=mongodb://127.0.0.1:27017/trading_assistant
PORT=5000
CLIENT_ORIGIN=http://YOUR_EC2_PUBLIC_IP:5173
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:1b
```

Example:

```env
CLIENT_ORIGIN=http://44.250.56.248:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://YOUR_EC2_PUBLIC_IP:5000
```

Example:

```env
VITE_API_URL=http://44.250.56.248:5000
```

> When accessing the application from your local computer, do not use `localhost:5000` for the frontend API URL. `localhost` refers to your own computer, not the EC2 server.

---

## 🔐 CORS Configuration

The backend uses `CLIENT_ORIGIN` to allow requests from the frontend.

For local development:

```env
CLIENT_ORIGIN=http://localhost:5173
```

For EC2:

```env
CLIENT_ORIGIN=http://YOUR_EC2_PUBLIC_IP:5173
```

Example:

```env
CLIENT_ORIGIN=http://44.250.56.248:5173
```

The frontend URL and `CLIENT_ORIGIN` must match.

---

## ⚡ Vite Configuration

For EC2 development deployment, Vite should listen on all interfaces.

Example `vite.config.js`:

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 5173
  }
});
```

Start Vite:

```bash
npm run dev -- --host 0.0.0.0
```

If the browser keeps refreshing or Vite continuously reconnects, check the browser developer console for HMR/WebSocket errors.

---

## 🧪 Testing Ollama Performance

Test Ollama directly:

```bash
curl -s http://127.0.0.1:11434/api/generate \
  -d '{"model":"llama3.2:1b","prompt":"Say hello in one sentence.","stream":false}'
```

Measure response time:

```bash
time curl -s http://127.0.0.1:11434/api/generate \
  -d '{"model":"llama3.2:1b","prompt":"Say hello in one sentence.","stream":false}'
```

Check memory:

```bash
free -h
```

Check CPU:

```bash
nproc
```

Check CPU information:

```bash
lscpu | grep -E 'Model name|CPU\(s\)'
```

Check Ollama:

```bash
ollama ps
```

---

## ⚡ Ollama Performance

Ollama performance depends heavily on CPU and RAM.

Running the following services on the same EC2 instance consumes system resources:

```text
Node.js
MongoDB
Ollama
React/Vite
Operating System
```

For CPU-only deployments:

- Use smaller models.
- Provide sufficient RAM.
- Provide sufficient CPU.
- Avoid unnecessarily large models.
- Monitor memory and swap usage.

A **4 GB RAM EC2 instance such as `t3.medium`** can be a reasonable starting point for a small demo.

For better Ollama performance, consider an instance with **8 GB RAM or more**, such as `t3.large`.

---

## 🔐 Git and Security

Never commit sensitive information to GitHub.

Do not commit:

```text
.env
.env.local
.env.production
API keys
Passwords
Database credentials
AWS credentials
Private keys
Secrets
```

Example `.gitignore`:

```gitignore
.env
.env.local
.env.development
.env.production

node_modules/
dist/
build/

*.log

.DS_Store
Thumbs.db

.vscode/
.idea/

coverage/
```

Use `.env.example` to document required environment variables.

Example:

```env
MONGO_URI=mongodb://127.0.0.1:27017/trading_assistant
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
OLLAMA_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:1b
```

---

## 🧹 Stop Tracking `.env` in Git

If `.env` was already committed before adding it to `.gitignore`, remove it from Git tracking:

```bash
git rm --cached .env
```

If it is inside the backend:

```bash
git rm --cached backend/.env
```

Then:

```bash
git add .
git commit -m "Stop tracking environment files"
git push
```

> If a real secret was already pushed to GitHub, removing the file is not enough. Rotate or revoke the exposed credential.

---


                             │
                  ┌──────────┴──────────┐
                  │                     │
                  ▼                     ▼
             Frontend                Backend
                                  Node.js :5000
                                        │
                                 ┌──────┴──────┐
                                 │             │
                                 ▼             ▼
                              MongoDB       Ollama
```

For production:

1. Build the React application.
2. Serve the frontend using Nginx.
3. Run Node.js using PM2 or another process manager.
4. Keep MongoDB private.
5. Keep Ollama private.
6. Use HTTPS.
7. Configure a domain name.
8. Store secrets securely.
9. Restrict AWS Security Group rules.
10. Enable logging and monitoring.

---

## 🔮 Future Improvements

- [ ] User authentication
- [ ] JWT authentication
- [ ] Real market data integration
- [ ] Portfolio management
- [ ] Advanced technical indicators
- [ ] Price alerts
- [ ] Trading history
- [ ] HTTPS / SSL
- [ ] Nginx reverse proxy
- [ ] Dockerization
- [ ] Docker Compose
- [ ] Kubernetes deployment
- [ ] CI/CD pipeline
- [ ] GitHub Actions
- [ ] Prometheus monitoring
- [ ] Grafana dashboards
- [ ] Centralized logging
- [ ] AI/RAG capabilities
- [ ] User-specific chat history
- [ ] Database backups

---

## 📌 Important Notes

### Simulated Market Data

LedgerLine does not connect to real financial exchanges.

All market prices are generated using a server-side random-walk simulation.

### AI Assistant

The AI assistant is designed to explain:

- Market concepts
- Trading terminology
- General market scenarios
- Factors affecting assets
- Risks and tradeoffs

It is not designed to provide direct buy/sell recommendations.

### Chat Sessions

Chat history is associated with a randomly generated `sessionId` stored in browser `localStorage`.

It is not tied to a real user account.

For production use, implement:

- Authentication
- Authorization
- User-specific sessions
- Secure session management
- Database access controls

---

## ⚠️ Disclaimer

LedgerLine is an educational software project.

The market data is simulated and does not represent actual market prices.

AI-generated responses may be inaccurate or incomplete and should not be considered financial, investment, or trading advice.

Always perform independent research and consult a qualified financial professional before making financial decisions.

---

## 📄 License

This project is intended for educational and demonstration purposes.

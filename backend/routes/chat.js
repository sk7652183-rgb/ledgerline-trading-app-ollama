import { Router } from "express";
import Asset from "../models/Asset.js";
import Message from "../models/Message.js";
import { askClaude } from "../services/claude.js";

const router = Router();

router.get("/:sessionId", async (req, res) => {
  const history = await Message.find({ sessionId: req.params.sessionId }).sort({ createdAt: 1 });
  res.json(history);
});

router.post("/", async (req, res) => {
  try {
    const { sessionId, message } = req.body;
    if (!sessionId || !message?.trim()) {
      return res.status(400).json({ error: "sessionId and message are required" });
    }

    await Message.create({ sessionId, role: "user", text: message });

    const history = await Message.find({ sessionId }).sort({ createdAt: 1 }).limit(20);
    const assets = await Asset.find();
    const snapshot = assets
      .map((a) => `${a.symbol}: $${a.price.toFixed(a.kind === "crypto" && a.price < 1 ? 4 : 2)} (${a.change >= 0 ? "+" : ""}${a.change.toFixed(2)}% last tick)`)
      .join(", ");

    const system = `You are a markets analysis assistant in a demo trading app covering stocks and crypto. Live simulated snapshot: ${snapshot}.
Rules: Explain concepts, price action, and indicators clearly and educationally. Never give a direct personalized buy/sell recommendation — lay out relevant factors and tradeoffs instead so the user can decide. Keep responses concise (under ~120 words) and conversational. This is a simulated environment with fabricated prices, not real market data — never claim otherwise.`;

    const reply = await askClaude({
      system,
      messages: history.map((m) => ({ role: m.role, content: m.text })),
    });

    await Message.create({ sessionId, role: "assistant", text: reply });
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Something went wrong" });
  }
});

export default router;

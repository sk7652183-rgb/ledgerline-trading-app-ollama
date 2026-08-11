import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Sparkles, ShieldAlert, Wifi, WifiOff } from "lucide-react";
import { fetchHistory, sendMessage } from "../lib/api.js";

const CHIPS = [
  "What's driving BTC right now?",
  "Compare AAPL and TSLA momentum",
  "Explain what RSI means",
  "Is now a good time to buy ETH?",
];

export default function ChatPanel({ sessionId, selected, connected }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    fetchHistory(sessionId)
      .then((history) => {
        if (history.length === 0) {
          setMessages([
            {
              role: "assistant",
              text: "I'm your market co-pilot. Ask me about price action, indicators, or what's moving stocks and crypto — I'll walk through the factors rather than tell you what to do.",
            },
          ]);
        } else {
          setMessages(history);
        }
      })
      .catch(() => {});
  }, [sessionId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend(text) {
    if (!text.trim() || loading) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await sendMessage(sessionId, text);
      setMessages((m) => [...m, { role: "assistant", text: reply }]);
    } catch (e) {
      setMessages((m) => [...m, { role: "assistant", text: "Couldn't reach the server. Check that the backend is running." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ width: 30, height: 30, borderRadius: 9, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 0 var(--accent-dim)", animation: connected ? "pulse-ring 2s infinite" : "none" }}>
          <Sparkles size={14} color="var(--accent)" />
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 14.5, fontWeight: 600 }}>Market co-pilot</div>
        <div style={{ fontSize: 11.5, color: "var(--text-muted)" }}>· focused on {selected}</div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: connected ? "var(--positive)" : "var(--negative)" }}>
            {connected ? <Wifi size={12} /> : <WifiOff size={12} />} {connected ? "live" : "offline"}
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
            <ShieldAlert size={12} /> educational only
          </span>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "18px", display: "flex", flexDirection: "column", gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", gap: 9, flexDirection: m.role === "user" ? "row-reverse" : "row", animation: "fade-up 0.25s ease" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
              {m.role === "user" ? <User size={13} color="var(--text-secondary)" /> : <Bot size={13} color="var(--accent)" />}
            </div>
            <div
              style={{
                maxWidth: "72%",
                fontSize: 14,
                lineHeight: 1.6,
                borderRadius: 16,
                padding: "10px 14px",
                background: m.role === "user" ? "var(--accent)" : "var(--surface-2)",
                color: m.role === "user" ? "#fff" : "var(--text-primary)",
                borderTopRightRadius: m.role === "user" ? 4 : 16,
                borderTopLeftRadius: m.role === "assistant" ? 4 : 16,
              }}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 9 }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={13} color="var(--accent)" />
            </div>
            <div style={{ background: "var(--surface-2)", borderRadius: 16, borderTopLeftRadius: 4, padding: "12px 16px", display: "flex", gap: 4 }}>
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--text-muted)", animation: `dot-bounce 1.1s ${i * 0.15}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "0 18px 10px", display: "flex", gap: 8, flexWrap: "wrap" }}>
        {CHIPS.map((c) => (
          <button
            key={c}
            onClick={() => handleSend(c)}
            style={{ fontSize: 12, padding: "6px 12px", borderRadius: 999, border: "1px solid var(--border-strong)", background: "transparent", color: "var(--text-secondary)", cursor: "pointer" }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--text-primary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >
            {c}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, padding: "14px 18px", borderTop: "1px solid var(--border)" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder={`Ask about ${selected}, a strategy, or a term…`}
          style={{ flex: 1, background: "var(--surface-2)", border: "1px solid var(--border-strong)", borderRadius: 12, padding: "11px 14px", fontSize: 14, color: "var(--text-primary)", outline: "none" }}
        />
        <button
          onClick={() => handleSend(input)}
          disabled={loading || !input.trim()}
          style={{ width: 42, height: 42, borderRadius: 12, border: "none", background: "var(--accent)", opacity: loading || !input.trim() ? 0.4 : 1, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 }}
        >
          <Send size={16} color="#fff" />
        </button>
      </div>
    </div>
  );
}

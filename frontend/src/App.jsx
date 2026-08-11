import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { socket } from "./lib/socket.js";
import { fetchAssets, getSessionId } from "./lib/api.js";
import TickerTape from "./components/TickerTape.jsx";
import Watchlist from "./components/Watchlist.jsx";
import ChatPanel from "./components/ChatPanel.jsx";

const sessionId = getSessionId();

export default function App() {
  const [assets, setAssets] = useState([]);
  const [selected, setSelected] = useState("AAPL");
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    fetchAssets().then(setAssets).catch(() => {});

    function onPrices(updated) {
      setAssets((prev) => {
        const map = new Map(updated.map((a) => [a.symbol, a]));
        return prev.map((a) => map.get(a.symbol) || a);
      });
    }
    socket.on("prices", onPrices);
    socket.on("connect", () => setConnected(true));
    socket.on("disconnect", () => setConnected(false));

    return () => {
      socket.off("prices", onPrices);
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", maxWidth: 1180, margin: "0 auto", border: "1px solid var(--border)", borderTop: "none", borderBottom: "none" }}>
      <header style={{ display: "flex", alignItems: "center", gap: 10, padding: "16px 18px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ width: 32, height: 32, borderRadius: 9, background: "linear-gradient(135deg, var(--accent), var(--stocks))", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Activity size={16} color="#fff" />
        </div>
        <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 17, letterSpacing: "-0.01em" }}>Ledgerline</div>
        <div style={{ fontSize: 12, color: "var(--text-muted)" }}>AI market co-pilot</div>
      </header>

      <TickerTape assets={assets} />

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <Watchlist assets={assets} selected={selected} onSelect={setSelected} />
        <ChatPanel sessionId={sessionId} selected={selected} connected={connected} />
      </div>
    </div>
  );
}

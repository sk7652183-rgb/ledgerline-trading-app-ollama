import { TrendingUp, TrendingDown, LineChart, Bitcoin } from "lucide-react";
import Sparkline from "./Sparkline.jsx";
import { fmt } from "../lib/format.js";

function Row({ a, active, onClick, accent }) {
  const up = a.change >= 0;
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        textAlign: "left",
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "10px 14px",
        background: active ? "var(--surface-2)" : "transparent",
        border: "none",
        borderLeft: `2px solid ${active ? accent : "transparent"}`,
        cursor: "pointer",
        transition: "background 0.15s",
      }}
      onMouseEnter={(e) => !active && (e.currentTarget.style.background = "#161a22")}
      onMouseLeave={(e) => !active && (e.currentTarget.style.background = "transparent")}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, fontFamily: "var(--font-display)" }}>{a.symbol}</div>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{a.name}</div>
      </div>
      <Sparkline data={a.history} positive={up} width={52} height={20} />
      <div style={{ textAlign: "right", minWidth: 74 }}>
        <div style={{ fontSize: 12.5, fontFamily: "var(--font-mono)" }}>{fmt(a.price, a.kind)}</div>
        <div style={{ fontSize: 10.5, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 2, color: up ? "var(--positive)" : "var(--negative)" }}>
          {up ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(a.change).toFixed(2)}%
        </div>
      </div>
    </button>
  );
}

export default function Watchlist({ assets, selected, onSelect }) {
  const stocks = assets.filter((a) => a.kind === "stock");
  const crypto = assets.filter((a) => a.kind === "crypto");

  return (
    <div style={{ width: 250, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--surface)", display: "flex", flexDirection: "column", overflowY: "auto" }}>
      <SectionLabel icon={<LineChart size={11} />} text="Equities" />
      {stocks.map((a) => (
        <Row key={a.symbol} a={a} active={selected === a.symbol} onClick={() => onSelect(a.symbol)} accent="var(--stocks)" />
      ))}
      <SectionLabel icon={<Bitcoin size={11} />} text="Crypto" />
      {crypto.map((a) => (
        <Row key={a.symbol} a={a} active={selected === a.symbol} onClick={() => onSelect(a.symbol)} accent="var(--crypto)" />
      ))}
    </div>
  );
}

function SectionLabel({ icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 14px 6px", fontSize: 10.5, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>
      {icon} {text}
    </div>
  );
}

import { fmt } from "../lib/format.js";

export default function TickerTape({ assets }) {
  const row = [...assets, ...assets];
  return (
    <div
      style={{
        overflow: "hidden",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "9px 0",
      }}
    >
      <div style={{ display: "flex", gap: 32, width: "max-content", animation: "ticker-scroll 26s linear infinite" }}>
        {row.map((a, i) => {
          const up = a.change >= 0;
          return (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontFamily: "var(--font-mono)", fontSize: 12, whiteSpace: "nowrap", padding: "0 4px" }}>
              <span style={{ color: "var(--text-muted)" }}>{a.symbol}</span>
              <span style={{ color: "var(--text-primary)" }}>{fmt(a.price, a.kind)}</span>
              <span style={{ color: up ? "var(--positive)" : "var(--negative)" }}>
                {up ? "▲" : "▼"} {Math.abs(a.change).toFixed(2)}%
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

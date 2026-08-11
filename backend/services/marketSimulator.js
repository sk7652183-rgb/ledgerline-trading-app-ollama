import Asset from "../models/Asset.js";

const HISTORY_LEN = 30;

export function startSimulator(io, intervalMs = 2000) {
  setInterval(async () => {
    const assets = await Asset.find();
    const updates = [];

    for (const a of assets) {
      const vol = a.kind === "crypto" ? 0.004 : 0.0015;
      const delta = a.price * vol * (Math.random() * 2 - 1);
      const nextPrice = Math.max(a.price + delta, 0.0001);
      const change = ((nextPrice - a.price) / a.price) * 100;

      a.prevPrice = a.price;
      a.price = nextPrice;
      a.change = change;
      a.history = [...a.history, nextPrice].slice(-HISTORY_LEN);
      a.updatedAt = new Date();
      await a.save();
      updates.push(a);
    }

    io.emit("prices", updates);
  }, intervalMs);
}

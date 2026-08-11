import "dotenv/config";
import { connectDB } from "./config/db.js";
import Asset from "./models/Asset.js";
import mongoose from "mongoose";

const SEED = [
  { symbol: "AAPL", name: "Apple", kind: "stock", price: 227.4 },
  { symbol: "TSLA", name: "Tesla", kind: "stock", price: 248.9 },
  { symbol: "NVDA", name: "Nvidia", kind: "stock", price: 131.7 },
  { symbol: "MSFT", name: "Microsoft", kind: "stock", price: 421.3 },
  { symbol: "BTC", name: "Bitcoin", kind: "crypto", price: 64200 },
  { symbol: "ETH", name: "Ethereum", kind: "crypto", price: 3180 },
  { symbol: "SOL", name: "Solana", kind: "crypto", price: 148.5 },
  { symbol: "XRP", name: "XRP", kind: "crypto", price: 0.62 },
];

async function run() {
  await connectDB();
  await Asset.deleteMany({});
  await Asset.insertMany(
    SEED.map((a) => ({ ...a, prevPrice: a.price, change: 0, history: [a.price] }))
  );
  console.log(`Seeded ${SEED.length} assets`);
  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});

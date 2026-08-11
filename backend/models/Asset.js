import mongoose from "mongoose";

const assetSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  kind: { type: String, enum: ["stock", "crypto"], required: true },
  price: { type: Number, required: true },
  prevPrice: { type: Number, required: true },
  change: { type: Number, default: 0 },
  history: { type: [Number], default: [] },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Asset", assetSchema);

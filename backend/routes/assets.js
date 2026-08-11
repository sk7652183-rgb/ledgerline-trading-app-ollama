import { Router } from "express";
import Asset from "../models/Asset.js";

const router = Router();

router.get("/", async (_req, res) => {
  const assets = await Asset.find().sort({ kind: 1, symbol: 1 });
  res.json(assets);
});

export default router;

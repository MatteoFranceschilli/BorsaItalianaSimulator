import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("ERROR: MONGODB_URI non impostato in .env");
  process.exit(1);
}

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://matteofranceschilli.github.io",
  ],
}));
app.use(express.json({ limit: "2mb" }));

const saveSchema = new mongoose.Schema({
  saveId:         { type: String, required: true },
  clientKey:      { type: String, required: true },
  savedAt:        { type: Date, default: Date.now },
  playerName:     String,
  cash:           Number,
  portfolioValue: Number,
  simTime:        String,
  speed:          Number,
  portfolio:      mongoose.Schema.Types.Mixed,
  orders:         [mongoose.Schema.Types.Mixed],
  priceAlerts:    [mongoose.Schema.Types.Mixed],
  trades:         [mongoose.Schema.Types.Mixed],
}, { versionKey: false });

saveSchema.index({ saveId: 1, clientKey: 1 }, { unique: true });
saveSchema.index({ clientKey: 1, savedAt: -1 });
const Save = mongoose.model("Save", saveSchema);

// Elenco salvataggi per client
app.get("/api/saves", async (req, res) => {
  const { clientKey } = req.query;
  if (!clientKey) return res.status(400).json({ error: "clientKey required" });
  try {
    const saves = await Save.find({ clientKey })
      .sort({ savedAt: -1 })
      .limit(10)
      .lean();
    res.json(saves.map(({ _id, saveId, ...s }) => ({ ...s, id: saveId })));
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Carica salvataggio singolo
app.get("/api/saves/:id", async (req, res) => {
  const { clientKey } = req.query;
  if (!clientKey) return res.status(400).json({ error: "clientKey required" });
  try {
    const save = await Save.findOne({ saveId: req.params.id, clientKey }).lean();
    if (!save) return res.status(404).json({ error: "not found" });
    const { _id, saveId, ...s } = save;
    res.json({ ...s, id: saveId });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Crea / aggiorna salvataggio (upsert)
app.post("/api/saves", async (req, res) => {
  const { saveId, clientKey, ...data } = req.body;
  if (!saveId || !clientKey) return res.status(400).json({ error: "saveId e clientKey obbligatori" });
  try {
    await Save.findOneAndUpdate(
      { saveId, clientKey },
      { saveId, clientKey, ...data },
      { upsert: true }
    );
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Elimina salvataggio
app.delete("/api/saves/:id", async (req, res) => {
  const { clientKey } = req.query;
  if (!clientKey) return res.status(400).json({ error: "clientKey required" });
  try {
    await Save.deleteOne({ saveId: req.params.id, clientKey });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get("/api/health", (_req, res) => res.json({ ok: true }));

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ Connesso a MongoDB");
    app.listen(PORT, () => console.log(`🚀 Server avviato su porta ${PORT}`));
  })
  .catch(err => {
    console.error("❌ Errore connessione MongoDB:", err.message);
    process.exit(1);
  });

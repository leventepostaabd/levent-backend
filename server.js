const express = require("express");
const fs = require("fs-extra");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const DATA_PATH = path.join(__dirname, "data", "shipRecords.json");
const upload = multer({ dest: path.join(__dirname, "uploads") });

app.get("/api/getRecords", async (req, res) => {
  try {
    const data = await fs.readJson(DATA_PATH);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Kayıtlar okunamadı" });
  }
});

app.post("/api/saveRecord", async (req, res) => {
  try {
    const { company, record } = req.body;
    const data = await fs.readJson(DATA_PATH);
    if (!data[company]) data[company] = [];
    data[company].push(record);
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Kayıt eklenemedi" });
  }
});

app.post("/api/deleteRecord", async (req, res) => {
  try {
    const { company, id } = req.body;
    const data = await fs.readJson(DATA_PATH);
    data[company] = data[company].filter(r => r.id !== id);
    await fs.writeJson(DATA_PATH, data, { spaces: 2 });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Kayıt silinemedi" });
  }
});

app.post("/api/uploadCert", upload.single("pdf"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "PDF yüklenmedi" });
  const newName = req.file.originalname;
  const newPath = path.join(__dirname, "uploads", newName);
  fs.rename(req.file.path, newPath);
  res.json({ success: true, filename: newName });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Backend çalışıyor: " + PORT);
});



const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = process.env.BASE_URL || `http://localhost:${PORT}`;

const uploadDir = path.join(__dirname, "public", "uploads");
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .slice(0, 60);
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${safeBase || "image"}-${unique}${ext}`);
  }
});

const allowedTypes = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml"
]);

const fileFilter = (_req, file, cb) => {
  if (allowedTypes.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed (jpg, png, webp, gif, svg)."));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }
});

app.use(express.static(path.join(__dirname, "public")));

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.get("/api/images", (_req, res) => {
  const files = fs
    .readdirSync(uploadDir)
    .filter((file) => !file.startsWith("."))
    .map((file) => ({
      name: file,
      url: `${BASE_URL}/uploads/${encodeURIComponent(file)}`
    }))
    .sort((a, b) => (a.name < b.name ? 1 : -1));

  res.json({ images: files });
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded." });
  }

  const publicUrl = `${BASE_URL}/uploads/${encodeURIComponent(req.file.filename)}`;
  return res.status(201).json({
    message: "Upload successful",
    filename: req.file.filename,
    url: publicUrl
  });
});

app.use((err, _req, res, _next) => {
  if (err instanceof multer.MulterError && err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ error: "File too large. Max size is 10MB." });
  }

  if (err) {
    return res.status(400).json({ error: err.message || "Upload error" });
  }

  return res.status(500).json({ error: "Unexpected server error" });
});

app.listen(PORT, () => {
  console.log(`Image hosting site running at ${BASE_URL}`);
});

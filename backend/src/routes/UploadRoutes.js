// backend/src/routes/uploadRoutes.js
const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// storage destination + filename logic
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("file"), (req, res) => {
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  res.status(200).json({ fileUrl });
});

module.exports = router;

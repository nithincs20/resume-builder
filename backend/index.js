const express = require('express');

const app = express()
app.use(express.json())

app.get('/api', (req, res) => {
    res.json({ message: 'Hello, API is running!' });
});
app.listen(8080, () => {
    console.log("server started")

})

const multer = require("multer");
const path = require("path");
const cors = require("cors");

app.use(cors());
app.use(express.json());

//Storage 
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

app.use("/uploads", express.static("uploads"));

//Files uploaded
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded.");
  res.json({ message: "File uploaded!", fileUrl: `/uploads/${req.file.filename}` });
});

app.get("/files", (req, res) => {
  const fs = require("fs");
  const files = fs.readdirSync("uploads/").map((file) => ({
    name: file,
    url: `/uploads/${file}`,
  }));
  res.json(files);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const pdfParse = require("pdf-parse");
const fs = require("fs");
const templateModel = require("./models/template");
const userModel = require("./models/user");
const app = express();
const PORT = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../frontend")));
app.use("/uploads", express.static("uploads"));

//MongoDB Connection
mongoose.connect("mongodb+srv://snehatk:6282011259@cluster0.jd3vcot.mongodb.net/resumebuilderdb?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB Atlas"))
.catch(err => console.error("MongoDB connection error:", err));

//Templates
const templates = [
    { id: 1, name: "Basic", image: "https://www.getsetresumes.com/storage/resume-examples/November2022/YYuo4fB1NmNUGd1Ki6qD.jpg" },
    { id: 2, name: "Modern Basic", image: "https://tse4.mm.bing.net/th?id=OIP.QpsQWZxxJfADSgmiEaq9mgHaKP&pid=Api&P=0&h=180" },
    { id: 3, name: "Diamond", image: "https://marketplace.canva.com/EAE-TBgRwsI/1/0/1131w/canva-pink-simple-profile-resume-Zf7Tc6sytxE.jpg" },
    { id: 4, name: "Refined Diamond", image: "https://tse4.mm.bing.net/th?id=OIP.rnNjzXv8oAlZgQoLuSDkywHaKe&pid=Api&P=0&h=180" },
    { id: 5, name: "Elegant", image: "https://tse4.mm.bing.net/th?id=OIP.T1drwMRLlqGfBesepUOzpAHaKZ&pid=Api&P=0&h=180" },
    { id: 6, name: "Premium Elegant", image: "https://tse4.mm.bing.net/th?id=OIP.IxfDtNURNsDOB6okDWn4bQHaKe&pid=Api&P=0&h=180" },
    { id: 7, name: "Spiral", image: "https://tse3.mm.bing.net/th?id=OIP.fZ1IQoNco5tJwiza4GbzyQHaKe&pid=Api&P=0&h=180" },
    { id: 8, name: "Creative Spiral", image: "https://tse3.mm.bing.net/th?id=OIP.jCboCEGxnM7KjHjTlevEbwHaKY&pid=Api&P=0&h=180" }
];

app.get("/templates", (req, res) => {
    res.json(templates);
});

app.post("/Addtemplate", async (req, res) => {
    try {
        const template = new templateModel(req.body);
        await template.save();
        res.json({ status: "success", template });
    } catch (err) {
        console.error(err);
        res.status(500).json({ status: "error", error: err.message });
    }
});

//File Upload 
const storage = multer.diskStorage({
    destination: "uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
    if (!req.file) return res.status(400).send("No file uploaded.");
    res.json({ message: "File uploaded!", fileUrl: `/uploads/${req.file.filename}` });
});

app.get("/files", (req, res) => {
    const files = fs.readdirSync("uploads/").map((file) => ({
        name: file,
        url: `/uploads/${file}`,
    }));
    res.json(files);
});

// Extract Resume Data API (Only PDFs)
app.get("/extract/:filename", async (req, res) => {
  const filePath = path.join(__dirname, "uploads", req.params.filename);

  // Check if file exists
  if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found!" });
  }

  // Check if the file is a PDF
  if (path.extname(filePath).toLowerCase() !== ".pdf") {
      return res.status(400).json({ message: "Unsupported file format. Only PDFs are allowed." });
  }

  try {
      // Read and parse the PDF
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      
      // Send extracted text as JSON
      res.json({ resumeText: pdfData.text });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error extracting data from resume." });
  }
});

// Register User API
app.post("/register", async (req, res) => {
  const { name, email, resumeText } = req.body;

  if (!name || !email || !resumeText) {
      return res.status(400).json({ message: "All fields are required" });
  }

  try {
      const newUser = new userModel({ name, email, resumeData: resumeText });
      await newUser.save();
      res.json({ message: "User registered successfully!" });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error registering user" });
  }
});

//Admin Login 
app.post("/AdminLogin", async (req, res) => {
    const { username, password } = req.body;
    const defaultAdmin = { username: "admin", password: "admin123" };

    try {
        if (username === defaultAdmin.username && password === defaultAdmin.password) {
            const token = jwt.sign({ username, usertype: "admin" }, "resumebuilder", { expiresIn: "1d" });
            return res.json({ status: "success", token, message: "Admin logged in successfully" });
        }

        const user = await userModel.findOne({ username });

        if (!user) return res.json({ status: "Username doesn't exist" });
        if (user.usertype !== "admin") return res.status(403).json({ status: "Access denied" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.json({ status: "Wrong password" });

        const token = jwt.sign({ username, usertype: user.usertype }, "resumebuilder", { expiresIn: "1d" });
        res.json({ status: "success", token, message: "Admin login successful" });
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
});

//Start Server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

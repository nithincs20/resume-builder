const express = require("express");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const templateModel = require("./models/template");

const app = express();
app.use(express.json());  
app.use(cors());

mongoose.connect("mongodb+srv://snehatk:6282011259@cluster0.jd3vcot.mongodb.net/resumebuilderdb?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => {
        console.log("Connected to MongoDB Atlas");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

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

app.post("/Addtemplate",(req,res)=>{
    let input=req.body;
    let template =new templateModel(input);
    template.save();
    console.log(template);
    res.json({"status":"success"});
});

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



//-------------------------------------ADMIN LOGIN----------------------------------------------------------


app.post("/AdminLogin", async (req, res) => {
  const { username, password } = req.body;

  // Default Admin Credentials
  const adminUsername = "admin";
  const adminPassword = "admin123";

  try {
      if (username === adminUsername && password === adminPassword) {
          // 🔹 Generate Admin Token
          const token = jwt.sign({ username, usertype: "admin" }, "resumebuilder", { expiresIn: "1d" });
          return res.json({ status: "success", token, message: "Admin logged in successfully" });
      }

      // 🔹 Check if the user exists in the database
      const user = await userModel.findOne({ username });

      if (!user) {
          return res.json({ status: "Username doesn't exist" });
      }

      // 🔹 Check if the user is an admin
      if (user.usertype !== "admin") {
          return res.status(403).json({ status: "Access denied. Admins only" });
      }

      // 🔹 Validate password
      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
          return res.json({ status: "Wrong password" });
      }

      // 🔹 Generate Admin Token
      const token = jwt.sign({ username, usertype: user.usertype }, "resumebuilder", { expiresIn: "1d" });

      res.json({ status: "success", token, message: "Admin login successful" });

  } catch (error) {
      res.json({ status: "Error occurred", error: error.message });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



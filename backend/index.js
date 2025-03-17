const express = require('express');
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const mongoose = require("mongoose");
const templateModel = require('./models/template');
const { engine } = require("express-handlebars");  // ✅ Correct import

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

// const templates = [
//     { id: 1, name: "Basic", image: "https://www.getsetresumes.com/storage/resume-examples/November2022/YYuo4fB1NmNUGd1Ki6qD.jpg" },
//     { id: 2, name: "Modern Basic", image: "https://tse4.mm.bing.net/th?id=OIP.QpsQWZxxJfADSgmiEaq9mgHaKP&pid=Api&P=0&h=180" },
//     { id: 3, name: "Diamond", image: "https://marketplace.canva.com/EAE-TBgRwsI/1/0/1131w/canva-pink-simple-profile-resume-Zf7Tc6sytxE.jpg" },
//     { id: 4, name: "Refined Diamond", image: "https://tse4.mm.bing.net/th?id=OIP.rnNjzXv8oAlZgQoLuSDkywHaKe&pid=Api&P=0&h=180" },
//     { id: 5, name: "Elegant", image: "https://tse4.mm.bing.net/th?id=OIP.T1drwMRLlqGfBesepUOzpAHaKZ&pid=Api&P=0&h=180" },
//     { id: 6, name: "Premium Elegant", image: "https://tse4.mm.bing.net/th?id=OIP.IxfDtNURNsDOB6okDWn4bQHaKe&pid=Api&P=0&h=180" },
//     { id: 7, name: "Spiral", image: "https://tse3.mm.bing.net/th?id=OIP.fZ1IQoNco5tJwiza4GbzyQHaKe&pid=Api&P=0&h=180" },
//     { id: 8, name: "Creative Spiral", image: "https://tse3.mm.bing.net/th?id=OIP.jCboCEGxnM7KjHjTlevEbwHaKY&pid=Api&P=0&h=180" }
// ];

// app.get('/templates', (req, res) => {
//     res.json(templates);
// });

// app.post("/Addtemplate",(req,res)=>{
//     let input=req.body
//     let template =new templateModel(input)
//     template.save()
//     console.log(template)
//     res.json({"status":"success"})
// })

// //Storage 
// const storage = multer.diskStorage({
//   destination: "uploads/",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage: storage });

// app.use("/uploads", express.static("uploads"));

// //Files uploaded
// app.post("/upload", upload.single("file"), (req, res) => {
//   if (!req.file) return res.status(400).send("No file uploaded.");
//   res.json({ message: "File uploaded!", fileUrl: `/uploads/${req.file.filename}` });
// });

// app.get("/files", (req, res) => {
//   const fs = require("fs");
//   const files = fs.readdirSync("uploads/").map((file) => ({
//     name: file,
//     url: `/uploads/${file}`,
//   }));
//   res.json(files);
// });
// Set up Handlebars as the view engine

// Set up Handlebars as the view engine
app.engine("hbs", engine({ extname: "hbs" })); // ✅ Fixed
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use("/uploads", express.static("uploads"));

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    console.log("✅ Saving file as:", uniqueName); // Debugging log
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Upload File API
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    console.error("❌ No file received");
    return res.status(400).json({ error: "No file uploaded." });
  }

  console.log("✅ File uploaded:", req.file.filename);
  res.json({ message: "File uploaded!", fileUrl: `/uploads/${req.file.filename}` });
});

// List Uploaded Files API
app.get("/files", (req, res) => {
  fs.readdir("uploads/", (err, files) => {
    if (err) return res.status(500).json({ error: "Unable to read files." });

    const fileList = files.map((file) => ({
      name: file,
      url: `/uploads/${file}`,
    }));
    res.json(fileList);
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



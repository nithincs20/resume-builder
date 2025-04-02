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
const nodemailer = require("nodemailer");
require("dotenv").config(); // If using environment variables

//Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files from the 'public' folder
app.use(express.static(path.join(__dirname, "public")));
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

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER, // Your email
        pass: process.env.EMAIL_PASS, // App password
    },
});

app.post("/upload", upload.single("file"), async (req, res) => {
    const { name, email } = req.body; // Get name and email from form input

    if (!req.file) return res.status(400).json({ error: "No file uploaded." });

    if (!name || !email) {
        return res.status(400).json({ error: "Name and email are required." });
    }

    const filePath = path.join(__dirname, "uploads", req.file.filename);
    const fileData = fs.readFileSync(filePath);

    try {
        // Extract text from PDF
        const data = await pdfParse(fileData);
        const extractedText = data.text;

        // Check if email already exists in the database
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                error: "Email already exists. Please use another email.",
            });
        }

        // Store in MongoDB
        const resumeEntry = new userModel({
            name,
            email,
            resumeData: { text: extractedText }, // Store extracted resume text
        });

        await resumeEntry.save();

        // 📩 Send Registration Email with Link
        const registrationLink = `http://your-website.com/verify?email=${encodeURIComponent(email)}`;
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome to ResumeBuilder! Complete Your Registration",
            text: `Hello ${name},\n\nThank you for registering! Click the link below to complete your registration:\n\n${registrationLink}\n\nBest regards,\nResumeBuilder Team`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email sending error:", error);
                return res.status(500).json({ error: "Error sending email" });
            }

            res.json({
                message: "Resume Uploaded & User Registered Successfully! An email has been sent.",
                name,
                email,
                resumeData: { text: extractedText.substring(0, 300) + "..." },
                emailStatus: "Email sent successfully",
            });
        });

    } catch (error) {
        console.error("Error processing file:", error);
        res.status(500).json({ error: "Error processing file" });
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

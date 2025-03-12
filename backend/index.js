const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");

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


app.get('/templates', (req, res) => {
    res.json(templates);
});

app.listen(8080, () => {
    console.log("Server started ");
});

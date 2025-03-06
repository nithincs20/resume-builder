const express = require('express');


const app = express()
app.use(express.json())

app.get('/api', (req, res) => {
    res.json({ message: 'Hello, API is running!' });
});
 
app.listen(8080, () => {
    console.log("server started")
})
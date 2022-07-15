const express = require('express');
const path = require('path');
const app = express();

// Send html files
app.get("/", (req, res) => {
    res.sendFile("./public/index.html", {
        root: path.join(__dirname)
    })
});

app.get("/notes", (req, res) => {
    res.sendFile("./public/notes.html", {
        root: path.join(__dirname)
    })
});


// Start server
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
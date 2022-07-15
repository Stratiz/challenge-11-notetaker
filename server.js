//@ts-check
const express = require('express');
const bodyParser = require('body-parser')
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

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

app.use(express.static('public'))

// API server
function GetNotesJSON() {
    try {
        const data = fs.readFileSync(__dirname + '/db/db.json', 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error(err);
        return [];
    }
}

app.get("/api/notes", (req, res) => { // Return notes json table from db.json
    res.json(GetNotesJSON());
});

app.post("/api/notes", (req, res) => { // Add note to the JSON table and return the new note table
    let currentNotes = GetNotesJSON();
    if (req.body.title && req.body.text) {
        req.body.id = crypto.randomUUID();
        currentNotes.push(req.body);
    }
    res.json(currentNotes);
    try {
        fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(currentNotes));
    } catch (err) {
        console.error(err);
    }
});

// Delete note if it matches the id
app.delete("/api/notes/:id", (req, res) => {
    let currentNotes = GetNotesJSON();
    currentNotes = currentNotes.filter(note => note.id !== req.params.id);
    res.json(currentNotes);
    try {
        fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(currentNotes));
    } catch (err) {
        console.error(err);
    }
});

// Start server
app.listen(process.env.PORT, () => {
    console.log('Server started on port' + process.env.PORT);
});
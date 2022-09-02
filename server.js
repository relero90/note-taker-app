const { randomUUID } = require("crypto");
const express = require("express"); // remote module - express
const fs = require("fs"); // shipped module - file system
const db = require("./db/db.json"); // local database json file

const PORT = process.env.PORT || 3001;

const app = express(); // express app

// GET /notes should return the notes.html file.
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => res.json(db));

app.post("/api/notes", (req, res) => {
  const { title, note } = req.body;
  // If all the required properties are present
  if (title && note) {
    // Variable for the object we will save
    const newNote = {
      title,
      note,
      id = randomUUID,
    };
    //receive a new note to save on the request body
    //give each note a unique id when it's saved
    //add it to the db.json file
    fs.readFile(db, "utf-8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const savedNotes = JSON.parse(data);
        savedNotes.push(newNote);
        fs.writeFile(db, JSON.stringify(notes), (err) =>
          err
            ? console.error(err)
            : console.log(`Note id ${newNote.id} has been written to JSON file.`)
        );
      }
    })
    //return the new note to the client
    res.status(201).json(db)
  } else {
    res.status(500).json("Oops! Problem saving note.");
  }

// GET * should return the index.html file.
app.get("/*", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

app.listen(PORT, () => console.log(`Notetaker app is listening at http://localhost:${PORT} 🚀`))

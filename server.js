const uuid = require("uuid"); // remote module - uuid
const express = require("express"); // remote module - express
const chalk = require("chalk"); // remote module - chalk
const path = require("path"); // remote module - path
const fs = require("fs"); // shipped module - file system
const db = require("./db/db.json"); // local database json file

const PORT = process.env.PORT || 3001;

const app = express(); // express app

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET * should return the index.html file.
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);
// GET /notes should return the notes.html file.
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => res.json(db));

app.post("/api/notes", (req, res) => {
  // Log that a POST request was received
  console.log(chalk.cyan(`${req.method} request received to add a note.`));
  console.log(req.body);
  const { title, text } = req.body;
  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid.v1(),
    };
    //receive a new note to save on the request body
    //give each note a unique id when it's saved
    //add it to the db.json file
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        const savedNotes = JSON.parse(data);
        savedNotes.push(newNote);
        fs.writeFile("./db/db.json", JSON.stringify(savedNotes), (err) =>
          err
            ? console.error(err)
            : console.log(
                `Note id ${newNote.id} has been written to JSON file.`
              )
        );
      }
    });
    //return the new note to the client
    res.status(201).json(db);
  } else {
    res.status(500).json("Oops! Problem saving note.");
  }
});

app.listen(PORT, () =>
  console.log(
    chalk.blue(`Notetaker app is listening at http://localhost:${PORT} 🚀`)
  )
);

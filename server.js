const uuid = require("uuid"); // remote module - uuid
const express = require("express"); // remote module - express
const chalk = require("chalk"); // remote module - chalk
const path = require("path"); // remote module - path
const fs = require("fs"); // shipped module - file system
let db = require("./db/db.json"); // local database - .json file

const PORT = process.env.PORT || 3001;

const app = express(); // express app

app.use(express.json()); // are these necessary?
app.use(express.urlencoded({ extended: true })); // are these necessary?
app.use(express.static("public"));

// GET * should return the index.html file.
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);
// GET /notes should return the notes.html file.
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);
// GET /api/notes should read the db.json file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let savedNotes = data;
      res.json(savedNotes);
    }
  });
});

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
    let savedNotes = [];
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) {
        console.log(err);
      } else {
        savedNotes = JSON.parse(data);
        savedNotes.push(newNote);
        fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), "utf-8");
      }
    });
    //return the new note to the client
    //render the note
    res.json(savedNotes);
  } else {
    res.status(500).json("Oops! Problem saving note.");
  }
});

// receive a query parameter that contains the id of a note to delete.
// app.delete("/api/notes/:id", (req, res) => {
//   // read all notes from the db.json file
//   fs.readFile("./db/db.json", "utf-8", (err, data) => {
//     const savedNotes = JSON.parse(data);
//     //const reqDeleteId =
//     // filter savedNotes array for notes with id = user query parameter
//     savedNotes.filter((id) => {
//       id === reqDeleteId;
//     });
//     // remove the note with the given id property
//     // then rewrite the notes to the db.json file.
//   });
// });

app.listen(PORT, () =>
  console.log(
    chalk.blue(`Notetaker app is listening at http://localhost:${PORT} 🚀`)
  )
);

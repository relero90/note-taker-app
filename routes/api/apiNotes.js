const router = require("express").Router();
const uuid = require("uuid"); // remote module - uuid
const fs = require("fs"); // shipped module - file system
const chalk = require("chalk"); // remote module - chalk

// GET /api/notes should read the db.json file and return all saved notes as JSON.
router.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let savedNotes = JSON.parse(data);
      res.json(savedNotes);
    }
  });
});

router.post("/api/notes", (req, res) => {
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
router.delete("/api/notes/:id", (req, res) => {
  // read all notes from the db.json file
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let savedNotes = JSON.parse(data);
      const reqId = req.params.id;
      // filter savedNotes array for notes with id = user query parameter
      for (var i = 0; i < savedNotes.length; i++) {
        if (reqId === savedNotes[i].id) {
          // remove the note with the given id property
          savedNotes.splice(i, 1);
          // then rewrite the notes to the db.json file.
          fs.writeFileSync("./db/db.json", JSON.stringify(savedNotes), "utf-8");
          res.json(savedNotes);
        }
      }
    }
  });
});

module.exports = router;

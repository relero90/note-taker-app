const router = require("express").Router();
const path = require("path"); // remote module - path

// GET /notes should return the notes.html file.
router.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "../../public/notes.html"))
);

module.exports = router;

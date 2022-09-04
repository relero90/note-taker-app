const api = require("./apiNotes");
const notes = require("./notes");

const express = require("express");
const app = express();

app.use(api);
app.use(notes);

module.exports = app;

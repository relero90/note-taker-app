const express = require("express"); // remote module - express
const routes = require("./routes/api/routes");
const chalk = require("chalk"); // remote module - chalk

const PORT = process.env.PORT || 3001;
const app = express(); // express app

app.use(express.json()); // are these necessary?
app.use(express.urlencoded({ extended: true })); // are these necessary?
app.use(routes);
app.use(express.static("public"));

// GET * should return the index.html file.
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

app.listen(PORT, () =>
  console.log(
    chalk.blue(`Notetaker app is listening at http://localhost:${PORT} 🚀`)
  )
);

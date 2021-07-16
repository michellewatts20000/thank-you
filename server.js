const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");
var Filter = require('bad-words');


filter = new Filter();
filter.addWords('arsehole');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(logger("dev"));


app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.use(express.static("public"));

const databaseUrl = "notetaker";
const collections = ["notes"];

const db = mongojs(process.env.MONGODB_URI || databaseUrl, collections);

db.on("error", error => {
  console.log("Database Error:", error);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.post("/submit", (req, res) => {
  var data = req.body;
  var clean = filter.clean(data.note);
  console.log("rude", data.note);
  console.log("clean", filter.clean(data.note));

  req.body = {
    title: data.title,
    email: data.email,
    note: clean,
    created: data.created
  }

  db.notes.insert(req.body, (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.send(data);
    }
  });
});

app.get("/all", (req, res) => {
  db.notes.aggregate([{
    $sort: {
      created: -1,

    }
  }], (error, data) => {
    if (error) {
      res.send(error);
    } else {
      res.json(data);
    }
  });
});





app.listen(PORT, () => {
  console.log("App running on port 3001!");
});
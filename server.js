const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");
var moment = require('moment');
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;
const app = express();

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/notetaker", {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true
});

app.use(logger("dev"));

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

app.use(express.static("public"));

const databaseUrl = "notetaker";
const collections = ["notes"];

const db = mongojs(process.env.MONGODB_URI, collections);

db.on("error", error => {
  console.log("Database Error:", error);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.post("/submit", (req, res) => {
  console.log(req.body);

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





app.listen(3001, () => {
  console.log("App running on port 3001!");
});
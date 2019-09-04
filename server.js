const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 3001;
const app = express();

var fs = require('fs');
const students = require("./models/students.json");

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

//route to get data from students.json
app.get("/api/students", (req, res) => {
  res.json(students);
});

//route to add new student in students.json
app.post("/api/new", (req, res) => {
  let student = req.body;
  fs.readFile(__dirname+'/models/students.json', 'utf-8', function(err, data) {
    data = JSON.parse(data);
    data.data.push(student);
    fs.writeFile(__dirname+'/models/students.json', JSON.stringify(data), function() {
      if (err) {
        console.log(err);
        res.status(422).json(err);
      } else res.status(200).json(student);
    });
  });
});

//route to delete a student in students.json
app.post("/api/delete", (req, res) => {
  let student = req.body;
  fs.readFile(__dirname+'/models/students.json', 'utf-8', function(err, data) {
    data = JSON.parse(data);
    let newStudents = {data:[]}; 
    data.data.forEach(dt=>{
      if(student._id !== dt._id) newStudents.data.push(dt);
    })
    fs.writeFile(__dirname+'/models/students.json', JSON.stringify(newStudents), function() {
      if (err) {
        console.log(err);
        res.status(422).json(err);
      } else res.status(200).json(newStudents);
    });
  });
});

// Send every other request to the React app
// Define any API routes before this runs
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});

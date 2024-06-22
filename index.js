const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

//to handle form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//this will give backend the path to frontend
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

//converting name to camel case
function toCamelCase(str) {
  return str
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

app.get("/", (req, res) => {
  fs.readdir(`./files`, (err, files) => {
    res.render("index", { files: files });
  });
});

app.get("/file/:fileName", (req, res) => {
  fs.readFile(`./files/${req.params.fileName}`, "utf-8", (err, fileData) => {
    res.render("show", { fileName: req.params.fileName, fileData: fileData });
  });
});

app.get("/edit/:fileName", (req, res) => {
  res.render("edit", { fileName: req.params.fileName });
});

app.post("/edit/", (req, res) => {
  const newName = toCamelCase(req.body.new) + ".txt";
  fs.rename(`./files/${req.body.previous}`, `./files/${newName}`, (err) => {
    res.redirect("/");
  });
});

app.post("/create", (req, res) => {
  // console.log(req.body)
  const filename = toCamelCase(req.body.title) + ".txt";
  fs.writeFile(`./files/${filename}`, req.body.details, (err) => {
    res.redirect("/");
  });
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

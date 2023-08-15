const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const exhbs = require("express-handlebars");
const dbo = require("./db");
const mongo = require("mongodb")

app.engine(
  "hbs",
  exhbs.engine({ layoutsDir: "views/", defaultLayout: "main", extname: "hbs" })
);
app.set("view engine", "hbs");
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("books");
  const cursor = collection.find({});
  let books = await cursor.toArray();

  let message = "";
  let edit_id, edit_book;

  if (req.query.edit_id) {
    edit_id = req.query.edit_id;
    var o_id= new mongo.ObjectId(edit_id)
    edit_book = await collection.findOne({_id:o_id});
  }
  switch (req.query.status) {
    case "1":
      message = "inserted Succesfully";
      break;
      case "2":
        message = "updated Succesfully";
        break;

    default:
      break;
  }
  res.render("main", { message, books, edit_id, edit_book });
});

app.post("/store_book", async (req, res) => {
  let database = await dbo.getDatabase();
  const collection = database.collection("books");
  let book = { title: req.body.title, author: req.body.author };
  await collection.insertOne(book);
  return res.redirect("/?status=1");
});

app.post("/update_book/:edit_id", async (req, res) => {
    let database = await dbo.getDatabase();
    const collection = database.collection("books");
    let book = { title: req.body.title, author: req.body.author };
    let edit_id = req.params.edit_id
    var o_id= new mongo.ObjectId(edit_id)
    await collection.updateOne({_id:o_id},{$set:book});
    return res.redirect("/?status=2");
  });

app.listen(8000, () => {
  console.log("runing on 8000");
});

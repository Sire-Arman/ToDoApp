import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "permalist",
  password: "870742@aA",
  port: 5432,
});
db.connect();


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
let items = [];
// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

app.get("/", async (req, res) => {
  try {
    const result = await db.query("Select* from items");
  items = result.rows;
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
  } catch (error) {
    console.log(error)
  }
});

app.post("/add", async(req, res) => {
  try {
    const item = req.body.newItem;
  const result = await db.query("insert into items (title) values($1)", [item]);
  // items.push({ title: item });
  res.redirect("/");
  } catch (error) {
    console.log(error)
  }
});

app.post("/edit", async(req, res) => {
  try {
    // console.log(req.body);
  const title = req.body.updatedItemTitle;
  const id = req.body.updatedItemId;
  const resp = await db.query("update items set title =$1 where id = $2",[title,id]);
  res.redirect("/");
  } catch (error) {
    console.log(error)
  }
});

app.post("/delete", async (req, res) => {
  try {
    // console.log(req.body);
  let id = req.body.deleteItemId;
  const result = await db.query("delete from items where id = $1", [id])
  res.redirect("/");
  } catch (error) {
    console.log(error)
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

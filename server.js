const express = require("express");
const mongoose = require("mongoose");
// const multer = require("multer");
const BlogModel = require("./models/blog-model");
// bring in method override
const methodOverride = require("method-override");

const app = express();

// connect to mongodb
mongoose.connect(
  "mongodb://localhost/crudblog",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useFindAndModify: false,
    useCreateIndex: true,
  },
  (err, data) => {
    console.log("database is connected");
  }
);
// const path = require("path");
const blogRouter = require("./routes/blog-route");
// static file set
// app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(__dirname + "/public"));
// set view engine
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

// blog route
app.use("/blog", blogRouter);

// index route
app.get("/", async (req, res) => {
  let blogs = await BlogModel.find().sort({ timeCreated: "desc" });

  res.render("index", { blogs: blogs });
});

app.listen(5000);

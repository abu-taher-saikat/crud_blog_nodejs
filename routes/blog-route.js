// blog routes
const express = require("express");
const router = express.Router();
const Blog = require("./../models/blog-model");
const multer = require("multer");
// define storage for the iamge
const storage = multer.diskStorage({
  // destination for files
  destination: function (req, file, callback) {
    callback(null, "./public/uploads/images");
  },

  // add back to extension
  filename: function (req, file, callback) {
    callback(null, Date.now() + file.originalname);
  },
});
// uploads parameter for multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 3,
  },
});

router.get("/new", (req, res) => {
  res.render("newBlog");
});

// view route
router.get("/:slug", async (req, res) => {
  let blog = await Blog.findOne({ slug: req.params.slug });

  if (blog) {
    console.log(blog);
    res.render("show", { blog: blog });
  } else {
    res.redirect("/");
  }
});

// route that handle new posts
router.post("/", upload.single("image"), async (req, res) => {
  console.log(req);
  // console.log(req.body);
  let blog = new Blog({
    title: req.body.title,
    author: req.body.author,
    description: req.body.description,
    img: req.file.filename,
  });

  try {
    blog = await blog.save();
    console.log(blog.id);
    res.redirect(`blog/${blog.slug}`);
  } catch (err) {
    console.log(err);
  }
});

// route that handle edit view..1(it's show)
router.get("/edit/:id", async (req, res) => {
  let blog = await Blog.findById(req.params.id);
  res.render("edit", { blog: blog });
});

// route that handle update...2(it's edit);
router.put("/:id", async (req, res) => {
  req.blog = await Blog.findById(req.params.id);
  let blog = req.blog;
  blog.title = req.body.title;
  blog.author = req.body.author;
  blog.description = req.body.description;

  try {
    blog = await blog.save();
    res.redirect(`${blog.slug}`);
  } catch (err) {
    console.log(err);
    res.render(`blog/edit/${blog.id}`, { blog: blog });
  }
});

// route to handle delete
router.delete("/:id", async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
module.exports = router;

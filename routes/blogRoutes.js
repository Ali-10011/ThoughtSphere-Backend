const express = require("express");
const { getRecentBlogs,getBlogs, uploadBlog, deleteBlog, getSingleBlog, updateBlog } = require("../controllers/blogsController");
const  verifyToken  = require("../middlewares/verifyToken");

const router = express.Router();

//GET Recent blogs
router.get("/home/blogs", verifyToken, getRecentBlogs);

//GET a single blog
router.get("/home/blogs/:id",verifyToken, getSingleBlog);

//GET blogs
router.get("/home/my-blogs",verifyToken, getBlogs);

//POST a single blog
router.post("/home/new-blog", verifyToken, uploadBlog);

//delete a single blog
router.delete("/home/blogs/:id", verifyToken, deleteBlog)

//update a single blog
router.patch("/home/blogs/:id",verifyToken, updateBlog)


//Exporting Modules
module.exports = router;
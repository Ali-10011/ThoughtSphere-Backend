const express = require("express");
const { getRecentBlogs,getBlogs, uploadBlog, deleteBlog, getSingleBlog, updateBlog, addComment, addBookmark , getBookmarks, addBlogLike, getNotifications} = require("../controllers/blogsController");
const  verifyToken  = require("../middlewares/verifyToken");

const router = express.Router();

//GET Recent blogs
router.get("/home/blogs", verifyToken, getRecentBlogs);

//GET a single blog
router.get("/home/blogs/:id",verifyToken, getSingleBlog);

//GET blogs
router.get("/home/my-blogs",verifyToken, getBlogs);

//POST Comment
router.post("/home/blogs/add-comment", addComment);

//POST a single blog
router.post("/home/new-blog", verifyToken, uploadBlog);

//delete a single blog
router.delete("/home/blogs/:id", verifyToken, deleteBlog)

//update a single blog
router.patch("/home/blogs/:id",verifyToken, updateBlog)

//POST Bookmark
router.post("/home/blogs/add-bookmark",verifyToken, addBookmark);

//GET Bookmarks
router.post("/home/blogs/bookmarks",verifyToken, getBookmarks);

//POST LIKE
router.post("/home/blogs/like",verifyToken, addBlogLike);

//GET Bookmarks
router.post("/home/blogs/notifications",verifyToken, getNotifications);



//Exporting Modules
module.exports = router;
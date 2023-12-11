const url = require("url");
const blogsModel = require("../models/blogsModel");
const notificationsModel = require("../models/notificationsModel");
const bookmarksModel = require("../models/bookmarksModel");

const getRecentBlogs = async (req, res) => {

  try {
   
    const blogs = await blogsModel.find().limit(10).sort({ createdAt: -1 });

    res.status(200).json({code : "1", msg: "Fetch Successful", blogs});
   
  } catch (e) {
    res.status(500).json({code : "0", msg: "Internal server error" });
  
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await blogsModel
      .find({ email: req.email })
      .sort({ createdAt: -1 });

    res.status(200).json({code : "1", msg: "Fetch Successful", blogs});
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
  
};

//posting a single blog
const uploadBlog = async (req, res) => {
  try {
    const blog = await new blogsModel({
      email: req.body.email,
      title: req.body.title,
      body: req.body.body,
      comments: [],
      likes: []
    }).save();

    if (!blog) {
      res.status(200).json({code: "0", msg: "Cannot Complete Request" });
    } else {
      notif = addNotification({email: blog.email, body: "You have added a blog - " + blog.title, blog_id: blog._id})
      if(notif)
      {
        res.status(200).json({code: "1", msg: "Blog Added"});
      }
      else 
      {
        res.status(200).json({code: "0", msg: "Cannot Complete Request"});
      }
      
    }
  } catch (e) {
     
    res.status(500).json({ code: "0", msg: "Internal server error" });
  }
};

//deleting a Blog
const deleteBlog = async (req, res) => {
  try {
    const blog = await blogsModel.findOneAndDelete({
      _id: req.params.id,
    });

    if (!blog) {
      res.status(200).json({ code: "0", msg: "No such entry !" });
    } else {
      res.status(200).json({code:"1", msg: "Successfully Deleted !" });
    }
  } catch (e) {
    res.status(500).json({code:"0", msg: "Internal server error" });
  }
};

//Getting a Single Blog
const getSingleBlog = async (req, res) => {
  try {
    const blog = await blogsModel.findOne({
      _id: req.params.id,
    });

    if (!blog) {
      res.status(200).json({code: "0", msg: "No such entry !" });
    } else {
      res.status(200).json({code:"1", msg:"Fetch Successful", blog });
    }
  } catch (e) {
    res.status(500).json({ code: "0", msg: "Internal server error" });
  }
};

//Update a Single Blog
const updateBlog = async (req, res) => {
  try {
    const blog = await blogsModel.findByIdAndUpdate(
      { _id: req.params.id },
      { title: req.body.title, body: req.body.body }
    );

    if (!blog) {
      res.status(200).json({ code: "0", msg: "Cannot Update" });
    } else {
      notif = addNotification({email: blog.email, body: "You have updated a blog - " + blog.title, blog_id: req.params.id})
      if(notif)
      {
        res.status(200).json({code: "1", msg: "Blog Updated"});
      }
      else 
      {
        res.status(200).json({code: "0", msg: "Cannot Complete Request"});
      }
    }
  } catch (e) {
    res.status(500).json({code: "0", msg: "Internal server error" });
  }
};
//adding a comment to a Blog
const addComment = async (req, res) => {
  console.log("Comment was added");
  try {
    const blog = await blogsModel.findById(
      { _id: req.body.id }     
    );
    let comments = blog.comments
    comments.unshift({"comment": req.body.comment, "email": req.email})
    blog.comments = comments
    const updatedBlog = await blogsModel.findByIdAndUpdate(
      { _id: req.body.id },
      blog
    );
    if (!updatedBlog) {
      res.status(200).json({code: "0", msg: "Cannot Complete Request" });
    } else {
      notif = addNotification({email: updatedBlog.email, body: "A Comment has been added on your blog - " + updatedBlog.title, blog_id: req.body.id })
      if(notif)
      {
        res.status(200).json({code: "1", msg: "Comment Added"});
      }
      else 
      {
        res.status(200).json({code: "0", msg: "Cannot Complete Request"});
      }
     
    }
  } catch (e) {
     
    res.status(500).json({ code: "0", msg: "Internal server error" });
  }
};

const addNotification = async (req) => {
  try {
   
    const notification = await notificationsModel.create(
     {
      email: req.email,
      blog_id: req.blog_id,
      body: req.body
     }
    );
    return notification
  } catch (e) {
    return null
  }
};

//adding a bookmark to a Blog
const addBookmark = async (req, res) => {
  try {
    const bookmark = await bookmarksModel.findOne(
      { email: req.body.email }     
    );
      let updatedBookmark;
      let message;

   if(bookmark)
   {
    let user_bookmarks = bookmark.bookmarks
   
    if(bookmark.bookmarks.includes(req.body.bookmark))
    {
      user_bookmarks.pop(req.body.bookmark)
      message = "blog removed"
    }
    else 
    {
      user_bookmarks.push(req.body.bookmark)
      message = "blog added"
    }
    bookmark.bookmarks = user_bookmarks
    updatedBookmark = await bookmarksModel.findOneAndUpdate(
      { email: req.body.email },
      bookmark
    );
   }
   else 
   {
    updatedBookmark = await bookmarksModel.create(
      {
        email: req.body.email,
        bookmarks: [req.body.bookmark]
      }
    
    );
    message = "blog added"
   }
    if (!updatedBookmark) {
      res.status(200).json({code: "0", msg: "Cannot Complete Request" });
    } else {
     
      res.status(200).json({code: "1", msg: message});
    }
  } catch (e) {
     
    res.status(500).json({ code: "0", msg: "Internal server error" });
  }
};

const getBookmarks = async (req, res) => {
  try {
    const response = await bookmarksModel
      .find({ email: req.email })
      .sort({ createdAt: -1 });
    console.log(response)
    
    const bookmarks = response[0].bookmarks
   //console.log(bookmarks)
     
     const blogs = await Promise.all(bookmarks.map(async (bookmark) => {
      const blog = await blogsModel.findOne({
        _id: bookmark,
      });
      if(blog!=null)
      {
        return blog;
      }
    }));
    const bookmarkBlogs = blogs.filter(blog => blog !== undefined);
    res.status(200).json({code : "1", msg: "Fetch Successful", bookmarkBlogs});
  } catch (e) {
    res.status(500).json({ msg: "Internal server error" });
  }
  
};
const getNotifications = async (req, res) => {
  try {
   
    const notifications = await notificationsModel
      .find({ email: req.email })
      .sort({ createdAt: -1 });
    console.log(notifications)
    res.status(200).json({code : "1", msg: "Fetch Successful", notifications});
  } catch (e) {
    console.log(e)
    res.status(500).json({ msg: "Internal server error" });
  }
  
};

//adding/Remove a like to a Blog
const addBlogLike = async (req, res) => {
  try {

    const blog = await blogsModel.findById(
      { _id: req.body.id }     
    );
    let msg;
    let likes = blog.likes
    if(likes.includes(req.body.user_like))
    {
      likes.pop(req.body.user_like)
      msg = "Like Removed"
    }
    else 
    {
      likes.push(req.body.user_like)
      msg = "Like Added"
    }
   
   blog.likes = likes

    
    const updatedBlog = await blogsModel.findByIdAndUpdate(
      { _id: req.body.id },
      blog
    );
    if (!updatedBlog) {
      res.status(200).json({code: "0", msg: msg });
    } else {
      res.status(200).json({code: "1", msg: msg});   
    }
  } catch (e) {
     
    res.status(500).json({ code: "0", msg: "Internal server error" });
  }
};

module.exports = {
  getRecentBlogs,
  getBlogs,
  uploadBlog,
  deleteBlog,
  getSingleBlog,
  updateBlog,
  addComment,
  addBookmark,
  getBookmarks,
  addBlogLike,
  getNotifications
};

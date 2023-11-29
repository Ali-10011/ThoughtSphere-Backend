const url = require("url");
const blogsModel = require("../models/blogsModel");

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
    console.log(req.body);
    const blog = await new blogsModel({
      email: req.body.email,
      title: req.body.title,
      body: req.body.body,
      comments: []
    }).save();

    if (!blog) {
      res.status(200).json({code: "0", msg: "Cannot Complete Request" });
    } else {
      res.status(200).json({code: "1", msg: "Blog Successfully Added", blog});
    }
  } catch (e) {
    console.log(e);
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
      res.status(200).json({code: "1", msg: "Successfully Updated" });
    }
  } catch (e) {
    res.status(500).json({code: "0", msg: "Internal server error" });
  }
};

module.exports = {
  getRecentBlogs,
  getBlogs,
  uploadBlog,
  deleteBlog,
  getSingleBlog,
  updateBlog,
};

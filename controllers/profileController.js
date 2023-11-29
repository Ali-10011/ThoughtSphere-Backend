const { json } = require("express");
const Auth = require("../models/authModel");
const blogsModel = require("../models/blogsModel");
const bcrypt = require("bcryptjs");

const updateProfile = async (req, res) => {
  try {
    const user = await Auth.findOne({ username: req.body.username });

    if (user) {
      if (user.username != req.username) {
        return res.status(401).json({
          msg: "Already Exists, Please select a different username !",
        });
      }
    }

    encryptedPassword = await bcrypt.hash(req.body.password, 10);

    const updatedUser = await Auth.findOneAndUpdate(
      { username: req.username },
      { username: req.body.username, password: encryptedPassword }
    );

    if (!updatedUser) {
      return res.status(201).json({ msg: "Cannot Completed Request" });
    } else {
      await blogsModel.updateMany(
        { username: req.username },
        { username: req.body.username }
      );
      return res.status(200).json({ msg: "Successfully Updated" });
    }
  } catch (e) {
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const blogs = await blogsModel.find({ username: req.body.username });
    const user = await Auth.findOne({ username: req.body.username });

    const blogsCount = blogs.length.toString();
    const followings = user.following.length.toString();

    return res.status(200).json({
      email: user.email,
      username: user.username,
      blogsCount: blogsCount,
      followings: followings,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

const followProfile = async (req, res) => {
  try {
    const user = await Auth.findOne({ username: req.username });
    const followingUser = await Auth.findOne({ username: req.body.follow });
    console.log(followingUser._id);
    console.log(user.following);
    var followings = user.following;
    if (followings.includes(followingUser._id)) {
      return res
        .status(201)
        .json({ msg: "This user is already being followed !" });
    } else {
      followings.push(followingUser._id);

      await Auth.findOneAndUpdate(
        { username: req.username },
        { following: followings }
      );
      return res.status(200).json({ msg: "User successfully followed!" });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({ msg: "Internal server error" });
  }
};
module.exports = { updateProfile, getProfile, followProfile };

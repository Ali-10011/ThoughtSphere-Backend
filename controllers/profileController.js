const profileModel = require("../models/profileModel");
const bcrypt = require("bcryptjs");
const authModel = require("../models/authModel");

const updateProfile = async (req, res) => {
  try {
    const profile = await profileModel.findOneAndUpdate({ email: req.email }, {username: req.body.username});
    const auth = await authModel.findOneAndUpdate({ email: req.email }, {username: req.body.username});
    if (profile && auth) {
      
        return res.status(200).json({code: "1", msg : "Profile Updated"});
      }
      else 
      {
        return res.status(200).json({code: "0", msg: "Profile Not Updated" });
      }
       
    
  } catch (e) {
    return res.status(500).json({ code: "0",msg: "Internal server error" });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await profileModel.findOne({ email: req.email });

    return res.status(200).json({code: "1", profile});
  } catch (e) {
    return res.status(500).json({ code: "0",msg: "Internal server error" });
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

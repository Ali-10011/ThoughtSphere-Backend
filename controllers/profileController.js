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
    const user_following = await profileModel.findOne({ email: req.email }); //user who is following
    const user_follower = await profileModel.findOne({ email: req.body.user_follow }); //user who is being follow/unfollow
   
    let followings = user_following.followings;
    let followers = user_follower.followers;
    let msg;
    
    if(followings.includes(req.body.user_follow) && followers.includes(req.email))
    {
        followings.pop(req.body.user_follow)
        followers.pop(req.email)
        msg = "User Unfollowed"
    }
   else {
      followings.push(req.body.user_follow)
      followers.push(req.email)
      msg = "User Followed"
    }
    user_following.followings = followings
    user_follower.followers = followers
    await profileModel.findOneAndUpdate({ email: req.email }, user_following); //user who is following
    await profileModel.findOneAndUpdate({ email: req.body.user_follow }, user_follower); //user who is being follow/unfollow

      return res.status(200).json({ msg: msg });
    
  } catch (e) {
   
    return res.status(500).json({ msg: "Internal server error" });
  }
};
module.exports = { updateProfile, getProfile, followProfile };

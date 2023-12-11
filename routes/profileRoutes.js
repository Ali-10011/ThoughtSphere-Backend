const express = require("express");
const {updateProfile, getProfile, followProfile, getUserProfile} = require("../controllers/profileController");
const  verifyToken  = require("../middlewares/verifyToken");

const router = express.Router();

//update Profile
router.patch("/home/update-profile", verifyToken, updateProfile);

//get profile
router.get("/home/profile", verifyToken, getProfile);

//follow profile
router.post("/home/profile/follow",verifyToken, followProfile)

//Get a user profile
router.post("/home/profile",verifyToken, getUserProfile)

//Exporting Modules
module.exports = router;

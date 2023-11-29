const express = require("express");
const {updateProfile, getProfile, followProfile} = require("../controllers/profileController");
const  verifyToken  = require("../middlewares/verifyToken");

const router = express.Router();

//update Profile
router.post("/home/profile", verifyToken, updateProfile);

//get profile
router.post("/home/user/profile", verifyToken, getProfile);

//follow profile
router.post("/home/profile/follow",verifyToken, followProfile)

//Exporting Modules
module.exports = router;

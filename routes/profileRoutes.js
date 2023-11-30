const express = require("express");
const {updateProfile, getProfile, followProfile} = require("../controllers/profileController");
const  verifyToken  = require("../middlewares/verifyToken");

const router = express.Router();

//update Profile
router.patch("/home/update-profile", verifyToken, updateProfile);

//get profile
router.get("/home/profile", verifyToken, getProfile);

//follow profile
router.post("/home/profile/follow",verifyToken, followProfile)

//Exporting Modules
module.exports = router;
